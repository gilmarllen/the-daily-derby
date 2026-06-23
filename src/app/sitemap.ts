import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

// Public, crawlable routes only — the dashboard and API/cron routes are
// auth-gated or machine-only and are kept out of the sitemap (and blocked in
// robots.ts). Locale is negotiated per request on a single URL, so each path
// appears once rather than per language.
const PUBLIC_PATHS = [
  "/",
  "/guide",
  "/login",
  "/signup",
  "/forgot-password",
  "/privacy",
  "/terms",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    changeFrequency: path === "/" ? "daily" : "monthly",
    priority: path === "/" ? 1 : 0.6,
  }));
}
