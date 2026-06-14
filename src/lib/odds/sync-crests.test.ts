import { describe, expect, it } from "vitest";

import { extensionForContentType } from "./sync-helpers";

describe("extensionForContentType", () => {
  it("maps known image types to extensions", () => {
    expect(extensionForContentType("image/png")).toBe("png");
    expect(extensionForContentType("image/jpeg")).toBe("jpg");
    expect(extensionForContentType("image/jpg")).toBe("jpg");
    expect(extensionForContentType("image/svg+xml")).toBe("svg");
    expect(extensionForContentType("image/webp")).toBe("webp");
  });

  it("ignores charset/parameters and casing", () => {
    expect(extensionForContentType("image/PNG; charset=binary")).toBe("png");
    expect(extensionForContentType("  image/svg+xml ")).toBe("svg");
  });

  it("falls back to png for unknown types", () => {
    expect(extensionForContentType("application/octet-stream")).toBe("png");
    expect(extensionForContentType("")).toBe("png");
  });
});
