import Link from "next/link";
import { BookOpen, Coins, Target, Trophy } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { buttonVariants } from "@/components/ui/button";
import { getServerDictionary } from "@/lib/i18n/server";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export default async function Home() {
  const dict = await getServerDictionary();
  const t = dict.home;

  // Server-rendered, so the correct CTA ships in the HTML — no logged-in player
  // ever sees the sign up / log in pair flash before correcting.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = Boolean(user);
  const features = [
    { icon: Target, title: t.features.pickTitle, text: t.features.pickText },
    { icon: Coins, title: t.features.moneyTitle, text: t.features.moneyText },
    { icon: Trophy, title: t.features.climbTitle, text: t.features.climbText },
  ];

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-20 text-center">
      {/* Playful pitch-like backdrop. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,theme(colors.emerald.500/15),transparent_60%)]"
      />

      <div className="absolute top-3 right-3 z-10">
        <LanguageSwitcher />
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-3 flex max-w-2xl flex-col items-center gap-6 duration-700">
        <Logo className="size-24 drop-shadow-sm sm:size-28" />

        <span className="bg-card text-muted-foreground ring-foreground/10 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium tracking-widest uppercase ring-1">
          <Logo className="size-4" /> {t.badge}
        </span>

        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
          The Daily Derby
        </h1>

        <p className="text-muted-foreground max-w-md text-lg">{t.tagline}</p>

        <div className="flex flex-col gap-3 sm:flex-row">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ size: "lg" }), "px-8")}
            >
              {dict.common.backToGame}
            </Link>
          ) : (
            <>
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
            </>
          )}
        </div>

        <Link
          href="/guide"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 transition-colors hover:underline"
        >
          <BookOpen className="size-4" aria-hidden />
          {t.howToPlay}
        </Link>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 mt-16 grid w-full max-w-3xl gap-4 duration-700 sm:grid-cols-3">
        {features.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="bg-card ring-foreground/10 flex flex-col items-center gap-2 rounded-xl p-5 ring-1"
          >
            <Icon className="text-primary size-6" aria-hidden />
            <h2 className="text-sm font-semibold">{title}</h2>
            <p className="text-muted-foreground text-xs">{text}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
