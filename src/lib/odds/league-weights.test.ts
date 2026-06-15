import { describe, expect, it } from "vitest";

import { leagueNameToSlug } from "./league-weights";

describe("leagueNameToSlug", () => {
  it("reproduces the odds-api slug from the display name", () => {
    expect(leagueNameToSlug("England - Premier League")).toBe(
      "england-premier-league"
    );
    expect(leagueNameToSlug("USA - USL, Championship")).toBe(
      "usa-usl-championship"
    );
    expect(leagueNameToSlug("International - FIFA World Cup")).toBe(
      "international-fifa-world-cup"
    );
    expect(leagueNameToSlug("Australia - U20 NSW League One")).toBe(
      "australia-u20-nsw-league-one"
    );
  });

  it("strips diacritics and apostrophes", () => {
    expect(leagueNameToSlug("Türkiye - Süper Lig")).toBe("turkiye-super-lig");
    expect(leagueNameToSlug("USA - National Women's Soccer League")).toBe(
      "usa-national-womens-soccer-league"
    );
  });
});
