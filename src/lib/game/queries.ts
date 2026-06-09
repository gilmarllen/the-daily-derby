import "server-only";

import { createClient } from "@/lib/supabase/server";
import { pickDaily } from "@/lib/game/daily-pool";
import type { Tables } from "@/lib/supabase/types";
import type { Match, Player } from "@/lib/game/types";

/** The match columns the daily-pool UI needs. */
const MATCH_COLUMNS =
  "id, league, kickoff, home_team, away_team, home_odds, away_odds";

type MatchRow = Pick<
  Tables<"matches">,
  | "id"
  | "league"
  | "kickoff"
  | "home_team"
  | "away_team"
  | "home_odds"
  | "away_odds"
>;

function rowToMatch(m: MatchRow): Match {
  return {
    id: m.id,
    league: m.league,
    // Raw ISO timestamp — formatted to the viewer's timezone on the client.
    kickoff: m.kickoff,
    home: {
      id: `${m.id}-home`,
      matchId: m.id,
      team: m.home_team,
      side: "home",
      odds: Number(m.home_odds),
    },
    away: {
      id: `${m.id}-away`,
      matchId: m.id,
      team: m.away_team,
      side: "away",
      odds: Number(m.away_odds),
    },
  };
}

/** How many matches a player sees per day. */
const DAILY_POOL_SIZE = 5;

/** Midnight (00:00:00.000Z) of the UTC day `addDays` from `base`. */
function utcDayStart(base: Date, addDays: number): Date {
  return new Date(
    Date.UTC(
      base.getUTCFullYear(),
      base.getUTCMonth(),
      base.getUTCDate() + addDays
    )
  );
}

/**
 * Loads the signed-in player's profile and maps it to the UI `Player` shape.
 * Returns `null` when there is no authenticated user — callers in protected
 * routes (gated by proxy.ts) should redirect in that case.
 */
export async function getCurrentPlayer(): Promise<Player | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, trophies, balance, win_streak")
    .eq("id", user.id)
    .single();

  // The user is authenticated but has no profile row. This shouldn't happen
  // (the handle_new_user trigger creates one on signup), so fail loudly rather
  // than returning null — returning null here would bounce an authenticated
  // user to /login, which sends them back, causing a redirect loop.
  if (!profile) {
    throw new Error(`No profile found for authenticated user ${user.id}`);
  }

  return {
    name: profile.username,
    trophies: profile.trophies,
    balance: profile.balance,
    winStreak: profile.win_streak,
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
  const dayKey = start.toISOString().slice(0, 10);

  const rows = await loadFrozenPool(supabase, user.id, dayKey, start, end);

  // Display in kickoff order (ISO timestamps sort chronologically) regardless of
  // the frozen storage / shuffle order.
  return rows
    .slice()
    .sort((a, b) => a.kickoff.localeCompare(b.kickoff))
    .map(rowToMatch);
}

type ServerClient = Awaited<ReturnType<typeof createClient>>;

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
    return data ?? [];
  }

  // 2. Not frozen yet: draw deterministically from the whole day's pool, in a
  // stable order so the seeded shuffle is reproducible (kickoff, then id).
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

  const picked = pickDaily(data ?? [], `${userId}:${dayKey}`, DAILY_POOL_SIZE);
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
