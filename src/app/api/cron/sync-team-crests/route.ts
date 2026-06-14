import { createCronRoute } from "@/lib/cron/handler";
import { syncTeamCrests } from "@/lib/odds/sync-crests";

// Daily team-crest sync, invoked by Vercel Cron (see vercel.json). Downloads
// odds-api participant logos for teams missing a crest and stores them in the
// `team-crests` Supabase Storage bucket. Always runs at request time.
export const dynamic = "force-dynamic";
// Downloading + uploading up to 50 images can take a while; give it room (Vercel
// caps this by plan — Hobby allows up to 60s).
export const maxDuration = 60;

export const GET = createCronRoute("sync-team-crests", syncTeamCrests);
