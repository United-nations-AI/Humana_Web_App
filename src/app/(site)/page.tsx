import Link from "next/link";

const stats   = [{ v:"195+", l:"Countries Covered" },{ v:"30+", l:"Rights Articles (UDHR)" },{ v:"Free", l:"Always, For Everyone" }];
const features = [
  { tag:"Rights Education",   h:"Know Your Rights Instantly",   b:"Ask about the UDHR, ICCPR, civil liberties, right to education, asylum and more — get clear, accurate answers in plain language." },
  { tag:"International Law",  h:"UN Treaties & Conventions",    b:"Navigate the ICCPR, ICESCR, Refugee Convention, and all major international instruments with ease." },
  { tag:"Advocacy Tools",     h:"Support for Defenders",        b:"Activists, lawyers, journalists, and citizens — understand reporting mechanisms, violations, and pathways to justice." },
  { tag:"Global Access",      h:"Built for the World",          b:"Designed for a global audience with responses adaptable to diverse legal systems and 195 countries." },
];
const principles = [
  { n:"01", h:"Universal Access",   b:"No signup, no payment, no barriers. Every person deserves access to information about their human rights." },
  { n:"02", h:"Responsible AI",     b:"Guardrails rooted in international human rights law are embedded in every response. We never promote harm." },
  { n:"03", h:"Full Transparency",  b:"Powered by OpenAI and Supabase. Interactions are logged only to improve the system and strengthen safety." },
];

export default function HomePage() {
  return (
    <div>

      {/* ── Hero ── */}
      <section className="hero-bg section-pad">
        <div className="wrap" style={{ textAlign:"center" }}>
          <div className="tag" style={{ marginBottom:28 }}>
            Free for Everyone · No Login Required
          </div>
          <h1 className="heading-1" style={{ color:"#0C1228", maxWidth:820, margin:"0 auto 24px" }}>
            AI That Stands Up<br/>For Human Rights
          </h1>
          <p className="body-text" style={{ fontSize:"clamp(15px,2vw,18px)", color:"#64748B", maxWidth:520, margin:"0 auto 40px" }}>
            Humana AI gives every person on the planet free access to human rights knowledge — powered by advanced AI and international law expertise.
          </p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:12, justifyContent:"center" }}>
            <Link href="/chat" className="btn-primary">Start Chatting Free →</Link>
            <Link href="/about" className="btn-outline">Learn More</Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ background:"#fff", borderBottom:"1px solid #E0E8F4" }}>
        <div className="wrap">
          <div className="grid-stats">
            {stats.map((s,i) => (
              <div key={i} className="stat-cell">
                <div className="heading-2" style={{ color:"#0C1228", marginBottom:6 }}>{s.v}</div>
                <div className="label-xs" style={{ color:"#64748B" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section-pad" style={{ background:"#fff" }}>
        <div className="wrap">
          <div style={{ marginBottom:52 }}>
            <div className="label-xs" style={{ color:"#1B4FD8", marginBottom:14 }}>Platform Capabilities</div>
            <h2 className="heading-2" style={{ color:"#0C1228", maxWidth:480 }}>
              Everything You Need to Know Your Rights
            </h2>
          </div>
          <div className="grid-features">
            {features.map((f,i) => (
              <div key={i} className="card">
                <div className="tag" style={{ marginBottom:18 }}>{f.tag}</div>
                <h3 className="heading-3" style={{ fontSize:18, color:"#0C1228", marginBottom:10 }}>{f.h}</h3>
                <p className="body-text" style={{ fontSize:14, color:"#64748B" }}>{f.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Principles ── */}
      <section className="dark-bg section-pad">
        <div className="wrap">
          <div style={{ marginBottom:52 }}>
            <div className="label-xs" style={{ color:"rgba(147,174,255,0.75)", marginBottom:14 }}>Our Commitment</div>
            <h2 className="heading-2" style={{ color:"#fff", maxWidth:440 }}>
              Built on Principles, Not Profit
            </h2>
          </div>
          <div className="grid-principles">
            {principles.map((p,i) => (
              <div key={i} className="card-dark">
                <div className="label-xs" style={{ color:"rgba(147,174,255,0.55)", marginBottom:20 }}>{p.n}</div>
                <h3 className="heading-3" style={{ fontSize:18, color:"#fff", marginBottom:10 }}>{p.h}</h3>
                <p className="body-text" style={{ fontSize:14, color:"rgba(255,255,255,0.45)" }}>{p.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-pad" style={{ background:"#fff" }}>
        <div className="wrap" style={{ textAlign:"center" }}>
          <div className="label-xs" style={{ color:"#64748B", marginBottom:16 }}>Get Started Now</div>
          <h2 className="heading-2" style={{ color:"#0C1228", marginBottom:18 }}>Your Rights. Your Voice. Free.</h2>
          <p className="body-text" style={{ fontSize:16, color:"#64748B", maxWidth:420, margin:"0 auto 36px" }}>
            No account. No subscription. Ask anything about human rights, international law, and your freedoms.
          </p>
          <Link href="/chat" className="btn-primary" style={{ fontSize:15, padding:"14px 32px" }}>
            Open Humana AI Chat →
          </Link>
          <p className="body-text" style={{ fontSize:12, color:"#A8BEDB", marginTop:16 }}>
            Powered by{" "}
            <a href="https://qatarcpd.com" target="_blank" rel="noopener noreferrer" style={{ color:"#1B4FD8", textDecoration:"none" }}>Qatar CPD</a>
          </p>
        </div>
      </section>

    </div>
  );
}
