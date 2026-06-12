import { describe, expect, it } from "vitest";

import { mulberry32 } from "@/lib/game/daily-pool";

import {
  MATCH_POOL_TARGET,
  dayWindow,
  extractMoneyline,
  isOnMatchDay,
  matchesNeeded,
  pickRandom,
  shuffle,
  targetMatchDay,
  weightedShuffle,
} from "./sync-helpers";
import type { OddsApiEvent, OddsApiEventOdds } from "./types";

describe("targetMatchDay", () => {
  it("returns the UTC day two days ahead", () => {
    expect(targetMatchDay(new Date("2026-06-08T10:00:00Z"))).toBe("2026-06-10");
  });

  it("delimits days by UTC, not local time", () => {
    // 23:30Z on the 8th is still the 8th in UTC → +2 = the 10th.
    expect(targetMatchDay(new Date("2026-06-08T23:30:00Z"))).toBe("2026-06-10");
  });

  it("rolls over month boundaries", () => {
    expect(targetMatchDay(new Date("2026-06-30T12:00:00Z"))).toBe("2026-07-02");
  });

  it("honours a custom daysAhead", () => {
    expect(targetMatchDay(new Date("2026-06-08T00:00:00Z"), 0)).toBe(
      "2026-06-08"
    );
  });
});

describe("dayWindow", () => {
  it("spans the full UTC day, capped at the match day's own end", () => {
    expect(dayWindow("2026-06-10")).toEqual({
      from: "2026-06-10T00:00:00Z",
      to: "2026-06-10T23:59:59Z",
    });
  });
});

describe("matchesNeeded", () => {
  it("returns the gap to the target", () => {
    expect(matchesNeeded(10)).toBe(MATCH_POOL_TARGET - 10);
  });

  it("never goes negative when the pool is full or over", () => {
    expect(matchesNeeded(MATCH_POOL_TARGET)).toBe(0);
    expect(matchesNeeded(MATCH_POOL_TARGET + 10)).toBe(0);
  });

  it("respects a custom target", () => {
    expect(matchesNeeded(2, 5)).toBe(3);
  });
});

describe("isOnMatchDay", () => {
  const event = { date: "2026-06-10T19:45:00Z" } as OddsApiEvent;

  it("matches the UTC date", () => {
    expect(isOnMatchDay(event, "2026-06-10")).toBe(true);
  });

  it("rejects other days", () => {
    expect(isOnMatchDay(event, "2026-06-11")).toBe(false);
  });
});

describe("shuffle / pickRandom", () => {
  // Deterministic rng: always returns 0 → Fisher–Yates rotates predictably.
  const zeroRng = () => 0;

  it("does not mutate the input", () => {
    const input = [1, 2, 3, 4];
    shuffle(input, zeroRng);
    expect(input).toEqual([1, 2, 3, 4]);
  });

  it("keeps every element", () => {
    expect([...shuffle([1, 2, 3, 4], zeroRng)].sort()).toEqual([1, 2, 3, 4]);
  });

  it("picks at most n items", () => {
    expect(pickRandom([1, 2, 3, 4, 5], 3, zeroRng)).toHaveLength(3);
  });

  it("returns empty for n <= 0", () => {
    expect(pickRandom([1, 2, 3], 0)).toEqual([]);
    expect(pickRandom([1, 2, 3], -1)).toEqual([]);
  });

  it("caps at the input length", () => {
    expect(pickRandom([1, 2], 10, zeroRng)).toHaveLength(2);
  });
});

describe("weightedShuffle", () => {
  const equalWeight = () => 1;

  it("does not mutate the input", () => {
    const input = [1, 2, 3, 4];
    weightedShuffle(input, equalWeight, () => 0.5);
    expect(input).toEqual([1, 2, 3, 4]);
  });

  it("keeps every element", () => {
    expect(
      [...weightedShuffle([1, 2, 3, 4], equalWeight, Math.random)].sort()
    ).toEqual([1, 2, 3, 4]);
  });

  it("orders a heavy item ahead of light ones for a fixed rng", () => {
    // With a constant u, key = u^(1/w) is monotonic in w, so the heaviest
    // league sorts first regardless of input order.
    const items = [
      { id: "light-a", weight: 1 },
      { id: "heavy", weight: 100 },
      { id: "light-b", weight: 2 },
    ];
    const ordered = weightedShuffle(
      items,
      (i) => i.weight,
      () => 0.5
    );
    expect(ordered[0].id).toBe("heavy");
  });

  it("lands a high-weight item in the picked prefix far more often", () => {
    // One elite league among many obscure ones: over many seeds it should be
    // selected (top-N) the large majority of the time.
    const items = [
      { id: "elite", weight: 100 },
      ...Array.from({ length: 24 }, (_, i) => ({
        id: `obscure-${i}`,
        weight: 2,
      })),
    ];
    const PICK = 5;
    const TRIALS = 1000;
    let hits = 0;
    for (let t = 0; t < TRIALS; t++) {
      const rng = mulberry32(t);
      const top = weightedShuffle(items, (i) => i.weight, rng).slice(0, PICK);
      if (top.some((i) => i.id === "elite")) hits++;
    }
    // Uniformly it'd be ~5/25 = 20%; weighting should push it well past 80%.
    expect(hits / TRIALS).toBeGreaterThan(0.8);
  });
});

describe("extractMoneyline", () => {
  function eventOdds(
    bookmakers: OddsApiEventOdds["bookmakers"]
  ): OddsApiEventOdds {
    return {
      id: 1,
      home: "A",
      away: "B",
      date: "",
      status: "pending",
      sport: { name: "", slug: "" },
      league: { name: "", slug: "" },
      bookmakers,
    };
  }

  it("reads home/away from the ML market", () => {
    const odds = eventOdds({
      Bet365: [
        {
          name: "ML",
          updatedAt: "",
          odds: [{ home: "2.10", draw: "3.40", away: "3.20" }],
        },
      ],
    });
    expect(extractMoneyline(odds, ["Bet365"])).toEqual({
      home: 2.1,
      away: 3.2,
    });
  });

  it("falls back to the next bookmaker in priority order", () => {
    const odds = eventOdds({
      Bet365: [
        {
          name: "Totals",
          updatedAt: "",
          odds: [{ over: "1.9", under: "1.9" }],
        },
      ],
      Pinnacle: [
        { name: "ML", updatedAt: "", odds: [{ home: "1.80", away: "2.05" }] },
      ],
    });
    expect(extractMoneyline(odds, ["Bet365", "Pinnacle"])).toEqual({
      home: 1.8,
      away: 2.05,
    });
  });

  it("returns null when no bookmaker has a usable ML line", () => {
    const odds = eventOdds({
      Bet365: [
        {
          name: "Asian Handicap",
          updatedAt: "",
          odds: [{ hdp: -0.5, home: "1.95", away: "1.85" }],
        },
      ],
    });
    expect(extractMoneyline(odds, ["Pinnacle"])).toBeNull();
  });

  it("rejects non-positive or non-numeric odds", () => {
    const odds = eventOdds({
      Bet365: [
        { name: "ML", updatedAt: "", odds: [{ home: "0", away: "abc" }] },
      ],
    });
    expect(extractMoneyline(odds, ["Bet365"])).toBeNull();
  });
});
