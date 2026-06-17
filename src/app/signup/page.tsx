import { redirect } from "next/navigation";

import { AuthForm } from "@/components/auth/auth-form";
import { createClient } from "@/lib/supabase/server";
import { getEnabledProviders } from "@/lib/supabase/enabled-providers";

export default async function SignupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/dashboard");
  }

  const enabledProviders = await getEnabledProviders();

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <AuthForm mode="signup" enabledProviders={enabledProviders} />
    </main>
  );
}
