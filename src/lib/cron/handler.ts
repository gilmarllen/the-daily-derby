import { NextResponse, type NextRequest } from "next/server";

// Shared plumbing for cron route handlers: bearer-token auth and uniform
// success/error JSON. Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`
// when CRON_SECRET is set; when it's unset (local dev) the route is open.

export function isCronAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

/**
 * Builds a `GET` handler for a cron job: guards with {@link isCronAuthorized},
 * runs `task`, and returns `{ ok: true, ...result }` or `{ ok: false, error }`
 * with a 500. `name` is used only in the server-side error log.
 *
 * Route segment config (`dynamic`, `maxDuration`) still lives in each route file,
 * since Next reads those as static module exports.
 */
export function createCronRoute<T extends object>(
  name: string,
  task: () => Promise<T>
) {
  return async function GET(request: NextRequest) {
    if (!isCronAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const result = await task();
      return NextResponse.json({ ok: true, ...result });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error(`${name} cron failed:`, message);
      return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }
  };
}
