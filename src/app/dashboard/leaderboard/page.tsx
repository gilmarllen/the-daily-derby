import { Coins, Flame, Trophy } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatFootballMoney } from "@/lib/game/constants";
import { leaderboard } from "@/lib/game/mock-data";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Leaderboard · The Daily Derby",
};

const RANK_ACCENT: Record<number, string> = {
  1: "text-amber-500",
  2: "text-zinc-400",
  3: "text-orange-700",
};

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function LeaderboardPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-muted-foreground text-sm">
          Global standings by total trophies.
        </p>
      </div>

      <div className="ring-foreground/10 overflow-hidden rounded-xl ring-1">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 text-muted-foreground border-b text-xs">
              <th className="px-3 py-2 text-left font-medium">#</th>
              <th className="px-3 py-2 text-left font-medium">Player</th>
              <th className="px-3 py-2 text-right font-medium">
                <Trophy className="ml-auto size-4" aria-label="Trophies" />
              </th>
              <th className="hidden px-3 py-2 text-right font-medium sm:table-cell">
                <Coins className="ml-auto size-4" aria-label="Money spent" />
              </th>
              <th className="hidden px-3 py-2 text-right font-medium sm:table-cell">
                <Flame className="ml-auto size-4" aria-label="Win streak" />
              </th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry) => (
              <tr
                key={entry.rank}
                className={cn(
                  "border-b transition-colors last:border-0",
                  entry.isCurrentUser
                    ? "bg-primary/10 font-medium"
                    : "hover:bg-muted/40"
                )}
              >
                <td className="px-3 py-3">
                  <span
                    className={cn(
                      "font-bold tabular-nums",
                      RANK_ACCENT[entry.rank]
                    )}
                  >
                    {entry.rank}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-7">
                      <AvatarFallback className="text-xs">
                        {initials(entry.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{entry.name}</span>
                    {entry.isCurrentUser && (
                      <span className="text-muted-foreground text-xs">
                        (you)
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3 text-right font-semibold tabular-nums">
                  {entry.trophies}
                </td>
                <td className="text-muted-foreground hidden px-3 py-3 text-right tabular-nums sm:table-cell">
                  {formatFootballMoney(entry.moneySpent)}
                </td>
                <td className="hidden px-3 py-3 text-right tabular-nums sm:table-cell">
                  {entry.winStreak}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
