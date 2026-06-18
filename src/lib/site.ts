/**
 * Canonical, absolute site URL (no trailing slash). Single source of truth for
 * anywhere an absolute URL is needed — OG/Twitter metadata, sitemap, canonical
 * links, etc. Override per environment with NEXT_PUBLIC_SITE_URL; falls back to
 * the production domain.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://thedailyderby.win";
