"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { createClient } from "@/lib/supabase/server";
import { getServerDictionary } from "@/lib/i18n/server";

export type AuthState = {
  error: string;
  // Submitted values echoed back so the form can repopulate on error.
  // Password is intentionally omitted — never round-trip it back to the client.
  values?: { username?: string; email?: string };
} | null;

function readCredentials(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  };
}

export async function login(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const { email, password } = readCredentials(formData);
  if (!email || !password) {
    const errors = (await getServerDictionary()).auth.errors;
    return { error: errors.missingCredentials, values: { email } };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message, values: { email } };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const { email, password } = readCredentials(formData);
  const username = String(formData.get("username") ?? "").trim();

  if (!username || !email || !password) {
    const errors = (await getServerDictionary()).auth.errors;
    return {
      error: errors.missingSignupCredentials,
      values: { username, email },
    };
  }
  if (password.length < 6) {
    const errors = (await getServerDictionary()).auth.errors;
    return {
      error: errors.passwordTooShort,
      values: { username, email },
    };
  }

  const origin = (await headers()).get("origin") ?? "";
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  });

  if (error) {
    return { error: error.message, values: { username, email } };
  }

  // When email confirmation is required, Supabase returns a user with no
  // active session. Send them to a "check your inbox" screen instead of the
  // (still-protected) dashboard.
  if (!data.session) {
    redirect("/signup/check-email");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export type ResetRequestState = { error?: string; sent?: boolean } | null;

export async function requestPasswordReset(
  _prevState: ResetRequestState,
  formData: FormData
): Promise<ResetRequestState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) {
    const errors = (await getServerDictionary()).auth.errors;
    return { error: errors.missingEmail };
  }

  const origin = (await headers()).get("origin") ?? "";
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm?next=/reset-password`,
  });

  // Don't reveal whether the email is registered — always report success.
  if (error && !error.message.toLowerCase().includes("rate")) {
    return { sent: true };
  }
  if (error) {
    return { error: error.message };
  }

  return { sent: true };
}

export type UpdatePasswordState = { error: string } | null;

export async function updatePassword(
  _prevState: UpdatePasswordState,
  formData: FormData
): Promise<UpdatePasswordState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 6) {
    const errors = (await getServerDictionary()).auth.errors;
    return { error: errors.passwordTooShort };
  }
  if (password !== confirm) {
    const errors = (await getServerDictionary()).auth.errors;
    return { error: errors.passwordMismatch };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    const errors = (await getServerDictionary()).auth.errors;
    return { error: errors.invalidResetLink };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
