import { describe, expect, it } from "vitest";

import {
  DEFAULT_LEAGUE_WEIGHT,
  LEAGUE_WEIGHTS,
  weightForLeague,
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
