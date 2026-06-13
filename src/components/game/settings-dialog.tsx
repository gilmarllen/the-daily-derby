"use client";

import { createContext, useCallback, useContext, useState } from "react";

import { useDictionary } from "@/components/i18n/locale-provider";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

const SettingsDialogContext = createContext<{
  openSettings: () => void;
} | null>(null);

/** Lets any descendant (e.g. the user menu) open the settings modal. */
export function useSettingsDialog() {
  const ctx = useContext(SettingsDialogContext);
  if (!ctx) {
    throw new Error(
      "useSettingsDialog must be used within a SettingsDialogProvider"
    );
  }
  return ctx;
}

export function SettingsDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const t = useDictionary().settings;

  const openSettings = useCallback(() => setOpen(true), []);

  return (
    <SettingsDialogContext.Provider value={{ openSettings }}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="gap-6">
          <div className="flex flex-col gap-1 pr-6">
            <DialogTitle>{t.title}</DialogTitle>
            <DialogDescription>{t.description}</DialogDescription>
          </div>

          <div className="flex flex-col gap-5">
            <Row label={t.language}>
              <LanguageSwitcher className="bg-muted/60 ring-foreground/10 ring-1" />
            </Row>
            <Row label={t.appearance}>
              <ThemeSwitcher />
            </Row>
          </div>
        </DialogContent>
      </Dialog>
    </SettingsDialogContext.Provider>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="text-sm font-semibold">{label}</span>
      {children}
    </div>
  );
}
