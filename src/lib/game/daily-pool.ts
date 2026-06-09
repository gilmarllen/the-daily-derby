// Deterministic per-player daily match selection. A player should see the same
// random subset all day (stable across reloads), while different players get
// different subsets. We achieve this without persistence by seeding a PRNG with
// the player id + day, so the pick is a pure function of (pool, seed).

/** FNV-1a hash of a string → uint32, used to seed the PRNG. */
export function hashSeed(input: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32 — a small, fast, deterministic PRNG returning [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Pick up to `count` items from `items`, shuffled deterministically by `seed`.
 * Same (items, seed) always yields the same ordered result. Does not mutate
 * `items`. Note: the result depends on the input order, so callers should pass a
 * stably-ordered pool.
 */
export function pickDaily<T>(
  items: readonly T[],
  seed: string,
  count: number
): T[] {
  if (count <= 0) return [];
  const rng = mulberry32(hashSeed(seed));
  const out = [...items];
  // Fisher–Yates.
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out.slice(0, count);
}
