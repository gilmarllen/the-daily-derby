import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms that govern your use of The Daily Derby, a free daily football prediction game.",
};

const CONTACT_EMAIL = "gilmarllen@gmail.com";
const REPO_URL = "https://github.com/gilmarllen/the-daily-derby";
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

export default function TermsPage() {
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
            href="/privacy"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Privacy Policy
          </Link>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-10 sm:py-14">
        <div className="flex flex-col items-center gap-4 text-center">
          <Logo className="size-16 drop-shadow-sm" />
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Terms of Use
          </h1>
          <p className="text-muted-foreground text-sm">
            Last updated: {LAST_UPDATED}
          </p>
        </div>

        <Section title="Acceptance of these terms">
          <P>
            By creating an account or using The Daily Derby (the
            &ldquo;Service&rdquo;), you agree to these Terms of Use. If you do
            not agree, please do not use the Service.
          </P>
        </Section>

        <Section title="The service">
          <P>
            The Daily Derby is a free, daily football (soccer) prediction game.
            You pick teams to win and earn trophies. Football Money (
            <span className="text-foreground font-medium">F$</span>) is in-game
            currency only — it has{" "}
            <span className="text-foreground font-medium">
              no monetary value
            </span>
            , cannot be purchased or exchanged, and is never paid out. The
            Service is a game of entertainment and is{" "}
            <span className="text-foreground font-medium">not gambling</span>.
          </P>
        </Section>

        <Section title="Your account">
          <P>
            You are responsible for keeping your login credentials secure and
            for activity under your account. Provide accurate information when
            signing up. You may delete your account at any time from the in-game
            Settings menu.
          </P>
        </Section>

        <Section title="Acceptable use">
          <P>
            Don&apos;t misuse the Service. In particular, do not attempt to
            cheat, automate play, abuse or overload the systems,
            reverse-engineer or disrupt the game, or use it for any unlawful
            purpose. We may suspend or remove accounts that violate these terms.
          </P>
        </Section>

        <Section title="Beta & availability">
          <P>
            The Service is currently in{" "}
            <span className="text-foreground font-medium">beta</span>. It may
            contain bugs, features may change, and your data (including picks,
            trophies, and balance) may be{" "}
            <span className="text-foreground font-medium">
              reset at any time
            </span>
            . We provide the Service on an &ldquo;as is&rdquo; and &ldquo;as
            available&rdquo; basis, without guarantees of uptime or
            availability.
          </P>
        </Section>

        <Section title="Intellectual property">
          <P>
            The Daily Derby name, logo, and game design belong to their owner.
            The project source code is available on{" "}
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium underline-offset-4 hover:underline"
            >
              GitHub
            </a>{" "}
            under its published license. Football fixtures, odds, and scores are
            provided by third parties and remain the property of their
            respective owners.
          </P>
        </Section>

        <Section title="Disclaimer & limitation of liability">
          <P>
            The Service is provided without warranties of any kind. To the
            extent permitted by law, we are not liable for any indirect,
            incidental, or consequential damages arising from your use of the
            Service. Match data is supplied by third parties and may be
            inaccurate or delayed; we are not responsible for such errors.
          </P>
        </Section>

        <Section title="Changes to these terms">
          <P>
            We may update these terms from time to time. Material changes will
            be reflected by the &ldquo;Last updated&rdquo; date above. Continued
            use after changes means you accept the updated terms.
          </P>
        </Section>

        <Section title="Contact">
          <P>
            Questions about these terms? Email{" "}
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
