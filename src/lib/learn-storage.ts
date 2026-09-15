import type { CourseProgress } from "@/types/learn";

const NAME_KEY     = "humana_learner_name";
const PROGRESS_KEY = "humana_learn_progress";

const isBrowser = () => typeof window !== "undefined";

export function getLearnerName(): string {
  if (!isBrowser()) return "";
  try { return localStorage.getItem(NAME_KEY) ?? ""; } catch { return ""; }
}

export function setLearnerName(name: string): void {
  if (!isBrowser()) return;
  try { localStorage.setItem(NAME_KEY, name.trim()); } catch {}
}

function readAll(): Record<string, CourseProgress> {
  if (!isBrowser()) return {};
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? "{}"); } catch { return {}; }
}

function writeAll(data: Record<string, CourseProgress>): void {
  if (!isBrowser()) return;
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(data)); } catch {}
}

export function getProgress(courseId: string): CourseProgress {
  return readAll()[courseId] ?? { completedLessons: [] };
}

export function getAllProgress(): Record<string, CourseProgress> {
  return readAll();
}

export function saveProgress(courseId: string, progress: CourseProgress): void {
  const all = readAll();
  all[courseId] = progress;
  writeAll(all);
}

export function markLessonComplete(courseId: string, lessonId: string): CourseProgress {
  const p = getProgress(courseId);
  if (!p.completedLessons.includes(lessonId)) {
    p.completedLessons = [...p.completedLessons, lessonId];
    saveProgress(courseId, p);
  }
  return p;
}

export function recordQuizResult(
  courseId: string,
  result: { score: number; passed: boolean; token?: string; certificateId?: string; issuedAt?: number },
): CourseProgress {
  const p = getProgress(courseId);
  p.quizScore = result.score;
  if (result.passed && result.token) {
    p.passed        = true;
    p.certToken     = result.token;
    p.certificateId = result.certificateId;
    p.completedAt   = result.issuedAt;
  }
  saveProgress(courseId, p);
  return p;
}

export function resetCourse(courseId: string): void {
  const all = readAll();
  delete all[courseId];
  writeAll(all);
}
