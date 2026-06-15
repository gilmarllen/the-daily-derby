import { createCronRoute } from "@/lib/cron/handler";
import { syncLeagues } from "@/lib/odds/sync";

// Daily league-catalog sync, invoked by Vercel Cron (see vercel.json). Refreshes
// league display names from odds-api `GET /leagues`, overwriting the slug
// placeholders seeded with the weights; weights are preserved. Always runs at
// request time.
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export const GET = createCronRoute("sync-leagues", syncLeagues);
