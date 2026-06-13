import {
  ArrowLeft,
  Coins,
  Flame,
  MapPin,
  Target,
  Trophy,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PastPicksList } from "@/components/game/past-picks-list";
import { StatPill } from "@/components/game/stat-pill";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatFootballMoney } from "@/lib/game/constants";
import { getPlayerPicks, getPlayerProfile } from "@/lib/game/queries";
import { getServerDictionary } from "@/lib/i18n/server";

export const metadata = {
  title: "Player · The Daily Derby",
};

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default async function PlayerProfilePage(props: {
  params: Promise<{ username: string }>;
}) {
  const { username: raw } = await props.params;
  const username = decodeURIComponent(raw);

  const [profile, picks, dict] = await Promise.all([
    getPlayerProfile(username),
    getPlayerPicks(username),
    getServerDictionary(),
  ]);

  if (!profile) {
    notFound();
  }

  const t = dict.profile;
  const winRatePct =
    profile.totalPredictions === 0
      ? "—"
      : `${Math.round(profile.winRate * 100)}%`;

  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/dashboard/leaderboard"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm font-medium"
      >
        <ArrowLeft className="size-4" /> {t.backToLeaderboard}
      </Link>

      <div className="bg-card ring-foreground/10 flex flex-col gap-4 rounded-xl p-5 ring-1">
        <div className="flex items-center gap-3">
          <Avatar className="size-12">
            <AvatarFallback>{initials(profile.name)}</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold tracking-tight">{profile.name}</h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <StatPill
            icon={Trophy}
            label={t.trophies}
            value={profile.trophies}
            iconClassName="text-amber-500"
          />
          <StatPill
            icon={Flame}
            label={t.winStreak}
            value={profile.winStreak}
            iconClassName="text-orange-500"
          />
          <StatPill
            icon={Wallet}
            label={t.balance}
            value={formatFootballMoney(profile.balance)}
            iconClassName="text-emerald-500"
          />
          <StatPill
            icon={Coins}
            label={t.moneySpent}
            value={formatFootballMoney(profile.moneySpent)}
            iconClassName="text-sky-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatTile
          icon={Target}
          label={t.winRate}
          value={winRatePct}
          sub={t.winRateSub(profile.wins, profile.totalPredictions)}
        />
        <StatTile
          icon={Target}
          label={t.predictions}
          value={profile.totalPredictions}
          sub={t.predictionsSub}
        />
        <StatTile
          icon={MapPin}
          label={t.bestLeague}
          value={profile.bestLeague ?? "—"}
          sub={
            profile.bestLeague
              ? t.bestLeagueSub(profile.bestLeagueWins)
              : t.noSettledPicksSub
          }
        />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold tracking-tight">
          {t.pastPicksTitle}
        </h2>
        <PastPicksList picks={picks} emptyLabel={t.emptyPicks} />
      </div>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Target;
  label: string;
  value: string | number;
  sub: string;
}) {
  return (
    <div className="bg-card ring-foreground/10 flex flex-col gap-1 rounded-xl p-4 ring-1">
      <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
        <Icon className="size-3.5" aria-hidden />
        {label}
      </span>
      <span className="truncate text-lg font-bold">{value}</span>
      <span className="text-muted-foreground text-xs">{sub}</span>
    </div>
  );
}
