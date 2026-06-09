import { describe, expect, it } from "vitest";

import { utcDateString, utcDayStart } from "./time";

describe("utcDayStart", () => {
  it("returns the UTC midnight of the same day at 00:00", () => {
    expect(utcDayStart(new Date("2026-06-10T13:45:00Z")).toISOString()).toBe(
      "2026-06-10T00:00:00.000Z"
    );
  });

  it("adds days in UTC", () => {
    expect(utcDayStart(new Date("2026-06-10T13:45:00Z"), 2).toISOString()).toBe(
      "2026-06-12T00:00:00.000Z"
    );
  });

  it("rolls over month boundaries", () => {
    expect(utcDayStart(new Date("2026-06-30T23:59:59Z"), 1).toISOString()).toBe(
      "2026-07-01T00:00:00.000Z"
    );
  });

  it("delimits by UTC, not local time", () => {
    // Late-evening UTC stays on the same UTC day.
    expect(utcDayStart(new Date("2026-06-10T23:30:00Z")).toISOString()).toBe(
      "2026-06-10T00:00:00.000Z"
    );
  });
});

describe("utcDateString", () => {
  it("formats the UTC date", () => {
    expect(utcDateString(new Date("2026-06-10T13:45:00Z"))).toBe("2026-06-10");
  });

  it("offsets by days", () => {
    expect(utcDateString(new Date("2026-06-10T13:45:00Z"), 1)).toBe(
      "2026-06-11"
    );
  });
});
