import { utcDateString } from "@/lib/time";

/**
 * The UTC date (YYYY-MM-DD) players are currently picking for. Picks are made a
 * day ahead, so this is tomorrow relative to `now`. Used as the `match_day` key
 * for the pool, picks, and the daily freeze. Mirrors the day the
 * `set_daily_pick` RPC computes server-side.
 */
export function pickableDay(now: Date = new Date()): string {
  return utcDateString(now, 1);
}
