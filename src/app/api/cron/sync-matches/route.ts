import { createCronRoute } from "@/lib/cron/handler";
import { syncMatches } from "@/lib/odds/sync";

// Daily fixture sync, invoked by Vercel Cron (see vercel.json). Pulls the match
// pool for the UTC day two days out, and first tops up tomorrow's pool so a
// missed run self-heals (a full pool costs no odds-api calls). Always runs at
// request time.
export const dynamic = "force-dynamic";
// Fetching + odds batching can take a while; give it room (Vercel caps this by
// plan — Hobby allows up to 60s).
export const maxDuration = 60;

export const GET = createCronRoute("sync-matches", async () => {
  const tomorrow = await syncMatches({ daysAhead: 1 });
  const dayAfter = await syncMatches();
  return { days: [tomorrow, dayAfter] };
});
