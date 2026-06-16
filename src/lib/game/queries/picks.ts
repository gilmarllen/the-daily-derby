import "server-only";

import { pickableDay } from "@/lib/game/day";
import { pastPickDays, toPastPick } from "@/lib/game/past-pick";
import type { PastPick, Selection, Side, TodayPick } from "@/lib/game/types";
import { createClient } from "@/lib/supabase/server";
import { utcDateString } from "@/lib/time";

/** How many past picks the history page shows. */
const PAST_PICKS_LIMIT = 30;

/** A to-one embed can arrive as an object or a single-element array. */
function embedOne<T>(ref: T | T[] | null | undefined): T | null {
  if (Array.isArray(ref)) return ref[0] ?? null;
  return ref ?? null;
}

/**
 * Loads the signed-in player's current pick for the pickable day, as a UI
 * `Selection`. A team pick maps to its option id (`<matchId>-<side>`); anything
 * else (no row, or a stored No-selection) is `{ kind: "none" }`.
 */
export async function getCurrentPick(
  now: Date = new Date()
): Promise<Selection> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { kind: "none" };

  const { data, error } = await supabase
    .from("picks")
    .select("match_id, picked_side")
    .eq("user_id", user.id)
    .eq("match_day", pickableDay(now))
    .maybeSingle();
  if (error) {
    throw new Error(`Failed to load current pick: ${error.message}`);
  }

  if (!data?.match_id || !data.picked_side) return { kind: "none" };
  return { kind: "team", optionId: `${data.match_id}-${data.picked_side}` };
}

/**
 * Loads the player's locked-in pick for *today* — the one made yesterday, since
 * picks are placed a day ahead. Returns `null` when there's no pick row for
 * today (e.g. a brand-new player), so the banner can be hidden entirely.
 */
export async function getTodayPick(
  now: Date = new Date()
): Promise<TodayPick | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("picks")
    .select(
      "picked_side, cost, result, matches(kickoff, status, home_score, away_score, home_ref:teams!matches_home_team_id_fkey(name, crest_url), away_ref:teams!matches_away_team_id_fkey(name, crest_url), league_ref:leagues!matches_league_id_fkey(name))"
    )
    .eq("user_id", user.id)
    .eq("match_day", utcDateString(now, 0))
    .maybeSingle();
  if (error) {
    throw new Error(`Failed to load today's pick: ${error.message}`);
  }
  if (!data) return null;

  // matches is a to-one embed; tolerate either object or single-element array.
  const match = embedOne(data.matches);
  if (!data.picked_side || !match) return { kind: "none" };

  const pickedSide = data.picked_side as Side;
  const home = embedOne(match.home_ref);
  const away = embedOne(match.away_ref);
  const league = embedOne(match.league_ref);

  return {
    kind: "team",
    league: league?.name ?? "",
    kickoff: match.kickoff,
    home: home?.name ?? "",
    away: away?.name ?? "",
    // picks only ever store home/away (never draw).
    pickedSide,
    crestUrl:
      (pickedSide === "home" ? home?.crest_url : away?.crest_url) ?? null,
    cost: Number(data.cost),
    status: match.status,
    result: data.result,
    homeScore: match.home_score,
    awayScore: match.away_score,
  };
}

/**
 * Loads the player's history for locked days (match_day <= today UTC; today's
 * pick was locked yesterday), newest first — mirroring the public profile, which
 * also shows today's pick. Every day from the player's first pick through today
 * is shown: a team pick keeps its result (or "pending" if unsettled), and a day
 * with no pick row — an explicit sat-out or a day the daily-default job missed —
 * renders as a skipped no-selection (-2), so the list matches the trophy total.
 */
export async function getPastPicks(
  now: Date = new Date()
): Promise<PastPick[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const today = utcDateString(now, 0);

  // Earliest locked pick day bounds the history; none means no past yet.
  const { data: firstRow, error: firstError } = await supabase
    .from("picks")
    .select("match_day")
    .eq("user_id", user.id)
    .lte("match_day", today)
    .order("match_day", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (firstError) {
    throw new Error(`Failed to load first pick: ${firstError.message}`);
  }

  const days = pastPickDays(now, firstRow?.match_day ?? null, PAST_PICKS_LIMIT);
  if (days.length === 0) return [];

  // Fetch the real picks across the window; missing days are filled below.
  const { data, error } = await supabase
    .from("picks")
    .select(
      "id, match_day, picked_side, cost, result, matches(home_ref:teams!matches_home_team_id_fkey(name, crest_url), away_ref:teams!matches_away_team_id_fkey(name, crest_url), league_ref:leagues!matches_league_id_fkey(name))"
    )
    .eq("user_id", user.id)
    .gte("match_day", days[days.length - 1])
    .lte("match_day", today)
    .order("match_day", { ascending: false });
  if (error) {
    throw new Error(`Failed to load past picks: ${error.message}`);
  }

  const byDay = new Map((data ?? []).map((row) => [row.match_day, row]));

  // Walk the day series (newest first), mapping each day to its pick or, when
  // absent, a synthetic sat-out (null team → toPastPick yields a skipped day).
  return days.map((day): PastPick => {
    const row = byDay.get(day);
    if (!row) {
      return toPastPick({
        id: `satout-${day}`,
        match_day: day,
        picked_side: null,
        cost: 0,
        result: null,
        home_team: null,
        away_team: null,
        league: null,
      });
    }
    const match = embedOne(row.matches);
    const home = embedOne(match?.home_ref);
    const away = embedOne(match?.away_ref);
    const league = embedOne(match?.league_ref);
    return toPastPick({
      id: row.id,
      match_day: row.match_day,
      picked_side: row.picked_side as Side | null,
      cost: row.cost,
      result: row.result,
      home_team: home?.name ?? null,
      away_team: away?.name ?? null,
      league: league?.name ?? null,
      home_crest: home?.crest_url ?? null,
      away_crest: away?.crest_url ?? null,
    });
  });
}
