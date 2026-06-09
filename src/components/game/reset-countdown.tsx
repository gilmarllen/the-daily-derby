"use client";

import { useEffect, useState } from "react";

import { formatCountdown, msUntilNextUtcReset } from "@/lib/game/daily-reset";

/**
 * Live `HH:MM:SS` countdown to the next 00:00 UTC daily reset. When it reaches
 * zero, reloads the page so the new day's match pool is fetched.
 *
 * The initial value is computed from the clock, so SSR and the client's first
 * render differ by a tick — `suppressHydrationWarning` lets the client value win
 * without a mismatch warning. State only updates inside the interval callback.
 */
export function ResetCountdown() {
  const [ms, setMs] = useState(() => msUntilNextUtcReset());

  useEffect(() => {
    const id = setInterval(() => {
      const remaining = msUntilNextUtcReset();
      if (remaining <= 0) {
        window.location.reload();
        return;
      }
      setMs(remaining);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="tabular-nums" suppressHydrationWarning>
      {formatCountdown(ms)}
    </span>
  );
}
