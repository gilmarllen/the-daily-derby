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

import type { Mission } from "./types";

// Placeholder data for surfaces not yet wired to Supabase (missions).
// Swap these out for live data later.

export const missions: Mission[] = [
  {
    id: "first-blood",
    title: "First Blood",
    description: "Win your very first derby.",
    icon: Trophy,
    completed: true,
  },
  {
    id: "budget-player",
    title: "Budget Player",
    description: "Win a day spending under F$ 5.00.",
    icon: Wallet,
    completed: true,
  },
  {
    id: "sharpshooter",
    title: "Sharpshooter",
    description: "Win 5 days in total.",
    icon: Target,
    completed: true,
  },
  {
    id: "hot-streak",
    title: "Hot Streak",
    description: "Win 10 days in a row.",
    icon: Flame,
    completed: false,
  },
  {
    id: "la-liga-loyalist",
    title: "La Liga Loyalist",
    description: "Win 3 days picking La Liga teams.",
    icon: Medal,
    completed: false,
  },
  {
    id: "high-roller",
    title: "High Roller",
    description: "Spend over F$ 50.00 in a single week.",
    icon: Coins,
    completed: false,
  },
  {
    id: "perfect-week",
    title: "Perfect Week",
    description: "Win every day for a full week.",
    icon: CalendarCheck,
    completed: false,
  },
  {
    id: "table-topper",
    title: "Table Topper",
    description: "Reach #1 on the global leaderboard.",
    icon: Crown,
    completed: false,
  },
  {
    id: "centurion",
    title: "Centurion",
    description: "Collect 100 trophies.",
    icon: Award,
    completed: false,
  },
];
