"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { COURSES, UPCOMING_COURSES, LEARN_INTRO, countLessons, hasQuiz } from "@/lib/courses";
import { getLearnerName, setLearnerName, getAllProgress } from "@/lib/learn-storage";
import type { CourseProgress } from "@/types/learn";
import NameModal from "./NameModal";

const steps = [
  { n:"01", h:"Enter your name",    b:"No account needed. Your name is used only for your certificate." },
  { n:"02", h:"Watch each module",  b:"Work through the video modules in order. Progress is saved in your browser." },
  { n:"03", h:"Pass the questionnaire", b:"Score 80% or higher on the final questionnaire." },
  { n:"04", h:"Earn a certificate", b:"Download a personalised certificate of completion from Humana AI." },
];

export default function LearnCatalog() {
  const router = useRouter();
  // Client-only component (loaded with ssr:false) — safe to read localStorage in initialisers
  const [name, setName]       = useState(() => getLearnerName());
  const [progress]            = useState<Record<string, CourseProgress>>(() => getAllProgress());
  const [pending, setPending] = useState<string | null>(null); // courseId awaiting name

  const start = (courseId: string) => {
    if (name) router.push(`/learn/${courseId}`);
    else setPending(courseId);
  };

  const confirmName = (n: string) => {
    setLearnerName(n);
    setName(n);
    const id = pending!;
    setPending(null);
    router.push(`/learn/${id}`);
  };

  const [headA, headB] = LEARN_INTRO.heading.split("\n");

  return (
    <div>

      {/* Hero */}
      <section className="hero-bg section-pad">
        <div className="wrap">
          <div className="label-xs" style={{ color:"#1B4FD8", marginBottom:16 }}>{LEARN_INTRO.eyebrow}</div>
          <h1 className="heading-1" style={{ color:"#0C1228", maxWidth:720, marginBottom:24 }}>
            {headA}<br/>{headB}
          </h1>
          <p className="body-text" style={{ fontSize:"clamp(15px,2vw,18px)", color:"#64748B", maxWidth:580, marginBottom:32 }}>
            {LEARN_INTRO.lede}
          </p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:12, alignItems:"center" }}>
            <a href="#courses" className="btn-primary">Browse Courses ↓</a>
            {name && (
              <span className="mono-label" style={{ color:"#64748B" }}>
                Signed in as <strong style={{ color:"#1E293B" }}>{name}</strong>
                {" · "}
                <button onClick={() => { setLearnerName(""); setName(""); }} className="learn-link-btn">Not you?</button>
              </span>
            )}
          </div>
        </div>
      </section>

      {/* About the platform */}
      <section style={{ background:"#fff", borderBottom:"1px solid #E0E8F4", padding:"40px 0" }}>
        <div className="wrap">
          <div className="two-col-lg" style={{ gap:40, alignItems:"start" }}>
            <div>
              <div className="label-xs" style={{ color:"#1B4FD8", marginBottom:14 }}>How Learning Works on Humana AI</div>
              <h2 className="heading-3" style={{ fontSize:22, color:"#0C1228", maxWidth:420 }}>Courses, modules, and a certificate at the end</h2>
            </div>
            <p className="body-text" style={{ fontSize:15, color:"#64748B" }}>{LEARN_INTRO.about}</p>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="section-pad" style={{ background:"#fff" }}>
        <div className="wrap">
          <div style={{ marginBottom:40 }}>
            <div className="label-xs" style={{ color:"#1B4FD8", marginBottom:14 }}>Available Now</div>
            <h2 className="heading-2" style={{ color:"#0C1228", maxWidth:520 }}>Start Your First Course</h2>
          </div>

          {COURSES.map(c => {
            const total = countLessons(c);
            const p     = progress[c.id];
            const done  = p?.completedLessons.length ?? 0;
            const pct   = total ? Math.round((done / total) * 100) : 0;
            const state = p?.passed ? "certified" : done > 0 ? "in-progress" : "new";

            return (
              <div key={c.id} className="card course-feature">
                <div style={{ minWidth:0 }}>
                  <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:16 }}>
                    <span className="tag">{c.tag}</span>
                    <span className="mono-label" style={{ color:"#A8BEDB" }}>{c.level}</span>
                  </div>
                  <h3 className="heading-3" style={{ fontSize:26, color:"#0C1228", marginBottom:12 }}>{c.title}</h3>
                  <p className="body-text" style={{ fontSize:15, color:"#64748B", marginBottom:20, maxWidth:620 }}>{c.summary}</p>

                  <div className="label-xs" style={{ color:"#64748B", marginBottom:10 }}>Modules</div>
                  <ol className="course-module-list">
                    {c.modules.map((m, i) => (
                      <li key={m.id}>
                        <span className="mono-label" style={{ color:"#1B4FD8" }}>{String(i + 1).padStart(2, "0")}</span>
                        <span>{m.title}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="course-feature-side">
                  <div className="course-meta" style={{ marginBottom:16 }}>
                    <span>{c.modules.length} modules</span>
                    <span>·</span>
                    <span>{total} videos</span>
                    <span>·</span>
                    <span>{hasQuiz(c) ? `${c.quiz.length} questions` : "Questionnaire soon"}</span>
                  </div>

                  {state !== "new" && (
                    <div style={{ marginBottom:16 }}>
                      <div className="progress-track"><div className="progress-fill" style={{ width:`${pct}%` }}/></div>
                      <div className="mono-label" style={{ color: state === "certified" ? "#16A34A" : "#64748B", marginTop:6 }}>
                        {state === "certified" ? "✓ Certificate earned" : `${pct}% complete`}
                      </div>
                    </div>
                  )}

                  <button onClick={() => start(c.id)} className="btn-primary" style={{ width:"100%", textAlign:"center", fontSize:14, padding:"13px 20px" }}>
                    {state === "certified" ? "Review Course" : state === "in-progress" ? "Continue Course →" : "Start Course →"}
                  </button>
                  <div className="mono-label" style={{ color:"#A8BEDB", marginTop:10, textAlign:"center" }}>Free · No login · Certificate on completion</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Upcoming */}
      <section style={{ background:"#F5F8FF", borderTop:"1px solid #E0E8F4", borderBottom:"1px solid #E0E8F4" }} className="section-pad">
        <div className="wrap">
          <div style={{ marginBottom:36 }}>
            <div className="label-xs" style={{ color:"#1B4FD8", marginBottom:14 }}>Coming Soon</div>
            <h2 className="heading-2" style={{ color:"#0C1228", maxWidth:520, marginBottom:12 }}>Upcoming Courses</h2>
            <p className="body-text" style={{ fontSize:15, color:"#64748B", maxWidth:560 }}>
              New courses are being prepared to go deeper into specific areas of human rights and international law.
            </p>
          </div>
          <div className="grid-principles">
            {UPCOMING_COURSES.map(u => (
              <div key={u.title} className="card course-upcoming">
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, marginBottom:16 }}>
                  <span className="tag">{u.tag}</span>
                  <span className="mono-label" style={{ color:"#A8BEDB" }}>Coming soon</span>
                </div>
                <h3 className="heading-3" style={{ fontSize:17, color:"#0C1228", marginBottom:8 }}>{u.title}</h3>
                <p className="body-text" style={{ fontSize:14, color:"#64748B" }}>{u.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="dark-bg section-pad">
        <div className="wrap">
          <div style={{ marginBottom:52 }}>
            <div className="label-xs" style={{ color:"rgba(147,174,255,0.75)", marginBottom:14 }}>How It Works</div>
            <h2 className="heading-2" style={{ color:"#fff", maxWidth:440 }}>Four Steps to Your Certificate</h2>
          </div>
          <div className="grid-features">
            {steps.map(s => (
              <div key={s.n} className="card-dark">
                <div className="label-xs" style={{ color:"rgba(147,174,255,0.55)", marginBottom:20 }}>{s.n}</div>
                <h3 className="heading-3" style={{ fontSize:17, color:"#fff", marginBottom:10 }}>{s.h}</h3>
                <p className="body-text" style={{ fontSize:14, color:"rgba(255,255,255,0.45)" }}>{s.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {pending && (
        <NameModal
          courseTitle={COURSES.find(c => c.id === pending)!.title}
          onConfirm={confirmName}
          onCancel={() => setPending(null)}
        />
      )}
    </div>
  );
}
