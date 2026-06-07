// SERVER-ONLY admin client. Uses the secret key (sb_secret_…), which bypasses
// Row Level Security. Never import this from a Client Component or any code that
// ships to the browser — the secret key is also rejected with HTTP 401 if used
// from a browser. Use it for trusted server tasks: settling daily picks,
// awarding trophies/achievements, importing fixtures from the odds provider.
import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./types";

export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
