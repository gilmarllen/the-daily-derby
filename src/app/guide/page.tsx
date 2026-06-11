import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarSync,
  CircleSlash,
  Coins,
  Flame,
  ListOrdered,
  Target,
  Trophy,
} from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";
import {
  DAILY_INCOME,
  DAILY_RESET_LABEL,
  STARTING_BALANCE,
  formatFootballMoney,
  formatTrophyDelta,
} from "@/lib/game/constants";
import { DAILY_LOOP, SCORING_RULES } from "@/lib/game/rules";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Game Guide",
  description:
    "How to play The Daily Derby — the daily loop, picking a winner, spending Football Money, and earning trophies.",
};

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Target;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
        <span className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
          <Icon className="size-4.5" aria-hidden />
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function GuidePage() {
  return (
    <main className="flex flex-1 flex-col">
      <header className="bg-background/80 sticky top-0 z-20 border-b backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Home
          </Link>
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Log in
          </Link>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-12 px-4 py-10 sm:py-14">
        {/* Hero */}
        <div className="animate-in fade-in slide-in-from-bottom-3 flex flex-col items-center gap-4 text-center duration-500">
          <Logo className="size-16 drop-shadow-sm" />
          <span className="bg-card text-muted-foreground ring-foreground/10 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium tracking-widest uppercase ring-1">
            Game guide
          </span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            How to play
          </h1>
          <p className="text-muted-foreground max-w-md text-lg">
            One pick a day. Back a winner, spend smart, and climb the global
            leaderboard. Here&apos;s everything you need to know.
          </p>
        </div>

        {/* Overview */}
        <Section icon={Target} title="The gist">
          <p className="text-muted-foreground leading-relaxed">
            The Daily Derby is a daily football prediction game. Every day you
            get five real matches and pick one team to win. Good calls earn{" "}
            <span className="text-foreground font-medium">trophies</span> and
            push you up the leaderboard; you manage a stash of in-game{" "}
            <span className="text-foreground font-medium">
              Football Money (F$)
            </span>{" "}
            along the way. It&apos;s a game — F$ is not real money.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            You start with{" "}
            <span className="text-foreground font-semibold">
              {formatFootballMoney(STARTING_BALANCE)}
            </span>{" "}
            and earn{" "}
            <span className="text-foreground font-semibold">
              +{formatFootballMoney(DAILY_INCOME)}
            </span>{" "}
            every day.
          </p>
        </Section>

        {/* Daily loop */}
        <Section icon={ListOrdered} title="The daily loop">
          <ol className="flex flex-col gap-3">
            {DAILY_LOOP.map((step, i) => (
              <li
                key={step.title}
                className="bg-card ring-foreground/10 flex gap-4 rounded-xl p-4 ring-1"
              >
                <span className="bg-primary text-primary-foreground flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-bold tabular-nums">
                  {i + 1}
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold">{step.title}</span>
                  <span className="text-muted-foreground text-sm">
                    {step.detail}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        {/* Money */}
        <Section icon={Coins} title="Football Money (F$)">
          <p className="text-muted-foreground leading-relaxed">
            Every team option has an F$ price set by its odds — a strong
            favourite is cheaper, a long shot costs more (the formula is{" "}
            <code className="bg-muted rounded px-1 py-0.5 text-xs">
              10 / odds
            </code>
            ). Picking a team spends that amount from your balance; switching
            picks refunds the old one and charges the new. Options you
            can&apos;t afford are disabled.
          </p>
          <div className="bg-card ring-foreground/10 flex items-center gap-3 rounded-xl p-4 ring-1">
            <CircleSlash
              className="text-muted-foreground size-5 shrink-0"
              aria-hidden
            />
            <p className="text-muted-foreground text-sm">
              <span className="text-foreground font-medium">No selection</span>{" "}
              is always free and selected by default — but sitting a day out
              costs you trophies (see below).
            </p>
          </div>
        </Section>

        {/* Scoring */}
        <Section icon={Trophy} title="Scoring">
          <p className="text-muted-foreground leading-relaxed">
            Trophies are your score and your leaderboard rank. They can go
            negative. Each settled day moves your total:
          </p>
          <div className="ring-foreground/10 overflow-hidden rounded-xl ring-1">
            {SCORING_RULES.map((rule, i) => (
              <div
                key={rule.outcome}
                className={cn(
                  "bg-card flex items-center gap-4 p-4",
                  i > 0 && "border-t"
                )}
              >
                <span
                  className={cn(
                    "flex w-12 shrink-0 items-center justify-center gap-1 rounded-full py-1 text-sm font-bold tabular-nums",
                    rule.trophies > 0
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : rule.trophies < 0
                        ? "bg-destructive/15 text-destructive"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {formatTrophyDelta(rule.trophies)}
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold">{rule.outcome}</span>
                  <span className="text-muted-foreground text-sm">
                    {rule.detail}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Streak & leaderboard */}
        <Section icon={Flame} title="Win streak & leaderboard">
          <p className="text-muted-foreground leading-relaxed">
            Win on consecutive days to build a{" "}
            <span className="text-foreground font-medium">win streak</span> —
            only a loss resets it, while draws and sat-out days leave it
            untouched. The global leaderboard ranks every player by total
            trophies, alongside their money spent and best streak.
          </p>
        </Section>

        {/* Reset */}
        <Section icon={CalendarSync} title="Daily reset">
          <p className="text-muted-foreground leading-relaxed">
            Everything resets at{" "}
            <span className="text-foreground font-semibold">
              {DAILY_RESET_LABEL}
            </span>
            : a fresh set of matches, your daily income, and a clean slate to
            make the next pick. Miss a day and it counts as No selection.
          </p>
        </Section>

        {/* CTA */}
        <div className="bg-card ring-foreground/10 flex flex-col items-center gap-4 rounded-2xl p-8 text-center ring-1">
          <h2 className="text-2xl font-bold tracking-tight">Ready to play?</h2>
          <p className="text-muted-foreground max-w-sm">
            Make your first pick today and start climbing the table.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className={cn(buttonVariants({ size: "lg" }), "px-8")}
            >
              Sign up
            </Link>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "px-8"
              )}
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
