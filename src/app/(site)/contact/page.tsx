"use client";
import { useState } from "react";

const channels = [
  { tag:"General",   h:"General Inquiries",  e:"info@qatarcpd.com",    b:"Questions about Humana AI, partnerships, or feedback." },
  { tag:"Technical", h:"Technical Support",  e:"support@qatarcpd.com", b:"Bug reports, feature requests, or platform issues." },
  { tag:"Press",     h:"Media & Press",      e:"media@qatarcpd.com",   b:"Press inquiries, interviews, and media coverage." },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name:"", email:"", subject:"", message:"" });
  const [status, setStatus] = useState<"idle"|"sending"|"sent">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    await new Promise(r => setTimeout(r, 1000));
    setStatus("sent");
  };

  return (
    <div>

      {/* Hero */}
      <section className="hero-bg section-pad">
        <div className="wrap">
          <div className="label-xs" style={{ color:"#1B4FD8", marginBottom:16 }}>Contact</div>
          <h1 className="heading-1" style={{ color:"#0C1228", maxWidth:560, marginBottom:20 }}>Get In Touch</h1>
          <p className="body-text" style={{ fontSize:"clamp(15px,2vw,17px)", color:"#64748B", maxWidth:440 }}>
            Questions, feedback, or collaboration? We&apos;re here and we listen.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-pad" style={{ background:"#fff" }}>
        <div className="wrap">
          <div className="contact-layout">

            {/* Left: channels */}
            <div>
              <div className="label-xs" style={{ color:"#1B4FD8", marginBottom:20 }}>Contact Channels</div>
              <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:12 }}>
                {channels.map(c => (
                  <div key={c.tag} className="card" style={{ padding:"22px 24px" }}>
                    <span className="tag" style={{ marginBottom:10 }}>{c.tag}</span>
                    <div className="heading-3" style={{ fontSize:14, color:"#0C1228", marginBottom:4 }}>{c.h}</div>
                    <a href={`mailto:${c.e}`} className="body-text" style={{ fontSize:13, color:"#1B4FD8", textDecoration:"none", display:"block", marginBottom:6 }}>{c.e}</a>
                    <p className="body-text" style={{ fontSize:12, color:"#64748B", lineHeight:1.6 }}>{c.b}</p>
                  </div>
                ))}
              </div>
              <div className="card" style={{ padding:"22px 24px" }}>
                <div className="label-xs" style={{ color:"#1B4FD8", marginBottom:10 }}>Organisation</div>
                <p className="body-text" style={{ fontSize:14, color:"#64748B", lineHeight:1.6 }}>
                  Qatar CPD<br/>
                  <a href="https://qatarcpd.com" target="_blank" rel="noopener noreferrer" style={{ color:"#1B4FD8", fontWeight:600, textDecoration:"none" }}>qatarcpd.com</a>
                </p>
              </div>
            </div>

            {/* Right: form */}
            <div>
              <div className="label-xs" style={{ color:"#1B4FD8", marginBottom:24 }}>Send a Message</div>

              {status === "sent" ? (
                <div className="card" style={{ padding:"56px 40px", textAlign:"center" }}>
                  <div style={{ width:48, height:48, borderRadius:8, background:"rgba(34,197,94,0.1)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 10l5 5 7-8" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="heading-3" style={{ fontSize:18, color:"#0C1228", marginBottom:8 }}>Message Sent</div>
                  <p className="body-text" style={{ fontSize:14, color:"#64748B" }}>Thank you for reaching out. We&apos;ll get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:18 }}>
                  <div className="form-row-2">
                    {([["Name","name","text","Your full name"],["Email","email","email","your@email.com"]] as [string,string,string,string][]).map(([label,key,type,ph]) => (
                      <div key={key}>
                        <label className="form-label">{label}</label>
                        <input type={type} required value={(form as Record<string,string>)[key]} placeholder={ph}
                          onChange={e => setForm({...form,[key]:e.target.value})} className="form-input"/>
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="form-label">Subject</label>
                    <input type="text" required value={form.subject} placeholder="What is your message about?"
                      onChange={e => setForm({...form,subject:e.target.value})} className="form-input"/>
                  </div>
                  <div>
                    <label className="form-label">Message</label>
                    <textarea required rows={6} value={form.message} placeholder="Tell us how we can help…"
                      onChange={e => setForm({...form,message:e.target.value})} className="form-textarea"/>
                  </div>
                  <div>
                    <button type="submit" disabled={status==="sending"} className="btn-primary"
                      style={{ fontSize:14, padding:"13px 28px", opacity: status==="sending" ? 0.5 : 1, cursor: status==="sending" ? "not-allowed" : "pointer" }}>
                      {status==="sending" ? "Sending…" : "Send Message"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
