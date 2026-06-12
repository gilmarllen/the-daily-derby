// Relevancy weights for the match-sync pool pick. The cron draws its global
// pool with a league-weighted random order (see `weightedShuffle` in
// sync-helpers.ts), so higher-weight leagues are more likely to be picked.
//
// Weights are static reference data kept as JSON (league-weights.json) so the
// cron resolves them from an in-memory map with zero DB/network latency. Edit a
// league's priority by changing its number there; the scale is roughly:
//   100 elite · 75 top · 50 strong · 30 good · 15 modest · 6 long-tail senior ·
//   2 down-weighted (women / youth / reserves / amateur / regional / simulated).

import weights from "./league-weights.json";

export const LEAGUE_WEIGHTS: Record<string, number> = weights;

/** Weight for a league slug the JSON doesn't list (e.g. a brand-new comp). */
export const DEFAULT_LEAGUE_WEIGHT = 3;

/** Relevancy weight for a league slug; falls back to the default when unknown. */
export function weightForLeague(slug: string | undefined | null): number {
  if (!slug) return DEFAULT_LEAGUE_WEIGHT;
  return LEAGUE_WEIGHTS[slug] ?? DEFAULT_LEAGUE_WEIGHT;
}

/**
 * Slugify a league display name to its odds-api slug form. The provider derives
 * the slug from the name by the same normalisation, so e.g. "USA - USL,
 * Championship" -> "usa-usl-championship" and "Australia - U20 NSW League One"
 * -> "australia-u20-nsw-league-one".
 */
export function leagueNameToSlug(name: string): string {
  return name
    .normalize("NFKD") // split accented letters into base + combining mark
    .replace(/[^\x20-\x7e]/g, "") // drop non-ASCII (combining marks, curly quotes)
    .toLowerCase()
    .replace(/'/g, "") // drop apostrophes (women's -> womens)
    .replace(/[^a-z0-9]+/g, "-") // any other run -> single hyphen
    .replace(/^-+|-+$/g, "");
}

/**
 * Relevancy weight for a stored league display name (the `matches.league`
 * column holds the name, not the slug). Used by the per-player daily draw.
 */
export function weightForLeagueName(name: string | undefined | null): number {
  if (!name) return DEFAULT_LEAGUE_WEIGHT;
  return weightForLeague(leagueNameToSlug(name));
}
