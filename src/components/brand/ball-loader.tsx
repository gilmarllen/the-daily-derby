import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

/**
 * Thematic loading indicator: the crest bounces like a football over a
 * squashing ground shadow, with an optional caption underneath. Honors
 * `prefers-reduced-motion` (the bounce/shadow animations are disabled in CSS).
 */
export function BallLoader({
  label,
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn("flex flex-col items-center gap-4", className)}
      role="status"
      aria-live="polite"
    >
      <div className="flex h-14 flex-col items-center justify-end">
        <Logo className="animate-ball-bounce size-12" />
        <span
          className="bg-foreground/30 animate-ball-shadow mt-1 block h-1 w-9 rounded-full blur-[1px]"
          aria-hidden
        />
      </div>
      {label && (
        <p className="text-muted-foreground text-sm font-medium">{label}</p>
      )}
    </div>
  );
}
