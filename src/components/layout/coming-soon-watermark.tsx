import type { ReactNode } from "react";
import { Construction } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Overlays a "coming soon / under development" stamp on top of `children`,
 * blurring them as a teaser preview. When `enabled` is false it renders the
 * children untouched, so a feature can be developed normally and the watermark
 * flipped on per environment. Reusable across any in-progress page/section.
 */
export function ComingSoonWatermark({
  enabled = true,
  title = "Coming soon",
  description,
  className,
  children,
}: {
  enabled?: boolean;
  title?: string;
  description?: string;
  className?: string;
  children: ReactNode;
}) {
  if (!enabled) return <>{children}</>;

  return (
    <div className={cn("relative", className)}>
      <div
        aria-hidden
        className="pointer-events-none opacity-50 blur-[2px] select-none"
      >
        {children}
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
        <span className="border-primary/40 bg-background/80 text-primary flex -rotate-6 items-center gap-2 rounded-2xl border-2 border-dashed px-6 py-3 text-2xl font-extrabold tracking-wide uppercase shadow-sm backdrop-blur-sm sm:text-3xl">
          <Construction className="size-7 sm:size-8" aria-hidden />
          {title}
        </span>
        {description && (
          <p className="text-muted-foreground bg-background/60 max-w-xs rounded-lg px-3 py-1 text-sm backdrop-blur-sm">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
