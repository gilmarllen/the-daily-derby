// Subset of the odds-api.io v3 response shapes that the match sync depends on.
// Full docs: https://docs.odds-api.io/llms-full.txt

/** An event as returned by `GET /events`. Odds are NOT included inline. */
export type OddsApiEvent = {
  id: number;
  home: string;
  away: string;
  homeId?: number;
  awayId?: number;
  /** ISO 8601, UTC (e.g. "2025-10-15T15:00:00Z"). */
  date: string;
  /** "pending" | "live" | "settled" */
  status: string;
  sport: { name: string; slug: string };
  league: { name: string; slug: string };
  /** Final/current scores; populated for settled (and live) events. */
  scores?: {
    home: number | null;
    away: number | null;
  };
};

/** A single market line, e.g. the moneyline ("ML") 1X2 market. */
export type OddsApiMarket = {
  name: string;
  updatedAt: string;
  odds: Array<{
    home?: string;
    draw?: string;
    away?: string;
    [key: string]: string | number | undefined;
  }>;
};

/** An event with odds, as returned by `GET /odds` and `GET /odds/multi`. */
export type OddsApiEventOdds = {
  id: number;
  home: string;
  away: string;
  date: string;
  status: string;
  sport: { name: string; slug: string };
  league: { name: string; slug: string };
  /** Final/current scores; populated for settled (and live) events. */
  scores?: {
    home: number | null;
    away: number | null;
  };
  /** Keyed by bookmaker name; each holds that book's markets. */
  bookmakers: Record<string, OddsApiMarket[]>;
};
