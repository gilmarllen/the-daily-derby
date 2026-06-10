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

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  earned: boolean;
};

export type LeaderboardEntry = {
  rank: number;
  name: string;
  trophies: number;
  moneySpent: number;
  winStreak: number;
  isCurrentUser?: boolean;
};

export type PickResult = "win" | "draw" | "loss" | "none";

export type PastPick = {
  id: string;
  date: string;
  league: string;
  /** Team name, or null when the player made no selection. */
  pick: string | null;
  cost: number;
  result: PickResult;
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
