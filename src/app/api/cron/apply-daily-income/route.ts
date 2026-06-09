import { createCronRoute } from "@/lib/cron/handler";
import { applyDailyIncome } from "@/lib/game/daily-income";

// Daily income payout, invoked by Vercel Cron (see vercel.json) at 00:00 UTC,
// the daily reset. Credits every player F$ 4.00 for the new day. Always runs at
// request time.
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export const GET = createCronRoute("apply-daily-income", applyDailyIncome);
