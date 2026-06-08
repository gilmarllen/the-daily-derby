import { NextResponse, type NextRequest } from "next/server";

import { syncMatches } from "@/lib/odds/sync";

// Daily fixture sync, invoked by Vercel Cron (see vercel.json). Pulls the match
// pool for the UTC day two days out. Always runs at request time.
export const dynamic = "force-dynamic";
// Fetching + odds batching can take a while; give it room (Vercel caps this by
// plan — Hobby allows up to 60s).
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  // Vercel Cron sends `Authorization: Bearer <CRON_SECRET>` when CRON_SECRET is
  // set. Enforce it in that case so the endpoint can't be triggered by anyone.
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const result = await syncMatches();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("sync-matches cron failed:", message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
