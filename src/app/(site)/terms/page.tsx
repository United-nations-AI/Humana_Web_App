import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions — Humana AI",
  description: "Read the terms and conditions for using Humana AI, the free human rights AI assistant.",
};

const sections = [
  { id:"1",  h:"Acceptance of Terms",       b:`By accessing or using Humana AI ("the Service"), you agree to be bound by these Terms and Conditions. The Service is provided free of charge and requires no registration or account creation.` },
  { id:"2",  h:"About the Service",         b:`Humana AI is a free, AI-powered human rights information platform operated by Qatar CPD (qatarcpd.com). The Service uses OpenAI's language model technology to provide educational information about human rights, international law, and humanitarian issues. It is intended for informational and educational purposes only.` },
  { id:"3",  h:"Not Legal Advice",          b:`IMPORTANT: Humana AI does not provide legal advice. Information provided is for educational purposes only and does not constitute legal advice, legal representation, or a legal opinion. Always consult a qualified legal professional for specific legal matters.` },
  { id:"4",  h:"Acceptable Use",            b:`You agree to use Humana AI only for lawful purposes consistent with human rights and dignity. You must not use the Service to promote violence, spread misinformation, harass others, violate anyone's rights, bypass safety guidelines, or use the Service commercially without written consent from Qatar CPD.` },
  { id:"5",  h:"Data Collection & Privacy", b:`Humana AI logs user interactions (input prompts and AI responses) solely to improve the system and strengthen AI guardrails. No personally identifiable information is required. Log data is stored securely via Supabase and is not sold or shared with third parties for commercial purposes.` },
  { id:"6",  h:"AI Limitations & Accuracy", b:`Humana AI is powered by large language model technology. While we strive for accuracy, the AI may occasionally produce incorrect or incomplete information. Human rights law evolves over time and varies by jurisdiction. Always verify critical information with authoritative sources (UN, national human rights institutions) or qualified professionals.` },
  { id:"7",  h:"Intellectual Property",     b:`The Humana AI platform, including its design, branding, and architecture, is the property of Qatar CPD. AI-generated responses are provided for your personal use. The underlying models are subject to OpenAI's terms of service.` },
  { id:"8",  h:"Disclaimer of Warranties",  b:`THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. Qatar CPD and Humana AI disclaim all warranties, including merchantability, fitness for a particular purpose, and non-infringement.` },
  { id:"9",  h:"Limitation of Liability",   b:`TO THE FULLEST EXTENT PERMITTED BY LAW, QATAR CPD AND HUMANA AI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE SERVICE.` },
  { id:"10", h:"Modifications",             b:`Qatar CPD reserves the right to modify these Terms at any time. Changes are effective immediately upon posting. Continued use of the Service constitutes acceptance of the revised terms.` },
  { id:"11", h:"Governing Law",             b:`These Terms are governed by the laws of the State of Qatar. Disputes are subject to the exclusive jurisdiction of the courts of Qatar, unless otherwise required by applicable local law.` },
  { id:"12", h:"Contact",                   b:`Questions about these Terms? Contact us:\n\nQatar CPD · qatarcpd.com · legal@qatarcpd.com` },
];

export default function TermsPage() {
  const updated = new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});
  return (
    <div>

      {/* Hero */}
      <section className="hero-bg section-pad">
        <div className="wrap">
          <div className="label-xs" style={{ color:"rgba(1,1,32,0.4)", marginBottom:16 }}>Legal</div>
          <h1 className="heading-1" style={{ color:"#010120", maxWidth:560, marginBottom:16 }}>Terms & Conditions</h1>
          <div className="mono-label" style={{ color:"rgba(1,1,32,0.4)", marginBottom:12 }}>Last updated: {updated}</div>
          <p className="body-text" style={{ fontSize:15, color:"rgba(1,1,32,0.55)", maxWidth:480 }}>
            Please read these terms carefully before using Humana AI. The Service is free for everyone.
          </p>
        </div>
      </section>

      {/* TOC */}
      <section style={{ borderBottom:"1px solid rgba(1,1,32,0.07)", padding:"28px 0", background:"#fff" }}>
        <div className="wrap">
          <div className="label-xs" style={{ color:"rgba(1,1,32,0.35)", marginBottom:14 }}>Contents</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {sections.map(s => (
              <a key={s.id} href={`#s${s.id}`} className="toc-link">{s.id}. {s.h}</a>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-pad" style={{ background:"#fff" }}>
        <div className="wrap" style={{ maxWidth:760 }}>
          <div style={{ display:"flex", flexDirection:"column", gap:48 }}>
            {sections.map(s => (
              <div key={s.id} id={`s${s.id}`}>
                <div style={{ display:"flex", alignItems:"baseline", gap:14, marginBottom:14 }}>
                  <span className="mono-label" style={{ color:"rgba(1,1,32,0.25)", flexShrink:0 }}>{s.id}.</span>
                  <h2 className="heading-3" style={{ fontSize:18, color:"#010120" }}>{s.h}</h2>
                </div>
                <div style={{ paddingLeft:28 }}>
                  {s.b.split("\n").map((line,i) => line.trim()
                    ? <p key={i} className="body-text" style={{ fontSize:14, lineHeight:1.8, color:"rgba(1,1,32,0.65)", marginBottom:6 }}>{line}</p>
                    : <br key={i}/>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
