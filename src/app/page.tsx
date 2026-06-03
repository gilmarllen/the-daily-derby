import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-24 text-center">
      <div className="flex flex-col items-center gap-4">
        <span className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
          Pick · Predict · Prevail
        </span>
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          The Daily Derby
        </h1>
        <p className="text-muted-foreground max-w-md text-lg">
          A daily football prediction game. Pick winners, manage your F$, earn
          trophies, and climb the global leaderboard.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" disabled>
          Sign up
        </Button>
        <Button size="lg" variant="outline" disabled>
          Log in
        </Button>
      </div>

      <p className="text-muted-foreground text-xs">
        🚧 Foundation only — gameplay coming soon.
      </p>
    </main>
  );
}
