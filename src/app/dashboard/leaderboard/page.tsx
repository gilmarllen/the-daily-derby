import { LeaderboardTable } from "@/components/game/leaderboard-table";
import { getLeaderboard } from "@/lib/game/queries";
import { getServerDictionary } from "@/lib/i18n/server";

export const metadata = {
  title: "Leaderboard · The Daily Derby",
};

export default async function LeaderboardPage() {
  const [entries, dict] = await Promise.all([
    getLeaderboard(),
    getServerDictionary(),
  ]);
  const t = dict.leaderboard;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">{t.title}</h1>
        <p className="text-muted-foreground text-sm">{t.description}</p>
      </div>

      <LeaderboardTable entries={entries} />
    </div>
  );
}
