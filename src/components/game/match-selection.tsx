"use client";

import { Ban, Check, CircleSlash, Lock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DAILY_RESET_LABEL,
  costFromOdds,
  formatFootballMoney,
} from "@/lib/game/constants";
import type { TeamOption } from "@/lib/game/types";
import { cn } from "@/lib/utils";

import { useGame } from "./game-provider";

function OptionButton({ option }: { option: TeamOption }) {
  const { canAfford, isSelected, pickTeam } = useGame();
  const cost = costFromOdds(option.odds);
  const affordable = canAfford(option);
  const selected = isSelected(option.id);

  return (
    <button
      type="button"
      disabled={!affordable}
      aria-pressed={selected}
      onClick={() => pickTeam(option.id)}
      className={cn(
        "group relative flex flex-1 flex-col gap-1 rounded-lg border-2 p-3 text-left transition-all duration-200",
        "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
        affordable &&
          !selected &&
          "border-border hover:border-primary/50 hover:bg-muted active:scale-[0.98]",
        selected && "border-primary bg-primary/10 scale-[1.02] shadow-sm",
        !affordable &&
          "border-border cursor-not-allowed border-dashed opacity-55"
      )}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="font-semibold">{option.team}</span>
        <span
          className={cn(
            "flex size-5 items-center justify-center rounded-full transition-all",
            selected
              ? "bg-primary text-primary-foreground scale-100"
              : "scale-0"
          )}
          aria-hidden
        >
          <Check className="size-3.5" />
        </span>
      </span>

      <span className="text-muted-foreground flex items-center justify-between text-xs">
        <span>@ {option.odds.toFixed(2)}</span>
        {affordable ? (
          <span className="text-foreground font-medium">
            {formatFootballMoney(cost)}
          </span>
        ) : (
          <span className="text-destructive flex items-center gap-1">
            <Lock className="size-3" aria-hidden />
            {formatFootballMoney(cost)}
          </span>
        )}
      </span>
    </button>
  );
}

export function MatchSelection() {
  const { matches, selection, clearPick } = useGame();
  const noPick = selection.kind === "none";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Tomorrow&apos;s Match Pool
        </h1>
        <p className="text-muted-foreground text-sm">
          Pick one team to win from your five matches. Cost is{" "}
          <span className="text-foreground font-medium">F$ 10 ÷ odds</span>. You
          can change your pick until {DAILY_RESET_LABEL}.
        </p>
      </div>

      {/* No-selection option — default, and deliberately distinct. */}
      <button
        type="button"
        aria-pressed={noPick}
        onClick={clearPick}
        className={cn(
          "flex items-center gap-3 rounded-xl border-2 border-dashed p-4 text-left transition-all duration-200",
          "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
          noPick
            ? "border-muted-foreground/60 bg-muted"
            : "border-border opacity-70 hover:opacity-100"
        )}
      >
        <CircleSlash
          className={cn(
            "size-6 shrink-0",
            noPick ? "text-foreground" : "text-muted-foreground"
          )}
          aria-hidden
        />
        <span className="flex flex-col">
          <span className="flex items-center gap-2 font-semibold">
            No selection
            {noPick && (
              <Badge variant="secondary" className="gap-1">
                <Ban className="size-3" /> Default
              </Badge>
            )}
          </span>
          <span className="text-muted-foreground text-xs">
            Sit today out — costs F$ 0.00 but skipping a day is −2 trophies.
          </span>
        </span>
      </button>

      <div className="grid gap-4 sm:grid-cols-2">
        {matches.map((m, i) => (
          <Card
            key={m.id}
            className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <CardHeader className="flex-row items-center justify-between">
              <Badge variant="outline">{m.league}</Badge>
              <span className="text-muted-foreground text-xs">{m.kickoff}</span>
            </CardHeader>
            <CardContent className="flex items-stretch gap-2">
              <OptionButton option={m.home} />
              <span className="text-muted-foreground flex items-center text-xs font-semibold">
                vs
              </span>
              <OptionButton option={m.away} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
