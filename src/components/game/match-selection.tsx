"use client";

import { Check, CircleSlash, Clock, Coins, Lock, Shield } from "lucide-react";

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

/** Kickoff time in the viewer's local timezone, e.g. "21:00". */
function formatLocal(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

/**
 * Renders a kickoff time in the viewer's timezone. Server-rendered markup uses
 * the server timezone, so `suppressHydrationWarning` lets the client's local
 * value take over on hydration without a mismatch warning.
 */
function KickoffTime({ iso }: { iso: string }) {
  return (
    <span className="tabular-nums" suppressHydrationWarning>
      {formatLocal(iso)}
    </span>
  );
}

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
        "group relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all duration-200",
        "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
        affordable &&
          !selected &&
          "border-border hover:border-primary/50 hover:bg-muted/60 active:scale-[0.98]",
        selected &&
          "border-primary bg-primary/10 ring-primary/20 scale-[1.02] shadow-sm ring-2",
        !affordable && "cursor-not-allowed border-dashed opacity-55"
      )}
    >
      {/* Selected check — floats in the corner so it doesn't shift the layout. */}
      <span
        className={cn(
          "absolute top-2 right-2 flex size-5 items-center justify-center rounded-full transition-all",
          selected ? "bg-primary text-primary-foreground scale-100" : "scale-0"
        )}
        aria-hidden
      >
        <Check className="size-3.5" />
      </span>

      <span className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
        {option.side}
      </span>
      <span className="leading-tight font-semibold">{option.team}</span>

      <span
        className={cn(
          "mt-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold tabular-nums",
          affordable
            ? "bg-muted text-foreground group-hover:bg-background"
            : "bg-destructive/10 text-destructive"
        )}
      >
        {affordable ? (
          <Coins className="size-3.5" aria-hidden />
        ) : (
          <Lock className="size-3.5" aria-hidden />
        )}
        {formatFootballMoney(cost)}
      </span>
    </button>
  );
}

export function MatchSelection() {
  const { matches, selection, clearPick, error } = useGame();
  const noPick = selection.kind === "none";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Tomorrow&apos;s Match Pool
        </h1>
        <p className="text-muted-foreground text-sm">
          Pick one team to win from your five matches. Each option shows its{" "}
          <span className="text-foreground font-medium">F$ price</span> — you
          can change your pick until {DAILY_RESET_LABEL}.
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="border-destructive/30 bg-destructive/10 text-destructive rounded-lg border px-3 py-2 text-sm"
        >
          {error}
        </p>
      )}

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
            <span
              className={cn(
                "bg-primary text-primary-foreground flex size-5 items-center justify-center rounded-full transition-all",
                noPick ? "scale-100" : "scale-0"
              )}
              aria-hidden
            >
              <Check className="size-3.5" />
            </span>
          </span>
          <span className="text-muted-foreground text-xs">
            Sit today out — costs F$ 0.00 but skipping a day is −2 trophies.
          </span>
        </span>
        <span className="text-muted-foreground ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold tabular-nums">
          <Coins className="size-3.5" aria-hidden />
          {formatFootballMoney(0)}
        </span>
      </button>

      {matches.length === 0 ? (
        <Card>
          <CardContent className="text-muted-foreground flex flex-col items-center gap-1 py-12 text-center text-sm">
            <CircleSlash className="mb-1 size-6" aria-hidden />
            <span className="text-foreground font-medium">
              No matches yet for tomorrow
            </span>
            <span>The pool is filled daily — check back soon.</span>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {matches.map((m, i) => (
            <Card
              key={m.id}
              className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both gap-3 overflow-hidden duration-500"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <CardHeader className="flex-row items-center justify-between gap-2">
                <Badge variant="outline" className="gap-1.5">
                  <Shield className="size-3.5" aria-hidden />
                  {m.league}
                </Badge>
                <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                  <Clock className="size-3.5" aria-hidden />
                  <KickoffTime iso={m.kickoff} />
                </span>
              </CardHeader>
              <CardContent className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2">
                <OptionButton option={m.home} />
                <span
                  className="text-muted-foreground bg-muted/60 m-auto flex size-7 items-center justify-center rounded-full text-[10px] font-bold"
                  aria-hidden
                >
                  VS
                </span>
                <OptionButton option={m.away} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
