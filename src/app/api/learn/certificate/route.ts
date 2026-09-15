import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/learn-server";

export const runtime = "nodejs";

/** Verifies a server-issued certificate token and returns the claim it carries. */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }

  try {
    const claim = verifyToken(body.token);
    if (!claim) return NextResponse.json({ error: "No valid certificate for this course" }, { status: 403 });
    if (typeof body.courseId === "string" && body.courseId !== claim.courseId) {
      return NextResponse.json({ error: "Certificate does not match this course" }, { status: 403 });
    }
    return NextResponse.json({ claim });
  } catch (e) {
    console.error("Certificate verify error:", e);
    return NextResponse.json({ error: "Verification service unavailable" }, { status: 500 });
  }
}
