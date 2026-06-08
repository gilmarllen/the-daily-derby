// SERVER-ONLY. Syncs the daily match pool from odds-api.io into the `matches`
// table. Run from a scheduled job (e.g. a cron route) once per day.
//
// What it does, for the UTC day two days out (so a run "now" fills the pool for
// the day after tomorrow):
//   1. Count how many matches that day already has in `matches`.
//   2. Work out how many more are needed to reach MATCH_POOL_TARGET (<= 50).
//   3. Fetch that day's fixtures from odds-api, drop any already stored, pick a
//      random subset, attach 1X2 odds, and insert them.
import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { createAdminClient } from "@/lib/supabase/admin";
import type { Database, TablesInsert } from "@/lib/supabase/types";

import { fetchEvents, fetchOddsMulti, ODDS_MULTI_BATCH_SIZE } from "./client";
import {
  MATCH_POOL_TARGET,
  dayWindow,
  extractMoneyline,
  isOnMatchDay,
  matchesNeeded,
  shuffle,
  targetMatchDay,
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

/** Map an odds-api event + its 1X2 odds to a `matches` insert row. */
function toMatchRow(
  event: OddsApiEvent,
  odds: { home: number; away: number }
): TablesInsert<"matches"> {
  return {
    external_id: String(event.id),
    league: event.league.name,
    kickoff: event.date,
    home_team: event.home,
    away_team: event.away,
    home_odds: odds.home,
    away_odds: odds.away,
    status: "scheduled",
  };
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

  // 3b. Shuffle all candidates so the picked subset is random. We walk the full
  // list (not just `requested`) because a fixture can still lack a clean 1X2
  // line; the odds loop early-stops once enough rows are built.
  const shortlist = shuffle(candidates, rng);

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

  // 3d. Insert. Ignore conflicts on external_id in case a concurrent run raced us.
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
