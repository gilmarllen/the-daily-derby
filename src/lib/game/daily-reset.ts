// Helpers for the daily reset countdown. The game day is delimited by 00:00 UTC
// (see CLAUDE.md / DAILY_RESET_LABEL), so the reset is the next UTC midnight.

import { utcDayStart } from "@/lib/time";

/** Milliseconds from `now` until the next 00:00 UTC. */
export function msUntilNextUtcReset(now: Date = new Date()): number {
  return utcDayStart(now, 1).getTime() - now.getTime();
}

/** Formats a duration in ms as `HH:MM:SS`, clamped at zero. */
export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
