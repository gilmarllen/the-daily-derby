import { describe, expect, it } from "vitest";

import {
  costFromOdds,
  formatFootballMoney,
  formatTrophyDelta,
} from "./constants";

// Non-breaking space that formatFootballMoney glues between "F$" and the amount.
const NBSP = String.fromCharCode(160);

describe("costFromOdds", () => {
  it("is 10 / odds", () => {
    expect(costFromOdds(2)).toBe(5);
    expect(costFromOdds(4)).toBe(2.5);
    expect(costFromOdds(10)).toBe(1);
  });

  it("matches the documented example (odds 1.50 -> ~6.67)", () => {
    expect(costFromOdds(1.5)).toBeCloseTo(6.6667, 3);
  });
});

describe("formatFootballMoney", () => {
  it("always shows two decimals", () => {
    expect(formatFootballMoney(10)).toBe(`F$${NBSP}10.00`);
    expect(formatFootballMoney(0)).toBe(`F$${NBSP}0.00`);
  });

  it("rounds to two decimals", () => {
    expect(formatFootballMoney(costFromOdds(1.5))).toBe(`F$${NBSP}6.67`);
  });

  it("glues F$ to the amount with a non-breaking space (no regular space)", () => {
    expect(formatFootballMoney(5)).not.toContain("F$ ");
    expect(formatFootballMoney(5)).toContain(NBSP);
  });
});

describe("formatTrophyDelta", () => {
  it("prefixes a + for positive values", () => {
    expect(formatTrophyDelta(3)).toBe("+3");
    expect(formatTrophyDelta(1)).toBe("+1");
  });

  it("leaves zero and negatives without a + sign", () => {
    expect(formatTrophyDelta(0)).toBe("0");
    expect(formatTrophyDelta(-1)).toBe("-1");
    expect(formatTrophyDelta(-2)).toBe("-2");
  });
});
