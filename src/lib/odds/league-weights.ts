// Relevancy weights for the match-sync pool pick now live in the `leagues`
// table (`leagues.weight`), seeded by migration and tunable in the DB without a
// redeploy. The cron loads them into an in-memory map (see `syncMatches`), and
// the per-player draw reads them off the embedded league row. The scale is
// roughly:
//   100 elite · 75 top · 50 strong · 30 good · 15 modest · 6 long-tail senior ·
//   2 down-weighted (women / youth / reserves / amateur / regional / simulated).

/** Weight for a league the catalog doesn't list (e.g. a brand-new comp). */
export const DEFAULT_LEAGUE_WEIGHT = 3;

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
