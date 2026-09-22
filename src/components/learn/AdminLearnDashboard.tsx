"use client";
import { useCallback, useEffect, useState } from "react";
import { COURSES } from "@/lib/courses";

type Stats = {
  totals: { attempts: number; learners: number; passedAttempts: number; learnersPassed: number; certificates: number; avgScorePct: number | null };
  courses: { course_id: string; attempts: number; learners: number; passed_attempts: number; learners_passed: number; certificates_issued: number; avg_score_pct: number | null; last_attempt_at: string | null }[];
  recent:  { id: string; course_id: string; learner_name: string; correct: number; total: number; score: number; passed: boolean; band: string; certificate_id: string | null; created_at: string }[];
};

const KEY_STORAGE = "humana_admin_key";
const courseTitle = (id: string) => COURSES.find(c => c.id === id)?.title ?? id;
const fmtDate = (iso: string) => new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default function AdminLearnDashboard() {
  const [key, setKey]       = useState("");
  const [input, setInput]   = useState("");
  const [stats, setStats]   = useState<Stats | null>(null);
  const [error, setError]   = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (k: string) => {
    setLoading(true); setError(null);
    try {
      const res  = await fetch("/api/admin/learn-stats", { headers: { Authorization: `Bearer ${k}` }, cache: "no-store" });
      const data = await res.json();
      if (res.status === 401) { setKey(""); try { sessionStorage.removeItem(KEY_STORAGE); } catch {} ; setError("Invalid admin key."); return; }
      if (!res.ok) throw new Error(data.error ?? "Could not load statistics");
      setStats(data); setKey(k);
      try { sessionStorage.setItem(KEY_STORAGE, k); } catch {}
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let saved = "";
    try { saved = sessionStorage.getItem(KEY_STORAGE) ?? ""; } catch {}
    if (!saved) return;
    const id = setTimeout(() => load(saved), 0);   // defer: no synchronous setState inside the effect
    return () => clearTimeout(id);
  }, [load]);

  const signOut = () => { setKey(""); setStats(null); try { sessionStorage.removeItem(KEY_STORAGE); } catch {} };

  /* ── Key prompt ── */
  if (!key) {
    return (
      <div>
        <section className="hero-bg section-pad">
          <div className="wrap" style={{ maxWidth: 520 }}>
            <div className="label-xs" style={{ color:"#1B4FD8", marginBottom:16 }}>Admin</div>
            <h1 className="heading-2" style={{ color:"#0C1228", marginBottom:12 }}>Learning Platform Statistics</h1>
            <p className="body-text" style={{ fontSize:15, color:"#64748B", marginBottom:28 }}>
              Enter the admin key to view assessment attempts and certificates issued.
            </p>
            <form onSubmit={e => { e.preventDefault(); if (input.trim()) load(input.trim()); }} className="card" style={{ padding:"24px" }}>
              <label className="form-label" htmlFor="admin-key">Admin key</label>
              <input id="admin-key" type="password" className="form-input" autoComplete="off" autoFocus
                value={input} onChange={e => setInput(e.target.value)} placeholder="LEARN_ADMIN_KEY" />
              {error && <div className="mono-label" style={{ color:"#EF4444", marginTop:10 }}>{error}</div>}
              <button type="submit" disabled={!input.trim() || loading} className="btn-primary"
                style={{ marginTop:18, width:"100%", textAlign:"center", opacity: input.trim() && !loading ? 1 : 0.5 }}>
                {loading ? "Checking…" : "View Statistics →"}
              </button>
            </form>
          </div>
        </section>
      </div>
    );
  }

  const t = stats?.totals;
  const tiles = t ? [
    { v: t.attempts,        l: "Exam attempts" },
    { v: t.learners,        l: "Students who attempted" },
    { v: t.learnersPassed,  l: "Students who passed" },
    { v: t.certificates,    l: "Certificates issued" },
    { v: t.attempts ? `${Math.round((t.passedAttempts / t.attempts) * 100)}%` : "—", l: "Pass rate (attempts)" },
    { v: t.avgScorePct === null ? "—" : `${t.avgScorePct}%`, l: "Average score" },
  ] : [];

  return (
    <div>
      <section className="hero-bg" style={{ padding:"28px 0 24px", borderBottom:"1px solid #E0E8F4" }}>
        <div className="wrap">
          <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"flex-end", gap:16 }}>
            <div>
              <div className="label-xs" style={{ color:"#1B4FD8", marginBottom:10 }}>Admin · Learning Platform</div>
              <h1 className="heading-2" style={{ color:"#0C1228" }}>Assessment Statistics</h1>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => load(key)} disabled={loading} className="btn-outline" style={{ fontSize:13, padding:"10px 16px" }}>
                {loading ? "Refreshing…" : "Refresh"}
              </button>
              <button onClick={signOut} className="btn-outline" style={{ fontSize:13, padding:"10px 16px" }}>Sign out</button>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background:"#fff", padding:"32px 0 64px" }}>
        <div className="wrap">
          {error && (
            <div className="learn-callout" style={{ marginTop:0, marginBottom:24, background:"rgba(239,68,68,0.05)", borderColor:"rgba(239,68,68,0.25)" }}>
              <div>
                <div className="label-xs" style={{ color:"#EF4444", marginBottom:6 }}>Could not load data</div>
                <div className="body-text" style={{ fontSize:14, color:"#1E293B" }}>{error}</div>
              </div>
            </div>
          )}

          {stats && (
            <>
              <div className="admin-tiles">
                {tiles.map(x => (
                  <div key={x.l} className="card" style={{ padding:"20px 22px" }}>
                    <div className="heading-2" style={{ fontSize:"clamp(26px,3vw,36px)", color:"#0C1228", marginBottom:6 }}>{x.v}</div>
                    <div className="label-xs" style={{ color:"#64748B" }}>{x.l}</div>
                  </div>
                ))}
              </div>

              <div className="label-xs" style={{ color:"#1B4FD8", margin:"40px 0 14px" }}>By course</div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Course</th><th>Attempts</th><th>Students</th><th>Passed</th><th>Certificates</th><th>Avg score</th><th>Last attempt</th></tr></thead>
                  <tbody>
                    {stats.courses.length === 0 && <tr><td colSpan={7} className="admin-empty">No attempts recorded yet.</td></tr>}
                    {stats.courses.map(c => (
                      <tr key={c.course_id}>
                        <td>{courseTitle(c.course_id)}</td><td>{c.attempts}</td><td>{c.learners}</td>
                        <td>{c.learners_passed}</td><td>{c.certificates_issued}</td>
                        <td>{c.avg_score_pct ?? "—"}%</td><td>{c.last_attempt_at ? fmtDate(c.last_attempt_at) : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="label-xs" style={{ color:"#1B4FD8", margin:"40px 0 14px" }}>Recent attempts (latest 100)</div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>When</th><th>Student</th><th>Course</th><th>Score</th><th>Result</th><th>Certificate</th></tr></thead>
                  <tbody>
                    {stats.recent.length === 0 && <tr><td colSpan={6} className="admin-empty">No attempts recorded yet.</td></tr>}
                    {stats.recent.map(r => (
                      <tr key={r.id}>
                        <td className="admin-mono">{fmtDate(r.created_at)}</td>
                        <td>{r.learner_name}</td>
                        <td>{courseTitle(r.course_id)}</td>
                        <td className="admin-mono">{r.correct}/{r.total} · {Math.round(Number(r.score) * 100)}%</td>
                        <td><span className={`admin-badge ${r.band}`}>{r.band === "pass" ? "Pass" : r.band === "retake" ? "Retake" : "Review"}</span></td>
                        <td className="admin-mono">{r.certificate_id ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
