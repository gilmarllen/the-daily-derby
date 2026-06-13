import "server-only";

import { cookies, headers } from "next/headers";

import { type Locale, LOCALE_COOKIE, isLocale } from "./config";
import { getDictionary } from "./dictionary";
import { matchLocale } from "./match-locale";

/**
 * Resolves the active locale for the current request: the `dd_locale` cookie if
 * the player has chosen one, otherwise the best match from the browser's
 * `Accept-Language` header, falling back to English.
 */
export async function getLocale(): Promise<Locale> {
  const cookieLocale = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (cookieLocale && isLocale(cookieLocale)) return cookieLocale;

  const acceptLanguage = (await headers()).get("accept-language");
  return matchLocale(acceptLanguage);
}

/** Convenience: the resolved locale's dictionary for server components. */
export async function getServerDictionary() {
  return getDictionary(await getLocale());
}
