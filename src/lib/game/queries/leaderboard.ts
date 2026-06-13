import "server-only";

import type { LeaderboardEntry } from "@/lib/game/types";
import { createClient } from "@/lib/supabase/server";

/**
 * Loads the global leaderboard (all players ranked by trophies) via the
 * get_leaderboard RPC, flagging the signed-in player's row. Rank is the row's
 * position in the already-ordered result.
 */
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase.rpc("get_leaderboard");
  if (error) {
    throw new Error(`Failed to load leaderboard: ${error.message}`);
  }

  return (data ?? []).map((row, index) => ({
    rank: index + 1,
    name: row.username ?? "",
    trophies: row.trophies ?? 0,
    moneySpent: Number(row.money_spent ?? 0),
    winStreak: row.win_streak ?? 0,
    todayPick: row.today_pick ?? null,
    todayPickCrestUrl: row.today_pick_crest ?? null,
    todayResult: (row.today_result as LeaderboardEntry["todayResult"]) ?? null,
    isCurrentUser: user?.id === row.user_id,
  }));
}
