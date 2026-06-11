// Core game constants and money helpers. See CLAUDE.md for the authoritative
// product rules these come from.

export const STARTING_BALANCE = 10;
export const DAILY_INCOME = 4;
export const SELECTION_COST_BASE = 10;
export const DAILY_RESET_LABEL = "00:00 UTC";

/** Non-breaking space — keeps `F$` glued to the amount so it can't wrap. */
const NBSP = String.fromCharCode(160);

export const TROPHY_DELTAS = {
  win: 3,
  draw: 0,
  loss: -1,
  none: -2,
  achievement: 1,
} as const;

/** Selection cost for a team given its decimal odds: `10 / odds`. */
export function costFromOdds(odds: number): number {
  return SELECTION_COST_BASE / odds;
}

/** Formats an F$ amount with two decimals, e.g. `F$ 6.67` (non-breaking). */
export function formatFootballMoney(amount: number): string {
  return `F$${NBSP}${amount.toFixed(2)}`;
}

/** Formats a trophy delta with an explicit sign, e.g. `+3`, `0`, `-2`. */
export function formatTrophyDelta(delta: number): string {
  return delta > 0 ? `+${delta}` : `${delta}`;
}
