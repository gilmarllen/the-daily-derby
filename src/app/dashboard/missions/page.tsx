import { Loader } from "lucide-react";

import { ComingSoonWatermark } from "@/components/layout/coming-soon-watermark";
import { Badge } from "@/components/ui/badge";
import { missions } from "@/lib/game/mock-data";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Missions · The Daily Derby",
};

// Flip the watermark on in deployed environments; leave the env var unset
// locally to develop the real page.
const COMING_SOON = process.env.NEXT_PUBLIC_MISSIONS_COMING_SOON === "true";

export default function MissionsPage() {
  const completedCount = missions.filter((m) => m.completed).length;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Missions</h1>
        <p className="text-muted-foreground text-sm">
          {completedCount} of {missions.length} completed
        </p>
      </div>

      <ComingSoonWatermark
        enabled={COMING_SOON}
        description="Missions are under development — check back soon."
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {missions.map(({ id, title, description, icon: Icon, completed }) => (
            <div
              key={id}
              className={cn(
                "flex flex-col items-center gap-3 rounded-xl border p-5 text-center transition-all",
                completed
                  ? "bg-card ring-foreground/10 ring-1"
                  : "bg-muted/40 opacity-60 grayscale hover:opacity-80"
              )}
            >
              <div
                className={cn(
                  "relative flex size-20 items-center justify-center rounded-full",
                  completed
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="size-10" aria-hidden />
                {!completed && (
                  <span className="bg-background ring-border absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full ring-1">
                    <Loader
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

              <Badge variant={completed ? "default" : "outline"}>
                {completed ? "Completed" : "Open"}
              </Badge>
            </div>
          ))}
        </div>
      </ComingSoonWatermark>
    </div>
  );
}
