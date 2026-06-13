import { CircleSlash, Trophy } from "lucide-react";

import { formatFootballMoney, formatTrophyDelta } from "@/lib/game/constants";
import type { PastPick } from "@/lib/game/types";
import { getServerDictionary } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";

import { Crest } from "./crest";

// Colours per result; the human label comes from the dictionary.
const RESULT_STYLES: Record<
  PastPick["result"],
  { badge: string; delta: string }
> = {
  win: {
    badge: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    delta: "text-emerald-600 dark:text-emerald-400",
  },
  draw: {
    badge: "bg-muted text-muted-foreground",
    delta: "text-muted-foreground",
  },
  loss: {
    badge: "bg-destructive/15 text-destructive",
    delta: "text-destructive",
  },
  none: {
    badge: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    delta: "text-amber-600 dark:text-amber-400",
  },
  pending: {
    badge: "bg-muted text-muted-foreground",
    delta: "text-muted-foreground",
  },
};

/**
 * Renders a player's settled/locked picks as a list. Shared by the signed-in
 * player's history page and other players' profiles so both look identical.
 * `emptyLabel` lets each surface word the empty state itself.
 */
export async function PastPicksList({
  picks,
  emptyLabel,
}: {
  picks: PastPick[];
  emptyLabel: string;
}) {
  const t = (await getServerDictionary()).pastPicks;

  if (picks.length === 0) {
    return (
      <p className="text-muted-foreground rounded-xl border border-dashed p-8 text-center text-sm">
        {emptyLabel}
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {picks.map((pick) => {
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
                    {t.noSelection}
                  </>
                ) : (
                  <>
                    <Crest
                      url={pick.crestUrl}
                      alt={pick.pick ?? ""}
                      className="size-5"
                    />
                    {pick.pick}
                  </>
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
              {t.results[pick.result]}
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
  );
}
