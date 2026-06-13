// Locale -> dictionary mapping. Client-safe (no server-only) so the client
// provider can resolve the dictionary from a locale string too. Dictionaries are
// small, so they're imported statically rather than dynamically.

import en, { type Dictionary } from "./dictionaries/en";
import es from "./dictionaries/es";
import pt from "./dictionaries/pt";
import { type Locale, defaultLocale } from "./config";

const dictionaries: Record<Locale, Dictionary> = { en, es, pt };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

export type { Dictionary };
