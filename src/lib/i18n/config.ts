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

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Persists the chosen locale to the browser cookie (~1 year). Client-only. */
export function setLocaleCookie(locale: Locale): void {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;samesite=lax`;
}
