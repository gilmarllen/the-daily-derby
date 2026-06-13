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
// Swap these out for live data later. Titles/descriptions are localized via
// `dict.missions.items[id]`.

export const missions: Mission[] = [
  { id: "first-blood", icon: Trophy, completed: true },
  { id: "budget-player", icon: Wallet, completed: true },
  { id: "sharpshooter", icon: Target, completed: true },
  { id: "hot-streak", icon: Flame, completed: false },
  { id: "la-liga-loyalist", icon: Medal, completed: false },
  { id: "high-roller", icon: Coins, completed: false },
  { id: "perfect-week", icon: CalendarCheck, completed: false },
  { id: "table-topper", icon: Crown, completed: false },
  { id: "centurion", icon: Award, completed: false },
];
