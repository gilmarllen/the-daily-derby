"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { type Theme, resolveDark, setThemeCookie } from "@/lib/theme/config";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (next: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const MEDIA_QUERY = "(prefers-color-scheme: dark)";

/** Toggles the `.dark` class on <html> to match the resolved theme. */
function applyTheme(theme: Theme): void {
  const prefersDark = window.matchMedia(MEDIA_QUERY).matches;
  document.documentElement.classList.toggle(
    "dark",
    resolveDark(theme, prefersDark)
  );
}

/**
 * Holds the active theme (resolved on the server from the `dd_theme` cookie) and
 * lets any descendant change it. The class toggle is purely client-side — unlike
 * the locale, the theme isn't server-rendered content, so there's no router
 * refresh. The no-flash inline script in the root layout sets the initial class
 * before paint; this provider keeps it in sync afterwards.
 */
export function ThemeProvider({
  theme: initialTheme,
  children,
}: {
  theme: Theme;
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);

  const setTheme = useCallback((next: Theme) => {
    setThemeCookie(next);
    setThemeState(next);
    applyTheme(next);
  }, []);

  // When following the OS, re-apply whenever the OS preference flips.
  useEffect(() => {
    if (theme !== "system") return;
    const media = window.matchMedia(MEDIA_QUERY);
    const onChange = () => applyTheme("system");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
