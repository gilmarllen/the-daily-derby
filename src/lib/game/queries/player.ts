import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Player } from "@/lib/game/types";

/**
 * Loads the signed-in player's profile and maps it to the UI `Player` shape.
 * Returns `null` when there is no authenticated user — callers in protected
 * routes (gated by proxy.ts) should redirect in that case.
 */
export async function getCurrentPlayer(): Promise<Player | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // trophies + win_streak are derived (see the player_stats view); balance is a
  // real column surfaced through the same view.
  const { data: stats } = await supabase
    .from("player_stats")
    .select("username, trophies, balance, win_streak")
    .eq("user_id", user.id)
    .single();

  // The user is authenticated but has no profile row. This shouldn't happen
  // (the handle_new_user trigger creates one on signup), so fail loudly rather
  // than returning null — returning null here would bounce an authenticated
  // user to /login, which sends them back, causing a redirect loop.
  if (!stats) {
    throw new Error(`No profile found for authenticated user ${user.id}`);
  }

  return {
    name: stats.username ?? "",
    trophies: stats.trophies ?? 0,
    balance: stats.balance ?? 0,
    winStreak: stats.win_streak ?? 0,
  };
}
