// Server-side Supabase client for Server Components, Server Actions, and Route
// Handlers. Reads/writes auth cookies via Next's async `cookies()` API.
import { cookies, headers } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import type { Database } from "./types";

export async function createClient() {
  const cookieStore = await cookies();

  // Forward the end-user's real IP so Supabase Auth rate-limits per user, not
  // per Vercel server IP (which all server-action auth calls would otherwise
  // share). The first entry in `x-forwarded-for` is the client; Vercel sets
  // this header and blocks direct origin access, so it can be trusted here.
  // Requires "IP address forwarding" enabled in the Supabase project settings.
  const forwardedFor = (await headers()).get("x-forwarded-for");
  const clientIp = forwardedFor?.split(",")[0]?.trim();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      ...(clientIp && {
        global: { headers: { "Sb-Forwarded-For": clientIp } },
      }),
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
