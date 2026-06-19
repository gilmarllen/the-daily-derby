"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

// Mobile-only scroll cue pinned to the bottom of the first screen. The previews
// sit far below the fold on a phone, so a bouncing arrow nudges visitors down to
// "Take a peek inside". It fades out once the visitor starts scrolling.
export function ScrollToPreview({ label }: { label: string }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY < 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() =>
        document
          .getElementById("preview")
          ?.scrollIntoView({ behavior: "smooth", block: "start" })
      }
      className={cn(
        "text-foreground ring-foreground/15 fixed bottom-6 left-1/2 z-10 flex size-11 -translate-x-1/2 items-center justify-center rounded-full bg-emerald-500/95 shadow-lg ring-1 transition-opacity duration-300 sm:hidden",
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <ChevronDown className="animate-scroll-cue size-5" aria-hidden />
    </button>
  );
}
