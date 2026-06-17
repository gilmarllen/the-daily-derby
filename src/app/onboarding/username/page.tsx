import { redirect } from "next/navigation";

import { UsernameForm } from "@/components/auth/username-form";
import { currentUserNeedsUsername } from "@/lib/game/queries/profile";
import { createClient } from "@/lib/supabase/server";

export default async function UsernamePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  // Already chose a username — nothing to do here.
  if (!(await currentUserNeedsUsername())) {
    redirect("/dashboard");
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <UsernameForm />
    </main>
  );
}
