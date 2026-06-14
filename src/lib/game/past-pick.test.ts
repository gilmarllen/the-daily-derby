import { describe, expect, it } from "vitest";

import { TROPHY_DELTAS } from "@/lib/game/constants";

import { pastPickDays, toPastPick, type PickRow } from "./past-pick";

const base: PickRow = {
  id: "p1",
  match_day: "2026-06-09",
  picked_side: "home",
  cost: 6.66,
  result: "win",
  home_team: "Real Madrid",
  away_team: "Barcelona",
  league: "La Liga",
};

describe("toPastPick", () => {
  it("maps a winning home pick to the home team and +3", () => {
    const out = toPastPick(base);
    expect(out.pick).toBe("Real Madrid");
    expect(out.result).toBe("win");
    expect(out.league).toBe("La Liga");
    expect(out.cost).toBe(6.66);
    expect(out.trophyDelta).toBe(TROPHY_DELTAS.win);
    expect(out.date).toBe("Jun 9");
  });

  it("maps an away pick to the away team", () => {
    expect(toPastPick({ ...base, picked_side: "away" }).pick).toBe("Barcelona");
  });

  it("uses the result's trophy delta for draw and loss", () => {
    expect(toPastPick({ ...base, result: "draw" }).trophyDelta).toBe(
      TROPHY_DELTAS.draw
    );
    expect(toPastPick({ ...base, result: "loss" }).trophyDelta).toBe(
      TROPHY_DELTAS.loss
    );
  });

  it("treats an unsettled team pick as pending with no delta", () => {
    const out = toPastPick({ ...base, result: null });
    expect(out.result).toBe("pending");
    expect(out.trophyDelta).toBe(0);
  });

  it("treats a sat-out (no team) as a skipped day worth -2 with an em-dash league", () => {
    const out = toPastPick({
      ...base,
      picked_side: null,
      home_team: null,
      away_team: null,
      league: null,
      result: "none",
    });
    expect(out.pick).toBeNull();
    expect(out.league).toBe("—");
    expect(out.result).toBe("none");
    expect(out.trophyDelta).toBe(TROPHY_DELTAS.none);
  });

  it("coerces a string cost to a number", () => {
    expect(toPastPick({ ...base, cost: "6.66" }).cost).toBe(6.66);
  });
});

describe("pastPickDays", () => {
  const now = new Date("2026-06-14T10:00:00Z"); // today = 2026-06-14

  it("returns [] when the player has no history", () => {
    expect(pastPickDays(now, null, 30)).toEqual([]);
  });

  it("covers first day through yesterday, newest first", () => {
    expect(pastPickDays(now, "2026-06-12", 30)).toEqual([
      "2026-06-13",
      "2026-06-12",
    ]);
  });

  it("caps at the limit of most-recent days", () => {
    expect(pastPickDays(now, "2026-01-01", 3)).toEqual([
      "2026-06-13",
      "2026-06-12",
      "2026-06-11",
    ]);
  });

  it("returns [] when the first day is today or later (no passed days)", () => {
    expect(pastPickDays(now, "2026-06-14", 30)).toEqual([]);
    expect(pastPickDays(now, "2026-06-20", 30)).toEqual([]);
  });

  it("yields a single day when the first pick was yesterday", () => {
    expect(pastPickDays(now, "2026-06-13", 30)).toEqual(["2026-06-13"]);
  });
});
