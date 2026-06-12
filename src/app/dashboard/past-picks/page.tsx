import { PastPicksList } from "@/components/game/past-picks-list";
import { getPastPicks } from "@/lib/game/queries";

export const metadata = {
  title: "Past Picks · The Daily Derby",
};

export default async function PastPicksPage() {
  const pastPicks = await getPastPicks();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Past Picks</h1>
        <p className="text-muted-foreground text-sm">
          Your recent daily picks and how they scored.
        </p>
      </div>

      <PastPicksList
        picks={pastPicks}
        emptyLabel="No past picks yet — your settled days will show up here."
      />
    </div>
  );
}
