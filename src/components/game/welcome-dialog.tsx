"use client";

import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { BookOpen, Coins, ListChecks, Trophy } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DAILY_INCOME,
  STARTING_BALANCE,
  formatFootballMoney,
  formatTrophyDelta,
} from "@/lib/game/constants";
import { SCORING_RULES } from "@/lib/game/rules";
import { cn } from "@/lib/utils";

/** localStorage key marking that the welcome summary has been shown once. */
const WELCOME_KEY = "dd_welcome_seen";

const WelcomeDialogContext = createContext<{ openWelcome: () => void } | null>(
  null
);

/** Lets any descendant (e.g. the user menu) re-open the welcome summary. */
export function useWelcomeDialog() {
  const ctx = useContext(WelcomeDialogContext);
  if (!ctx) {
    throw new Error(
      "useWelcomeDialog must be used within a WelcomeDialogProvider"
    );
  }
  return ctx;
}

export function WelcomeDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  // First visit on this device pops the summary once. We record the flag
  // immediately so a refresh mid-view doesn't re-trigger it.
  useEffect(() => {
    if (localStorage.getItem(WELCOME_KEY)) return;
    localStorage.setItem(WELCOME_KEY, new Date().toISOString());
    const raf = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const openWelcome = useCallback(() => setOpen(true), []);

  return (
    <WelcomeDialogContext.Provider value={{ openWelcome }}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="gap-5">
          <div className="flex flex-col gap-1 pr-6">
            <DialogTitle>Welcome to The Daily Derby ⚽</DialogTitle>
            <DialogDescription>
              A daily football prediction game. Here&apos;s the quick version.
            </DialogDescription>
          </div>

          <ul className="flex flex-col gap-3">
            <Fact icon={ListChecks} title="One pick a day">
              Back a single team to win from your five real matches — or sit the
              day out. Change your mind any time before the daily lock.
            </Fact>
            <Fact icon={Coins} title="Manage your F$">
              Start with{" "}
              <strong className="text-foreground font-semibold">
                {formatFootballMoney(STARTING_BALANCE)}
              </strong>{" "}
              and earn{" "}
              <strong className="text-foreground font-semibold">
                +{formatFootballMoney(DAILY_INCOME)}
              </strong>{" "}
              daily. Stronger favourites cost less to back.
            </Fact>
            <Fact icon={Trophy} title="Earn trophies">
              <span className="mt-1 flex flex-wrap gap-1.5">
                {SCORING_RULES.filter((r) => r.outcome !== "New mission").map(
                  (rule) => (
                    <span
                      key={rule.outcome}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums",
                        rule.trophies > 0
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : rule.trophies < 0
                            ? "bg-destructive/15 text-destructive"
                            : "bg-muted text-muted-foreground"
                      )}
                    >
                      {rule.outcome} {formatTrophyDelta(rule.trophies)}
                    </span>
                  )
                )}
              </span>
            </Fact>
          </ul>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            {/* Navigating to the guide unmounts this layout (and the dialog),
                so a plain link is enough — no DialogClose needed. */}
            <Link
              href="/guide"
              className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
            >
              <BookOpen className="size-4" aria-hidden />
              Read the full guide
            </Link>
            <DialogClose className={cn(buttonVariants(), "px-6")}>
              Got it
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </WelcomeDialogContext.Provider>
  );
}

function Fact({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Coins;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3">
      <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
        <Icon className="size-4.5" aria-hidden />
      </span>
      <div className="flex flex-col gap-0.5">
        <span className="font-semibold">{title}</span>
        <span className="text-muted-foreground text-sm leading-relaxed">
          {children}
        </span>
      </div>
    </li>
  );
}
