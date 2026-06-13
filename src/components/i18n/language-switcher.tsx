"use client";

import { useRouter } from "next/navigation";
import { Check, Globe } from "lucide-react";

import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/menu";
import {
  type Locale,
  locales,
  localeNames,
  setLocaleCookie,
} from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

import { useDictionary, useLocale } from "./locale-provider";

/**
 * Lets any visitor (logged in or out) switch language. Writes the choice to the
 * `dd_locale` cookie (~1 year) then refreshes so server components re-render in
 * the new locale and the provider picks up the new dictionary.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const router = useRouter();
  const locale = useLocale();
  const dict = useDictionary();

  function choose(next: Locale) {
    if (next !== locale) {
      setLocaleCookie(next);
      router.refresh();
    }
  }

  return (
    <Menu>
      <MenuTrigger
        aria-label={dict.language.label}
        className={cn(
          "text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-ring flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none",
          className
        )}
      >
        <Globe className="size-4" aria-hidden />
        <span className="uppercase">{locale}</span>
      </MenuTrigger>

      <MenuContent>
        {locales.map((code) => (
          <MenuItem
            key={code}
            onClick={() => choose(code)}
            className={cn(code === locale && "text-foreground font-semibold")}
          >
            <span className="flex-1">{localeNames[code]}</span>
            {code === locale && <Check className="size-4" aria-hidden />}
          </MenuItem>
        ))}
      </MenuContent>
    </Menu>
  );
}
