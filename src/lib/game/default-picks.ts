// SERVER-ONLY. Seeds the default "No selection" pick for every player for the
// day two UTC days out. Invoked by the daily cron (see the generate-default-picks
// route) at 12:00 UTC. Uses the admin client because it writes rows for all
// players.
import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

export async function generateDefaultPicks(): Promise<{ inserted: number }> {
  const supabase = createAdminClient();

  const { data, error } = await supabase.rpc("generate_default_picks", {});
  if (error) {
    throw new Error(`Failed to generate default picks: ${error.message}`);
  }

  return { inserted: Number(data ?? 0) };
}
