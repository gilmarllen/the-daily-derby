// SERVER-ONLY. Fills `teams.crest_url` from odds-api participant logos. Run from
// a scheduled job (see the sync-team-crests cron route) once per day.
//
// What it does:
//   1. Take up to CREST_BATCH_LIMIT teams that have an odds-api id
//      (`external_id`) but no crest yet (`crest_url IS NULL`).
//   2. For each, download the logo, upload it to the `team-crests` Storage
//      bucket, and write the bucket's public URL back to `crest_url`.
// One bad team (e.g. a 404 logo) is skipped and counted, never aborting the run.
import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/types";

import { fetchParticipantLogo } from "./client";
import { extensionForContentType } from "./sync-helpers";

/** Public Storage bucket holding team crest images. */
const CREST_BUCKET = "team-crests";

/** Max teams to process per run (keeps within the cron's maxDuration). */
const CREST_BATCH_LIMIT = 50;

export type SyncTeamCrestsResult = {
  /** Teams matched (missing crest, have an external id), up to the batch limit. */
  candidates: number;
  /** Crests successfully downloaded, uploaded, and linked. */
  uploaded: number;
  /** Teams skipped because their logo fetch/upload/update failed. */
  failed: number;
};

export type SyncTeamCrestsOptions = {
  /** Defaults to the admin (service-role) client. */
  client?: SupabaseClient<Database>;
};

export async function syncTeamCrests(
  options: SyncTeamCrestsOptions = {}
): Promise<SyncTeamCrestsResult> {
  const supabase = options.client ?? createAdminClient();

  // 1. Teams needing a crest that carry an odds-api id to fetch it with.
  const { data: teams, error } = await supabase
    .from("teams")
    .select("id, external_id")
    .is("crest_url", null)
    .not("external_id", "is", null)
    .limit(CREST_BATCH_LIMIT);
  if (error) throw new Error(`Failed to read teams: ${error.message}`);

  const candidates = teams?.length ?? 0;
  let uploaded = 0;
  let failed = 0;

  // 2. Process sequentially — 50 small images is fine and avoids hammering the API.
  for (const team of teams ?? []) {
    const externalId = team.external_id;
    if (!externalId) continue;
    try {
      const { bytes, contentType } = await fetchParticipantLogo(externalId);
      const path = `${externalId}.${extensionForContentType(contentType)}`;

      const { error: uploadError } = await supabase.storage
        .from(CREST_BUCKET)
        .upload(path, bytes, { contentType, upsert: true });
      if (uploadError) throw new Error(uploadError.message);

      const {
        data: { publicUrl },
      } = supabase.storage.from(CREST_BUCKET).getPublicUrl(path);

      const { error: updateError } = await supabase
        .from("teams")
        .update({ crest_url: publicUrl })
        .eq("id", team.id);
      if (updateError) throw new Error(updateError.message);

      uploaded += 1;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error(`Failed to sync crest for team ${externalId}:`, message);
      failed += 1;
    }
  }

  return { candidates, uploaded, failed };
}
