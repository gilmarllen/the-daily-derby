import { describe, expect, it } from "vitest";

import { hashSeed, mulberry32, pickDaily } from "./daily-pool";

const pool = Array.from({ length: 50 }, (_, i) => i + 1);

describe("hashSeed", () => {
  it("is deterministic", () => {
    expect(hashSeed("user-a:2026-06-10")).toBe(hashSeed("user-a:2026-06-10"));
  });

  it("differs for different inputs", () => {
    expect(hashSeed("user-a:2026-06-10")).not.toBe(
      hashSeed("user-b:2026-06-10")
    );
  });

  it("returns a uint32", () => {
    const h = hashSeed("anything");
    expect(Number.isInteger(h)).toBe(true);
    expect(h).toBeGreaterThanOrEqual(0);
    expect(h).toBeLessThanOrEqual(0xffffffff);
  });
});

describe("mulberry32", () => {
  it("produces the same sequence for the same seed", () => {
    const a = mulberry32(123);
    const b = mulberry32(123);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("stays within [0, 1)", () => {
    const rng = mulberry32(42);
    for (let i = 0; i < 100; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("pickDaily", () => {
  it("is stable for the same pool + seed (reload-safe)", () => {
    const seed = "user-a:2026-06-10";
    expect(pickDaily(pool, seed, 5)).toEqual(pickDaily(pool, seed, 5));
  });

  it("gives different players different selections", () => {
    const day = "2026-06-10";
    const a = pickDaily(pool, `user-a:${day}`, 5);
    const b = pickDaily(pool, `user-b:${day}`, 5);
    expect(a).not.toEqual(b);
  });

  it("gives the same player a different selection on a different day", () => {
    const a = pickDaily(pool, "user-a:2026-06-10", 5);
    const b = pickDaily(pool, "user-a:2026-06-11", 5);
    expect(a).not.toEqual(b);
  });

  it("returns exactly `count` items when the pool is large enough", () => {
    expect(pickDaily(pool, "seed", 5)).toHaveLength(5);
  });

  it("only returns items from the pool, with no duplicates", () => {
    const picked = pickDaily(pool, "seed", 5);
    expect(new Set(picked).size).toBe(picked.length);
    for (const item of picked) expect(pool).toContain(item);
  });

  it("returns the whole pool when count exceeds its size", () => {
    expect(pickDaily([1, 2, 3], "seed", 10).sort((x, y) => x - y)).toEqual([
      1, 2, 3,
    ]);
  });

  it("returns empty for count <= 0", () => {
    expect(pickDaily(pool, "seed", 0)).toEqual([]);
    expect(pickDaily(pool, "seed", -1)).toEqual([]);
  });

  it("does not mutate the input pool", () => {
    const input = [1, 2, 3, 4, 5];
    pickDaily(input, "seed", 3);
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("pickDaily (league-weighted)", () => {
  // One heavy league among many light ones, mirroring the daily pool.
  const weighted = [
    { id: "marquee", weight: 75 },
    ...Array.from({ length: 24 }, (_, i) => ({ id: `minor-${i}`, weight: 6 })),
  ];
  const weightOf = (m: { weight: number }) => m.weight;

  it("stays stable for the same seed (reload-safe)", () => {
    const seed = "user-a:2026-06-13";
    expect(pickDaily(weighted, seed, 5, weightOf)).toEqual(
      pickDaily(weighted, seed, 5, weightOf)
    );
  });

  it("does not mutate the input pool", () => {
    const input = [...weighted];
    pickDaily(input, "seed", 5, weightOf);
    expect(input).toEqual(weighted);
  });

  it("returns `count` distinct items from the pool", () => {
    const picked = pickDaily(weighted, "seed", 5, weightOf);
    expect(picked).toHaveLength(5);
    expect(new Set(picked).size).toBe(5);
    for (const m of picked) expect(weighted).toContain(m);
  });

  it("draws the heavy league far more often than a uniform draw would", () => {
    let hits = 0;
    const TRIALS = 2000;
    for (let t = 0; t < TRIALS; t++) {
      const picked = pickDaily(weighted, `user-${t}:day`, 5, weightOf);
      if (picked.some((m) => m.id === "marquee")) hits++;
    }
    // Uniform would be ~5/25 = 20%; weighting should push it well past 50%.
    expect(hits / TRIALS).toBeGreaterThan(0.5);
  });
});
