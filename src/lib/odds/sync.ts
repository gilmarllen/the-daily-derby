// SERVER-ONLY. Syncs the daily match pool from odds-api.io into the `matches`
// table. Run from a scheduled job (e.g. a cron route) once per day.
//
// What it does, for the UTC day two days out (so a run "now" fills the pool for
// the day after tomorrow):
//   1. Count how many matches that day already has in `matches`.
//   2. Work out how many more are needed to reach MATCH_POOL_TARGET (<= 25).
//   3. Fetch that day's fixtures from odds-api, drop any already stored, pick a
//      league-weighted random subset (marquee leagues are likelier — weights
//      from `leagues.weight`), attach 1X2 odds, and insert them.
import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { createAdminClient } from "@/lib/supabase/admin";
import type { Database, TablesInsert } from "@/lib/supabase/types";

import {
  fetchEvents,
  fetchLeagues,
  fetchOddsMulti,
  ODDS_MULTI_BATCH_SIZE,
} from "./client";
import { DEFAULT_LEAGUE_WEIGHT } from "./league-weights";
import {
  MATCH_POOL_TARGET,
  dayWindow,
  extractMoneyline,
  isOnMatchDay,
  matchesNeeded,
  targetMatchDay,
  weightedShuffle,
} from "./sync-helpers";
import type { OddsApiEvent } from "./types";

const SPORT = "football";

/** The single bookmaker to source fixtures + odds from. Override via env. */
function bookmaker(): string {
  return process.env.ODDS_API_BOOKMAKER?.trim() || "Bet365";
}

export type SyncMatchesResult = {
  matchDay: string;
  /** Rows already present for the day before this run. */
  existing: number;
  /** How many we aimed to add (target − existing). */
  requested: number;
  /** Fixtures returned by odds-api for the day. */
  available: number;
  /** Rows actually inserted. */
  inserted: number;
};

export type SyncMatchesOptions = {
  /** Defaults to the real time; injectable for testing. */
  now?: Date;
  /** Defaults to the admin (service-role) client. */
  client?: SupabaseClient<Database>;
  /** Defaults to Math.random; injectable for deterministic selection. */
  rng?: () => number;
};

/**
 * Map an odds-api event + its 1X2 odds to a `matches` insert row. Team/league
 * names live in the catalog tables now, not on matches; the FK ids are attached
 * later by {@link attachCatalogIds}.
 */
function toMatchRow(
  event: OddsApiEvent,
  odds: { home: number; away: number }
): TablesInsert<"matches"> {
  return {
    external_id: String(event.id),
    league_slug: event.league.slug,
    kickoff: event.date,
    home_odds: odds.home,
    away_odds: odds.away,
    status: "scheduled",
  };
}

/**
 * Ensures the leagues + teams referenced by `rows` exist (names/slugs only —
 * crest/colour columns stay null) and writes the resulting ids back onto each
 * row's `league_id` / `home_team_id` / `away_team_id`. A failure here is
 * non-fatal: matches still insert with null FKs and fall back to default icons.
 *
 * Identity:
 *  - Leagues are keyed by slug (the odds-api exposes no league id).
 *  - A team side carrying an odds-api id (`homeId`/`awayId`) is keyed on
 *    `external_id`, creating a new row on miss — it never falls back to a
 *    name match, so a club already present as a name-only row gets a second,
 *    id-keyed row (reconciled by hand later).
 *  - A side with no id is reused by name (created with a null `external_id`).
 */
async function attachCatalogIds(
  supabase: SupabaseClient<Database>,
  rows: TablesInsert<"matches">[],
  eventsById: Map<number, OddsApiEvent>
): Promise<void> {
  if (rows.length === 0) return;

  // Pair each row with its source event (names + odds-api team ids).
  const paired = rows
    .map((row) => ({ row, event: eventsById.get(Number(row.external_id)) }))
    .filter(
      (p): p is { row: TablesInsert<"matches">; event: OddsApiEvent } =>
        p.event != null
    );

  // --- Leagues: keyed by slug. ---
  const leagueBySlug = new Map<string, string>();
  for (const { event } of paired) {
    if (event.league.slug)
      leagueBySlug.set(event.league.slug, event.league.name);
  }
  const leagueIdBySlug = new Map<string, string>();
  if (leagueBySlug.size > 0) {
    // Upsert names (no ignoreDuplicates) so a fixture's real league name
    // overwrites the slug placeholder seeded by the weights migration. `weight`
    // is absent from the payload, so it is preserved on update.
    const { error } = await supabase.from("leagues").upsert(
      [...leagueBySlug].map(([slug, name]) => ({ slug, name })),
      {
        onConflict: "slug",
      }
    );
    if (error) throw new Error(`Failed to upsert leagues: ${error.message}`);
    const { data, error: readError } = await supabase
      .from("leagues")
      .select("id, slug")
      .in("slug", [...leagueBySlug.keys()]);
    if (readError)
      throw new Error(`Failed to read leagues: ${readError.message}`);
    for (const l of data ?? []) leagueIdBySlug.set(l.slug, l.id);
  }

  // --- Teams: split into id-keyed and name-keyed sides. ---
  const teamNameByExternalId = new Map<string, string>();
  const nameOnlyTeams = new Set<string>();
  for (const { event } of paired) {
    if (event.homeId != null)
      teamNameByExternalId.set(String(event.homeId), event.home);
    else nameOnlyTeams.add(event.home);
    if (event.awayId != null)
      teamNameByExternalId.set(String(event.awayId), event.away);
    else nameOnlyTeams.add(event.away);
  }

  const teamIdByExternalId = new Map<string, string>();
  if (teamNameByExternalId.size > 0) {
    const { error } = await supabase.from("teams").upsert(
      [...teamNameByExternalId].map(([external_id, name]) => ({
        external_id,
        name,
      })),
      { onConflict: "external_id", ignoreDuplicates: true }
    );
    if (error) throw new Error(`Failed to upsert teams: ${error.message}`);
    const { data, error: readError } = await supabase
      .from("teams")
      .select("id, external_id")
      .in("external_id", [...teamNameByExternalId.keys()]);
    if (readError)
      throw new Error(`Failed to read teams: ${readError.message}`);
    for (const t of data ?? [])
      if (t.external_id) teamIdByExternalId.set(t.external_id, t.id);
  }

  const teamIdByName = new Map<string, string>();
  if (nameOnlyTeams.size > 0) {
    // Reuse any existing row with this name; create (null external_id) for misses.
    const { data: existing, error: readError } = await supabase
      .from("teams")
      .select("id, name")
      .in("name", [...nameOnlyTeams]);
    if (readError)
      throw new Error(`Failed to read teams: ${readError.message}`);
    for (const t of existing ?? [])
      if (!teamIdByName.has(t.name)) teamIdByName.set(t.name, t.id);
    const missing = [...nameOnlyTeams].filter((n) => !teamIdByName.has(n));
    if (missing.length > 0) {
      const { data: created, error } = await supabase
        .from("teams")
        .insert(missing.map((name) => ({ name })))
        .select("id, name");
      if (error) throw new Error(`Failed to insert teams: ${error.message}`);
      for (const t of created ?? []) teamIdByName.set(t.name, t.id);
    }
  }

  // --- Write ids back. ---
  for (const { row, event } of paired) {
    if (event.league.slug)
      row.league_id = leagueIdBySlug.get(event.league.slug) ?? null;
    row.home_team_id =
      event.homeId != null
        ? (teamIdByExternalId.get(String(event.homeId)) ?? null)
        : (teamIdByName.get(event.home) ?? null);
    row.away_team_id =
      event.awayId != null
        ? (teamIdByExternalId.get(String(event.awayId)) ?? null)
        : (teamIdByName.get(event.away) ?? null);
  }
}

/** Load the league relevancy weights keyed by slug from the catalog. */
async function loadLeagueWeights(
  supabase: SupabaseClient<Database>
): Promise<Map<string, number>> {
  const { data, error } = await supabase.from("leagues").select("slug, weight");
  if (error) throw new Error(`Failed to read league weights: ${error.message}`);
  return new Map((data ?? []).map((l) => [l.slug, l.weight]));
}

export type SyncLeaguesResult = {
  /** Leagues returned by odds-api. */
  fetched: number;
  /** Rows upserted into the catalog (names refreshed; weights preserved). */
  upserted: number;
};

export type SyncLeaguesOptions = {
  /** Defaults to the admin (service-role) client. */
  client?: SupabaseClient<Database>;
};

/**
 * Refresh league display names from odds-api `GET /leagues`. Upserts on slug so
 * the real names overwrite the slug placeholders seeded by the weights
 * migration; `weight` is left out of the payload, so it is preserved on update
 * (and brand-new leagues insert with the column default).
 */
export async function syncLeagues(
  options: SyncLeaguesOptions = {}
): Promise<SyncLeaguesResult> {
  const supabase = options.client ?? createAdminClient();

  const leagues = await fetchLeagues(SPORT);
  const rows = leagues
    .filter((l) => l.slug)
    .map((l) => ({ slug: l.slug, name: l.name }));
  if (rows.length === 0) return { fetched: leagues.length, upserted: 0 };

  const { data, error } = await supabase
    .from("leagues")
    .upsert(rows, { onConflict: "slug" })
    .select("id");
  if (error) throw new Error(`Failed to upsert leagues: ${error.message}`);

  return { fetched: leagues.length, upserted: data?.length ?? 0 };
}

export async function syncMatches(
  options: SyncMatchesOptions = {}
): Promise<SyncMatchesResult> {
  const now = options.now ?? new Date();
  const rng = options.rng ?? Math.random;
  const supabase = options.client ?? createAdminClient();
  const book = bookmaker();

  const matchDay = targetMatchDay(now);
  const { from, to } = dayWindow(matchDay);

  // 1. What's already stored for the day (matched by kickoff window, since the
  // match day is derived from kickoff).
  const { data: existingRows, error: countError } = await supabase
    .from("matches")
    .select("external_id")
    .gte("kickoff", from)
    .lte("kickoff", to);
  if (countError)
    throw new Error(`Failed to read existing matches: ${countError.message}`);

  const existing = existingRows?.length ?? 0;
  const existingIds = new Set(
    (existingRows ?? [])
      .map((r) => r.external_id)
      .filter((id): id is string => id != null)
  );

  // 2. How many more we need.
  const requested = matchesNeeded(existing, MATCH_POOL_TARGET);
  if (requested === 0) {
    return { matchDay, existing, requested: 0, available: 0, inserted: 0 };
  }

  // 3a. Fetch fixtures that have odds from our bookmaker, dropping any we
  // already have. Filtering by bookmaker means (almost) every candidate yields
  // usable odds below.
  const events = await fetchEvents({
    sport: SPORT,
    from,
    to,
    status: "pending",
    bookmaker: book,
  });
  const candidates = events.filter(
    (e) => isOnMatchDay(e, matchDay) && !existingIds.has(String(e.id))
  );

  // 3b. Order candidates by a league-weighted random shuffle so marquee leagues
  // are likelier to be picked (weights from `leagues.weight`). We walk the full
  // list (not just `requested`) because a fixture can still lack a clean 1X2
  // line; the odds loop early-stops once enough rows are built.
  const weightBySlug = await loadLeagueWeights(supabase);
  const shortlist = weightedShuffle(
    candidates,
    (e) => weightBySlug.get(e.league.slug) ?? DEFAULT_LEAGUE_WEIGHT,
    rng
  );

  // 3c. Attach odds in batches (max 10 events per /odds/multi call), stopping
  // once we have enough rows.
  const rows: TablesInsert<"matches">[] = [];
  const eventsById = new Map(shortlist.map((e) => [e.id, e]));

  for (
    let i = 0;
    i < shortlist.length && rows.length < requested;
    i += ODDS_MULTI_BATCH_SIZE
  ) {
    const batch = shortlist.slice(i, i + ODDS_MULTI_BATCH_SIZE);
    const oddsList = await fetchOddsMulti(
      batch.map((e) => e.id),
      [book]
    );
    for (const eventOdds of oddsList) {
      if (rows.length >= requested) break;
      const event = eventsById.get(eventOdds.id);
      if (!event) continue;
      const ml = extractMoneyline(eventOdds, [book]);
      if (!ml) continue;
      rows.push(toMatchRow(event, ml));
    }
  }

  // 3d. Auto-populate the teams/leagues catalogs from the names/slugs on the
  // rows, then attach the resulting ids. Crest/colour columns are left null and
  // filled in by hand later; the UI falls back to a default icon until then.
  await attachCatalogIds(supabase, rows, eventsById);

  // 3e. Insert. Ignore conflicts on external_id in case a concurrent run raced us.
  let inserted = 0;
  if (rows.length > 0) {
    const { data, error } = await supabase
      .from("matches")
      .upsert(rows, { onConflict: "external_id", ignoreDuplicates: true })
      .select("id");
    if (error) throw new Error(`Failed to insert matches: ${error.message}`);
    inserted = data?.length ?? 0;
  }

  return {
    matchDay,
    existing,
    requested,
    available: candidates.length,
    inserted,
  };
}
