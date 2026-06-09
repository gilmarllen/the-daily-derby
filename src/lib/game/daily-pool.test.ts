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
