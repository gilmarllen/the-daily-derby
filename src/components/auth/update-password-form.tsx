"use client";

import { useActionState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

import { updatePassword, type UpdatePasswordState } from "@/app/auth/actions";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function UpdatePasswordForm() {
  const [state, formAction, isPending] = useActionState<
    UpdatePasswordState,
    FormData
  >(updatePassword, null);

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-3 w-full max-w-sm duration-500">
      <CardHeader className="items-center text-center">
        <Logo className="mx-auto size-12" />
        <CardTitle className="text-xl">Set a new password</CardTitle>
        <CardDescription>
          Choose a new password for your account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              New password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirm" className="text-sm font-medium">
              Confirm new password
            </label>
            <Input
              id="confirm"
              name="confirm"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              minLength={6}
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

          <Button type="submit" size="lg" disabled={isPending} className="mt-1">
            {isPending && <Loader2 className="animate-spin" />}
            Update password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
