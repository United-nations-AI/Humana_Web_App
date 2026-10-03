"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Course } from "@/types/learn";
import { countLessons, hasQuiz } from "@/lib/courses";
import { getProgress, getLearnerName, recordQuizResult } from "@/lib/learn-storage";

type Band = "pass" | "retake" | "review";
type ModuleScore = { moduleId: string; correct: number; total: number };
type Result = { score: number; correct: number; total: number; passed: boolean; band: Band; modules: ModuleScore[] };

const BAND_COPY: Record<Band, { title: string; body: (need: number, pct: number) => string }> = {
  pass:   { title: "Congratulations, you passed!", body: () => "Your certificate is ready to download." },
  retake: { title: "Retake recommended",           body: (need, pct) => `You were close. You need ${pct}% (${need} correct) to pass. Revisit the modules highlighted below, then retake the questionnaire.` },
  review: { title: "Review the course content",    body: (need, pct) => `You need ${pct}% (${need} correct) to pass. Go back through the modules highlighted below, then retake the questionnaire.` },
};

const PINNED_LAST = ["All of the above", "None of the above"];

/** Random display order of each question's options for this attempt (values are original option indexes). */
function shuffleOrders(course: Course): Record<string, number[]> {
  const out: Record<string, number[]> = {};
  for (const q of course.quiz) {
    const idx = q.options.map((_, i) => i);
    if (!q.options.some(o => PINNED_LAST.includes(o))) {
      for (let i = idx.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [idx[i], idx[j]] = [idx[j], idx[i]];
      }
    }
    out[q.id] = idx;
  }
  return out;
}

export default function CourseQuiz({ course }: { course: Course }) {
  const router = useRouter();
  // Client-only component (loaded with ssr:false) — locked until every module is complete
  const [unlocked] = useState(() => hasQuiz(course) && getProgress(course.id).completedLessons.length >= countLessons(course));
  const [orders, setOrders]       = useState(() => shuffleOrders(course));
  const [answers, setAnswers]     = useState<Record<string, number>>({});   // questionId → ORIGINAL option index
  const [result, setResult]       = useState<Result | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    if (!unlocked) router.replace(`/learn/${course.id}`);
  }, [unlocked, course.id, router]);

  const total    = course.quiz.length;
  const answered = Object.keys(answers).length;
  const allAnswered = answered === total;
  const passPct  = Math.round(course.passMark * 100);

  // Grading happens on the server. Correct answers are never sent to the browser.
  const submit = async () => {
    setSubmitting(true); setError(null);
    try {
      const res = await fetch("/api/learn/quiz", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course.id,
          name: getLearnerName(),
          answers,
          completedLessons: getProgress(course.id).completedLessons,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not grade the questionnaire");
      recordQuizResult(course.id, {
        score: data.score, passed: data.passed, token: data.token,
        certificateId: data.claim?.certificateId, issuedAt: data.claim?.issuedAt,
      });
      setResult({ score: data.score, correct: data.correct, total: data.total, passed: data.passed, band: data.band, modules: data.modules ?? [] });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const retry = () => { setAnswers({}); setResult(null); setError(null); setOrders(shuffleOrders(course)); window.scrollTo({ top: 0 }); };

  if (!unlocked) return <div className="learn-loading"><div className="chat-loading-dot" /></div>;

  return (
    <div>
      <section className="hero-bg" style={{ padding:"28px 0 24px", borderBottom:"1px solid #E0E8F4" }}>
        <div className="wrap">
          <Link href={`/learn/${course.id}`} className="learn-back">← Back to course</Link>
          <div className="label-xs" style={{ color:"#1B4FD8", marginTop:12, marginBottom:10 }}>Final Questionnaire · {course.title}</div>
          <h1 className="heading-2" style={{ color:"#0C1228", marginBottom:10 }}>Test Your Knowledge</h1>
          <p className="body-text" style={{ fontSize:15, color:"#64748B", maxWidth:540 }}>
            {total} questions. You need <strong style={{ color:"#1E293B" }}>{passPct}% or higher</strong> to earn your certificate. If you do not pass, you will be guided back to the modules to review before retaking.
          </p>
        </div>
      </section>

      <section style={{ background:"#fff", padding:"36px 0 64px" }}>
        <div className="wrap" style={{ maxWidth:820 }}>

          {/* ── Result: score + per-module guidance. Correct answers are never shown. ── */}
          {result && (
            <>
              <div className={`quiz-result ${result.band}`}>
                <div className="quiz-result-score">{Math.round(result.score * 100)}%</div>
                <div style={{ flex:1, minWidth:200 }}>
                  <div className="mono-label" style={{ color: result.passed ? "#16A34A" : "#64748B", marginBottom:6 }}>
                    {result.correct} of {result.total} correct · {result.band === "pass" ? "Pass" : result.band === "retake" ? "Retake recommended" : "Review course content"}
                  </div>
                  <div className="heading-3" style={{ fontSize:18, color:"#0C1228", marginBottom:4 }}>{BAND_COPY[result.band].title}</div>
                  <p className="body-text" style={{ fontSize:14, color:"#64748B" }}>
                    {BAND_COPY[result.band].body(Math.ceil(course.passMark * result.total), passPct)}
                  </p>
                </div>
                {result.passed && (
                  <Link href={`/learn/${course.id}/certificate`} className="btn-primary" style={{ fontSize:14, padding:"11px 20px" }}>Download Certificate →</Link>
                )}
              </div>

              <div className="label-xs" style={{ color:"#1B4FD8", marginBottom:14 }}>
                {result.passed ? "Your results by module" : "Modules to review before you retake"}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:28 }}>
                {result.modules.map((ms, i) => {
                  const mod = course.modules.find(m => m.id === ms.moduleId);
                  const full = ms.correct === ms.total;
                  return (
                    <div key={ms.moduleId} className={`card module-score${full ? " ok" : " needs"}`}>
                      <div style={{ minWidth:0, flex:"1 1 260px" }}>
                        <div className="mono-label" style={{ color:"#1B4FD8", marginBottom:4 }}>Module {String(i + 1).padStart(2, "0")}</div>
                        <div className="heading-3" style={{ fontSize:15, color:"#0C1228" }}>{mod?.title}</div>
                      </div>
                      <div className="module-score-num">{ms.correct}/{ms.total}</div>
                      {full
                        ? <span className="admin-badge pass">All correct</span>
                        : result.passed
                          ? <span className="admin-badge retake">{ms.total - ms.correct} missed</span>
                          : <Link href={`/learn/${course.id}?module=${ms.moduleId}`} className="btn-outline" style={{ fontSize:13, padding:"9px 14px", whiteSpace:"nowrap" }}>Review module →</Link>}
                    </div>
                  );
                })}
              </div>

              {!result.passed && (
                <div style={{ display:"flex", justifyContent:"flex-end", gap:8, flexWrap:"wrap" }}>
                  <Link href={`/learn/${course.id}`} className="btn-outline" style={{ fontSize:14, padding:"12px 20px" }}>Back to Course</Link>
                  <button onClick={retry} className="btn-primary" style={{ fontSize:14, padding:"12px 20px" }}>Retake Questionnaire →</button>
                </div>
              )}
            </>
          )}

          {/* ── Questions (hidden once submitted) ── */}
          {!result && (
            <>
              <div style={{ position:"sticky", top:64, zIndex:5, background:"#fff", padding:"12px 0 16px", marginBottom:8 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span className="mono-label" style={{ color:"#64748B" }}>Answered</span>
                  <span className="mono-label" style={{ color:"#1E293B" }}>{answered}/{total}</span>
                </div>
                <div className="progress-track"><div className="progress-fill" style={{ width:`${total ? (answered / total) * 100 : 0}%` }}/></div>
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
                {course.quiz.map((q, qi) => {
                  const chosen = answers[q.id];
                  const modIdx = course.modules.findIndex(m => m.id === q.moduleId);
                  const firstOfModule = qi === 0 || course.quiz[qi - 1].moduleId !== q.moduleId;
                  return (
                    <div key={q.id} style={{ display:"contents" }}>
                      {firstOfModule && modIdx >= 0 && (
                        <div className="quiz-section" style={{ marginTop: qi === 0 ? 0 : 12 }}>
                          <span className="mono-label" style={{ color:"#1B4FD8" }}>Module {String(modIdx + 1).padStart(2, "0")}</span>
                          <span className="heading-3" style={{ fontSize:15, color:"#0C1228" }}>{course.modules[modIdx].title}</span>
                        </div>
                      )}
                      <div className="card quiz-card">
                        <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                          <span className="mono-label" style={{ color:"#1B4FD8", paddingTop:4, flexShrink:0 }}>Q{String(qi + 1).padStart(2, "0")}</span>
                          <div style={{ flex:1 }}>
                            <div className="heading-3" style={{ fontSize:16, color:"#0C1228", marginBottom:14 }}>{q.question}</div>
                            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                              {orders[q.id].map((orig, pos) => (
                                <button key={orig} className={`quiz-option${chosen === orig ? " selected" : ""}`}
                                  onClick={() => setAnswers(a => ({ ...a, [q.id]: orig }))}>
                                  <span className="quiz-option-key">{String.fromCharCode(65 + pos)}</span>
                                  <span>{q.options[orig]}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display:"flex", justifyContent:"flex-end", alignItems:"center", gap:14, marginTop:32, flexWrap:"wrap" }}>
                {error && <span className="mono-label" style={{ color:"#EF4444" }}>{error}</span>}
                {!allAnswered && !error && <span className="mono-label" style={{ color:"#A8BEDB" }}>Answer all questions to submit</span>}
                <button onClick={submit} disabled={!allAnswered || submitting} className="btn-primary"
                  style={{ opacity: allAnswered && !submitting ? 1 : 0.5, cursor: allAnswered && !submitting ? "pointer" : "not-allowed" }}>
                  {submitting ? "Checking…" : "Submit Answers →"}
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
