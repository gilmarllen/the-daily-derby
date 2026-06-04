import { Lock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { achievements } from "@/lib/game/mock-data";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Achievements · The Daily Derby",
};

export default function AchievementsPage() {
  const earnedCount = achievements.filter((a) => a.earned).length;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Achievements</h1>
        <p className="text-muted-foreground text-sm">
          {earnedCount} of {achievements.length} unlocked · each one earns{" "}
          <span className="text-foreground font-medium">+1 trophy</span>.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {achievements.map(({ id, title, description, icon: Icon, earned }) => (
          <div
            key={id}
            className={cn(
              "flex flex-col items-center gap-3 rounded-xl border p-5 text-center transition-all",
              earned
                ? "bg-card ring-foreground/10 ring-1"
                : "bg-muted/40 opacity-60 grayscale hover:opacity-80"
            )}
          >
            <div
              className={cn(
                "relative flex size-20 items-center justify-center rounded-full",
                earned
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <Icon className="size-10" aria-hidden />
              {!earned && (
                <span className="bg-background ring-border absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full ring-1">
                  <Lock
                    className="text-muted-foreground size-3.5"
                    aria-hidden
                  />
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="text-sm font-semibold">{title}</h2>
              <p className="text-muted-foreground text-xs">{description}</p>
            </div>

            <Badge variant={earned ? "default" : "outline"}>
              {earned ? "Unlocked" : "Locked"}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
