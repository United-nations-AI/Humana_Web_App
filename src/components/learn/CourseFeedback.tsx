"use client";
import { useState } from "react";
import type { Course } from "@/types/learn";
import { markFeedbackSubmitted } from "@/lib/learn-storage";

const STATEMENTS = [
  { id: "q1", text: "The course was clear and easy to understand." },
  { id: "q2", text: "The course improved my understanding of human rights." },
  { id: "q3", text: "The course content was relevant and useful." },
  { id: "q4", text: "The quizzes and final assessment helped reinforce my learning." },
  { id: "q5", text: "The online course was easy to navigate." },
  { id: "q6", text: "I feel more confident discussing and understanding human rights issues after completing this course." },
];
const OVERALL   = ["Poor", "Fair", "Good", "Very Good", "Excellent"];
const RECOMMEND = ["Yes", "Maybe", "No"];

interface Props {
  course: Course;
  certificateId: string;
  completedAt: number;
  onSubmitted: () => void;
}

export default function CourseFeedback({ course, certificateId, completedAt, onSubmitted }: Props) {
  const [ratings, setRatings]     = useState<Record<string, number>>({});
  const [overall, setOverall]     = useState("");
  const [recommend, setRecommend] = useState("");
  const [mostUseful, setMostUseful] = useState("");
  const [improve, setImprove]     = useState("");
  const [sending, setSending]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const dateDone = new Date(completedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const complete = STATEMENTS.every(s => ratings[s.id]) && overall && recommend;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complete || sending) return;
    setSending(true); setError(null);
    try {
      const res  = await fetch("/api/learn/feedback", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id, certificateId, ratings, overall, recommend, mostUseful, improve }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not send your feedback");
      markFeedbackSubmitted(course.id);
      onSubmitted();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="feedback" className="no-print" style={{ background:"#fff", padding:"56px 0 72px", borderTop:"1px solid #E0E8F4" }}>
      <div className="wrap" style={{ maxWidth:820 }}>
        <div className="label-xs" style={{ color:"#1B4FD8", marginBottom:14 }}>Humana AI · Human Rights Learning Programme</div>
        <h2 className="heading-2" style={{ color:"#0C1228", marginBottom:12 }}>Course Feedback Form</h2>
        <p className="body-text" style={{ fontSize:15, color:"#64748B", maxWidth:620, marginBottom:28 }}>
          Thank you for completing this course. Your feedback will help Humana AI improve its free Human Rights Learning Programme and develop future courses.
        </p>

        <div className="feedback-meta">
          <div><span className="form-label" style={{ marginBottom:4 }}>Course</span><span className="feedback-meta-value">{course.title}</span></div>
          <div><span className="form-label" style={{ marginBottom:4 }}>Date completed</span><span className="feedback-meta-value">{dateDone}</span></div>
        </div>

        <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:20 }}>
          <p className="body-text" style={{ fontSize:14, color:"#1E293B" }}>
            Please rate the following from <strong>1 (Strongly Disagree)</strong> to <strong>5 (Strongly Agree)</strong>.
          </p>

          {STATEMENTS.map((s, i) => (
            <div key={s.id} className="card feedback-card">
              <div className="feedback-q">{i + 1}. {s.text}</div>
              <div className="likert" role="radiogroup" aria-label={s.text}>
                {[1, 2, 3, 4, 5].map(n => (
                  <button type="button" key={n} onClick={() => setRatings(r => ({ ...r, [s.id]: n }))}
                    className={`likert-btn${ratings[s.id] === n ? " active" : ""}`} aria-pressed={ratings[s.id] === n}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="card feedback-card">
            <div className="feedback-q">7. Overall, how would you rate this course?</div>
            <div className="choice-row">
              {OVERALL.map(o => (
                <button type="button" key={o} onClick={() => setOverall(o)} className={`choice-btn${overall === o ? " active" : ""}`}>{o}</button>
              ))}
            </div>
          </div>

          <div className="card feedback-card">
            <div className="feedback-q">8. Would you recommend this course to others?</div>
            <div className="choice-row">
              {RECOMMEND.map(o => (
                <button type="button" key={o} onClick={() => setRecommend(o)} className={`choice-btn${recommend === o ? " active" : ""}`}>{o}</button>
              ))}
            </div>
          </div>

          <div className="card feedback-card">
            <label className="feedback-q" htmlFor="fb-useful">9. What was the most useful part of the course?</label>
            <textarea id="fb-useful" className="form-textarea" style={{ minHeight:96 }} maxLength={2000}
              value={mostUseful} onChange={e => setMostUseful(e.target.value)} placeholder="Optional" />
          </div>

          <div className="card feedback-card">
            <label className="feedback-q" htmlFor="fb-improve">10. How could we improve this course?</label>
            <textarea id="fb-improve" className="form-textarea" style={{ minHeight:96 }} maxLength={2000}
              value={improve} onChange={e => setImprove(e.target.value)} placeholder="Optional" />
          </div>

          <div style={{ display:"flex", justifyContent:"flex-end", alignItems:"center", gap:14, flexWrap:"wrap" }}>
            {error && <span className="mono-label" style={{ color:"#EF4444" }}>{error}</span>}
            {!complete && !error && <span className="mono-label" style={{ color:"#A8BEDB" }}>Answer questions 1 to 8 to submit</span>}
            <button type="submit" disabled={!complete || sending} className="btn-primary"
              style={{ opacity: complete && !sending ? 1 : 0.5, cursor: complete && !sending ? "pointer" : "not-allowed" }}>
              {sending ? "Sending…" : "Submit Feedback →"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
