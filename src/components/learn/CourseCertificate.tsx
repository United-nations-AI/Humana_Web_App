"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Course, CertificateClaim } from "@/types/learn";
import { getProgress } from "@/lib/learn-storage";

/* Partner logos printed on the certificate (files live in /public/certificate). */
const LOGOS = {
  humana: "/humanahi-logo.png",
  qcpd:   "/certificate/qcpd-logo.jpg",
  cpd:    "/certificate/cpd-member.png",
};

export default function CourseCertificate({ course }: { course: Course }) {
  const router = useRouter();
  const [claim, setClaim] = useState<CertificateClaim | null>(null);

  // The certificate renders only from a server-verified token issued after a passing quiz.
  // Editing localStorage or typing this URL directly cannot produce one.
  useEffect(() => {
    const token = getProgress(course.id).certToken;
    if (!token) { router.replace(`/learn/${course.id}`); return; }
    let cancelled = false;
    fetch("/api/learn/certificate", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, courseId: course.id }),
    })
      .then(async r => (r.ok ? (await r.json()).claim as CertificateClaim : null))
      .catch(() => null)
      .then(c => {
        if (cancelled) return;
        if (c) setClaim(c);
        else router.replace(`/learn/${course.id}`);
      });
    return () => { cancelled = true; };
  }, [course.id, router]);

  if (!claim) return <div className="learn-loading"><div className="chat-loading-dot" /></div>;

  const date  = new Date(claim.issuedAt).toLocaleDateString("en-GB", { day:"numeric", month:"long", year:"numeric" });
  const score = Math.round(claim.score * 100);

  return (
    <div>
      <section className="hero-bg no-print" style={{ padding:"28px 0 24px", borderBottom:"1px solid #E0E8F4" }}>
        <div className="wrap">
          <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"flex-end", gap:16 }}>
            <div>
              <Link href={`/learn/${course.id}`} className="learn-back">← Back to course</Link>
              <div className="label-xs" style={{ color:"#1B4FD8", marginTop:12, marginBottom:10 }}>Certificate of Completion</div>
              <h1 className="heading-2" style={{ color:"#0C1228" }}>Congratulations, {claim.name.split(" ")[0]}.</h1>
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <Link href="/learn" className="btn-outline" style={{ fontSize:13, padding:"10px 16px" }}>More Courses</Link>
              <button onClick={() => window.print()} className="btn-primary" style={{ fontSize:13, padding:"10px 18px" }}>
                Download / Print PDF
              </button>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background:"#F5F8FF", padding:"40px 0 64px" }} className="cert-section">
        <div className="wrap">
          <div className="certificate">
            <div className="cert-border">
              <div className="cert-head">
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <img src={LOGOS.humana} alt="Humana AI" className="cert-logo" />
                  <div>
                    <div className="cert-brand">Humana AI</div>
                    <div className="cert-brand-sub">Learning Platform · by Qatar CPD</div>
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <div className="cert-id">No. {claim.certificateId}</div>
                  <img src={LOGOS.qcpd} alt="Qatar Centre for Peace and Democracy" className="cert-logo" />
                </div>
              </div>

              <div className="cert-body">
                <div className="cert-eyebrow">Certificate of Completion</div>
                <div className="cert-presented">This certificate is proudly presented to</div>
                <div className="cert-name">{claim.name}</div>
                <div className="cert-rule" />
                <div className="cert-presented">for successfully completing the course</div>
                <div className="cert-course">{course.title}</div>
                <div className="cert-detail">
                  {course.modules.length} modules · Duration: {course.duration} · Final assessment score {score}%
                </div>
              </div>

              <div className="cert-foot">
                <div>
                  <div className="cert-sig-line" />
                  <div className="cert-foot-label">Date of Completion</div>
                  <div className="cert-foot-value">{date}</div>
                </div>
                <div className="cert-seal">
                  <img src={LOGOS.cpd} alt="CPD Member — The CPD Certification Service" className="cert-seal-img" />
                </div>
                <div style={{ textAlign:"right" }}>
                  <div className="cert-sig-line" />
                  <div className="cert-foot-label">Issued by</div>
                  <div className="cert-foot-value">Qatar Centre for Peace and Democracy · Humana AI</div>
                </div>
              </div>
            </div>
          </div>

          <p className="mono-label no-print" style={{ color:"#A8BEDB", textAlign:"center", marginTop:20 }}>
            Use your browser&apos;s print dialog and choose &quot;Save as PDF&quot; · Landscape orientation recommended
          </p>
        </div>
      </section>
    </div>
  );
}
