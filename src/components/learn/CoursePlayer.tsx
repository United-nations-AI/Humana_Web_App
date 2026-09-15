"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Course, CourseProgress } from "@/types/learn";
import { allLessons, getYouTubeId, youTubeWatchUrl, hasQuiz } from "@/lib/courses";
import { getLearnerName, setLearnerName, getProgress, markLessonComplete } from "@/lib/learn-storage";
import NameModal from "./NameModal";

export default function CoursePlayer({ course }: { course: Course }) {
  const router  = useRouter();
  const lessons = useMemo(() => allLessons(course), [course]);
  // Client-only component (loaded with ssr:false) — safe to read localStorage in initialisers
  const [name, setName]         = useState(() => getLearnerName());
  const [progress, setProgress] = useState<CourseProgress>(() => getProgress(course.id));
  const [activeId, setActiveId] = useState<string>(() => {
    const done = getProgress(course.id).completedLessons;
    return (lessons.find(l => !done.includes(l.id)) ?? lessons[0])?.id;   // resume at first incomplete
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const active     = lessons.find(l => l.id === activeId) ?? lessons[0];
  const activeIdx  = lessons.findIndex(l => l.id === active?.id);
  const activeMod  = course.modules.findIndex(m => m.lessons.some(l => l.id === active?.id));
  const done       = progress.completedLessons.length;
  const total      = lessons.length;
  const pct        = total ? Math.round((done / total) * 100) : 0;
  const allDone    = total > 0 && done >= total;
  const quizReady  = hasQuiz(course);
  const isComplete = (id: string) => progress.completedLessons.includes(id);
  const videoId    = getYouTubeId(active?.videoUrl ?? "");
  const watchUrl   = youTubeWatchUrl(active?.videoUrl ?? "");
  const passPct    = Math.round(course.passMark * 100);

  const complete = () => {
    if (!active) return;
    setProgress(markLessonComplete(course.id, active.id));
    if (activeIdx < total - 1) setActiveId(lessons[activeIdx + 1].id);
  };

  return (
    <div>
      {/* Course header */}
      <section className="hero-bg" style={{ padding:"28px 0 24px", borderBottom:"1px solid #E0E8F4" }}>
        <div className="wrap">
          <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"flex-end", gap:16 }}>
            <div style={{ minWidth:0 }}>
              <Link href="/learn" className="learn-back">← All courses</Link>
              <div style={{ display:"flex", gap:10, alignItems:"center", marginTop:10, marginBottom:8 }}>
                <span className="tag">{course.tag}</span>
                <span className="mono-label" style={{ color:"#A8BEDB" }}>{course.level}</span>
              </div>
              <h1 className="heading-2" style={{ color:"#0C1228" }}>{course.title}</h1>
            </div>
            <div style={{ minWidth:220, flex:"0 1 300px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span className="mono-label" style={{ color:"#64748B" }}>Progress</span>
                <span className="mono-label" style={{ color:"#1E293B" }}>{done}/{total} modules · {pct}%</span>
              </div>
              <div className="progress-track progress-track--lg"><div className="progress-fill" style={{ width:`${pct}%` }}/></div>
              <div className="mono-label" style={{ color:"#A8BEDB", marginTop:6 }}>Learner: {name || "—"}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Player + syllabus */}
      <section style={{ background:"#fff", padding:"32px 0 56px" }}>
        <div className="wrap">
          <button className="learn-syllabus-toggle" onClick={() => setSidebarOpen(v => !v)}>
            {sidebarOpen ? "Hide" : "Show"} modules ({done}/{total})
          </button>

          <div className="course-layout">

            {/* Syllabus */}
            <aside className={`course-syllabus${sidebarOpen ? " open" : ""}`}>
              {course.modules.map((m, mi) => (
                <div key={m.id} className="syllabus-module">
                  <div className="syllabus-module-head">
                    <span className="mono-label" style={{ color:"#1B4FD8" }}>Module {String(mi + 1).padStart(2, "0")}</span>
                    <div className="heading-3" style={{ fontSize:14, color:"#0C1228", marginTop:4 }}>{m.title}</div>
                  </div>
                  {m.lessons.map(l => {
                    const idx = lessons.findIndex(x => x.id === l.id);
                    const isActive = l.id === active?.id;
                    return (
                      <button key={l.id} onClick={() => { setActiveId(l.id); setSidebarOpen(false); }}
                        className={`syllabus-lesson${isActive ? " active" : ""}${isComplete(l.id) ? " done" : ""}`}>
                        <span className="syllabus-check">
                          {isComplete(l.id)
                            ? <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            : <span>{idx + 1}</span>}
                        </span>
                        <span className="syllabus-lesson-title">Video {idx + 1}</span>
                        <span className="syllabus-duration">{isComplete(l.id) ? "Done" : isActive ? "Now" : ""}</span>
                      </button>
                    );
                  })}
                </div>
              ))}

              <div className={`syllabus-quiz${allDone && quizReady ? " ready" : ""}`}>
                <span className="mono-label" style={{ color: allDone && quizReady ? "#1B4FD8" : "#A8BEDB" }}>Final Step</span>
                <div className="heading-3" style={{ fontSize:14, color: allDone && quizReady ? "#0C1228" : "#A8BEDB", marginTop:4, marginBottom:10 }}>
                  Questionnaire{quizReady ? ` · ${course.quiz.length} questions` : ""}
                </div>
                {!quizReady
                  ? <span className="mono-label" style={{ color:"#A8BEDB" }}>Questionnaire coming soon</span>
                  : allDone
                    ? <Link href={`/learn/${course.id}/quiz`} className="btn-primary" style={{ display:"block", textAlign:"center", fontSize:13, padding:"10px 14px" }}>
                        {progress.passed ? "Retake Questionnaire" : "Take the Questionnaire →"}
                      </Link>
                    : <span className="mono-label" style={{ color:"#A8BEDB" }}>Complete all modules to unlock</span>}
                {progress.passed && progress.certToken && (
                  <Link href={`/learn/${course.id}/certificate`} className="btn-outline" style={{ display:"block", textAlign:"center", fontSize:13, padding:"9px 14px", marginTop:8 }}>
                    View Certificate
                  </Link>
                )}
              </div>
            </aside>

            {/* Main */}
            <div style={{ minWidth:0 }}>
              <div className="video-frame">
                {videoId ? (
                  <iframe
                    key={videoId}
                    src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
                    title={active?.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="video-placeholder">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M10 9l5 3-5 3V9z" fill="currentColor"/>
                    </svg>
                    <span className="mono-label">Video unavailable</span>
                  </div>
                )}
              </div>

              <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"flex-start", gap:16, marginTop:24 }}>
                <div style={{ minWidth:0, flex:"1 1 320px" }}>
                  <div className="mono-label" style={{ color:"#64748B", marginBottom:8 }}>
                    Module {activeMod + 1} of {course.modules.length} · Video {activeIdx + 1}
                  </div>
                  <h2 className="heading-3" style={{ fontSize:22, color:"#0C1228", marginBottom:8 }}>{active?.title}</h2>
                  {course.modules[activeMod]?.description && (
                    <p className="body-text" style={{ fontSize:14, color:"#64748B", marginBottom:10 }}>{course.modules[activeMod].description}</p>
                  )}
                  {watchUrl && (
                    <a href={watchUrl} target="_blank" rel="noopener noreferrer" className="learn-ext-link">
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M6 3H3.5A1.5 1.5 0 002 4.5v8A1.5 1.5 0 003.5 14h8a1.5 1.5 0 001.5-1.5V10M9 2h5v5M14 2L7 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Watch on YouTube
                    </a>
                  )}
                </div>

                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  <button onClick={() => activeIdx > 0 && setActiveId(lessons[activeIdx - 1].id)} disabled={activeIdx === 0}
                    className="btn-outline" style={{ fontSize:13, padding:"10px 16px", opacity: activeIdx === 0 ? 0.4 : 1 }}>
                    ← Previous
                  </button>
                  {isComplete(active?.id ?? "") ? (
                    activeIdx < total - 1
                      ? <button onClick={() => setActiveId(lessons[activeIdx + 1].id)} className="btn-primary" style={{ fontSize:13, padding:"10px 18px" }}>Next Module →</button>
                      : quizReady
                        ? <Link href={`/learn/${course.id}/quiz`} className="btn-primary" style={{ fontSize:13, padding:"10px 18px" }}>Go to Questionnaire →</Link>
                        : null
                  ) : (
                    <button onClick={complete} className="btn-primary" style={{ fontSize:13, padding:"10px 18px" }}>
                      Mark Complete {activeIdx < total - 1 ? "& Continue →" : "✓"}
                    </button>
                  )}
                </div>
              </div>

              {allDone && (
                <div className="learn-callout">
                  <div>
                    <div className="label-xs" style={{ color:"#1B4FD8", marginBottom:6 }}>All modules complete</div>
                    <div className="heading-3" style={{ fontSize:16, color:"#0C1228" }}>
                      {progress.passed
                        ? "You've earned your certificate."
                        : quizReady
                          ? `Score ${passPct}% or more on the questionnaire to earn your certificate.`
                          : "The questionnaire for this course is being prepared. Come back soon to complete it and earn your certificate."}
                    </div>
                  </div>
                  {(progress.passed || quizReady) && (
                    <Link href={`/learn/${course.id}/${progress.passed ? "certificate" : "quiz"}`} className="btn-primary" style={{ fontSize:13, padding:"10px 18px", whiteSpace:"nowrap" }}>
                      {progress.passed ? "View Certificate →" : "Start Questionnaire →"}
                    </Link>
                  )}
                </div>
              )}

              <div style={{ marginTop:40, paddingTop:28, borderTop:"1px solid #E0E8F4" }}>
                <div className="two-col-lg" style={{ gap:32, alignItems:"start" }}>
                  <div>
                    <div className="label-xs" style={{ color:"#1B4FD8", marginBottom:12 }}>About This Course</div>
                    <p className="body-text" style={{ fontSize:15, color:"#64748B" }}>{course.description}</p>
                  </div>
                  <div>
                    <div className="label-xs" style={{ color:"#1B4FD8", marginBottom:12 }}>What You Will Learn</div>
                    <ul className="course-outcomes">
                      {course.outcomes.map(o => (
                        <li key={o}>
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="#EEF2FF" stroke="rgba(27,79,216,0.25)"/><path d="M5 8l2 2 4-4" stroke="#1B4FD8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          <span>{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {!name && (
        <NameModal
          courseTitle={course.title}
          onConfirm={n => { setLearnerName(n); setName(n); }}
          onCancel={() => router.push("/learn")}
        />
      )}
    </div>
  );
}
