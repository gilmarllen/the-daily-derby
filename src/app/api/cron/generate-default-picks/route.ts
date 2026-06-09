import { createCronRoute } from "@/lib/cron/handler";
import { generateDefaultPicks } from "@/lib/game/default-picks";

// Daily "No selection" pick seeding, invoked by Vercel Cron (see vercel.json)
// at 12:00 UTC. Ensures every player has a default pick for the day two UTC days
// out, well before it becomes pickable. Always runs at request time.
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export const GET = createCronRoute(
  "generate-default-picks",
  generateDefaultPicks
);
