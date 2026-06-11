import { CircleSlash, Trophy } from "lucide-react";

import { formatFootballMoney, formatTrophyDelta } from "@/lib/game/constants";
import { getPastPicks } from "@/lib/game/queries";
import type { PastPick } from "@/lib/game/types";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Past Picks · The Daily Derby",
};

const RESULT_STYLES: Record<
  PastPick["result"],
  { label: string; badge: string; delta: string }
> = {
  win: {
    label: "Win",
    badge: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    delta: "text-emerald-600 dark:text-emerald-400",
  },
  draw: {
    label: "Draw",
    badge: "bg-muted text-muted-foreground",
    delta: "text-muted-foreground",
  },
  loss: {
    label: "Loss",
    badge: "bg-destructive/15 text-destructive",
    delta: "text-destructive",
  },
  none: {
    label: "Skipped",
    badge: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    delta: "text-amber-600 dark:text-amber-400",
  },
  pending: {
    label: "Pending",
    badge: "bg-muted text-muted-foreground",
    delta: "text-muted-foreground",
  },
};

export default async function PastPicksPage() {
  const pastPicks = await getPastPicks();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Past Picks</h1>
        <p className="text-muted-foreground text-sm">
          Your recent daily picks and how they scored.
        </p>
      </div>

      {pastPicks.length === 0 ? (
        <p className="text-muted-foreground rounded-xl border border-dashed p-8 text-center text-sm">
          No past picks yet — your settled days will show up here.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {pastPicks.map((pick) => {
            const style = RESULT_STYLES[pick.result];
            const skipped = pick.pick === null;

            return (
              <li
                key={pick.id}
                className="bg-card ring-foreground/10 flex items-center gap-3 rounded-xl p-3 ring-1"
              >
                <div className="flex w-12 shrink-0 flex-col items-center">
                  <span className="text-xs font-semibold tabular-nums">
                    {pick.date}
                  </span>
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="flex items-center gap-2 truncate font-medium">
                    {skipped ? (
                      <>
                        <CircleSlash
                          className="text-muted-foreground size-4"
                          aria-hidden
                        />
                        No selection
                      </>
                    ) : (
                      pick.pick
                    )}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {pick.league} · {formatFootballMoney(pick.cost)}
                  </span>
                </div>

                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-medium",
                    style.badge
                  )}
                >
                  {style.label}
                </span>

                <span
                  className={cn(
                    "flex w-12 items-center justify-end gap-0.5 font-bold tabular-nums",
                    style.delta
                  )}
                >
                  {formatTrophyDelta(pick.trophyDelta)}
                  <Trophy className="size-3.5" aria-hidden />
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
