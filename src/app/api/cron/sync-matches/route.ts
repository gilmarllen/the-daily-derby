import { createCronRoute } from "@/lib/cron/handler";
import { syncMatches } from "@/lib/odds/sync";

// Daily fixture sync, invoked by Vercel Cron (see vercel.json). Pulls the match
// pool for the UTC day two days out. Always runs at request time.
export const dynamic = "force-dynamic";
// Fetching + odds batching can take a while; give it room (Vercel caps this by
// plan — Hobby allows up to 60s).
export const maxDuration = 60;

export const GET = createCronRoute("sync-matches", syncMatches);
