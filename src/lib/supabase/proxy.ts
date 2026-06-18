// Session-refresh helper used by the root `proxy.ts` (Next 16's renamed
// middleware). It refreshes the Supabase auth token on each request and writes
// the rotated cookies onto the outgoing response so Server Components always
// see a fresh session.
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

import type { Database } from "./types";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Forward the real client IP so the per-request token refresh is rate-limited
  // per user, not per Vercel server IP. See the note in server.ts.
  const clientIp = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      ...(clientIp && {
        global: { headers: { "Sb-Forwarded-For": clientIp } },
      }),
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  // IMPORTANT: do not run code between createServerClient and getUser(). A
  // simple mistake could make it very hard to debug random logout issues.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Gate the dashboard: unauthenticated users are sent to the home page.
  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return response;
}
