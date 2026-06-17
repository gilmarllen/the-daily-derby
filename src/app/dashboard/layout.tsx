import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/game/dashboard-shell";
import { currentUserNeedsUsername } from "@/lib/game/queries/profile";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // New players (email or social) still carry a placeholder username — send
  // them to pick a real one before they can use the game.
  if (await currentUserNeedsUsername()) {
    redirect("/onboarding/username");
  }

  return <DashboardShell>{children}</DashboardShell>;
}
