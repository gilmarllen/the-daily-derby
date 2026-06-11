import { LeaderboardTable } from "@/components/game/leaderboard-table";
import { getLeaderboard } from "@/lib/game/queries";

export const metadata = {
  title: "Leaderboard · The Daily Derby",
};

export default async function LeaderboardPage() {
  const entries = await getLeaderboard();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-muted-foreground text-sm">
          Global standings by total trophies.
        </p>
      </div>

      <LeaderboardTable entries={entries} />
    </div>
  );
}
