import { describe, expect, it } from "vitest";

import { pickableDay } from "./day";

describe("pickableDay", () => {
  it("is the next UTC day (players pick a day ahead)", () => {
    expect(pickableDay(new Date("2026-06-12T10:00:00Z"))).toBe("2026-06-13");
  });

  it("delimits the day by UTC midnight, not local time", () => {
    // Late on the 12th UTC is still the 12th -> +1 = the 13th.
    expect(pickableDay(new Date("2026-06-12T23:30:00Z"))).toBe("2026-06-13");
  });

  it("rolls over month boundaries", () => {
    expect(pickableDay(new Date("2026-06-30T12:00:00Z"))).toBe("2026-07-01");
  });
});
