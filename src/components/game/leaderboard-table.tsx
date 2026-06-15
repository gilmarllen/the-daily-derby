"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Coins,
  Flame,
  Goal,
  Locate,
  Trophy,
} from "lucide-react";

import { useDictionary } from "@/components/i18n/locale-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatFootballMoney } from "@/lib/game/constants";
import type { LeaderboardEntry, PickResult } from "@/lib/game/types";
import { cn } from "@/lib/utils";

import { Crest } from "./crest";

const PAGE_SIZE = 10;

// Colour the today pick by its settled result; pending (null) stays muted.
const TODAY_RESULT_STYLE: Record<PickResult, string> = {
  win: "text-emerald-600 dark:text-emerald-400",
  draw: "text-black dark:text-white",
  loss: "text-destructive",
  none: "text-muted-foreground",
};

const RANK_ACCENT: Record<number, string> = {
  1: "text-amber-500",
  2: "text-zinc-400",
  3: "text-orange-700",
};

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function LeaderboardTable({ entries }: { entries: LeaderboardEntry[] }) {
  const router = useRouter();
  const t = useDictionary().leaderboard;
  const currentIndex = entries.findIndex((e) => e.isCurrentUser);
  const myPage = currentIndex >= 0 ? Math.floor(currentIndex / PAGE_SIZE) : 0;
  const pageCount = Math.max(1, Math.ceil(entries.length / PAGE_SIZE));

  // Default to the page holding the current user.
  const [page, setPage] = useState(myPage);
  const current = Math.min(page, pageCount - 1);
  const rows = entries.slice(
    current * PAGE_SIZE,
    current * PAGE_SIZE + PAGE_SIZE
  );

  if (entries.length === 0) {
    return (
      <p className="text-muted-foreground rounded-xl border border-dashed p-8 text-center text-sm">
        {t.empty}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="ring-foreground/10 overflow-hidden rounded-xl ring-1">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 text-muted-foreground border-b text-xs">
              <th className="px-3 py-2 text-left font-medium">#</th>
              <th className="px-3 py-2 text-left font-medium">{t.player}</th>
              <th className="hidden px-3 py-2 text-left font-medium sm:table-cell">
                <Goal className="size-4" aria-label={t.ariaTodayPick} />
              </th>
              <th className="px-3 py-2 text-right font-medium">
                <Trophy
                  className="ml-auto size-4"
                  aria-label={t.ariaTrophies}
                />
              </th>
              <th className="hidden px-3 py-2 text-right font-medium sm:table-cell">
                <Coins
                  className="ml-auto size-4"
                  aria-label={t.ariaMoneySpent}
                />
              </th>
              <th className="hidden px-3 py-2 text-right font-medium sm:table-cell">
                <Flame
                  className="ml-auto size-4"
                  aria-label={t.ariaWinStreak}
                />
              </th>
              {/* Open-profile affordance. */}
              <th className="w-9 px-2 py-2" aria-hidden />
            </tr>
          </thead>
          <tbody>
            {rows.map((entry) => (
              <tr
                key={entry.rank}
                onClick={() =>
                  router.push(
                    `/dashboard/players/${encodeURIComponent(entry.name)}`
                  )
                }
                className={cn(
                  "cursor-pointer border-b transition-colors last:border-0",
                  entry.isCurrentUser
                    ? "bg-primary/10 font-medium"
                    : "hover:bg-muted/40"
                )}
              >
                <td className="px-3 py-3 align-top sm:align-middle">
                  <span
                    className={cn(
                      "font-bold tabular-nums",
                      RANK_ACCENT[entry.rank]
                    )}
                  >
                    {entry.rank}
                  </span>
                </td>
                <td className="px-3 py-3 align-top sm:align-middle">
                  <Link
                    href={`/dashboard/players/${encodeURIComponent(entry.name)}`}
                    onClick={(e) => e.stopPropagation()}
                    className="group flex items-center gap-2"
                  >
                    <Avatar className="size-7">
                      <AvatarFallback className="text-xs">
                        {initials(entry.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="group-hover:underline">{entry.name}</span>
                    {entry.isCurrentUser && (
                      <span className="text-muted-foreground text-xs">
                        {t.you}
                      </span>
                    )}
                  </Link>

                  {/* Mobile: today pick on its own line, then streak + money. */}
                  <div className="mt-1.5 flex flex-col gap-1 text-xs sm:hidden">
                    <span className="flex min-w-0 items-center gap-1.5">
                      <Goal
                        className="text-muted-foreground size-3.5 shrink-0"
                        aria-label={t.ariaTodayPick}
                      />
                      {entry.todayPick ? (
                        <span
                          className={cn(
                            "flex min-w-0 items-center gap-1.5 font-medium",
                            entry.todayResult
                              ? TODAY_RESULT_STYLE[entry.todayResult]
                              : "text-foreground"
                          )}
                        >
                          <Crest
                            url={entry.todayPickCrestUrl}
                            alt={entry.todayPick}
                            className="size-4"
                          />
                          <span className="truncate">{entry.todayPick}</span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </span>
                    <span className="text-muted-foreground flex items-center gap-3">
                      <span className="flex items-center gap-1.5 tabular-nums">
                        <Flame
                          className="size-3.5 shrink-0"
                          aria-label={t.ariaWinStreak}
                        />
                        {entry.winStreak}
                      </span>
                      <span className="flex items-center gap-1.5 tabular-nums">
                        <Coins
                          className="size-3.5 shrink-0"
                          aria-label={t.ariaMoneySpent}
                        />
                        {formatFootballMoney(entry.moneySpent)}
                      </span>
                    </span>
                  </div>
                </td>
                <td
                  className={cn(
                    "hidden max-w-[10rem] px-3 py-3 sm:table-cell",
                    entry.todayPick && entry.todayResult
                      ? cn("font-medium", TODAY_RESULT_STYLE[entry.todayResult])
                      : "text-muted-foreground"
                  )}
                >
                  {entry.todayPick ? (
                    <span className="flex items-center gap-1.5">
                      <Crest
                        url={entry.todayPickCrestUrl}
                        alt={entry.todayPick}
                        className="size-5"
                      />
                      <span className="truncate">{entry.todayPick}</span>
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-3 py-3 text-right align-top font-semibold tabular-nums sm:align-middle">
                  {entry.trophies}
                </td>
                <td className="text-muted-foreground hidden px-3 py-3 text-right tabular-nums sm:table-cell">
                  {formatFootballMoney(entry.moneySpent)}
                </td>
                <td className="hidden px-3 py-3 text-right tabular-nums sm:table-cell">
                  {entry.winStreak}
                </td>
                {/* Hints the row opens the player's profile. */}
                <td className="px-2 py-3 text-right align-top sm:align-middle">
                  <ChevronRight
                    className="text-muted-foreground/50 inline size-4"
                    aria-hidden
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col text-sm">
        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPage(current - 1)}
            disabled={current === 0}
          >
            <ChevronLeft className="size-4" /> {t.prev}
          </Button>

          <span className="text-muted-foreground flex items-center gap-3 text-xs">
            <span className="tabular-nums">
              {t.page(current + 1, pageCount)}
            </span>
          </span>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPage(current + 1)}
            disabled={current >= pageCount - 1}
          >
            {t.next} <ChevronRight className="size-4" />
          </Button>
        </div>
        {currentIndex >= 0 && current !== myPage && (
          <button
            type="button"
            onClick={() => setPage(myPage)}
            className="text-foreground mx-auto inline-flex items-center gap-1 font-medium hover:underline"
          >
            <Locate className="size-3.5" /> {t.jumpToMe}
          </button>
        )}
      </div>
    </div>
  );
}
