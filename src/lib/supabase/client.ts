// Browser-side Supabase client. Safe to import from Client Components.
// Uses only the public publishable key (sb_publishable_…) — never the secret key.
import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "./types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
