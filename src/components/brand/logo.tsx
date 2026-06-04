"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

/**
 * The Daily Derby crest — a heraldic shield holding a 3D football
 * (truncated-icosahedron, orthographically projected and shaded) under a
 * champion's star. Self-colored; size it via `className`.
 *
 * Artwork is generated geometry — edit gen-ball.mjs, not this file by hand.
 */
export function Logo({
  className,
  title = "The Daily Derby",
}: {
  className?: string;
  title?: string;
}) {
  const id = useId();
  const shield =
    "M14 8 H50 a5 5 0 0 1 5 5 V33 C55 46 46 54 32 59.5 C18 54 9 46 9 33 V13 a5 5 0 0 1 5 -5 Z";
  const shieldInner =
    "M16.5 11 H47.5 a3 3 0 0 1 3 3 V32.6 C50.5 43.4 43 50.2 32 55 C21 50.2 13.5 43.4 13.5 32.6 V14 a3 3 0 0 1 3 -3 Z";

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient
          id={`${id}-shield`}
          x1="32"
          y1="6"
          x2="32"
          y2="60"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#34d399" />
          <stop offset="0.55" stopColor="#10b981" />
          <stop offset="1" stopColor="#047857" />
        </linearGradient>
        <linearGradient
          id={`${id}-gloss`}
          x1="16"
          y1="8"
          x2="46"
          y2="34"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.42" />
          <stop offset="0.6" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-sheen`} cx="0.36" cy="0.3" r="0.5">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="0.7" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-vignette`} cx="0.42" cy="0.4" r="0.62">
          <stop offset="0.62" stopColor="#0b1220" stopOpacity="0" />
          <stop offset="1" stopColor="#0b1220" stopOpacity="0.26" />
        </radialGradient>
        <clipPath id={`${id}-clip`}>
          <circle cx="32" cy="31" r="12.6" />
        </clipPath>
      </defs>

      <path d={shield} fill={`url(#${id}-shield)`} />
      <path d={shield} fill={`url(#${id}-gloss)`} />
      <path
        d={shieldInner}
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.55"
        strokeWidth="1"
      />
      <path d={shield} fill="none" stroke="#065f46" strokeWidth="1.4" />
      <path
        d="M32.00 11.30 L32.68 13.07 L34.57 13.17 L33.09 14.36 L33.59 16.18 L32.00 15.15 L30.41 16.18 L30.91 14.36 L29.43 13.17 L31.32 13.07 Z"
        fill="#fde68a"
      />

      <circle cx="32" cy="31" r="12.6" fill="#eef2f6" />
      <g clipPath={`url(#${id}-clip)`} stroke="#0b1220">
        <path
          d="M33.78 43.06 L28.87 43.06 L27.53 42.40 L31.11 41.73 L36.02 41.73 L37.36 42.40 Z"
          fill="rgb(243,245,248)"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
        <path
          d="M20.71 31.54 L22.65 36.10 L23.30 39.58 L22.02 38.50 L20.09 33.94 L19.44 30.46 Z"
          fill="rgb(241,243,246)"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
        <path
          d="M44.56 31.54 L43.46 36.10 L42.12 35.43 L42.40 30.47 L43.91 28.06 Z"
          fill="rgb(9,13,21)"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
        <path
          d="M37.36 42.40 L36.02 41.73 L38.40 38.25 L42.12 35.43 L43.46 36.10 L41.08 39.58 Z"
          fill="rgb(221,223,226)"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
        <path
          d="M30.22 18.94 L28.71 21.35 L24.20 23.50 L22.92 22.42 L26.64 19.60 Z"
          fill="rgb(9,13,21)"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
        <path
          d="M20.71 31.54 L19.44 30.46 L20.54 25.90 L22.92 22.42 L24.20 23.50 L23.09 28.06 Z"
          fill="rgb(218,220,223)"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
        <path
          d="M38.53 21.35 L41.98 23.50 L43.91 28.06 L42.40 30.47 L38.96 28.31 L37.03 23.75 Z"
          fill="rgb(202,204,207)"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
        <path
          d="M35.13 18.94 L38.53 21.35 L37.03 23.75 L32.11 23.75 L28.71 21.35 L30.22 18.94 Z"
          fill="rgb(202,204,207)"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
        <path
          d="M27.53 42.40 L23.30 39.58 L22.65 36.10 L26.22 35.43 L30.45 38.25 L31.11 41.73 Z"
          fill="rgb(255,255,255)"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
        <path
          d="M34.96 36.10 L38.40 38.25 L36.02 41.73 L31.11 41.73 L30.45 38.25 Z"
          fill="rgb(25,29,37)"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
        <path
          d="M20.71 31.54 L23.09 28.06 L26.50 30.47 L26.22 35.43 L22.65 36.10 Z"
          fill="rgb(24,28,36)"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
        <path
          d="M35.24 31.13 L38.96 28.31 L42.40 30.47 L42.12 35.43 L38.40 38.25 L34.96 36.10 Z"
          fill="rgb(219,221,224)"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
        <path
          d="M28.71 21.35 L32.11 23.75 L31.01 28.31 L26.50 30.47 L23.09 28.06 L24.20 23.50 Z"
          fill="rgb(217,219,222)"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
        <path
          d="M35.24 31.13 L31.01 28.31 L32.11 23.75 L37.03 23.75 L38.96 28.31 Z"
          fill="rgb(12,16,24)"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
        <path
          d="M35.24 31.13 L34.96 36.10 L30.45 38.25 L26.22 35.43 L26.50 30.47 L31.01 28.31 Z"
          fill="rgb(240,242,245)"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
        <circle
          cx="32"
          cy="31"
          r="12.6"
          fill={`url(#${id}-sheen)`}
          stroke="none"
        />
        <circle
          cx="32"
          cy="31"
          r="12.6"
          fill={`url(#${id}-vignette)`}
          stroke="none"
        />
      </g>
      <circle
        cx="32"
        cy="31"
        r="12.6"
        fill="none"
        stroke="#0b1220"
        strokeOpacity="0.6"
        strokeWidth="1"
      />
    </svg>
  );
}
