// Pure helpers for the match sync. Kept apart from sync.ts so they can be
// unit-tested without pulling in the server-only HTTP/DB clients.

import { utcDateString } from "@/lib/time";

import type { OddsApiEvent, OddsApiEventOdds } from "./types";

/** Days ahead of "today" (UTC) that we sync fixtures for. */
export const TARGET_DAYS_AHEAD = 2;

/** Maximum matches the pool holds for a single match day. */
export const MATCH_POOL_TARGET = 50;

/** The 1X2 / moneyline market name in odds-api responses. */
export const MONEYLINE_MARKET = "ML";

/**
 * The UTC date (YYYY-MM-DD) we should be syncing, given the current instant.
 * Days are delimited by UTC midnight, so `now` June 8 → "2026-06-10".
 */
export function targetMatchDay(
  now: Date,
  daysAhead: number = TARGET_DAYS_AHEAD
): string {
  return utcDateString(now, daysAhead);
}

/**
 * RFC3339 window covering the whole UTC match day, inclusive on both ends:
 * `00:00:00Z`..`23:59:59Z`. The upper bound stays on the match day itself so the
 * (inclusive) odds-api `to` filter doesn't pull the next day's 00:00:00 kickoff.
 */
export function dayWindow(matchDay: string): { from: string; to: string } {
  return { from: `${matchDay}T00:00:00Z`, to: `${matchDay}T23:59:59Z` };
}

/** How many matches to pull to reach the target, never negative. */
export function matchesNeeded(
  existingCount: number,
  target: number = MATCH_POOL_TARGET
): number {
  return Math.max(0, target - existingCount);
}

/** True when the event's kickoff falls on the given UTC match day. */
export function isOnMatchDay(event: OddsApiEvent, matchDay: string): boolean {
  return event.date.slice(0, 10) === matchDay;
}

/** Fisher–Yates shuffle on a copy; `rng` injectable for deterministic tests. */
export function shuffle<T>(
  items: readonly T[],
  rng: () => number = Math.random
): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Randomly pick up to `n` items (shuffle then slice). */
export function pickRandom<T>(
  items: readonly T[],
  n: number,
  rng: () => number = Math.random
): T[] {
  if (n <= 0) return [];
  return shuffle(items, rng).slice(0, n);
}

/**
 * Pull home/away decimal odds from the moneyline market, trying each bookmaker
 * in priority order. Returns null when no bookmaker has usable 1X2 odds.
 */
export function extractMoneyline(
  eventOdds: OddsApiEventOdds,
  bookmakerPriority: string[]
): { home: number; away: number } | null {
  for (const name of bookmakerPriority) {
    const markets = eventOdds.bookmakers?.[name];
    const ml = markets?.find((m) => m.name === MONEYLINE_MARKET);
    const line = ml?.odds?.[0];
    if (!line) continue;
    const home = Number(line.home);
    const away = Number(line.away);
    if (
      Number.isFinite(home) &&
      home > 0 &&
      Number.isFinite(away) &&
      away > 0
    ) {
      return { home, away };
    }
  }
  return null;
}
