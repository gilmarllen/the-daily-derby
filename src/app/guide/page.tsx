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
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { buttonVariants } from "@/components/ui/button";
import {
  DAILY_INCOME,
  DAILY_RESET_LABEL,
  STARTING_BALANCE,
  formatFootballMoney,
  formatTrophyDelta,
} from "@/lib/game/constants";
import { DAILY_LOOP, SCORING_RULES } from "@/lib/game/rules";
import { getServerDictionary } from "@/lib/i18n/server";
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

export default async function GuidePage() {
  const dict = await getServerDictionary();
  const t = dict.guide;

  return (
    <main className="flex flex-1 flex-col">
      <header className="bg-background/80 sticky top-0 z-20 border-b backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="size-4" aria-hidden />
            {t.home}
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              {dict.common.login}
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-12 px-4 py-10 sm:py-14">
        {/* Hero */}
        <div className="animate-in fade-in slide-in-from-bottom-3 flex flex-col items-center gap-4 text-center duration-500">
          <Logo className="size-16 drop-shadow-sm" />
          <span className="bg-card text-muted-foreground ring-foreground/10 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium tracking-widest uppercase ring-1">
            {t.badge}
          </span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {t.heroTitle}
          </h1>
          <p className="text-muted-foreground max-w-md text-lg">{t.heroDesc}</p>
        </div>

        {/* Overview */}
        <Section icon={Target} title={t.gistTitle}>
          <p className="text-muted-foreground leading-relaxed">
            {t.gistP1a}
            <span className="text-foreground font-medium">
              {t.gistTrophies}
            </span>
            {t.gistP1b}
            <span className="text-foreground font-medium">{t.gistMoney}</span>
            {t.gistP1c}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {t.gistP2a}
            <span className="text-foreground font-semibold">
              {formatFootballMoney(STARTING_BALANCE)}
            </span>
            {t.gistP2b}
            <span className="text-foreground font-semibold">
              +{formatFootballMoney(DAILY_INCOME)}
            </span>
            {t.gistP2c}
          </p>
        </Section>

        {/* Daily loop */}
        <Section icon={ListOrdered} title={t.loopTitle}>
          <ol className="flex flex-col gap-3">
            {DAILY_LOOP.map((id, i) => (
              <li
                key={id}
                className="bg-card ring-foreground/10 flex gap-4 rounded-xl p-4 ring-1"
              >
                <span className="bg-primary text-primary-foreground flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-bold tabular-nums">
                  {i + 1}
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold">
                    {dict.dailyLoop[id].title}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {dict.dailyLoop[id].detail}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        {/* Money */}
        <Section icon={Coins} title={t.moneyTitle}>
          <p className="text-muted-foreground leading-relaxed">
            {t.moneyP1a}
            <code className="bg-muted rounded px-1 py-0.5 text-xs">
              10 / odds
            </code>
            {t.moneyP1b}
          </p>
          <div className="bg-card ring-foreground/10 flex items-center gap-3 rounded-xl p-4 ring-1">
            <CircleSlash
              className="text-muted-foreground size-5 shrink-0"
              aria-hidden
            />
            <p className="text-muted-foreground text-sm">
              <span className="text-foreground font-medium">
                {t.moneyNoSel}
              </span>
              {t.moneyCalloutBody}
            </p>
          </div>
        </Section>

        {/* Scoring */}
        <Section icon={Trophy} title={t.scoringTitle}>
          <p className="text-muted-foreground leading-relaxed">
            {t.scoringIntro}
          </p>
          <div className="ring-foreground/10 overflow-hidden rounded-xl ring-1">
            {SCORING_RULES.map((rule, i) => (
              <div
                key={rule.id}
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
                  <span className="font-semibold">
                    {dict.scoring[rule.id].outcome}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {dict.scoring[rule.id].detail}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Streak & leaderboard */}
        <Section icon={Flame} title={t.streakTitle}>
          <p className="text-muted-foreground leading-relaxed">
            {t.streakA}
            <span className="text-foreground font-medium">{t.streakLabel}</span>
            {t.streakB}
          </p>
        </Section>

        {/* Reset */}
        <Section icon={CalendarSync} title={t.resetTitle}>
          <p className="text-muted-foreground leading-relaxed">
            {t.resetA}
            <span className="text-foreground font-semibold">
              {DAILY_RESET_LABEL}
            </span>
            {t.resetB}
          </p>
        </Section>

        {/* CTA */}
        <div className="bg-card ring-foreground/10 flex flex-col items-center gap-4 rounded-2xl p-8 text-center ring-1">
          <h2 className="text-2xl font-bold tracking-tight">{t.ctaTitle}</h2>
          <p className="text-muted-foreground max-w-sm">{t.ctaDesc}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className={cn(buttonVariants({ size: "lg" }), "px-8")}
            >
              {dict.common.signup}
            </Link>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "px-8"
              )}
            >
              {dict.common.login}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
