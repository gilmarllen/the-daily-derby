"use client";

import Link from "next/link";
import { BookOpen, ChevronDown, HelpCircle, LogOut } from "lucide-react";

import { signOut } from "@/app/auth/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuLinkItem,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";

import { useGame } from "./game-provider";
import { useWelcomeDialog } from "./welcome-dialog";

export function UserMenu() {
  const { player } = useGame();
  const { openWelcome } = useWelcomeDialog();
  const initial = (player.name.trim()[0] ?? "?").toUpperCase();

  return (
    <Menu>
      <MenuTrigger
        aria-label="Open menu"
        className="group bg-card ring-foreground/10 hover:bg-muted focus-visible:ring-ring flex cursor-pointer items-center gap-1.5 rounded-full py-1 pr-2 pl-1 ring-1 transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        <Avatar size="sm">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
            {initial}
          </AvatarFallback>
        </Avatar>
        <ChevronDown
          className="text-muted-foreground size-4 transition-transform group-data-[popup-open]:rotate-180"
          aria-hidden
        />
      </MenuTrigger>

      <MenuContent>
        <div className="px-2.5 py-1.5">
          <p className="text-muted-foreground text-xs">Signed in as</p>
          <p className="truncate text-sm font-semibold">{player.name}</p>
        </div>
        <MenuSeparator />
        <MenuItem onClick={openWelcome}>
          <HelpCircle />
          How to play
        </MenuItem>
        <MenuLinkItem render={<Link href="/guide" />}>
          <BookOpen />
          Game guide
        </MenuLinkItem>
        <MenuSeparator />
        <MenuItem
          onClick={() => {
            void signOut();
          }}
          className="text-destructive data-[highlighted]:bg-destructive/10 [&>svg]:text-destructive"
        >
          <LogOut />
          Log out
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}
