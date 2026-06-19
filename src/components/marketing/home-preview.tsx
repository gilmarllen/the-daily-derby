import { Check, Clock, Coins, Flame, Goal, Trophy } from "lucide-react";

import { Crest } from "@/components/game/crest";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { cn } from "@/lib/utils";

// Static, non-interactive marketing previews of the Pick screen and Leaderboard.
// They mirror the real components' look so logged-out visitors get a taste of
// the game before signing up. Data is hardcoded sample content — nothing here
// talks to Supabase or the game provider.

type PreviewDict = Dictionary["home"]["preview"];

const SAMPLE_MATCHES: {
  league: string;
  kickoff: string;
  home: { team: string; side: string; color: string; cost: string };
  away: { team: string; side: string; color: string; cost: string };
  selected: "home" | "away" | null;
}[] = [
  {
    league: "La Liga",
    kickoff: "Tomorrow, 21:00",
    home: {
      team: "Real Madrid",
      side: "Home",
      color: "#FEBE10",
      cost: "F$ 5.88",
    },
    away: {
      team: "Barcelona",
      side: "Away",
      color: "#A50044",
      cost: "F$ 6.45",
    },
    selected: "home",
  },
  {
    league: "Premier League",
    kickoff: "Tomorrow, 18:30",
    home: { team: "Arsenal", side: "Home", color: "#EF0107", cost: "F$ 4.76" },
    away: {
      team: "Liverpool",
      side: "Away",
      color: "#C8102E",
      cost: "F$ 7.14",
    },
    selected: null,
  },
];

const SAMPLE_RANKS = [
  {
    rank: 1,
    name: "GoalMachine",
    pick: "Real Madrid",
    color: "#FEBE10",
    trophies: 142,
    streak: 9,
  },
  {
    rank: 2,
    name: "DerbyKing",
    pick: "Arsenal",
    color: "#EF0107",
    trophies: 128,
    streak: 5,
  },
  {
    rank: 3,
    name: "PitchPerfect",
    pick: "Inter",
    color: "#0068A8",
    trophies: 119,
    streak: 3,
  },
  {
    rank: 4,
    name: "TopCorner",
    pick: "Bayern",
    color: "#DC052D",
    trophies: 104,
    streak: 2,
  },
];

const RANK_ACCENT: Record<number, string> = {
  1: "text-amber-500",
  2: "text-zinc-400",
  3: "text-orange-700",
};

function PreviewOption({
  team,
  side,
  color,
  cost,
  selected,
}: {
  team: string;
  side: string;
  color: string;
  cost: string;
  selected: boolean;
}) {
  return (
    <div
      style={selected ? { borderColor: color } : undefined}
      className={cn(
        "flex min-w-0 items-center gap-2 rounded-xl border-2 p-3 text-left sm:gap-3",
        selected
          ? "border-primary bg-primary/10 ring-primary/20 shadow-sm ring-2"
          : "border-border"
      )}
    >
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border-2",
          selected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/30"
        )}
        aria-hidden
      >
        {selected && <Check className="size-3" />}
      </span>

      <Crest url={null} alt={team} color={color} className="size-8 sm:size-9" />

      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
          {side}
        </span>
        <span className="line-clamp-2 text-xs leading-tight font-semibold break-words sm:text-base">
          {team}
        </span>
      </span>

      <span className="bg-muted text-foreground ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums sm:px-3 sm:text-sm">
        <Coins className="size-3.5" aria-hidden />
        {cost}
      </span>
    </div>
  );
}

function PickPreview({ t }: { t: PreviewDict }) {
  return (
    <div className="bg-card ring-foreground/10 flex flex-col gap-4 rounded-2xl p-5 text-left ring-1">
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold">{t.pickTitle}</h3>
        <p className="text-muted-foreground text-xs">{t.pickCaption}</p>
      </div>

      <div className="flex flex-col gap-3">
        {SAMPLE_MATCHES.map((m) => (
          <div
            key={m.league}
            className="ring-foreground/10 flex flex-col gap-3 rounded-xl p-3 ring-1"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium">{m.league}</span>
              <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                <Clock className="size-3.5" aria-hidden />
                {m.kickoff}
              </span>
            </div>
            {/* Always stacked — the preview lives in a narrow column, so
                side-by-side options would squish. */}
            <div className="grid min-w-0 gap-2">
              <PreviewOption {...m.home} selected={m.selected === "home"} />
              <PreviewOption {...m.away} selected={m.selected === "away"} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeaderboardPreview({ t }: { t: PreviewDict }) {
  return (
    <div className="bg-card ring-foreground/10 flex flex-col gap-4 rounded-2xl p-5 text-left ring-1">
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold">{t.leaderboardTitle}</h3>
        <p className="text-muted-foreground text-xs">{t.leaderboardCaption}</p>
      </div>

      <div className="ring-foreground/10 overflow-hidden rounded-xl ring-1">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 text-muted-foreground border-b text-xs">
              <th className="px-3 py-2 text-left font-medium">#</th>
              <th className="px-3 py-2 text-left font-medium">Player</th>
              <th className="hidden px-3 py-2 text-left font-medium sm:table-cell">
                <Goal className="size-4" aria-hidden />
              </th>
              <th className="px-3 py-2 text-right font-medium">
                <Trophy className="ml-auto size-4" aria-hidden />
              </th>
              <th className="hidden px-3 py-2 text-right font-medium sm:table-cell">
                <Flame className="ml-auto size-4" aria-hidden />
              </th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_RANKS.map((r) => (
              <tr key={r.rank} className="border-b last:border-0">
                <td className="px-3 py-3">
                  <span
                    className={cn(
                      "font-bold tabular-nums",
                      RANK_ACCENT[r.rank]
                    )}
                  >
                    {r.rank}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className="flex items-center gap-2">
                    <span className="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-full text-xs font-semibold">
                      {r.name.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="truncate">{r.name}</span>
                  </span>
                </td>
                <td className="text-muted-foreground hidden max-w-[10rem] px-3 py-3 sm:table-cell">
                  <span className="flex items-center gap-1.5">
                    <Crest
                      url={null}
                      alt={r.pick}
                      color={r.color}
                      className="size-5"
                    />
                    <span className="truncate">{r.pick}</span>
                  </span>
                </td>
                <td className="px-3 py-3 text-right font-semibold tabular-nums">
                  {r.trophies}
                </td>
                <td className="text-muted-foreground hidden px-3 py-3 text-right tabular-nums sm:table-cell">
                  {r.streak}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function HomePreview({ t }: { t: PreviewDict }) {
  return (
    <section
      id="preview"
      className="animate-in fade-in slide-in-from-bottom-4 mt-16 w-full max-w-4xl scroll-mt-6 duration-700"
    >
      <div className="mb-6 flex flex-col items-center gap-1">
        <h2 className="text-2xl font-bold tracking-tight">{t.heading}</h2>
        <p className="text-muted-foreground text-sm">{t.subheading}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
        <PickPreview t={t} />
        <LeaderboardPreview t={t} />
      </div>

      <p className="text-muted-foreground/70 mt-4 text-center text-xs italic">
        {t.sampleNote}
      </p>
    </section>
  );
}
