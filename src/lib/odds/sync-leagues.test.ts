import { beforeEach, describe, expect, it, vi } from "vitest";

import { syncLeagues } from "./sync";
import type { OddsApiLeague } from "./types";

const fetchLeagues = vi.hoisted(() => vi.fn());

vi.mock("server-only", () => ({}));

vi.mock("./client", () => ({
  fetchLeagues,
  // Unused by syncLeagues but imported by the module under test.
  fetchEvents: vi.fn(),
  fetchOddsMulti: vi.fn(),
  ODDS_MULTI_BATCH_SIZE: 10,
}));

type UpsertCall = { rows: unknown; options: unknown };

/** Minimal fake of the Supabase client surface syncLeagues touches. */
function fakeClient(calls: UpsertCall[]) {
  return {
    from() {
      return {
        upsert(rows: unknown, options: unknown) {
          calls.push({ rows, options });
          return {
            select: () =>
              Promise.resolve({
                data: (rows as unknown[]).map((_, i) => ({ id: `id-${i}` })),
                error: null,
              }),
          };
        },
      };
    },
  };
}

describe("syncLeagues", () => {
  beforeEach(() => {
    fetchLeagues.mockReset();
  });

  it("upserts slug+name on slug, leaving weight out so it is preserved", async () => {
    const leagues: OddsApiLeague[] = [
      {
        name: "England - Premier League",
        slug: "england-premier-league",
        eventsCount: 10,
      },
      { name: "Spain - La Liga", slug: "spain-la-liga", eventsCount: 8 },
    ];
    fetchLeagues.mockResolvedValue(leagues);
    const calls: UpsertCall[] = [];

    const result = await syncLeagues({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      client: fakeClient(calls) as any,
    });

    expect(result).toEqual({ fetched: 2, upserted: 2 });
    expect(calls).toHaveLength(1);
    expect(calls[0].rows).toEqual([
      { slug: "england-premier-league", name: "England - Premier League" },
      { slug: "spain-la-liga", name: "Spain - La Liga" },
    ]);
    // No `weight` in the payload -> seeded weights survive the name refresh.
    for (const row of calls[0].rows as Record<string, unknown>[]) {
      expect(row).not.toHaveProperty("weight");
    }
    expect(calls[0].options).toEqual({ onConflict: "slug" });
  });

  it("skips the upsert when the API returns no leagues", async () => {
    fetchLeagues.mockResolvedValue([]);
    const calls: UpsertCall[] = [];

    const result = await syncLeagues({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      client: fakeClient(calls) as any,
    });

    expect(result).toEqual({ fetched: 0, upserted: 0 });
    expect(calls).toHaveLength(0);
  });
});
