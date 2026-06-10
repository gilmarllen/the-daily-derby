import { createCronRoute } from "@/lib/cron/handler";
import { settleMatches } from "@/lib/game/settle";

// Settles finished matches + their picks, invoked by Vercel Cron (see
// vercel.json). Settles anything that kicked off >= 1h45m ago and has a result.
// Always runs at request time.
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export const GET = createCronRoute("settle-matches", settleMatches);
