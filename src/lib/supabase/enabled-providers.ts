import "server-only";

import {
  ALL_PROVIDERS,
  SUPABASE_PROVIDER_ID,
  type OAuthProvider,
} from "@/lib/supabase/oauth-providers";

// Which social-login providers are turned on in Supabase. We don't hardcode
// this — we ask GoTrue's public `/auth/v1/settings` endpoint, which reports an
// `external` map of provider → enabled. That way the buttons shown on the auth
// screens always match what's actually configured in the project.

type SettingsResponse = { external?: Record<string, boolean> };

export async function getEnabledProviders(): Promise<OAuthProvider[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return [];

  try {
    const res = await fetch(`${url}/auth/v1/settings`, {
      headers: { apikey: key },
      // Provider config changes rarely; cache for an hour.
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];

    const { external = {} } = (await res.json()) as SettingsResponse;
    return ALL_PROVIDERS.filter((p) => external[SUPABASE_PROVIDER_ID[p]]);
  } catch {
    // Network hiccup — fall back to email/password only rather than erroring
    // the whole auth page.
    return [];
  }
}
