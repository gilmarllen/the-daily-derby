import { redirect } from "next/navigation";

import { UpdatePasswordForm } from "@/components/auth/update-password-form";
import { createClient } from "@/lib/supabase/server";

export default async function ResetPasswordPage() {
  // Reachable only with the recovery session established by /auth/confirm.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/forgot-password");
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <UpdatePasswordForm />
    </main>
  );
}
