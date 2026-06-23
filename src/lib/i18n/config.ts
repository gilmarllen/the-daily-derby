// i18n configuration. Client-safe: no server-only imports so both the server
// locale resolver and the client provider/switcher can share these constants.

export const locales = ["en", "es", "pt"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Cookie that persists the player's chosen locale in the browser (~1 year). */
export const LOCALE_COOKIE = "dd_locale";

/** Native display names for the language switcher. */
export const localeNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
  pt: "Português",
};

/**
 * Open Graph locale codes (`og:locale` / `og:locale:alternate`) for each app
 * locale. Underscore-separated language_TERRITORY per the OG spec; the
 * territories match the flavour each dictionary is written in (Spain Spanish,
 * Brazilian Portuguese).
 */
export const ogLocales: Record<Locale, string> = {
  en: "en_US",
  es: "es_ES",
  pt: "pt_BR",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Persists the chosen locale to the browser cookie (~1 year). Client-only. */
export function setLocaleCookie(locale: Locale): void {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;samesite=lax`;
}
