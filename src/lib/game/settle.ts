// SERVER-ONLY. Settles matches whose results are in: finds scheduled matches
// that kicked off long enough ago to be over, fetches their final scores from
// odds-api, and settles each via the settle_match RPC (which records the result
// and the picks' results atomically).
//
// Scores for finished matches are only available from /events (status=settled) —
// /odds and /odds/multi only return pending/live events. /events is capped at
// 5000 per response, so we paginate and short-circuit once every target match
// for a day is found, and we narrow the window to each day's actual kickoff
// range to keep result sets small.
import "server-only";

import { ODDS_EVENTS_PAGE_SIZE, fetchEvents } from "@/lib/odds/client";
import { createAdminClient } from "@/lib/supabase/admin";
import { utcDateString } from "@/lib/time";

const SPORT = "football";

/**
 * How long after kickoff a match is assumed to be over (90' + half-time +
 * stoppage). Matches older than this and still scheduled are settled.
 */
const SETTLE_AFTER_MS = 105 * 60 * 1000; // 1h45m

type DueMatch = { id: string; external_id: string; kickoff: string };

export type SettleMatchesResult = {
  /** Scheduled matches past the settle cutoff. */
  due: number;
  /** Matches actually settled this run (a final result was available). */
  settled: number;
  /** Picks settled across those matches. */
  picksSettled: number;
};

/**
 * Final scores for the given matches, keyed by external id. Fetched per UTC
 * kickoff day so the time window is tight, paginated against the 5000 cap, and
 * short-circuited once every match for the day has a score.
 */
async function fetchScores(
  matches: DueMatch[]
): Promise<Map<string, { home: number; away: number }>> {
  const scores = new Map<string, { home: number; away: number }>();

  const byDay = new Map<string, DueMatch[]>();
  for (const m of matches) {
    const day = utcDateString(new Date(m.kickoff));
    const list = byDay.get(day);
    if (list) list.push(m);
    else byDay.set(day, [m]);
  }

  for (const dayMatches of byDay.values()) {
    const remaining = new Set(dayMatches.map((m) => m.external_id));
    const times = dayMatches.map((m) => Date.parse(m.kickoff));
    const from = new Date(Math.min(...times)).toISOString();
    const to = new Date(Math.max(...times) + 1000).toISOString();

    for (let skip = 0; remaining.size > 0; skip += ODDS_EVENTS_PAGE_SIZE) {
      const events = await fetchEvents({
        sport: SPORT,
        from,
        to,
        status: "settled",
        limit: ODDS_EVENTS_PAGE_SIZE,
        skip,
      });

      for (const e of events) {
        const id = String(e.id);
        if (!remaining.has(id)) continue;
        const home = e.scores?.home;
        const away = e.scores?.away;
        if (typeof home === "number" && typeof away === "number") {
          scores.set(id, { home, away });
          remaining.delete(id);
        }
      }

      if (events.length < ODDS_EVENTS_PAGE_SIZE) break; // last page for this day
    }
  }

  return scores;
}

export async function settleMatches(
  now: Date = new Date()
): Promise<SettleMatchesResult> {
  const supabase = createAdminClient();
  const cutoff = new Date(now.getTime() - SETTLE_AFTER_MS).toISOString();

  // 1. Matches that should be over but aren't settled yet.
  const { data, error } = await supabase
    .from("matches")
    .select("id, external_id, kickoff")
    .eq("status", "scheduled")
    .not("external_id", "is", null)
    .lte("kickoff", cutoff)
    .order("kickoff", { ascending: true });
  if (error) {
    throw new Error(`Failed to load matches to settle: ${error.message}`);
  }
  const due = (data ?? []).filter((m): m is DueMatch => m.external_id != null);
  if (due.length === 0) {
    return { due: 0, settled: 0, picksSettled: 0 };
  }

  // 2. Fetch final scores from odds-api.
  const scores = await fetchScores(due);

  // 3. Settle each match whose result is available; missing ones retry next run.
  let settled = 0;
  let picksSettled = 0;
  for (const match of due) {
    const score = scores.get(match.external_id);
    if (!score) continue;

    const { data: count, error: rpcError } = await supabase.rpc(
      "settle_match",
      {
        p_match_id: match.id,
        p_home_score: score.home,
        p_away_score: score.away,
      }
    );
    if (rpcError) {
      throw new Error(
        `Failed to settle match ${match.id}: ${rpcError.message}`
      );
    }
    settled += 1;
    picksSettled += Number(count ?? 0);
  }

  return { due: due.length, settled, picksSettled };
}
