"use client";

import Link from "next/link";
import { Coins, Flame, Trophy } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useDictionary } from "@/components/i18n/locale-provider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DAILY_INCOME, formatFootballMoney } from "@/lib/game/constants";

import { useGame } from "./game-provider";
import { StatPill } from "./stat-pill";
import { UserMenu } from "./user-menu";

export function DashboardHeader() {
  const { player } = useGame();
  const t = useDictionary().header;

  return (
    <header className="bg-background/80 sticky top-0 z-20 border-b backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-bold tracking-tight"
        >
          <Logo className="size-7" />
          <span className="hidden sm:inline">The Daily Derby</span>
        </Link>

        <div className="flex items-center gap-2">
          <StatPill
            icon={Trophy}
            label={t.trophies}
            value={player.trophies}
            iconClassName="text-amber-500"
          />
          <Tooltip>
            <TooltipTrigger className="cursor-help rounded-full border-0 bg-transparent p-0">
              <StatPill
                icon={Coins}
                label={t.footballMoney}
                value={formatFootballMoney(player.balance)}
                iconClassName="text-emerald-500"
              />
            </TooltipTrigger>
            <TooltipContent>
              {t.dailyIncomeTooltip(formatFootballMoney(DAILY_INCOME))}
            </TooltipContent>
          </Tooltip>
          <StatPill
            icon={Flame}
            label={t.winStreak}
            value={player.winStreak}
            iconClassName="text-orange-500"
            className="hidden sm:flex"
          />
          <LanguageSwitcher />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
