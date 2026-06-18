"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, RotateCw } from "lucide-react";

import { BallLoader } from "@/components/brand/ball-loader";
import { useDictionary } from "@/components/i18n/locale-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Auto-retry tuning. The common trigger is a returning mobile tab: when the app
// regains focus after being idle, `useRevalidateOnFocus` fires
// `router.refresh()`, and a transient failure (stale network, expired session,
// version skew after a deploy) lands here. Rather than show an error, we bounce
// a football and silently re-render the failed segment a few times — which
// usually succeeds — only surfacing a manual fallback once retries are spent.
const MAX_RETRIES = 4;
// Retries that re-throw remount this boundary, resetting component state, so the
// attempt count lives at module scope. A fresh incident after this idle window
// starts over rather than inheriting a spent budget.
const INCIDENT_RESET_MS = 20_000;

let attempts = 0;
let lastAttemptAt = 0;

/**
 * Segment error boundary for the whole app. Renders within the root layout, so
 * the locale/theme providers are still mounted and `useDictionary` works.
 */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useDictionary().error;
  const [exhausted, setExhausted] = useState(false);

  useEffect(() => {
    // Surface to the console / monitoring so it's not silently swallowed.
    console.error(error);

    const now = Date.now();
    if (now - lastAttemptAt > INCIDENT_RESET_MS) attempts = 0;
    lastAttemptAt = now;

    if (attempts >= MAX_RETRIES) {
      // Retries spent — reveal the manual fallback. Deferred so we're not
      // setting state synchronously inside the effect body.
      const id = setTimeout(() => setExhausted(true), 0);
      return () => clearTimeout(id);
    }

    attempts += 1;
    // Gentle backoff so a persistent failure doesn't hammer the server.
    const delay = Math.min(700 * attempts, 3000);
    const timer = setTimeout(reset, delay);
    return () => clearTimeout(timer);
  }, [error, reset]);

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      {exhausted ? (
        <div className="animate-in fade-in slide-in-from-bottom-3 w-full max-w-sm duration-500">
          <Card>
            <CardHeader className="items-center text-center">
              <span className="bg-destructive/10 text-destructive mx-auto flex size-12 items-center justify-center rounded-full">
                <AlertTriangle className="size-6" aria-hidden />
              </span>
              <CardTitle className="text-xl">{t.title}</CardTitle>
              <CardDescription>{t.description}</CardDescription>
            </CardHeader>

            <CardContent>
              {/* A hard reload (not just reset()) so we also recover from a
                  stale build after a deploy — reset() would re-run the same
                  cached chunks and fail again. */}
              <Button
                size="lg"
                className="w-full"
                onClick={() => window.location.reload()}
              >
                <RotateCw className="size-4" aria-hidden />
                {t.retry}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <BallLoader label={t.reconnecting} />
      )}
    </div>
  );
}
