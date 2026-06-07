import { redirect } from "next/navigation";

import { getCurrentPlayer } from "@/lib/game/queries";

import { DashboardHeader } from "./dashboard-header";
import { DashboardNav } from "./dashboard-nav";
import { GameProvider } from "./game-provider";
import { SelectionBanner } from "./selection-banner";

/** Persistent logged-in chrome: header, nav, in-progress banner, and content. */
export async function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const player = await getCurrentPlayer();
  if (!player) {
    redirect("/login");
  }

  return (
    <GameProvider player={player}>
      <div className="flex min-h-full flex-1 flex-col">
        <DashboardHeader />
        <DashboardNav />
        <SelectionBanner />
        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6">
          {children}
        </main>
      </div>
    </GameProvider>
  );
}
