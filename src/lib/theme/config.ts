// Theme configuration. Client-safe: no server-only imports so both the server
// resolver and the client provider/switcher (and the no-flash inline script)
// can share these constants. Mirrors the i18n config pattern.

export const themes = ["system", "light", "dark"] as const;

export type Theme = (typeof themes)[number];

export const defaultTheme: Theme = "system";

/** Cookie that persists the player's chosen theme in the browser (~1 year). */
export const THEME_COOKIE = "dd_theme";

export function isTheme(value: string): value is Theme {
  return (themes as readonly string[]).includes(value);
}

/** Persists the chosen theme to the browser cookie (~1 year). Client-only. */
export function setThemeCookie(theme: Theme): void {
  document.cookie = `${THEME_COOKIE}=${theme};path=/;max-age=31536000;samesite=lax`;
}

/**
 * Whether the dark palette should apply. "system" defers to the OS preference,
 * which is only known on the client — the server passes `prefersDark = false`
 * and the no-flash inline script corrects it before paint.
 */
export function resolveDark(theme: Theme, prefersDark: boolean): boolean {
  if (theme === "dark") return true;
  if (theme === "light") return false;
  return prefersDark;
}
