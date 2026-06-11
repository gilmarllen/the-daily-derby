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

import type { Achievement } from "./types";

// Placeholder data for surfaces not yet wired to Supabase (achievements).
// Swap these out for live data later.

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
