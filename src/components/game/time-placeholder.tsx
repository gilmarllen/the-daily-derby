import { cn } from "@/lib/utils";

/**
 * A pulsing bar shown in place of a local time during SSR and the first client
 * render — local times can only be formatted in the browser's timezone, so they
 * are rendered client-side after mount. Size the reserved width via `className`
 * (e.g. `w-24`) so the real time doesn't shift the layout when it appears.
 */
export function TimePlaceholder({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "bg-muted/70 inline-block h-3 animate-pulse rounded-sm align-middle",
        className
      )}
      aria-hidden
    />
  );
}
