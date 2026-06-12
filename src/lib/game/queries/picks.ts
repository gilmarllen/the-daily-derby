import "server-only";

import { pickableDay } from "@/lib/game/day";
import { toPastPick } from "@/lib/game/past-pick";
import type { PastPick, Selection, Side, TodayPick } from "@/lib/game/types";
import { createClient } from "@/lib/supabase/server";
import { utcDateString } from "@/lib/time";

/** How many past picks the history page shows. */
const PAST_PICKS_LIMIT = 30;

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
      "picked_side, cost, result, matches(home_team, away_team, league, kickoff, status, home_score, away_score)"
    )
    .eq("user_id", user.id)
    .eq("match_day", utcDateString(now, 0))
    .maybeSingle();
  if (error) {
    throw new Error(`Failed to load today's pick: ${error.message}`);
  }
  if (!data) return null;

  // matches is a to-one embed; tolerate either object or single-element array.
  const match = Array.isArray(data.matches) ? data.matches[0] : data.matches;
  if (!data.picked_side || !match) return { kind: "none" };

  return {
    kind: "team",
    league: match.league,
    kickoff: match.kickoff,
    home: match.home_team,
    away: match.away_team,
    // picks only ever store home/away (never draw).
    pickedSide: data.picked_side as Side,
    cost: Number(data.cost),
    status: match.status,
    result: data.result,
    homeScore: match.home_score,
    awayScore: match.away_score,
  };
}

/**
 * Loads the player's picks for days that have fully passed (match_day < today
 * UTC), newest first, for the history page. A no-selection (no match) counts as
 * a skipped day (-2); a team pick still awaiting its result shows as "pending".
 */
export async function getPastPicks(
  now: Date = new Date()
): Promise<PastPick[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("picks")
    .select(
      "id, match_day, picked_side, cost, result, matches(home_team, away_team, league)"
    )
    .eq("user_id", user.id)
    .lt("match_day", utcDateString(now, 0))
    .order("match_day", { ascending: false })
    .limit(PAST_PICKS_LIMIT);
  if (error) {
    throw new Error(`Failed to load past picks: ${error.message}`);
  }

  return (data ?? []).map((row): PastPick => {
    const match = Array.isArray(row.matches) ? row.matches[0] : row.matches;
    return toPastPick({
      id: row.id,
      match_day: row.match_day,
      picked_side: row.picked_side as Side | null,
      cost: row.cost,
      result: row.result,
      home_team: match?.home_team ?? null,
      away_team: match?.away_team ?? null,
      league: match?.league ?? null,
    });
  });
}
