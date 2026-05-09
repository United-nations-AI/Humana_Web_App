import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Humana AI",
  description: "Learn about Humana AI's mission to democratize human rights education and the team at Qatar CPD behind it.",
};

const values = [
  { n:"01", h:"Universal Dignity",  b:"Every human is born free and equal. Humana AI exists to make that principle real — giving everyone access to knowledge about their rights." },
  { n:"02", h:"Accessible Justice", b:"Legal knowledge shouldn't be locked behind expensive consultations. We translate complexity into clarity, for free." },
  { n:"03", h:"Ethical AI",         b:"Every response is guided by strict guardrails rooted in international human rights law. We reject harm, discrimination, and misinformation." },
  { n:"04", h:"Global Reach",       b:"From Geneva to Dhaka, New York to Nairobi — Humana AI is built for the entire world, not just the privileged few." },
];

const timeline = [
  { y:"1948",  e:"Universal Declaration of Human Rights adopted by the UN General Assembly. 30 articles defining the foundation of human rights worldwide." },
  { y:"1951",  e:"Refugee Convention signed — foundational protection for people fleeing persecution." },
  { y:"1966",  e:"International Covenants (ICCPR & ICESCR) established binding international law for civil, political, economic, and social rights." },
  { y:"Today", e:"Humana AI brings the full body of international human rights knowledge to every person, instantly, at no cost." },
];

export default function AboutPage() {
  return (
    <div>

      {/* Hero */}
      <section className="hero-bg section-pad">
        <div className="wrap">
          <div className="label-xs" style={{ color:"#1B4FD8", marginBottom:16 }}>About Humana AI</div>
          <h1 className="heading-1" style={{ color:"#0C1228", maxWidth:680, marginBottom:24 }}>
            Human Rights Knowledge For Every Human
          </h1>
          <p className="body-text" style={{ fontSize:"clamp(15px,2vw,18px)", color:"#64748B", maxWidth:540, marginBottom:40 }}>
            Humana AI is a free, AI-powered platform making human rights education accessible to every person on Earth — regardless of geography, language, or economic status.
          </p>
          <Link href="/chat" className="btn-primary">Try Humana AI Free →</Link>
        </div>
      </section>

      {/* Mission + Values */}
      <section className="section-pad" style={{ background:"#fff" }}>
        <div className="wrap">
          <div style={{ display:"grid", gridTemplateColumns:"1fr", gap:64 }}>
            <div>
              <div className="label-xs" style={{ color:"#1B4FD8", marginBottom:16 }}>Our Mission</div>
              <h2 className="heading-2" style={{ color:"#0C1228", maxWidth:480, marginBottom:20 }}>
                Democratizing Human Rights Education
              </h2>
              <p className="body-text" style={{ fontSize:15, color:"#64748B", marginBottom:16 }}>
                Millions face rights violations without knowing what protections they&apos;re entitled to. Language barriers, legal complexity, and lack of resources leave the most vulnerable without recourse.
              </p>
              <p className="body-text" style={{ fontSize:15, color:"#64748B" }}>
                Humana AI changes that. By combining advanced AI with a curated knowledge base of international human rights law, we provide instant, accurate guidance — free, no registration, for everyone.
              </p>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {values.map(v => (
                <div key={v.n} className="card" style={{ padding:"22px 24px" }}>
                  <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
                    <span className="label-xs" style={{ color:"#1B4FD8", flexShrink:0, paddingTop:3 }}>{v.n}</span>
                    <div>
                      <div className="heading-3" style={{ fontSize:15, color:"#0C1228", marginBottom:6 }}>{v.h}</div>
                      <p className="body-text" style={{ fontSize:13, color:"#64748B" }}>{v.b}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="dark-bg section-pad">
        <div className="wrap">
          <div className="label-xs" style={{ color:"rgba(147,174,255,0.75)", marginBottom:16 }}>Historical Context</div>
          <h2 className="heading-2" style={{ color:"#fff", maxWidth:400, marginBottom:52 }}>
            Standing on Shoulders of Giants
          </h2>
          <div style={{ display:"flex", flexDirection:"column", gap:0, paddingLeft:80, position:"relative" }}>
            {timeline.map((t,i) => (
              <div key={i} style={{ position:"relative", paddingBottom: i < timeline.length-1 ? 36 : 0, paddingLeft:28, borderLeft: i < timeline.length-1 ? "1px solid rgba(255,255,255,0.1)" : "1px solid transparent" }}>
                <span className="mono-label" style={{ color:"rgba(147,174,255,0.8)", position:"absolute", left:-80, top:3, width:68, textAlign:"right" }}>{t.y}</span>
                <div style={{ width:8, height:8, borderRadius:"50%", background:"#1B4FD8", position:"absolute", left:-4, top:5 }}/>
                <p className="body-text" style={{ fontSize:14, color:"rgba(255,255,255,0.65)" }}>{t.e}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Qatar CPD */}
      <section className="section-pad" style={{ background:"#fff" }}>
        <div className="wrap">
          <div className="two-col-lg">
            <div>
              <div className="label-xs" style={{ color:"#1B4FD8", marginBottom:16 }}>Powered By</div>
              <h2 className="heading-2" style={{ color:"#0C1228", marginBottom:20 }}>Qatar CPD</h2>
              <p className="body-text" style={{ fontSize:15, color:"#64748B", marginBottom:16 }}>
                Humana AI is an initiative of{" "}
                <a href="https://qatarcpd.com" target="_blank" rel="noopener noreferrer" style={{ color:"#1B4FD8", fontWeight:600, textDecoration:"none" }}>Qatar CPD</a>
                , a leading professional development and knowledge organization committed to capacity building and global education access.
              </p>
              <p className="body-text" style={{ fontSize:15, color:"#64748B", marginBottom:32 }}>
                By combining Qatar CPD&apos;s commitment to accessible education with the latest advances in AI, Humana AI delivers a platform that serves the global community without commercial constraints.
              </p>
              <a href="https://qatarcpd.com" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ fontSize:14, padding:"11px 20px" }}>
                Visit Qatar CPD →
              </a>
            </div>
            <div className="card" style={{ borderRadius:12, padding:"48px 40px", textAlign:"center", boxShadow:"rgba(6,14,43,0.06) 0 4px 24px" }}>
              <div style={{ width:56, height:56, borderRadius:10, background:"#1B4FD8", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>
                <svg width="26" height="26" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.6"/>
                  <path d="M2.5 8h11M8 2.5v11" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="heading-3" style={{ fontSize:22, color:"#0C1228", marginBottom:6 }}>Humana AI</div>
              <div className="label-xs" style={{ color:"#64748B", marginBottom:20 }}>Human Rights AI Platform</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center" }}>
                {["Free","No Login","Global","OpenAI Powered","Supabase"].map(t => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
