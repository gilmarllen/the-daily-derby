import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

// Crawlers may index the public marketing/auth pages; the per-player dashboard,
// onboarding, and API/cron routes are private or machine-only, so they're
// disallowed.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/onboarding", "/api", "/auth"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
