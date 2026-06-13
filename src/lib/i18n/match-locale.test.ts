import { describe, expect, it } from "vitest";

import { matchLocale } from "./match-locale";

describe("matchLocale", () => {
  it("matches a supported language by its two-letter prefix", () => {
    expect(matchLocale("es-ES,es;q=0.9,en;q=0.8")).toBe("es");
    expect(matchLocale("pt-BR,pt;q=0.9")).toBe("pt");
    expect(matchLocale("en-US")).toBe("en");
  });

  it("honours quality weights when picking the best match", () => {
    // English is supported but Portuguese has the higher q.
    expect(matchLocale("en;q=0.5,pt;q=0.9")).toBe("pt");
  });

  it("falls back to English for unsupported or empty headers", () => {
    expect(matchLocale("fr-FR,fr;q=0.9")).toBe("en");
    expect(matchLocale("")).toBe("en");
    expect(matchLocale(null)).toBe("en");
    expect(matchLocale(undefined)).toBe("en");
  });
});
