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
