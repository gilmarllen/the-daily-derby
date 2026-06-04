"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Goal, ListChecks, Medal, Trophy, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Pick", icon: Goal },
  { href: "/dashboard/achievements", label: "Achievements", icon: Medal },
  { href: "/dashboard/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/dashboard/past-picks", label: "Past Picks", icon: ListChecks },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-background/60 border-b">
      <ul className="mx-auto flex w-full max-w-5xl gap-1 overflow-x-auto px-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
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
