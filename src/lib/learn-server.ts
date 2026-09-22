/* ────────────────────────────────────────────────────────────────────────────
   SERVER-ONLY learning helpers. Never import this from a client component.
   - Holds the quiz answer keys (kept off the client bundle).
   - Grades submissions and issues HMAC-signed certificate tokens.
   ──────────────────────────────────────────────────────────────────────────── */
import { createHmac, timingSafeEqual } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { CertificateClaim } from "@/types/learn";
import { getCourse, allLessons } from "./courses";

/** courseId → questionId → index of the correct option */
export const QUIZ_ANSWERS: Record<string, Record<string, number>> = {
  "foundations-of-human-rights": {
    q01: 1,
    q02: 2,
    q03: 1,
    q04: 3,
    q05: 2,
    q06: 0,
    q07: 0,
    q08: 1,
    q09: 2,
    q10: 1,
    q11: 0,
    q12: 0,
    q13: 0,
    q14: 0,
    q15: 1,
    q16: 0,
    q17: 0,
    q18: 0,
    q19: 0,
    q20: 0,
    q21: 0,
    q22: 0,
    q23: 0,
    q24: 0,
    q25: 0,
    q26: 0,
    q27: 0,
    q28: 0,
    q29: 0,
    q30: 0,
  },
};

function secret(): string {
  const s = process.env.LEARN_CERT_SECRET;
  if (!s || s.length < 16) {
    throw new Error("LEARN_CERT_SECRET is not configured (set a random string of at least 16 characters in .env.local)");
  }
  return s;
}

const b64url = (s: string) => Buffer.from(s, "utf8").toString("base64url");
const sign   = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url");

export function issueToken(claim: CertificateClaim): string {
  const payload = b64url(JSON.stringify(claim));
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token: unknown): CertificateClaim | null {
  if (typeof token !== "string") return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  const a = Buffer.from(sig), b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const claim = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as CertificateClaim;
    if (!getCourse(claim.courseId)) return null;
    if (typeof claim.name !== "string" || typeof claim.score !== "number") return null;
    return claim;
  } catch { return null; }
}

export type ResultBand = "pass" | "retake" | "review";

export interface GradeResult {
  ok: true;
  total: number;
  correct: number;
  score: number;
  passed: boolean;
  band: ResultBand;
  /** Correct option per question — revealed only after a full submission has been graded. */
  key: Record<string, number>;
  token?: string;
  claim?: CertificateClaim;
}

/** Three-band scoring: pass ≥ passMark; "retake" ≥ 60%; otherwise "review" the course content. */
export function bandFor(score: number, passMark: number): ResultBand {
  if (score >= passMark) return "pass";
  if (score >= 0.6) return "retake";
  return "review";
}

export function gradeSubmission(input: {
  courseId: unknown; name: unknown; answers: unknown; completedLessons: unknown;
}): GradeResult | { ok: false; status: number; error: string } {
  const course = typeof input.courseId === "string" ? getCourse(input.courseId) : undefined;
  if (!course) return { ok: false, status: 404, error: "Course not found" };

  const key = QUIZ_ANSWERS[course.id] ?? {};
  if (course.quiz.length === 0 || Object.keys(key).length !== course.quiz.length) {
    return { ok: false, status: 409, error: "The questionnaire for this course is not available yet" };
  }

  const name = typeof input.name === "string" ? input.name.trim().replace(/\s+/g, " ") : "";
  if (name.length < 2 || name.length > 60) return { ok: false, status: 400, error: "A valid learner name is required" };

  // All lessons must be marked complete before grading (defence in depth; the client also gates this).
  const done = Array.isArray(input.completedLessons) ? new Set(input.completedLessons as string[]) : new Set<string>();
  const missing = allLessons(course).filter(l => !done.has(l.id));
  if (missing.length) return { ok: false, status: 403, error: "Complete every lesson before taking the questionnaire" };

  const answers = (input.answers && typeof input.answers === "object") ? input.answers as Record<string, unknown> : {};
  let correct = 0;
  for (const q of course.quiz) {
    const a = answers[q.id];
    if (typeof a !== "number") return { ok: false, status: 400, error: "Answer every question before submitting" };
    if (a === key[q.id]) correct++;
  }

  const total  = course.quiz.length;
  const score  = correct / total;
  const passed = score >= course.passMark;
  const result: GradeResult = { ok: true, total, correct, score, passed, band: bandFor(score, course.passMark), key: { ...key } };

  if (passed) {
    const claim: CertificateClaim = {
      courseId: course.id, name, score,
      issuedAt: Date.now(),
      certificateId: `HAI-${course.id.slice(0, 3).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
    };
    result.claim = claim;
    result.token = issueToken(claim);
  }
  return result;
}

/* ── Assessment tracking (Supabase, service role — never exposed to the client) ──
   NOT CONNECTED: nothing in the request paths calls recordAssessment / recordFeedback yet.
   The functions, migrations 003/004 and the /admin/learn dashboard are kept ready for later. */

/** Master switch for writing learning data to Supabase. Set LEARN_DB_TRACKING=on to enable; anything else = local only. */
export const dbTrackingEnabled = () => process.env.LEARN_DB_TRACKING === "on";

let _admin: SupabaseClient | null = null;
function adminDb(): SupabaseClient | null {
  if (!dbTrackingEnabled()) return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return (_admin ??= createClient(url, key, { auth: { persistSession: false } }));
}

/** Fire-and-forget: log a graded attempt. Never throws — a logging failure must not block the learner. */
export async function recordAssessment(input: {
  courseId: string; name: string; result: GradeResult;
}): Promise<void> {
  const db = adminDb();
  if (!db) return;
  const { error } = await db.from("learn_assessments").insert({
    course_id:      input.courseId,
    learner_name:   input.name,
    correct:        input.result.correct,
    total:          input.result.total,
    score:          input.result.score,
    passed:         input.result.passed,
    band:           input.result.band,
    certificate_id: input.result.claim?.certificateId ?? null,
  });
  if (error) console.error("[learn] could not record assessment:", error.message);
}

export interface LearnStats {
  totals: { attempts: number; learners: number; passedAttempts: number; learnersPassed: number; certificates: number; avgScorePct: number | null };
  courses: { course_id: string; attempts: number; learners: number; passed_attempts: number; learners_passed: number; certificates_issued: number; avg_score_pct: number | null; last_attempt_at: string | null }[];
  recent:  { id: string; course_id: string; learner_name: string; correct: number; total: number; score: number; passed: boolean; band: string; certificate_id: string | null; created_at: string }[];
}

export async function getLearnStats(): Promise<LearnStats> {
  if (!dbTrackingEnabled()) throw new Error('Database tracking is switched off (LEARN_DB_TRACKING is not "on"). No assessment data is being recorded.');
  const db = adminDb();
  if (!db) throw new Error("Supabase service credentials are not configured");
  const [courses, recent] = await Promise.all([
    db.from("learn_course_stats").select("*"),
    db.from("learn_assessments").select("*").order("created_at", { ascending: false }).limit(100),
  ]);
  if (courses.error) throw new Error(courses.error.message);
  if (recent.error)  throw new Error(recent.error.message);
  const rows = (courses.data ?? []) as LearnStats["courses"];
  const sum = (k: keyof LearnStats["courses"][number]) => rows.reduce((n, r) => n + Number(r[k] ?? 0), 0);
  const totalAttempts = sum("attempts");
  const avg = totalAttempts ? rows.reduce((n, r) => n + Number(r.avg_score_pct ?? 0) * Number(r.attempts), 0) / totalAttempts : null;
  return {
    totals: {
      attempts: totalAttempts, learners: sum("learners"), passedAttempts: sum("passed_attempts"),
      learnersPassed: sum("learners_passed"), certificates: sum("certificates_issued"),
      avgScorePct: avg === null ? null : Math.round(avg * 10) / 10,
    },
    courses: rows,
    recent: (recent.data ?? []) as LearnStats["recent"],
  };
}

/** Constant-time check of the admin dashboard key from an Authorization: Bearer header. */
export function isAdminAuthorised(authHeader: string | null): boolean {
  const expected = process.env.LEARN_ADMIN_KEY;
  if (!expected || expected.length < 16) return false;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  const a = Buffer.from(token), b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/* ── Course feedback ─────────────────────────────────────────────────────── */

export interface FeedbackSubmission {
  courseId: string;
  certificateId: string | null;
  ratings: Record<string, number>;   // q1..q6 → 1..5
  overall: string;                   // Poor | Fair | Good | Very Good | Excellent
  recommend: string;                 // Yes | Maybe | No
  mostUseful: string;
  improve: string;
}

const OVERALL   = ["Poor", "Fair", "Good", "Very Good", "Excellent"];
const RECOMMEND = ["Yes", "Maybe", "No"];
const RATING_KEYS = ["q1", "q2", "q3", "q4", "q5", "q6"];

export function validateFeedback(body: unknown): FeedbackSubmission | { error: string } {
  const b = (body && typeof body === "object") ? body as Record<string, unknown> : {};
  if (typeof b.courseId !== "string" || !getCourse(b.courseId)) return { error: "Unknown course" };
  const ratings: Record<string, number> = {};
  const raw = (b.ratings && typeof b.ratings === "object") ? b.ratings as Record<string, unknown> : {};
  for (const k of RATING_KEYS) {
    const v = Number(raw[k]);
    if (!Number.isInteger(v) || v < 1 || v > 5) return { error: "Please rate every statement from 1 to 5" };
    ratings[k] = v;
  }
  if (!OVERALL.includes(String(b.overall)))     return { error: "Please choose an overall rating" };
  if (!RECOMMEND.includes(String(b.recommend))) return { error: "Please say whether you would recommend the course" };
  const clean = (v: unknown) => (typeof v === "string" ? v.trim().slice(0, 2000) : "");
  return {
    courseId: b.courseId, certificateId: typeof b.certificateId === "string" ? b.certificateId.slice(0, 40) : null,
    ratings, overall: String(b.overall), recommend: String(b.recommend),
    mostUseful: clean(b.mostUseful), improve: clean(b.improve),
  };
}

/** Stores feedback when DB tracking is on; otherwise a no-op (local-only mode). Never throws. */
export async function recordFeedback(f: FeedbackSubmission): Promise<"stored" | "local-only"> {
  const db = adminDb();
  if (!db) return "local-only";
  const { error } = await db.from("learn_feedback").insert({
    course_id: f.courseId, certificate_id: f.certificateId, ratings: f.ratings,
    overall: f.overall, recommend: f.recommend, most_useful: f.mostUseful || null, improve: f.improve || null,
  });
  if (error) { console.error("[learn] could not record feedback:", error.message); return "local-only"; }
  return "stored";
}
