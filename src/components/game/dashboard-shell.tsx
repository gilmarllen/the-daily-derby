import { DashboardHeader } from "./dashboard-header";
import { DashboardNav } from "./dashboard-nav";
import { GameProvider } from "./game-provider";
import { SelectionBanner } from "./selection-banner";

/** Persistent logged-in chrome: header, nav, in-progress banner, and content. */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <GameProvider>
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
