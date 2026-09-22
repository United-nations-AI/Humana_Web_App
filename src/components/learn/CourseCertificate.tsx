"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Course, CertificateClaim } from "@/types/learn";
import { getProgress, markCertificateDownloaded } from "@/lib/learn-storage";
import CourseFeedback from "./CourseFeedback";

/* Partner logos printed on the certificate (files live in /public/certificate). */
const LOGOS = {
  humana: "/humanahi-logo.png",
  qcpd:   "/certificate/qcpd-logo.jpg",
  cpd:    "/certificate/cpd-member.png",
  signature: "/certificate/signature.png",
};

export default function CourseCertificate({ course }: { course: Course }) {
  const router = useRouter();
  const [claim, setClaim] = useState<CertificateClaim | null>(null);
  // Feedback form is shown only after the certificate has been downloaded/printed
  const [downloaded, setDownloaded] = useState(() => !!getProgress(course.id).certificateDownloaded);
  const [feedbackDone, setFeedbackDone] = useState(() => !!getProgress(course.id).feedbackSubmittedAt);

  const [busy, setBusy] = useState(false);

  const unlockFeedback = () => {
    markCertificateDownloaded(course.id);
    setDownloaded(true);
    setTimeout(() => document.getElementById("feedback")?.scrollIntoView({ behavior: "smooth" }), 400);
  };

  /* Builds the PDF in the browser from an off-screen, fixed-size (A4 landscape) copy of the
     certificate, so phones and desktops all get the same single-page landscape file.
     Falls back to the browser print dialog if rendering fails. */
  const download = async () => {
    if (busy || !claim) return;
    setBusy(true);
    let host: HTMLDivElement | null = null;
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);
      const src = document.querySelector<HTMLElement>(".certificate");
      if (!src) throw new Error("certificate not rendered");
      const clone = src.cloneNode(true) as HTMLElement;
      clone.classList.add("cert-export");
      host = document.createElement("div");
      host.className = "cert-stage cert-stage--export";
      host.style.cssText = "position:fixed;left:-20000px;top:0;width:1123px;height:794px;background:#fff;overflow:hidden;";
      host.appendChild(clone);
      document.body.appendChild(host);
      await document.fonts?.ready;
      await Promise.all(Array.from(clone.querySelectorAll("img")).map(img =>
        img.complete ? Promise.resolve() : new Promise<void>(r => { img.onload = () => r(); img.onerror = () => r(); })));
      const canvas = await html2canvas(clone, {
        scale: 2, backgroundColor: "#ffffff", useCORS: true, logging: false,
        width: 1123, height: 794, windowWidth: 1123, windowHeight: 794,
      });
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4", compress: true });
      pdf.setProperties({ title: `Certificate of Completion — ${claim.name}`, subject: course.title, author: "Humana AI · Qatar CPD" });
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.94), "JPEG", 0, 0, 297, 210);
      pdf.save(`Humana-AI-Certificate-${claim.certificateId}.pdf`);
      unlockFeedback();
    } catch (e) {
      console.warn("[certificate] PDF generation failed, falling back to print:", e);
      const onAfter = () => { window.removeEventListener("afterprint", onAfter); unlockFeedback(); };
      window.addEventListener("afterprint", onAfter);
      window.print();
    } finally {
      host?.remove();
      setBusy(false);
    }
  };

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
              <button onClick={download} disabled={busy} className="btn-primary" style={{ fontSize:13, padding:"10px 18px", opacity: busy ? 0.6 : 1 }}>
                {busy ? "Preparing PDF…" : "Download PDF"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background:"#F5F8FF", padding:"40px 0 64px" }} className="cert-section">
        <div className="wrap">
          <div className="cert-stage">
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
                <img src={LOGOS.qcpd} alt="Qatar Centre for Peace and Democracy" className="cert-logo" />
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
                <div className="cert-foot-col">
                  <div className="cert-foot-label">Date of Completion</div>
                  <div className="cert-foot-value cert-date">{date}</div>
                </div>
                <div className="cert-foot-col">
                  <img src={LOGOS.signature} alt="Authorised signature" className="cert-signature" />
                  <div className="cert-sig-line" />
                  <div className="cert-foot-label">Authorised Signature</div>
                  <div className="cert-foot-value">Qatar Centre for Peace and Democracy</div>
                </div>
                <div className="cert-foot-col">
                  <img src={LOGOS.cpd} alt="CPD Member — The CPD Certification Service" className="cert-seal-img" />
                  <div className="cert-sig-line" />
                  <div className="cert-foot-label">Issued by</div>
                  <div className="cert-foot-value">Humana AI · Qatar CPD</div>
                </div>
              </div>
              <div className="cert-serial">Certificate No. {claim.certificateId}</div>
            </div>
          </div>
          </div>

          <p className="mono-label no-print" style={{ color:"#A8BEDB", textAlign:"center", marginTop:20 }}>
            Download PDF saves a single-page A4 landscape certificate · Works on phones and desktops
          </p>
        </div>
      </section>

      {downloaded && !feedbackDone && (
        <CourseFeedback course={course} certificateId={claim.certificateId} completedAt={claim.issuedAt}
          onSubmitted={() => { setFeedbackDone(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
      )}

      {downloaded && feedbackDone && (
        <section className="no-print" style={{ background:"#fff", padding:"48px 0 64px", borderTop:"1px solid #E0E8F4" }}>
          <div className="wrap" style={{ maxWidth:820 }}>
            <div className="learn-callout" style={{ marginTop:0, background:"rgba(22,163,74,0.06)", borderColor:"rgba(22,163,74,0.3)" }}>
              <div>
                <div className="label-xs" style={{ color:"#16A34A", marginBottom:6 }}>Thank you</div>
                <div className="heading-3" style={{ fontSize:16, color:"#0C1228", marginBottom:6 }}>
                  Thank you for your feedback and for participating in the Humana AI Human Rights Learning Programme.
                </div>
                <p className="body-text" style={{ fontSize:14, color:"#64748B" }}>
                  Your feedback helps us continue improving and providing accessible human rights education free of charge.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
