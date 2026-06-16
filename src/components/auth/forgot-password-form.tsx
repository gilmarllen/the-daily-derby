"use client";

import Link from "next/link";
import { useActionState } from "react";
import { AlertCircle, ArrowLeft, Loader2, MailCheck } from "lucide-react";

import {
  requestPasswordReset,
  type ResetRequestState,
} from "@/app/auth/actions";
import { Logo } from "@/components/brand/logo";
import { useDictionary } from "@/components/i18n/locale-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState<
    ResetRequestState,
    FormData
  >(requestPasswordReset, null);
  const dict = useDictionary();
  const t = dict.auth;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-3 flex w-full max-w-sm flex-col gap-3 duration-500">
      <Link
        href="/login"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 self-start text-sm font-medium transition-colors"
      >
        <ArrowLeft className="size-4" />
        {t.backToLogin}
      </Link>

      <Card>
        {state?.sent ? (
          <>
            <CardHeader className="items-center text-center">
              <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
                <MailCheck className="size-6" />
              </span>
              <CardTitle className="text-xl">{t.forgot.sentTitle}</CardTitle>
              <CardDescription>{t.forgot.sentDescription}</CardDescription>
              <p className="text-muted-foreground text-sm">{t.spamHint}</p>
            </CardHeader>
          </>
        ) : (
          <>
            <CardHeader className="items-center text-center">
              <Logo className="mx-auto size-12" />
              <CardTitle className="text-xl">{t.forgot.title}</CardTitle>
              <CardDescription>{t.forgot.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <form action={formAction} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-sm font-medium">
                    {t.emailLabel}
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder={t.emailPlaceholder}
                    required
                  />
                </div>

                {state?.error && (
                  <p
                    role="alert"
                    className="text-destructive flex items-center gap-1.5 text-sm"
                  >
                    <AlertCircle className="size-4 shrink-0" />
                    {state.error}
                  </p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={isPending}
                  className="mt-1"
                >
                  {isPending && <Loader2 className="animate-spin" />}
                  {t.forgot.submit}
                </Button>
              </form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
