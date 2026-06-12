import { describe, expect, it } from "vitest";

import {
  DEFAULT_LEAGUE_WEIGHT,
  LEAGUE_WEIGHTS,
  leagueNameToSlug,
  weightForLeague,
  weightForLeagueName,
} from "./league-weights";

describe("weightForLeague", () => {
  it("ranks marquee leagues above obscure ones", () => {
    expect(weightForLeague("england-premier-league")).toBeGreaterThan(
      weightForLeague("england-championship")
    );
    expect(weightForLeague("england-championship")).toBeGreaterThan(
      weightForLeague("england-amateur-national-league-north")
    );
    expect(weightForLeague("international-clubs-uefa-champions-league")).toBe(
      100
    );
  });

  it("collapses women / youth / reserve / amateur leagues to the floor", () => {
    for (const slug of [
      "usa-national-womens-soccer-league",
      "australia-u20-nsw-league-one",
      "brazil-u20-brasileiro",
      "el-salvador-primera-division-reserves-apertura",
      "germany-amateur-regionalliga-west",
      "simulated-reality-league-laliga-srl",
    ]) {
      expect(weightForLeague(slug)).toBeLessThanOrEqual(2);
    }
  });

  it("falls back to the default for unknown or empty slugs", () => {
    expect(weightForLeague("a-brand-new-league-2099")).toBe(
      DEFAULT_LEAGUE_WEIGHT
    );
    expect(weightForLeague(undefined)).toBe(DEFAULT_LEAGUE_WEIGHT);
    expect(weightForLeague(null)).toBe(DEFAULT_LEAGUE_WEIGHT);
  });

  it("assigns a positive weight to every catalogued league", () => {
    const values = Object.values(LEAGUE_WEIGHTS);
    expect(values.length).toBeGreaterThan(1000);
    expect(values.every((w) => w >= 1)).toBe(true);
  });
});

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

describe("weightForLeagueName", () => {
  it("weights by the catalogued slug derived from the name", () => {
    expect(weightForLeagueName("England - Premier League")).toBe(
      weightForLeague("england-premier-league")
    );
    expect(weightForLeagueName("Australia - U20 NSW League One")).toBe(
      weightForLeague("australia-u20-nsw-league-one")
    );
    expect(weightForLeagueName("England - Premier League")).toBeGreaterThan(
      weightForLeagueName("Australia - U20 NSW League One")
    );
  });

  it("falls back to the default for an unknown or empty name", () => {
    expect(weightForLeagueName("Some Made Up League")).toBe(
      DEFAULT_LEAGUE_WEIGHT
    );
    expect(weightForLeagueName(null)).toBe(DEFAULT_LEAGUE_WEIGHT);
  });
});
