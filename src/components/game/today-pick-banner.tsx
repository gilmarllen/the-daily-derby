"use client";

import { CalendarClock, CircleSlash, Clock, Trophy } from "lucide-react";

import { useDictionary } from "@/components/i18n/locale-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  TROPHY_DELTAS,
  formatFootballMoney,
  formatTrophyDelta,
} from "@/lib/game/constants";
import { useHydrated } from "@/lib/hooks";
import type { PickResult, TodayPick } from "@/lib/game/types";
import { cn } from "@/lib/utils";

/** Trophy change chip, colored by sign. */
function TrophyDelta({ delta }: { delta: number }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-semibold tabular-nums",
        delta > 0
          ? "text-emerald-600 dark:text-emerald-400"
          : delta < 0
            ? "text-destructive"
            : "text-muted-foreground"
      )}
    >
      <Trophy className="size-3.5" aria-hidden />
      {formatTrophyDelta(delta)}
    </span>
  );
}

/** Kickoff time in the viewer's local timezone, e.g. "Jun 9, 21:00". */
function formatKickoff(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

const RESULT_CLASS: Record<PickResult, string> = {
  win: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  draw: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  loss: "bg-destructive/15 text-destructive",
  none: "bg-muted text-muted-foreground",
};

export function TodayPickBanner({ pick }: { pick: TodayPick | null }) {
  const t = useDictionary().todayPick;
  // Re-render after mount so kickoff times format in the browser's timezone.
  useHydrated();

  // No pick row for today (e.g. a brand-new player) — nothing to show.
  if (!pick) return null;

  if (pick.kind === "none") {
    return (
      <Card className="border-dashed">
        <CardContent className="flex items-center gap-3 py-4">
          <CircleSlash
            className="text-muted-foreground size-5 shrink-0"
            aria-hidden
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{t.noPickTitle}</span>
            <span className="text-muted-foreground text-xs">
              {t.noPickDesc}
            </span>
          </div>
          <span className="ml-auto">
            <TrophyDelta delta={TROPHY_DELTAS.none} />
          </span>
        </CardContent>
      </Card>
    );
  }

  const pickedTeam = pick.pickedSide === "home" ? pick.home : pick.away;
  const opponent = pick.pickedSide === "home" ? pick.away : pick.home;
  const settled = pick.status === "finished" && pick.result !== null;
  const hasScore = pick.homeScore !== null && pick.awayScore !== null;

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="flex flex-col gap-2 py-4">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary" className="gap-1.5 p-0">
            <CalendarClock className="size-3.5" aria-hidden />
            {t.badge}
          </Badge>

          {settled && pick.result ? (
            <span className="flex items-center gap-2">
              {hasScore && (
                <span className="text-sm font-semibold tabular-nums">
                  {pick.homeScore}–{pick.awayScore}
                </span>
              )}
              <Badge className={cn("border-0", RESULT_CLASS[pick.result])}>
                {t.results[pick.result]}
              </Badge>
              <TrophyDelta delta={TROPHY_DELTAS[pick.result]} />
            </span>
          ) : (
            <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <Clock className="size-3.5 shrink-0" aria-hidden />
              <span className="tabular-nums" suppressHydrationWarning>
                {formatKickoff(pick.kickoff)}
              </span>
            </span>
          )}
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="font-semibold">
            {pickedTeam}{" "}
            <span className="text-muted-foreground text-sm font-normal">
              {t.vs} {opponent}
            </span>
          </span>
          <span className="text-muted-foreground text-xs">
            {pick.league} · {formatFootballMoney(pick.cost)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
