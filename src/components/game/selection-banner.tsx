"use client";

import { CircleCheck, Clock, Hourglass } from "lucide-react";

import { formatFootballMoney } from "@/lib/game/constants";
import { cn } from "@/lib/utils";

import { useGame } from "./game-provider";
import { ResetCountdown } from "./reset-countdown";

export function SelectionBanner() {
  const { selectedOption, selectedCost } = useGame();
  const hasPick = selectedOption !== null;

  return (
    <div
      className={cn(
        "relative overflow-hidden border-b transition-colors",
        hasPick
          ? "bg-primary/10 text-foreground"
          : "text-foreground bg-amber-500/10"
      )}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5 text-sm">
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

        <span className="text-muted-foreground ml-auto flex items-center gap-1.5 text-xs">
          <Clock className="size-3.5" aria-hidden />
          Locks in <ResetCountdown />
        </span>
      </div>
    </div>
  );
}
