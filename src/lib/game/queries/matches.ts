import "server-only";

import { pickDaily } from "@/lib/game/daily-pool";
import { pickableDay } from "@/lib/game/day";
import type { Match } from "@/lib/game/types";
import { DEFAULT_LEAGUE_WEIGHT } from "@/lib/odds/league-weights";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/types";
import { utcDayStart } from "@/lib/time";

/** How many matches a player sees per day. */
const DAILY_POOL_SIZE = 5;

/**
 * The match columns the daily-pool UI + weighted draw need. Team/league names
 * (and crest + colour) come from embedded catalog lookups, disambiguated by FK
 * constraint name since two FKs point at `teams`. The refs are null until their
 * catalog row exists / is filled.
 */
const MATCH_COLUMNS =
  "id, kickoff, home_odds, away_odds, home_ref:teams!matches_home_team_id_fkey(name, crest_url, primary_color, secondary_color), away_ref:teams!matches_away_team_id_fkey(name, crest_url, primary_color, secondary_color), league_ref:leagues!matches_league_id_fkey(name, weight)";

type TeamRef = Pick<
  Tables<"teams">,
  "name" | "crest_url" | "primary_color" | "secondary_color"
> | null;
type LeagueRef = Pick<Tables<"leagues">, "name" | "weight"> | null;

type MatchRow = Pick<
  Tables<"matches">,
  "id" | "kickoff" | "home_odds" | "away_odds"
> & {
  home_ref: TeamRef;
  away_ref: TeamRef;
  league_ref: LeagueRef;
};

type ServerClient = Awaited<ReturnType<typeof createClient>>;

/** A to-one embed can arrive as an object or a single-element array. */
function one<T>(ref: T | T[] | null | undefined): T | null {
  if (Array.isArray(ref)) return ref[0] ?? null;
  return ref ?? null;
}

function rowToMatch(m: MatchRow): Match {
  const home = one(m.home_ref);
  const away = one(m.away_ref);
  const league = one(m.league_ref);
  return {
    id: m.id,
    league: league?.name ?? "",
    // Raw ISO timestamp — formatted to the viewer's timezone on the client.
    kickoff: m.kickoff,
    home: {
      id: `${m.id}-home`,
      matchId: m.id,
      team: home?.name ?? "",
      side: "home",
      odds: Number(m.home_odds),
      crestUrl: home?.crest_url ?? null,
      primaryColor: home?.primary_color ?? null,
      secondaryColor: home?.secondary_color ?? null,
    },
    away: {
      id: `${m.id}-away`,
      matchId: m.id,
      team: away?.name ?? "",
      side: "away",
      odds: Number(m.away_odds),
      crestUrl: away?.crest_url ?? null,
      primaryColor: away?.primary_color ?? null,
      secondaryColor: away?.secondary_color ?? null,
    },
  };
}

/**
 * Loads the match pool for the day players are currently picking for — the next
 * UTC day. The day is delimited by 00:00 UTC: matches kicking off in
 * `[tomorrow 00:00Z, the following day 00:00Z)`.
 *
 * Each player sees {@link DAILY_POOL_SIZE} matches drawn from that day's pool.
 * The draw is seeded by user id + day (deterministic, so it differs per player)
 * and then **frozen** the first time it's loaded: the chosen match ids are
 * persisted to `daily_pools`, so later edits to the matches pool can't reshuffle
 * what a player has already seen that day.
 */
export async function getDailyMatches(
  now: Date = new Date()
): Promise<Match[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const start = utcDayStart(now, 1); // tomorrow, 00:00 UTC
  const end = utcDayStart(now, 2); // the following 00:00 UTC (exclusive boundary)
  const dayKey = pickableDay(now);

  const rows = await loadFrozenPool(supabase, user.id, dayKey, start, end);

  // Display in kickoff order (ISO timestamps sort chronologically) regardless of
  // the frozen storage / shuffle order.
  return rows
    .slice()
    .sort((a, b) => a.kickoff.localeCompare(b.kickoff))
    .map(rowToMatch);
}

/**
 * Returns the player's frozen 5 matches for the day, freezing them on first
 * access. Returns `[]` while the pool is still empty (nothing is frozen until
 * there are matches to freeze).
 */
async function loadFrozenPool(
  supabase: ServerClient,
  userId: string,
  dayKey: string,
  start: Date,
  end: Date
): Promise<MatchRow[]> {
  // 1. Already frozen for today? Load exactly those matches.
  const { data: frozen, error: frozenError } = await supabase
    .from("daily_pools")
    .select("match_ids")
    .eq("user_id", userId)
    .eq("match_day", dayKey)
    .maybeSingle();
  if (frozenError) {
    throw new Error(`Failed to read daily pool: ${frozenError.message}`);
  }

  if (frozen) {
    const { data, error } = await supabase
      .from("matches")
      .select(MATCH_COLUMNS)
      .in("id", frozen.match_ids);
    if (error) {
      throw new Error(`Failed to load frozen matches: ${error.message}`);
    }
    return (data ?? []) as unknown as MatchRow[];
  }

  // 2. Not frozen yet: draw deterministically from the whole day's pool, in a
  // stable order so the seeded draw is reproducible (kickoff, then id). The draw
  // is league-weighted, so marquee leagues are likelier to land in a player's
  // five — weight comes from the embedded league row (unmapped rows fall back to
  // the default weight).
  const { data, error } = await supabase
    .from("matches")
    .select(MATCH_COLUMNS)
    .gte("kickoff", start.toISOString())
    .lt("kickoff", end.toISOString())
    .order("kickoff", { ascending: true })
    .order("id", { ascending: true });
  if (error) {
    throw new Error(`Failed to load daily matches: ${error.message}`);
  }

  const picked = pickDaily(
    (data ?? []) as unknown as MatchRow[],
    `${userId}:${dayKey}`,
    DAILY_POOL_SIZE,
    // Default weight when the league ref is null (legacy/unmapped rows).
    (row) => one(row.league_ref)?.weight ?? DEFAULT_LEAGUE_WEIGHT
  );
  if (picked.length === 0) return [];

  // 3. Freeze it. ignoreDuplicates makes concurrent first-loads a no-op (and the
  // pick is deterministic, so they'd agree anyway).
  const { error: freezeError } = await supabase.from("daily_pools").upsert(
    {
      user_id: userId,
      match_day: dayKey,
      match_ids: picked.map((m) => m.id),
    },
    { onConflict: "user_id,match_day", ignoreDuplicates: true }
  );
  if (freezeError) {
    throw new Error(`Failed to freeze daily pool: ${freezeError.message}`);
  }

  return picked;
}
