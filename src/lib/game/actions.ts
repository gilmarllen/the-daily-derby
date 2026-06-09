"use server";

import { createClient } from "@/lib/supabase/server";
import type { Side } from "@/lib/game/types";

export type SetPickInput =
  | { matchId: string; side: Side }
  | { matchId: null; side: null };

export type SetPickResult = { balance: number } | { error: string };

/**
 * Persists the player's pick for the day via the `set_daily_pick` RPC, which
 * validates the day + pool membership and adjusts the balance atomically.
 * Returns the player's new balance, or an error message to surface in the UI.
 */
export async function setPick(input: SetPickInput): Promise<SetPickResult> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("set_daily_pick", {
    p_match_id: input.matchId,
    p_side: input.side,
  });

  if (error) {
    return { error: error.message };
  }

  return { balance: Number(data) };
}
