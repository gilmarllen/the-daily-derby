// Server-side Supabase client for Server Components, Server Actions, and Route
// Handlers. Reads/writes auth cookies via Next's async `cookies()` API.
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import type { Database } from "./types";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // `setAll` was called from a Server Component, where setting
            // cookies is not allowed. This is safe to ignore when the proxy
            // (proxy.ts) is responsible for refreshing the session.
          }
        },
      },
    }
  );
}
