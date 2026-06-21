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

  // Single RPC: credits today's daily income if the 00:00 UTC cron hasn't yet
  // (idempotent, scoped to this user) and returns the stats reflecting it — so
  // the on-the-spot top-up costs no extra round-trip. trophies + win_streak are
  // derived (see the player_stats view); balance is a real column.
  const { data: rows, error } = await supabase.rpc("get_current_player", {});
  if (error) {
    throw new Error(`get_current_player failed: ${error.message}`);
  }
  const stats = rows?.[0];

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
