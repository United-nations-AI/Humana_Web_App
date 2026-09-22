import { NextRequest, NextResponse } from "next/server";
import { getLearnStats, isAdminAuthorised } from "@/lib/learn-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Admin-only: learning platform statistics. Requires `Authorization: Bearer <LEARN_ADMIN_KEY>`. */
export async function GET(req: NextRequest) {
  if (!isAdminAuthorised(req.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  try {
    return NextResponse.json(await getLearnStats(), { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    const hint = /learn_assessments|learn_course_stats|does not exist|schema cache/i.test(msg)
      ? "The learn_assessments table is missing. Run supabase/migrations/003_learn_assessments.sql in the Supabase SQL editor."
      : msg;
    return NextResponse.json({ error: hint }, { status: 500 });
  }
}
