import { PastPicksList } from "@/components/game/past-picks-list";
import { getPastPicks } from "@/lib/game/queries";
import { getServerDictionary } from "@/lib/i18n/server";

export const metadata = {
  title: "Past Picks · The Daily Derby",
};

export default async function PastPicksPage() {
  const [pastPicks, dict] = await Promise.all([
    getPastPicks(),
    getServerDictionary(),
  ]);
  const t = dict.pastPicks;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">{t.title}</h1>
        <p className="text-muted-foreground text-sm">{t.description}</p>
      </div>

      <PastPicksList picks={pastPicks} emptyLabel={t.empty} />
    </div>
  );
}
