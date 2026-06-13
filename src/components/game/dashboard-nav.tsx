"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Goal, ListChecks, Medal, Trophy, type LucideIcon } from "lucide-react";

import { useDictionary } from "@/components/i18n/locale-provider";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export function DashboardNav() {
  const pathname = usePathname();
  const t = useDictionary().nav;

  const navItems: NavItem[] = [
    { href: "/dashboard", label: t.pick, icon: Goal },
    { href: "/dashboard/missions", label: t.missions, icon: Medal },
    { href: "/dashboard/leaderboard", label: t.leaderboard, icon: Trophy },
    { href: "/dashboard/past-picks", label: t.pastPicks, icon: ListChecks },
  ];

  return (
    <nav className="bg-background/60 border-b">
      <ul className="mx-auto flex w-full max-w-5xl gap-1 overflow-x-auto px-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === href
              : pathname.startsWith(href);

          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative flex items-center gap-2 px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="size-4" aria-hidden />
                {label}
                <span
                  className={cn(
                    "bg-primary absolute inset-x-2 bottom-0 h-0.5 rounded-full transition-transform duration-200",
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
                  )}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
