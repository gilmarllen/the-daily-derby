import "server-only";

import { toPastPick } from "@/lib/game/past-pick";
import type { PastPick, PlayerProfile, Side } from "@/lib/game/types";
import { createClient } from "@/lib/supabase/server";

/**
 * Loads another player's public profile by username via the get_player_profile
 * RPC (SECURITY DEFINER — picks RLS is owner-only). Returns `null` when no such
 * player exists, so the route can 404. Money/balance exclude the in-progress
 * pick (see the RPC), so nothing here can leak the player's active selection.
 */
export async function getPlayerProfile(
  username: string
): Promise<PlayerProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_player_profile", {
    p_username: username,
  });
  if (error) {
    throw new Error(`Failed to load player profile: ${error.message}`);
  }

  const row = data?.[0];
  if (!row) return null;

  return {
    name: row.username,
    trophies: row.trophies ?? 0,
    winStreak: row.win_streak ?? 0,
    moneySpent: Number(row.money_spent ?? 0),
    balance: Number(row.adjusted_balance ?? 0),
    totalPredictions: row.total_predictions ?? 0,
    wins: row.wins ?? 0,
    winRate: Number(row.win_rate ?? 0),
    bestLeague: row.best_league,
    bestLeagueWins: row.best_league_wins ?? 0,
  };
}

/**
 * Loads another player's locked past picks (newest first) via the
 * get_player_picks RPC, reusing the same row→PastPick mapping as the history
 * page. The RPC excludes the in-progress pick.
 */
export async function getPlayerPicks(username: string): Promise<PastPick[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_player_picks", {
    p_username: username,
  });
  if (error) {
    throw new Error(`Failed to load player picks: ${error.message}`);
  }

  return (data ?? []).map((row) =>
    toPastPick({
      id: row.id,
      match_day: row.match_day,
      picked_side: row.picked_side as Side | null,
      cost: row.cost,
      result: row.result,
      home_team: row.home_team,
      away_team: row.away_team,
      league: row.league,
    })
  );
}
