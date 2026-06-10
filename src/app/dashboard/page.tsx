import { MatchSelection } from "@/components/game/match-selection";
import { TodayPickBanner } from "@/components/game/today-pick-banner";
import { getTodayPick } from "@/lib/game/queries";

export default async function DashboardPage() {
  const todayPick = await getTodayPick();

  return (
    <div className="flex flex-col gap-6">
      <TodayPickBanner pick={todayPick} />
      <MatchSelection />
    </div>
  );
}
