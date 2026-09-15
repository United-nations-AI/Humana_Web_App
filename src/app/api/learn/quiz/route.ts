import { NextRequest, NextResponse } from "next/server";
import { gradeSubmission } from "@/lib/learn-server";

export const runtime = "nodejs";

/** Grades a questionnaire server-side. Answer keys never leave the server. */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }

  try {
    const r = gradeSubmission({
      courseId: body.courseId, name: body.name, answers: body.answers, completedLessons: body.completedLessons,
    });
    if (!r.ok) return NextResponse.json({ error: r.error }, { status: r.status });
    return NextResponse.json(r);
  } catch (e) {
    console.error("Quiz grading error:", e);
    return NextResponse.json({ error: "Grading service unavailable" }, { status: 500 });
  }
}
