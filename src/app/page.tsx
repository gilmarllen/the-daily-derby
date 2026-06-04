import Link from "next/link";
import { Coins, Target, Trophy } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: Target,
    title: "Pick a winner",
    text: "One pick a day from five real matches.",
  },
  {
    icon: Coins,
    title: "Manage your F$",
    text: "Spend smart — cheaper odds, bigger risk.",
  },
  {
    icon: Trophy,
    title: "Climb the table",
    text: "Earn trophies and top the global board.",
  },
];

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-20 text-center">
      {/* Playful pitch-like backdrop. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,theme(colors.emerald.500/15),transparent_60%)]"
      />

      <div className="animate-in fade-in slide-in-from-bottom-3 flex max-w-2xl flex-col items-center gap-6 duration-700">
        <span className="bg-card text-muted-foreground ring-foreground/10 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium tracking-widest uppercase ring-1">
          ⚽ Daily football predictions
        </span>

        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
          The Daily Derby
        </h1>

        <p className="text-muted-foreground max-w-md text-lg">
          Pick winners, manage your Football Money, earn trophies, and climb the
          global leaderboard. One pick a day — make it count.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ size: "lg" }), "px-8")}
          >
            Sign up
          </Link>
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "px-8"
            )}
          >
            Log in
          </Link>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 mt-16 grid w-full max-w-3xl gap-4 duration-700 sm:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, text }) => (
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
