"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
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

  // Username is no longer collected here — every new player picks it on the
  // /onboarding/username screen after their first login (see handle_new_user).
  if (!email || !password) {
    const errors = (await getServerDictionary()).auth.errors;
    return { error: errors.missingCredentials, values: { email } };
  }
  if (password.length < 6) {
    const errors = (await getServerDictionary()).auth.errors;
    return { error: errors.passwordTooShort, values: { email } };
  }

  const origin = (await headers()).get("origin") ?? "";
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  });

  if (error) {
    return { error: error.message, values: { email } };
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

export type SetUsernameState = { error: string } | null;

const USERNAME_RE = /^[a-zA-Z0-9_]{3,24}$/;

export async function setUsername(
  _prevState: SetUsernameState,
  formData: FormData
): Promise<SetUsernameState> {
  const username = String(formData.get("username") ?? "").trim();
  const errors = (await getServerDictionary()).auth.errors;

  if (!username) {
    return { error: errors.missingUsername };
  }
  if (!USERNAME_RE.test(username)) {
    return { error: errors.invalidUsername };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ username, needs_username: false })
    .eq("id", user.id);

  if (error) {
    // 23505 = unique_violation (username already taken).
    if (error.code === "23505") {
      return { error: errors.usernameTaken };
    }
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

export type RequestDeletionState = { error?: string; sent?: boolean } | null;

/**
 * Step 1 of account deletion: emails the signed-in user a 6-digit confirmation
 * code via Supabase's email OTP. Requires an active session, so the code always
 * goes to the caller's own confirmed email — proving they control the inbox
 * before the destructive step. (We use email OTP rather than reauthenticate()
 * because the reauthentication nonce cannot be securely verified for a non
 * password operation — see confirmAccountDeletion.)
 *
 * Note: the code only appears in the email if the Supabase "Magic Link" template
 * includes `{{ .Token }}` — the default template is link-only.
 */
export async function requestAccountDeletion(): Promise<RequestDeletionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    redirect("/login");
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: user.email,
    options: { shouldCreateUser: false },
  });
  if (error) {
    return { error: error.message };
  }
  return { sent: true };
}

export type ConfirmDeletionState = { error: string } | null;

/**
 * Step 2 of account deletion: verifies the emailed OTP code, then permanently
 * deletes the account. The delete target is the session-derived user id (never
 * client input), so there is no IDOR vector — the code is verified against the
 * caller's own email. Deleting the auth user cascades to profiles → picks /
 * daily_pools / user_missions via ON DELETE CASCADE, erasing all of their data.
 */
export async function confirmAccountDeletion(
  _prevState: ConfirmDeletionState,
  formData: FormData
): Promise<ConfirmDeletionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    redirect("/login");
  }

  const errors = (await getServerDictionary()).auth.errors;
  const code = String(formData.get("code") ?? "").trim();
  if (!code) {
    return { error: errors.invalidCode };
  }

  // Verify the email OTP from step 1. GoTrue rejects a wrong/expired code, so a
  // successful verify proves the caller controls the account's inbox.
  const { error: verifyError } = await supabase.auth.verifyOtp({
    email: user.email,
    token: code,
    type: "email",
  });
  if (verifyError) {
    return { error: errors.invalidCode };
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    return { error: error.message };
  }

  // Clear the now-orphaned session cookies, then send them home.
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
