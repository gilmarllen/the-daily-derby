"use client";

import { Monitor, Moon, Sun } from "lucide-react";

import { useDictionary } from "@/components/i18n/locale-provider";
import { type Theme, themes } from "@/lib/theme/config";
import { cn } from "@/lib/utils";

import { useTheme } from "./theme-provider";

const ICONS: Record<Theme, typeof Monitor> = {
  system: Monitor,
  light: Sun,
  dark: Moon,
};

/** Segmented 3-way theme picker (System / Light / Dark) for the settings modal. */
export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const t = useDictionary().settings;
  const labels: Record<Theme, string> = {
    system: t.themeSystem,
    light: t.themeLight,
    dark: t.themeDark,
  };

  return (
    <div
      role="radiogroup"
      aria-label={t.appearance}
      className="bg-muted/60 inline-flex items-center gap-1 rounded-full p-1"
    >
      {themes.map((code) => {
        const Icon = ICONS[code];
        const active = code === theme;
        return (
          <button
            key={code}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(code)}
            className={cn(
              "focus-visible:ring-ring flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none",
              active
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="size-4" aria-hidden />
            {labels[code]}
          </button>
        );
      })}
    </div>
  );
}
