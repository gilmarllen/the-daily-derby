// SERVER-ONLY HTTP client for odds-api.io (v3). The API key is a query param
// and must never reach the browser. Docs: https://docs.odds-api.io/llms-full.txt
import "server-only";

import type { OddsApiEvent, OddsApiEventOdds } from "./types";

const BASE_URL = "https://api.odds-api.io/v3";

/** `/odds/multi` accepts at most 10 event ids per call. */
export const ODDS_MULTI_BATCH_SIZE = 10;

function apiKey(): string {
  const key = process.env.ODDS_API_KEY;
  if (!key) throw new Error("ODDS_API_KEY is not set");
  return key;
}

async function getJson<T>(
  path: string,
  params: Record<string, string>
): Promise<T> {
  console.log(params);
  const url = new URL(`${BASE_URL}${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  url.searchParams.set("apiKey", apiKey());

  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `odds-api ${path} failed: ${res.status} ${res.statusText} ${body}`.trim()
    );
  }
  return res.json() as Promise<T>;
}

/** Some odds-api list endpoints wrap rows in `{ data: [...] }`; tolerate both. */
function unwrap<T>(payload: T[] | { data: T[] }): T[] {
  return Array.isArray(payload) ? payload : (payload.data ?? []);
}

/**
 * Fetch events for a sport within a UTC time window. `from`/`to` are RFC3339
 * timestamps. `status` defaults to "pending" (not yet kicked off).
 *
 * `bookmaker` restricts results to events that have odds from that single book
 * (the API only accepts one — a comma-separated list returns nothing).
 */
export async function fetchEvents(opts: {
  sport: string;
  from: string;
  to: string;
  status?: string;
  league?: string;
  bookmaker?: string;
}): Promise<OddsApiEvent[]> {
  const params: Record<string, string> = {
    sport: opts.sport,
    from: opts.from,
    to: opts.to,
    status: opts.status ?? "pending",
  };
  if (opts.league) params.league = opts.league;
  if (opts.bookmaker) params.bookmaker = opts.bookmaker;
  return unwrap(
    await getJson<OddsApiEvent[] | { data: OddsApiEvent[] }>("/events", params)
  );
}

/**
 * Fetch odds for up to {@link ODDS_MULTI_BATCH_SIZE} events in one call.
 * `bookmakers` is a comma-separated list of bookmaker names.
 */
export async function fetchOddsMulti(
  eventIds: Array<number | string>,
  bookmakers: string[]
): Promise<OddsApiEventOdds[]> {
  if (eventIds.length === 0) return [];
  if (eventIds.length > ODDS_MULTI_BATCH_SIZE) {
    throw new Error(
      `fetchOddsMulti: max ${ODDS_MULTI_BATCH_SIZE} events per call`
    );
  }
  return unwrap(
    await getJson<OddsApiEventOdds[] | { data: OddsApiEventOdds[] }>(
      "/odds/multi",
      {
        eventIds: eventIds.join(","),
        bookmakers: bookmakers.join(","),
      }
    )
  );
}
