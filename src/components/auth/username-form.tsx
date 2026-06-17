"use client";

import { useActionState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

import { setUsername, type SetUsernameState } from "@/app/auth/actions";
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

export function UsernameForm() {
  const [state, formAction, isPending] = useActionState<
    SetUsernameState,
    FormData
  >(setUsername, null);
  const t = useDictionary().auth;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-3 flex w-full max-w-sm flex-col gap-3 duration-500">
      <Card>
        <CardHeader className="items-center text-center">
          <Logo className="mx-auto size-12" />
          <CardTitle className="text-xl">{t.onboarding.title}</CardTitle>
          <CardDescription>{t.onboarding.description}</CardDescription>
        </CardHeader>

        <CardContent>
          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="text-sm font-medium">
                {t.usernameLabel}
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder={t.usernamePlaceholder}
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
              {t.onboarding.submit}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
