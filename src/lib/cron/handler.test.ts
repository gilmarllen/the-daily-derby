import type { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { isCronAuthorized } from "./handler";

// Minimal stand-in: isCronAuthorized only reads the Authorization header.
function requestWith(authorization?: string): NextRequest {
  return {
    headers: {
      get: (name: string) =>
        name.toLowerCase() === "authorization" ? (authorization ?? null) : null,
    },
  } as unknown as NextRequest;
}

describe("isCronAuthorized", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("is open (always authorized) when CRON_SECRET is unset", () => {
    vi.stubEnv("CRON_SECRET", "");
    expect(isCronAuthorized(requestWith())).toBe(true);
    expect(isCronAuthorized(requestWith("Bearer anything"))).toBe(true);
  });

  it("authorizes a matching bearer token when CRON_SECRET is set", () => {
    vi.stubEnv("CRON_SECRET", "s3cret");
    expect(isCronAuthorized(requestWith("Bearer s3cret"))).toBe(true);
  });

  it("rejects a missing or wrong token when CRON_SECRET is set", () => {
    vi.stubEnv("CRON_SECRET", "s3cret");
    expect(isCronAuthorized(requestWith())).toBe(false);
    expect(isCronAuthorized(requestWith("Bearer wrong"))).toBe(false);
    expect(isCronAuthorized(requestWith("s3cret"))).toBe(false);
  });
});
