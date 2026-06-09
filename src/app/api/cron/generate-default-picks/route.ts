import { NextResponse, type NextRequest } from "next/server";

import { generateDefaultPicks } from "@/lib/game/default-picks";

// Daily "No selection" pick seeding, invoked by Vercel Cron (see vercel.json)
// at 12:00 UTC. Ensures every player has a default pick for the day two UTC days
// out, well before it becomes pickable. Always runs at request time.
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  // Vercel Cron sends `Authorization: Bearer <CRON_SECRET>` when CRON_SECRET is
  // set. Enforce it so the endpoint can't be triggered by anyone.
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const result = await generateDefaultPicks();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("generate-default-picks cron failed:", message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
