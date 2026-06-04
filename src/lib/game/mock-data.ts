import {
  Award,
  CalendarCheck,
  Coins,
  Crown,
  Flame,
  Medal,
  Target,
  Trophy,
  Wallet,
} from "lucide-react";

import type {
  Achievement,
  LeaderboardEntry,
  Match,
  PastPick,
  Player,
} from "./types";

// Placeholder data so the UI is fully explorable before Supabase / odds-api are
// wired up. Swap these out for live data later.

export const player: Player = {
  name: "You",
  trophies: 87,
  balance: 7,
  winStreak: 2,
};

function match(
  id: string,
  league: string,
  kickoff: string,
  home: [string, number],
  away: [string, number]
): Match {
  return {
    id,
    league,
    kickoff,
    home: {
      id: `${id}-home`,
      matchId: id,
      team: home[0],
      side: "home",
      odds: home[1],
    },
    away: {
      id: `${id}-away`,
      matchId: id,
      team: away[0],
      side: "away",
      odds: away[1],
    },
  };
}

/** The 5 matches drawn from tomorrow's pool that this player sees today. */
export const matches: Match[] = [
  match(
    "m1",
    "La Liga",
    "Tomorrow · 21:00",
    ["Real Madrid", 1.5],
    ["Getafe", 6.5]
  ),
  match(
    "m2",
    "Premier League",
    "Tomorrow · 17:30",
    ["Manchester City", 1.4],
    ["Brentford", 8.0]
  ),
  match("m3", "Serie A", "Tomorrow · 19:45", ["Inter", 1.8], ["Napoli", 4.2]),
  match(
    "m4",
    "Bundesliga",
    "Tomorrow · 18:30",
    ["Bayern München", 1.3],
    ["Borussia Dortmund", 9.0]
  ),
  match(
    "m5",
    "Ligue 1",
    "Tomorrow · 20:00",
    ["Paris SG", 1.25],
    ["Marseille", 11.0]
  ),
];

export const achievements: Achievement[] = [
  {
    id: "first-blood",
    title: "First Blood",
    description: "Win your very first derby.",
    icon: Trophy,
    earned: true,
  },
  {
    id: "budget-player",
    title: "Budget Player",
    description: "Win a day spending under F$ 5.00.",
    icon: Wallet,
    earned: true,
  },
  {
    id: "sharpshooter",
    title: "Sharpshooter",
    description: "Win 5 days in total.",
    icon: Target,
    earned: true,
  },
  {
    id: "hot-streak",
    title: "Hot Streak",
    description: "Win 10 days in a row.",
    icon: Flame,
    earned: false,
  },
  {
    id: "la-liga-loyalist",
    title: "La Liga Loyalist",
    description: "Win 3 days picking La Liga teams.",
    icon: Medal,
    earned: false,
  },
  {
    id: "high-roller",
    title: "High Roller",
    description: "Spend over F$ 50.00 in a single week.",
    icon: Coins,
    earned: false,
  },
  {
    id: "perfect-week",
    title: "Perfect Week",
    description: "Win every day for a full week.",
    icon: CalendarCheck,
    earned: false,
  },
  {
    id: "table-topper",
    title: "Table Topper",
    description: "Reach #1 on the global leaderboard.",
    icon: Crown,
    earned: false,
  },
  {
    id: "centurion",
    title: "Centurion",
    description: "Collect 100 trophies.",
    icon: Award,
    earned: false,
  },
];

export const leaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    name: "Goal Machine",
    trophies: 142,
    moneySpent: 612.4,
    winStreak: 9,
  },
  { rank: 2, name: "La Pulga", trophies: 128, moneySpent: 540.1, winStreak: 6 },
  {
    rank: 3,
    name: "NetBuster",
    trophies: 119,
    moneySpent: 498.75,
    winStreak: 4,
  },
  { rank: 4, name: "TikiTaka", trophies: 101, moneySpent: 455.0, winStreak: 3 },
  {
    rank: 5,
    name: "You",
    trophies: 87,
    moneySpent: 312.66,
    winStreak: 2,
    isCurrentUser: true,
  },
  {
    rank: 6,
    name: "ParkTheBus",
    trophies: 80,
    moneySpent: 401.2,
    winStreak: 1,
  },
  {
    rank: 7,
    name: "OffsideKing",
    trophies: 74,
    moneySpent: 380.55,
    winStreak: 0,
  },
  { rank: 8, name: "OwnGoal", trophies: 61, moneySpent: 290.0, winStreak: 0 },
];

export const pastPicks: PastPick[] = [
  {
    id: "p1",
    date: "Jun 02",
    league: "La Liga",
    pick: "Real Madrid",
    cost: 6.67,
    result: "win",
    trophyDelta: 3,
  },
  {
    id: "p2",
    date: "Jun 01",
    league: "Premier League",
    pick: "Arsenal",
    cost: 5.0,
    result: "loss",
    trophyDelta: -1,
  },
  {
    id: "p3",
    date: "May 31",
    league: "Serie A",
    pick: "Juventus",
    cost: 4.0,
    result: "draw",
    trophyDelta: 0,
  },
  {
    id: "p4",
    date: "May 30",
    league: "—",
    pick: null,
    cost: 0,
    result: "none",
    trophyDelta: -2,
  },
  {
    id: "p5",
    date: "May 29",
    league: "Bundesliga",
    pick: "Bayern München",
    cost: 7.69,
    result: "win",
    trophyDelta: 3,
  },
  {
    id: "p6",
    date: "May 28",
    league: "Ligue 1",
    pick: "Paris SG",
    cost: 8.0,
    result: "win",
    trophyDelta: 3,
  },
];
