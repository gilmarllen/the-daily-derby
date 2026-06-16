"use client";

import {
  Check,
  CircleSlash,
  Clock,
  Coins,
  Lock,
  CircleStar,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useDictionary } from "@/components/i18n/locale-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DAILY_RESET_LABEL,
  costFromOdds,
  formatFootballMoney,
} from "@/lib/game/constants";
import type { TeamOption } from "@/lib/game/types";
import { utcDayStart } from "@/lib/time";
import { cn } from "@/lib/utils";

import { Crest } from "./crest";
import { useGame } from "./game-provider";

/** The next 00:00 UTC reset, rendered in the viewer's local time. */
function ResetLocalTime() {
  const localTime = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(utcDayStart(new Date(), 1));
  return <span suppressHydrationWarning>{localTime}</span>;
}

/** Kickoff date + time in the viewer's local timezone, e.g. "Jun 9, 21:00". */
function formatLocal(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
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

function OptionButton({
  option,
  innerRef,
  flash,
}: {
  option: TeamOption;
  innerRef?: React.Ref<HTMLButtonElement>;
  flash?: boolean;
}) {
  const { canAfford, isSelected, pickTeam } = useGame();
  const cost = costFromOdds(option.odds);
  const affordable = canAfford(option);
  const selected = isSelected(option.id);

  // When selected, tint the border with the club's primary colour if known.
  const accent =
    selected && option.primaryColor ? option.primaryColor : undefined;

  return (
    <button
      ref={innerRef}
      type="button"
      disabled={!affordable}
      aria-pressed={selected}
      onClick={() => pickTeam(option.id)}
      style={accent ? { borderColor: accent } : undefined}
      className={cn(
        "group flex min-w-0 items-center gap-3 rounded-xl border-2 p-3 text-left transition-all duration-200",
        "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
        affordable &&
          !selected &&
          "border-border hover:border-primary/50 hover:bg-muted/60 active:scale-[0.99]",
        selected &&
          "border-primary bg-primary/10 ring-primary/20 shadow-sm ring-2",
        !affordable && "cursor-not-allowed border-dashed opacity-55",
        flash && "animate-pick-highlight"
      )}
    >
      {/* Leading radio-style indicator that fills in when selected. */}
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          selected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/30"
        )}
        aria-hidden
      >
        <Check
          className={cn(
            "size-3 transition-transform",
            selected ? "scale-100" : "scale-0"
          )}
        />
      </span>

      <Crest
        url={option.crestUrl}
        alt={option.team}
        color={option.primaryColor}
        className="size-8 sm:size-10"
      />

      <span className="flex min-w-0 flex-col">
        <span className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
          {option.side}
        </span>
        <span className="truncate leading-tight font-semibold">
          {option.team}
        </span>
      </span>

      <span
        className={cn(
          "ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold tabular-nums",
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
  const {
    matches,
    selection,
    isSelected,
    clearPick,
    error,
    highlightSignal,
    consumeHighlight,
  } = useGame();
  const t = useDictionary().selection;
  const noPick = selection.kind === "none";

  // When the in-progress banner requests it, scroll the current selection into
  // view and flash it. `selectedRef` is attached to whichever button is the
  // active pick (a team option, or the No-selection button).
  const selectedRef = useRef<HTMLButtonElement>(null);
  const [flashing, setFlashing] = useState(false);
  useEffect(() => {
    if (!consumeHighlight()) return;
    selectedRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    const raf = requestAnimationFrame(() => setFlashing(true));
    const timer = setTimeout(() => setFlashing(false), 1500);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [highlightSignal, consumeHighlight]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">{t.title}</h1>
        <p className="text-muted-foreground text-sm">
          {t.descA}
          <span className="text-foreground font-medium">
            {t.descPriceLabel}
          </span>
          {t.descB}
          <ResetLocalTime /> ({DAILY_RESET_LABEL}).
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
        ref={noPick ? selectedRef : undefined}
        type="button"
        aria-pressed={noPick}
        onClick={clearPick}
        className={cn(
          "flex items-center gap-3 rounded-xl border-2 border-dashed p-4 text-left transition-all duration-200",
          "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
          noPick
            ? "border-muted-foreground/60 bg-muted"
            : "border-border opacity-70 hover:opacity-100",
          flashing && noPick && "animate-pick-highlight"
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
            {t.noSelection}
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
            {t.noSelectionDesc(formatFootballMoney(0))}
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
            <span className="text-foreground font-medium">{t.emptyTitle}</span>
            <span>{t.emptyDesc}</span>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {matches.map((m, i) => (
            <Card
              key={m.id}
              className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both overflow-hidden p-4 duration-500"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="flex flex-col gap-3">
                {/* Match meta header — league left, kickoff right on desktop;
                    stacked (kickoff under the league) on mobile. */}
                <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                  <span className="text-xs font-medium whitespace-nowrap">
                    {m.league}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                    <Clock className="size-3.5" aria-hidden />
                    <KickoffTime iso={m.kickoff} />
                  </span>
                </div>

                {/* Team options — stacked on mobile, side-by-side on desktop. */}
                <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-3">
                  <OptionButton
                    option={m.home}
                    innerRef={isSelected(m.home.id) ? selectedRef : undefined}
                    flash={flashing && isSelected(m.home.id)}
                  />
                  <span
                    className="text-muted-foreground bg-muted/60 m-auto hidden size-7 items-center justify-center rounded-full text-[10px] font-bold sm:flex"
                    aria-hidden
                  >
                    {t.vs}
                  </span>
                  <OptionButton
                    option={m.away}
                    innerRef={isSelected(m.away.id) ? selectedRef : undefined}
                    flash={flashing && isSelected(m.away.id)}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
