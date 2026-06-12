import type { LucideIcon } from "lucide-react";

export type Side = "home" | "away";

export type TeamOption = {
  /** Unique within a day, e.g. "m1-home". */
  id: string;
  matchId: string;
  team: string;
  side: Side;
  /** Decimal odds for this team to win. */
  odds: number;
};

export type Match = {
  id: string;
  league: string;
  /** ISO 8601 kickoff timestamp (UTC); formatted to the viewer's timezone. */
  kickoff: string;
  home: TeamOption;
  away: TeamOption;
};

/** A player picks at most one team per day; "none" is the default skip. */
export type Selection = { kind: "none" } | { kind: "team"; optionId: string };

export type Player = {
  name: string;
  trophies: number;
  balance: number;
  winStreak: number;
};

export type Mission = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  completed: boolean;
};

export type LeaderboardEntry = {
  rank: number;
  name: string;
  trophies: number;
  moneySpent: number;
  winStreak: number;
  /** This player's locked team pick for today, or null when none/sat-out. */
  todayPick: string | null;
  isCurrentUser?: boolean;
};

/**
 * Public stats for another player's profile. Money/balance exclude the
 * in-progress pick so the active selection can't be inferred (balance is the
 * pre-pick value). `bestLeague` is null until the player has a settled pick.
 */
export type PlayerProfile = {
  name: string;
  trophies: number;
  winStreak: number;
  moneySpent: number;
  balance: number;
  totalPredictions: number;
  wins: number;
  /** 0–1 fraction of settled team picks that were wins. */
  winRate: number;
  bestLeague: string | null;
  bestLeagueWins: number;
};

export type PickResult = "win" | "draw" | "loss" | "none";

export type PastPick = {
  id: string;
  date: string;
  league: string;
  /** Team name, or null when the player made no selection. */
  pick: string | null;
  /** "pending" when a team pick's match hasn't been settled yet. */
  result: PickResult | "pending";
  cost: number;
  trophyDelta: number;
};

/**
 * The player's locked-in pick for the current day (made the day before). Used by
 * the "today's pick" banner. `none` covers both an explicit No-selection and a
 * seeded default that was never changed.
 */
export type TodayPick =
  | { kind: "none" }
  | {
      kind: "team";
      league: string;
      /** ISO 8601 kickoff timestamp (UTC). */
      kickoff: string;
      home: string;
      away: string;
      pickedSide: Side;
      cost: number;
      status: "scheduled" | "finished";
      /** Settlement result; null until the match is settled. */
      result: PickResult | null;
      homeScore: number | null;
      awayScore: number | null;
    };
