import { TROPHY_DELTAS } from "@/lib/game/constants";
import type { PastPick, PickResult, Side } from "@/lib/game/types";
import { utcDateString } from "@/lib/time";

/**
 * The UTC day strings (newest first) a past-picks history should cover: every
 * locked day from `firstDay` through today (today's pick was locked yesterday),
 * capped at the `limit` most recent. Days without a pick row are filled in by
 * the caller as sat-outs, so a missed day shows up like a real no-selection.
 * Returns `[]` when there's no history (`firstDay` null, or only the in-progress
 * day/future), so a new player sees nothing.
 */
export function pastPickDays(
  now: Date,
  firstDay: string | null,
  limit: number
): string[] {
  if (!firstDay) return [];
  const days: string[] = [];
  // Walk back from today (0); stop at the limit or the player's first day.
  for (let i = 0; i < limit; i++) {
    const day = utcDateString(now, -i);
    if (day < firstDay) break;
    days.push(day);
  }
  return days;
}

/** A match day (YYYY-MM-DD) as a short label, e.g. "Jun 9". */
export function formatDay(matchDay: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${matchDay}T00:00:00Z`));
}

/** A picks-row shape (own table or the get_player_picks RPC) for mapping. */
export type PickRow = {
  id: string;
  match_day: string;
  picked_side: Side | null;
  cost: number | string;
  result: PickResult | null;
  home_team: string | null;
  away_team: string | null;
  league: string | null;
  /** Crest urls; optional — only the history query embeds them. */
  home_crest?: string | null;
  away_crest?: string | null;
};

/**
 * Maps a settled/locked picks row to the UI `PastPick`. A row with no team
 * (sat-out) is a skipped day (-2); a team pick still awaiting its result shows
 * as "pending". Shared by the history page and other players' profiles so both
 * render identically. Pure (no server-only deps) so it is unit-testable.
 */
export function toPastPick(row: PickRow): PastPick {
  // No team chosen → a skipped day.
  if (!row.picked_side || !row.home_team || !row.away_team) {
    return {
      id: row.id,
      date: formatDay(row.match_day),
      league: "—",
      pick: null,
      cost: Number(row.cost),
      result: "none",
      trophyDelta: TROPHY_DELTAS.none,
    };
  }

  const result = row.result ?? "pending";
  return {
    id: row.id,
    date: formatDay(row.match_day),
    league: row.league ?? "—",
    pick: row.picked_side === "home" ? row.home_team : row.away_team,
    crestUrl:
      (row.picked_side === "home" ? row.home_crest : row.away_crest) ?? null,
    cost: Number(row.cost),
    result,
    trophyDelta: result === "pending" ? 0 : TROPHY_DELTAS[result],
  };
}
