import { describe, expect, it } from "vitest";

import { TROPHY_DELTAS } from "@/lib/game/constants";

import { toPastPick, type PickRow } from "./past-pick";

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
