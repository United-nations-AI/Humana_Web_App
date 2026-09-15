/* ────────────────────────────────────────────────────────────────────────────
   SERVER-ONLY learning helpers. Never import this from a client component.
   - Holds the quiz answer keys (kept off the client bundle).
   - Grades submissions and issues HMAC-signed certificate tokens.
   ──────────────────────────────────────────────────────────────────────────── */
import { createHmac, timingSafeEqual } from "node:crypto";
import type { CertificateClaim } from "@/types/learn";
import { getCourse, allLessons } from "./courses";

/** courseId → questionId → index of the correct option */
export const QUIZ_ANSWERS: Record<string, Record<string, number>> = {
  "general-human-rights": {
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
