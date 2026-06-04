import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type StatPillProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
  className?: string;
  iconClassName?: string;
};

/** Compact icon + value chip used for trophies, money, and streak counts. */
export function StatPill({
  icon: Icon,
  label,
  value,
  className,
  iconClassName,
}: StatPillProps) {
  return (
    <div
      className={cn(
        "bg-card ring-foreground/10 flex items-center gap-2 rounded-full px-3 py-1.5 ring-1",
        className
      )}
    >
      <Icon className={cn("size-4 shrink-0", iconClassName)} aria-hidden />
      <span className="sr-only">{label}:</span>
      <span className="text-sm font-semibold tabular-nums">{value}</span>
    </div>
  );
}
