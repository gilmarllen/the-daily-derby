// Pure Accept-Language matcher, kept dependency-free and separate from
// `server.ts` so it can be unit-tested without importing `next/headers`.

import { type Locale, defaultLocale, isLocale } from "./config";

/**
 * Picks the first supported locale from an `Accept-Language` header, comparing
 * on the two-letter language prefix (so `pt-BR` matches `pt`). Falls back to the
 * default locale (English) when nothing matches or the header is empty.
 */
export function matchLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return defaultLocale;

  const ordered = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      const quality = q ? Number.parseFloat(q.slice(2)) : 1;
      return { prefix: tag.trim().toLowerCase().split("-")[0], quality };
    })
    .filter((entry) => entry.prefix && !Number.isNaN(entry.quality))
    .sort((a, b) => b.quality - a.quality);

  for (const { prefix } of ordered) {
    if (isLocale(prefix)) return prefix;
  }

  return defaultLocale;
}
