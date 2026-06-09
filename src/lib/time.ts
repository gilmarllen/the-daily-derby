// Shared UTC date/time helpers. The game day is delimited by 00:00 UTC, so all
// day arithmetic goes through these to keep the boundary consistent.

/** Midnight (00:00:00.000Z) of the UTC day `addDays` from `base`. */
export function utcDayStart(base: Date, addDays = 0): Date {
  return new Date(
    Date.UTC(
      base.getUTCFullYear(),
      base.getUTCMonth(),
      base.getUTCDate() + addDays
    )
  );
}

/** The UTC calendar date (YYYY-MM-DD) `addDays` from `base`. */
export function utcDateString(base: Date, addDays = 0): string {
  return utcDayStart(base, addDays).toISOString().slice(0, 10);
}
