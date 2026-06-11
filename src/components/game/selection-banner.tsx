"use client";

import { ChevronRight, CircleCheck, Clock, Hourglass } from "lucide-react";

import { formatFootballMoney } from "@/lib/game/constants";
import { cn } from "@/lib/utils";

import { useGame } from "./game-provider";
import { ResetCountdown } from "./reset-countdown";

export function SelectionBanner() {
  const { selectedOption, selectedCost, requestHighlight } = useGame();
  const hasPick = selectedOption !== null;

  return (
    <button
      type="button"
      onClick={requestHighlight}
      aria-label="Go to your pick"
      className={cn(
        "group focus-visible:ring-ring relative w-full cursor-pointer overflow-hidden border-b text-sm transition-colors focus-visible:ring-2 focus-visible:-outline-offset-2 focus-visible:outline-none",
        hasPick
          ? "bg-primary/10 text-foreground hover:bg-primary/15"
          : "text-foreground bg-amber-500/10 hover:bg-amber-500/15"
      )}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5">
        <span className="flex items-center gap-1.5 font-semibold">
          {hasPick ? (
            <span className="relative flex size-2.5">
              <span className="bg-primary/60 absolute inline-flex size-full animate-ping rounded-full" />
              <span className="bg-primary relative inline-flex size-2.5 rounded-full" />
            </span>
          ) : (
            <Hourglass className="size-4 text-amber-600" aria-hidden />
          )}
          {hasPick ? "Picking" : "No selection"}
        </span>

        {hasPick ? (
          <span className="text-muted-foreground flex items-center gap-1.5">
            <CircleCheck className="text-primary size-4" aria-hidden />
            <span className="text-foreground">{selectedOption.team}</span>
            <span aria-hidden>·</span>
            {formatFootballMoney(selectedCost)}
          </span>
        ) : (
          <span className="text-muted-foreground">
            Pick a team to enter today&apos;s derby.
          </span>
        )}

        <ChevronRight
          className="text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />

        <span className="text-muted-foreground flex w-full items-center gap-1.5 text-xs sm:ml-auto sm:w-auto">
          <Clock className="size-3.5 shrink-0" aria-hidden />
          Locks in <ResetCountdown />
        </span>
      </div>
    </button>
  );
}
