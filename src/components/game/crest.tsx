"use client";

import { Shield } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

/**
 * A team/league crest. Renders the image at `url`; falls back to a neutral
 * Shield icon when there's no url yet or the image fails to load (so half-filled
 * catalogs still look clean). Plain <img> on purpose — crest urls are arbitrary
 * hosts, which next/image would require per-host `remotePatterns` for.
 */
export function Crest({
  url,
  alt,
  color,
  className,
}: {
  url?: string | null;
  alt: string;
  /** Optional tint for the fallback icon (the team/league primary colour). */
  color?: string | null;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = url && !failed;

  return (
    <span
      className={cn(
        "inline-flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full",
        className
      )}
      aria-hidden
    >
      {showImage ? (
        // Arbitrary crest hosts; next/image would need per-host remotePatterns.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={alt}
          loading="lazy"
          className="size-full object-contain"
          onError={() => setFailed(true)}
        />
      ) : (
        <Shield
          className="size-[80%]"
          style={color ? { color } : undefined}
          aria-hidden
        />
      )}
    </span>
  );
}
