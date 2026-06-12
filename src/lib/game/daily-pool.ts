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
 * Pick up to `count` items from `items`, drawn deterministically by `seed`.
 * Same (items, seed) always yields the same ordered result. Does not mutate
 * `items`. The result depends on the input order, so callers should pass a
 * stably-ordered pool.
 *
 * With `weightOf`, the draw is league-weighted: items with a higher weight are
 * likelier to be picked, while the result stays a pure function of the seed (so
 * a player still sees the same set all day). Without it, the draw is uniform.
 */
export function pickDaily<T>(
  items: readonly T[],
  seed: string,
  count: number,
  weightOf?: (item: T) => number
): T[] {
  if (count <= 0) return [];
  const rng = mulberry32(hashSeed(seed));

  if (!weightOf) {
    // Uniform deterministic shuffle (Fisher–Yates), then take `count`.
    const out = [...items];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out.slice(0, count);
  }

  // Weighted deterministic draw (Efraimidis–Spirakis A-Res): order by a random
  // key `u^(1/w)` descending and take the top `count`. The rng is consumed in
  // input order, so the pick is reproducible for the seed. A tiny epsilon floor
  // keeps a zero/negative weight merely unlikely, never NaN or excluded.
  const EPSILON = 1e-9;
  return items
    .map((item) => {
      const weight = Math.max(weightOf(item), EPSILON);
      return { item, key: rng() ** (1 / weight) };
    })
    .sort((a, b) => b.key - a.key)
    .slice(0, count)
    .map((entry) => entry.item);
}
