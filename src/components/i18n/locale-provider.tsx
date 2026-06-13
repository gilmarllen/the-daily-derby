"use client";

import { createContext, useContext, useMemo } from "react";

import { type Locale } from "@/lib/i18n/config";
import { type Dictionary, getDictionary } from "@/lib/i18n/dictionary";

type LocaleContextValue = {
  locale: Locale;
  dictionary: Dictionary;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * Holds the active locale (resolved on the server from the cookie/Accept-Language
 * header) and exposes its dictionary to client components. Only the locale
 * string crosses the server/client boundary — the dictionary (which contains
 * interpolation functions) is resolved here on the client, so nothing
 * unserializable is passed as a prop.
 */
export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const value = useMemo<LocaleContextValue>(
    () => ({ locale, dictionary: getDictionary(locale) }),
    [locale]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

function useLocaleContext(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocaleContext must be used within a LocaleProvider");
  }
  return ctx;
}

/** The active locale's dictionary, for use in client components. */
export function useDictionary(): Dictionary {
  return useLocaleContext().dictionary;
}

/** The active locale code (e.g. for the language switcher). */
export function useLocale(): Locale {
  return useLocaleContext().locale;
}
