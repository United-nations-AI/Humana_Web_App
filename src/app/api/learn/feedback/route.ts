import { NextRequest, NextResponse } from "next/server";
import { validateFeedback } from "@/lib/learn-server";

export const runtime = "nodejs";

/** Post-course feedback form. Validated server-side; stored only when LEARN_DB_TRACKING=on. */
export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
  const v = validateFeedback(body);
  if ("error" in v) return NextResponse.json({ error: v.error }, { status: 400 });
  // NOTE: feedback storage is intentionally NOT connected. To enable later, import
  // `recordFeedback` from "@/lib/learn-server", call it here, run migration 004,
  // and set LEARN_DB_TRACKING=on.
  return NextResponse.json({ ok: true, stored: "local-only" });
}
