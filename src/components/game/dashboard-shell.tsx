import { redirect } from "next/navigation";

import {
  getCurrentPick,
  getCurrentPlayer,
  getCurrentUserEmail,
  getDailyMatches,
} from "@/lib/game/queries";

import { ToastProvider } from "@/components/ui/toast";

import { DashboardHeader } from "./dashboard-header";
import { DashboardNav } from "./dashboard-nav";
import { GameProvider } from "./game-provider";
import { SelectionBanner } from "./selection-banner";
import { SettingsDialogProvider } from "./settings-dialog";
import { WelcomeDialogProvider } from "./welcome-dialog";

/** Persistent logged-in chrome: header, nav, in-progress banner, and content. */
export async function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [player, matches, currentPick, email] = await Promise.all([
    getCurrentPlayer(),
    getDailyMatches(),
    getCurrentPick(),
    getCurrentUserEmail(),
  ]);
  if (!player) {
    redirect("/login");
  }

  return (
    <ToastProvider>
      <GameProvider
        player={player}
        matches={matches}
        initialSelection={currentPick}
      >
        <WelcomeDialogProvider>
          <SettingsDialogProvider email={email}>
            <div className="flex min-h-full flex-1 flex-col">
              <DashboardHeader />
              <DashboardNav />
              <SelectionBanner />
              <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6">
                {children}
              </main>
            </div>
          </SettingsDialogProvider>
        </WelcomeDialogProvider>
      </GameProvider>
    </ToastProvider>
  );
}
