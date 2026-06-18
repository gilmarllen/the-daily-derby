"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Returns `false` during SSR and the first client render, then `true` after the
 * component has mounted. Use it to force a re-render once hydrated so values
 * computed from the browser environment (e.g. the viewer's timezone) replace the
 * server-rendered fallback. `suppressHydrationWarning` alone is not enough — it
 * mutes the warning but React keeps the server markup until something triggers a
 * re-render.
 *
 * Built on `useSyncExternalStore` (server snapshot `false`, client snapshot
 * `true`) so the post-hydration re-render happens without a setState-in-effect.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
