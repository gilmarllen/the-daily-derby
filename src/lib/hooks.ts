"use client";

import { useEffect, useState } from "react";

/**
 * Returns `false` during SSR and the first client render, then `true` after the
 * component has mounted. Use it to force a re-render once hydrated so values
 * computed from the browser environment (e.g. the viewer's timezone) replace the
 * server-rendered fallback. `suppressHydrationWarning` alone is not enough — it
 * mutes the warning but React keeps the server markup until something triggers a
 * re-render.
 *
 * Implemented with a mount effect (not `useSyncExternalStore`, whose
 * server/client snapshot difference does not reliably re-render after hydration
 * in the App Router). Flipping state in a mount effect is the canonical way to
 * guarantee that re-render.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional one-shot flip on mount to re-render with browser-only values
    setHydrated(true);
  }, []);
  return hydrated;
}
