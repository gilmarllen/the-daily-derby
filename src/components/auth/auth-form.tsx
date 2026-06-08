"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

import { login, signup, type AuthState } from "@/app/auth/actions";
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

type Mode = "login" | "signup";

const COPY = {
  login: {
    title: "Welcome back",
    description: "Log in to make today's pick.",
    submit: "Log in",
    cta: "New here?",
    ctaHref: "/signup",
    ctaLabel: "Create an account",
  },
  signup: {
    title: "Join the Derby",
    description: "Create an account and start with F$ 10.00.",
    submit: "Sign up",
    cta: "Already playing?",
    ctaHref: "/login",
    ctaLabel: "Log in",
  },
} as const;

export function AuthForm({ mode }: { mode: Mode }) {
  const action = mode === "login" ? login : signup;
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(
    action,
    null
  );
  const copy = COPY[mode];

  // Controlled so values survive React 19's post-action form reset (and so
  // base-ui doesn't warn about a changing uncontrolled default value).
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  // When the server echoes values back after a failed submit, repopulate the
  // fields. This uses React's "adjust state during render" pattern (rather than
  // an effect) so it applies before paint without an extra render.
  const [syncedState, setSyncedState] = useState(state);
  if (state !== syncedState) {
    setSyncedState(state);
    if (state?.values?.username !== undefined)
      setUsername(state.values.username);
    if (state?.values?.email !== undefined) setEmail(state.values.email);
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-3 flex w-full max-w-sm flex-col gap-3 duration-500">
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 self-start text-sm font-medium transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to home
      </Link>

      <Card>
        <CardHeader className="items-center text-center">
          <Logo className="mx-auto size-12" />
          <CardTitle className="text-xl">{copy.title}</CardTitle>
          <CardDescription>{copy.description}</CardDescription>
        </CardHeader>

        <CardContent>
          <form action={formAction} className="flex flex-col gap-4">
            {mode === "signup" && (
              <Field
                id="username"
                name="username"
                label="Username"
                type="text"
                autoComplete="username"
                placeholder="goal_machine"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            )}

            <Field
              id="email"
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Field
              id="password"
              name="password"
              label="Password"
              type="password"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              placeholder="••••••••"
              required
              minLength={mode === "signup" ? 6 : undefined}
            />

            {mode === "login" && (
              <Link
                href="/forgot-password"
                className="text-muted-foreground hover:text-foreground -mt-2 self-end text-sm underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            )}

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
              {copy.submit}
            </Button>
          </form>

          <p className="text-muted-foreground mt-4 text-center text-sm">
            {copy.cta}{" "}
            <Link
              href={copy.ctaHref}
              className="text-primary font-medium underline-offset-4 hover:underline"
            >
              {copy.ctaLabel}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  id,
  label,
  ...props
}: { id: string; label: string } & React.ComponentProps<typeof Input>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <Input id={id} {...props} />
    </div>
  );
}
