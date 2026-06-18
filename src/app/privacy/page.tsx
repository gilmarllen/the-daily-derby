import type { Metadata } from "next";
import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How The Daily Derby collects, uses, and protects your data — including data from Google sign-in.",
};

const CONTACT_EMAIL = "gilmarllen@gmail.com";
const LAST_UPDATED = "18 June 2026";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-muted-foreground leading-relaxed">{children}</p>;
}

export default function PrivacyPage() {
  return (
    <main className="flex flex-1 flex-col">
      <header className="bg-background/80 sticky top-0 z-20 border-b backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold tracking-tight"
          >
            <Logo className="size-7" />
            <span>The Daily Derby</span>
          </Link>
          <Link
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Terms of Use
          </Link>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-10 sm:py-14">
        <div className="flex flex-col items-center gap-4 text-center">
          <Logo className="size-16 drop-shadow-sm" />
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-sm">
            Last updated: {LAST_UPDATED}
          </p>
        </div>

        <Section title="Overview">
          <P>
            The Daily Derby is a free, daily football (soccer) prediction game.
            You pick teams to win, manage in-game Football Money (
            <span className="text-foreground font-medium">F$</span>), and climb
            a global leaderboard. F$ is in-game currency only — it has no
            monetary value, cannot be bought, and is never paid out. This policy
            explains what data we collect, why, and how we handle it.
          </P>
        </Section>

        <Section title="What we collect">
          <P>
            <span className="text-foreground font-medium">Account data.</span>{" "}
            When you create an account we store your email address, a display
            name, and (if provided) an avatar. If you sign in with Google, we
            receive your name, email address, and profile picture from your
            Google account.
          </P>
          <P>
            <span className="text-foreground font-medium">Gameplay data.</span>{" "}
            We store the data needed to run the game: your daily picks, F$
            balance, trophies, win streak, and mission progress.
          </P>
          <P>
            <span className="text-foreground font-medium">Usage data.</span> We
            use Vercel Analytics to collect anonymous, aggregated usage metrics
            (such as page views). This does not identify you personally.
          </P>
        </Section>

        <Section title="How we use your data">
          <P>
            We use your data solely to operate the game: to authenticate you, to
            save and display your picks and stats, to render the leaderboard,
            and to maintain and improve the service. We do not sell your data,
            and we do not use it for advertising.
          </P>
        </Section>

        <Section title="Google user data">
          <P>
            When you choose to sign in with Google, we access only your basic
            profile (name, email, avatar) to create and identify your account.
            We use this data only to provide the sign-in and the game itself. We
            do not share Google user data with third parties except the
            infrastructure providers below that are required to run the service,
            and we do not use it for purposes unrelated to the game.
          </P>
        </Section>

        <Section title="Third-party services">
          <P>
            We rely on a small number of providers to run the game, and your
            data may be processed by them:
          </P>
          <ul className="text-muted-foreground flex list-disc flex-col gap-1.5 pl-5 leading-relaxed">
            <li>
              <span className="text-foreground font-medium">Supabase</span> —
              authentication and database (stores your account and gameplay
              data).
            </li>
            <li>
              <span className="text-foreground font-medium">Vercel</span> —
              hosting and anonymous analytics.
            </li>
            <li>
              <span className="text-foreground font-medium">odds-api.io</span> —
              football fixtures, odds, and scores. We send no personal data to
              this provider; it supplies match data only.
            </li>
          </ul>
        </Section>

        <Section title="Data retention & deletion">
          <P>
            We keep your data for as long as your account exists. You can
            permanently delete your account at any time from the in-game
            Settings menu — this erases your account and all associated data
            (picks, trophies, missions, and balance) and cannot be undone. You
            may also request deletion by emailing us at the address below.
          </P>
        </Section>

        <Section title="Children">
          <P>
            The Daily Derby is intended for users aged 13 and over. The game
            does not involve gambling or real money. If you believe a child
            under 13 has created an account, contact us and we will remove it.
          </P>
        </Section>

        <Section title="Changes to this policy">
          <P>
            We may update this policy from time to time. Material changes will
            be reflected by the &ldquo;Last updated&rdquo; date above. The game
            is currently in beta, and data may be reset at any time.
          </P>
        </Section>

        <Section title="Contact">
          <P>
            Questions or data requests? Email{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-primary font-medium underline-offset-4 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </P>
        </Section>
      </div>
    </main>
  );
}
