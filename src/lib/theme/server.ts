import "server-only";

import { cookies } from "next/headers";

import { type Theme, THEME_COOKIE, defaultTheme, isTheme } from "./config";

/**
 * Resolves the player's chosen theme for the current request from the `dd_theme`
 * cookie, falling back to "system". When "system", the actual light/dark choice
 * is the OS preference — resolved on the client by the no-flash inline script,
 * since the server can't read `prefers-color-scheme`.
 */
export async function getTheme(): Promise<Theme> {
  const cookieTheme = (await cookies()).get(THEME_COOKIE)?.value;
  if (cookieTheme && isTheme(cookieTheme)) return cookieTheme;
  return defaultTheme;
}
