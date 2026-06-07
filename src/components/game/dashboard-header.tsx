"use client";

import Link from "next/link";
import { Coins, Flame, LogOut, Trophy } from "lucide-react";

import { signOut } from "@/app/auth/actions";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { formatFootballMoney } from "@/lib/game/constants";

import { useGame } from "./game-provider";
import { StatPill } from "./stat-pill";

export function DashboardHeader() {
  const { player } = useGame();

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
            label="Trophies"
            value={player.trophies}
            iconClassName="text-amber-500"
          />
          <StatPill
            icon={Coins}
            label="Football Money"
            value={formatFootballMoney(player.balance)}
            iconClassName="text-emerald-500"
          />
          <StatPill
            icon={Flame}
            label="Win streak"
            value={player.winStreak}
            iconClassName="text-orange-500"
            className="hidden sm:flex"
          />
          <form action={signOut}>
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              aria-label="Log out"
              className="text-muted-foreground"
            >
              <LogOut />
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
