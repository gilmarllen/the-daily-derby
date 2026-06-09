// SERVER-ONLY. Credits every player their daily income for the current UTC day.
// Invoked by the daily cron (see the apply-daily-income route) at 00:00 UTC. The
// RPC is idempotent, so a re-run within the same day is a no-op.
import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

export async function applyDailyIncome(): Promise<{ credited: number }> {
  const supabase = createAdminClient();

  const { data, error } = await supabase.rpc("apply_daily_income", {});
  if (error) {
    throw new Error(`Failed to apply daily income: ${error.message}`);
  }

  return { credited: Number(data ?? 0) };
}
