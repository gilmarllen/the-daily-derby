import { describe, expect, it } from "vitest";

import { formatCountdown, msUntilNextUtcReset } from "./daily-reset";

describe("msUntilNextUtcReset", () => {
  it("is a full day at exactly 00:00 UTC", () => {
    const ms = msUntilNextUtcReset(new Date("2026-06-10T00:00:00Z"));
    expect(ms).toBe(24 * 60 * 60 * 1000);
  });

  it("is one hour at 23:00 UTC", () => {
    const ms = msUntilNextUtcReset(new Date("2026-06-10T23:00:00Z"));
    expect(ms).toBe(60 * 60 * 1000);
  });

  it("counts to the next UTC midnight, not local", () => {
    const ms = msUntilNextUtcReset(new Date("2026-06-10T23:59:59Z"));
    expect(ms).toBe(1000);
  });
});

describe("formatCountdown", () => {
  it("formats hours, minutes, seconds with zero-padding", () => {
    expect(formatCountdown(3_661_000)).toBe("01:01:01");
  });

  it("renders a full day", () => {
    expect(formatCountdown(24 * 60 * 60 * 1000)).toBe("24:00:00");
  });

  it("clamps negatives to zero", () => {
    expect(formatCountdown(-5000)).toBe("00:00:00");
  });

  it("floors partial seconds", () => {
    expect(formatCountdown(1999)).toBe("00:00:01");
  });
});
