import { Bug, Lightbulb, Code } from "lucide-react";

import { getServerDictionary } from "@/lib/i18n/server";

import { KofiButton } from "./kofi-button";

const REPO_URL = "https://github.com/gilmarllen/the-daily-derby";
const ISSUES_URL = `${REPO_URL}/issues/new`;

const linkClass =
  "text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 font-medium transition-colors";

export async function Footer() {
  const t = (await getServerDictionary()).footer;

  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 px-4 py-8 text-center">
        <p className="text-sm font-semibold">{t.thanks}</p>

        <p className="text-muted-foreground max-w-xl text-xs leading-relaxed">
          <span className="mr-1.5 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-amber-600 uppercase dark:text-amber-400">
            {t.beta}
          </span>
          {t.betaText}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            <Code className="size-4" aria-hidden />
            {t.contribute}
          </a>
          <a
            href={`${ISSUES_URL}?template=feature_request.md`}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            <Lightbulb className="size-4" aria-hidden />
            {t.suggestIdea}
          </a>
          {` ${t.or} `}
          <a
            href={`${ISSUES_URL}?template=bug_report.md`}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            <Bug className="size-4" aria-hidden />
            {t.reportBug}
          </a>
        </div>

        <KofiButton />
      </div>
    </footer>
  );
}
