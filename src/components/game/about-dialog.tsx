"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useState } from "react";
import { ChevronRight, FileText, Shield } from "lucide-react";

import { useDictionary } from "@/components/i18n/locale-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

const AboutDialogContext = createContext<{
  openAbout: () => void;
} | null>(null);

/** Lets any descendant (e.g. the user menu) open the About modal. */
export function useAboutDialog() {
  const ctx = useContext(AboutDialogContext);
  if (!ctx) {
    throw new Error(
      "useAboutDialog must be used within an AboutDialogProvider"
    );
  }
  return ctx;
}

export function AboutDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const t = useDictionary().about;

  const openAbout = useCallback(() => setOpen(true), []);

  return (
    <AboutDialogContext.Provider value={{ openAbout }}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="gap-6">
          <div className="flex flex-col gap-1 pr-6">
            <DialogTitle>{t.title}</DialogTitle>
            <DialogDescription>{t.description}</DialogDescription>
          </div>

          <div className="flex flex-col gap-2">
            <LegalLink
              href="/terms"
              icon={<FileText className="size-4" aria-hidden />}
              label={t.terms}
            />
            <LegalLink
              href="/privacy"
              icon={<Shield className="size-4" aria-hidden />}
              label={t.privacy}
            />
          </div>
        </DialogContent>
      </Dialog>
    </AboutDialogContext.Provider>
  );
}

function LegalLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-card ring-foreground/10 hover:bg-muted focus-visible:ring-ring flex items-center gap-3 rounded-xl p-3.5 ring-1 transition-colors focus-visible:ring-2 focus-visible:outline-none"
    >
      <span className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
        {icon}
      </span>
      <span className="flex-1 text-sm font-medium">{label}</span>
      <ChevronRight className="text-muted-foreground size-4" aria-hidden />
    </Link>
  );
}
