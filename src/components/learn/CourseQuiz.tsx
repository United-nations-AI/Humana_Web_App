"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Course } from "@/types/learn";
import { countLessons, hasQuiz } from "@/lib/courses";
import { getProgress, getLearnerName, recordQuizResult } from "@/lib/learn-storage";

type Band = "pass" | "retake" | "review";
type Result = { score: number; correct: number; total: number; passed: boolean; band: Band; key: Record<string, number> };

const BAND_COPY: Record<Band, { title: string; body: (need: number, pct: number) => string }> = {
  pass:   { title: "Congratulations, you passed!",   body: () => "Your certificate is ready to download." },
  retake: { title: "Retake recommended",             body: (need, pct) => `You were close. You need ${pct}% (${need} correct) to pass. Review the answers below and try again.` },
  review: { title: "Review the course content",      body: (need, pct) => `You need ${pct}% (${need} correct) to pass. Go back through the modules, then retake the questionnaire.` },
};

export default function CourseQuiz({ course }: { course: Course }) {
  const router = useRouter();
  // Client-only component (loaded with ssr:false) — locked until every module is complete
  const [unlocked] = useState(() => hasQuiz(course) && getProgress(course.id).completedLessons.length >= countLessons(course));
  const [answers, setAnswers]     = useState<Record<string, number>>({});
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

  // Grading happens on the server; correct answers are never shipped to the browser.
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
      setResult({ score: data.score, correct: data.correct, total: data.total, passed: data.passed, band: data.band, key: data.key ?? {} });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const retry = () => { setAnswers({}); setResult(null); setError(null); };

  if (!unlocked) return <div className="learn-loading"><div className="chat-loading-dot" /></div>;

  return (
    <div>
      <section className="hero-bg" style={{ padding:"28px 0 24px", borderBottom:"1px solid #E0E8F4" }}>
        <div className="wrap">
          <Link href={`/learn/${course.id}`} className="learn-back">← Back to course</Link>
          <div className="label-xs" style={{ color:"#1B4FD8", marginTop:12, marginBottom:10 }}>Final Questionnaire · {course.title}</div>
          <h1 className="heading-2" style={{ color:"#0C1228", marginBottom:10 }}>Test Your Knowledge</h1>
          <p className="body-text" style={{ fontSize:15, color:"#64748B", maxWidth:520 }}>
            {total} questions. You need <strong style={{ color:"#1E293B" }}>{passPct}% or higher</strong> to earn your certificate. You can retake the questionnaire as many times as you like.
          </p>
        </div>
      </section>

      <section style={{ background:"#fff", padding:"36px 0 64px" }}>
        <div className="wrap" style={{ maxWidth:820 }}>

          {result && (
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
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {result.passed
                  ? <Link href={`/learn/${course.id}/certificate`} className="btn-primary" style={{ fontSize:14, padding:"11px 20px" }}>Download Certificate →</Link>
                  : <>
                      <Link href={`/learn/${course.id}`} className="btn-outline" style={{ fontSize:13, padding:"10px 16px" }}>Review Modules</Link>
                      <button onClick={retry} className="btn-primary" style={{ fontSize:13, padding:"10px 16px" }}>Retake Questionnaire</button>
                    </>}
              </div>
            </div>
          )}

          {result && (
            <div className="quiz-legend">
              <span><i className="quiz-legend-dot correct" /> Correct answer</span>
              <span><i className="quiz-legend-dot wrong" /> Your incorrect answer</span>
            </div>
          )}

          {!result && (
            <div style={{ position:"sticky", top:64, zIndex:5, background:"#fff", padding:"12px 0 16px", marginBottom:8 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span className="mono-label" style={{ color:"#64748B" }}>Answered</span>
                <span className="mono-label" style={{ color:"#1E293B" }}>{answered}/{total}</span>
              </div>
              <div className="progress-track"><div className="progress-fill" style={{ width:`${total ? (answered / total) * 100 : 0}%` }}/></div>
            </div>
          )}

          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            {course.quiz.map((q, qi) => {
              const chosen   = answers[q.id];
              const modIdx   = course.modules.findIndex(m => m.id === q.moduleId);
              const firstOfModule = qi === 0 || course.quiz[qi - 1].moduleId !== q.moduleId;
              const correct  = result?.key[q.id];
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
                          {q.options.map((opt, oi) => {
                            let cls = "quiz-option";
                            if (result) {
                              if (oi === correct) cls += " correct";
                              else if (chosen === oi) cls += " wrong";
                            } else if (chosen === oi) cls += " selected";
                            return (
                              <button key={oi} disabled={!!result} className={cls}
                                onClick={() => setAnswers(a => ({ ...a, [q.id]: oi }))}>
                                <span className="quiz-option-key">{String.fromCharCode(65 + oi)}</span>
                                <span>{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                        {result && chosen !== correct && (
                          <div className="mono-label" style={{ color:"#EF4444", marginTop:10 }}>
                            Correct answer: {String.fromCharCode(65 + (correct ?? 0))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {result && (
            <div style={{ display:"flex", justifyContent:"flex-end", gap:8, marginTop:32, flexWrap:"wrap" }}>
              {result.passed
                ? <Link href={`/learn/${course.id}/certificate`} className="btn-primary">Download Certificate →</Link>
                : <button onClick={retry} className="btn-primary">Retake Questionnaire →</button>}
            </div>
          )}

          {!result && (
            <div style={{ display:"flex", justifyContent:"flex-end", alignItems:"center", gap:14, marginTop:32, flexWrap:"wrap" }}>
              {error && <span className="mono-label" style={{ color:"#EF4444" }}>{error}</span>}
              {!allAnswered && !error && <span className="mono-label" style={{ color:"#A8BEDB" }}>Answer all questions to submit</span>}
              <button onClick={submit} disabled={!allAnswered || submitting} className="btn-primary"
                style={{ opacity: allAnswered && !submitting ? 1 : 0.5, cursor: allAnswered && !submitting ? "pointer" : "not-allowed" }}>
                {submitting ? "Checking…" : "Submit Answers →"}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
