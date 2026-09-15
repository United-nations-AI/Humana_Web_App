"use client";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";

export default function Footer() {
  const year = new Date().getFullYear();
  const { t } = useLang();
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">

          {/* Brand */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <div style={{ width:34, height:34, borderRadius:6, background:"rgba(255,255,255,0.9)", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
                <img src="/humanahi-logo.png" alt="Humana AI" style={{ width: 30, height: 30, objectFit: "contain" }} />
              </div>
              <span className="footer-brand-name">Humana AI</span>
            </div>
            <p className="footer-brand-desc" style={{ maxWidth:300, marginBottom:20 }}>
              {t("footer_tagline")}
            </p>
            <div>
              <span className="footer-col-heading" style={{ display:"block", marginBottom:4 }}>{t("footer_powered")}</span>
              <a href="https://qatarcpd.com" target="_blank" rel="noopener noreferrer"
                style={{ fontFamily:"'Space Grotesk',Arial,sans-serif", fontSize:14, fontWeight:600, color:"rgba(147,174,255,0.85)", textDecoration:"none", letterSpacing:"-0.01em" }}>
                Qatar CPD →
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <div className="footer-col-heading">{t("footer_platform")}</div>
            {([["nav_cta","/chat"],["nav_learn","/learn"],["nav_about","/about"]] as [string,string][]).map(([k,h])=>(
              <Link key={h} href={h} className="footer-link">{k === "nav_cta" ? t("nav_chat") : t(k)}</Link>
            ))}
          </div>

          {/* Legal */}
          <div>
            <div className="footer-col-heading">{t("footer_legal")}</div>
            {([["nav_terms","/terms"],["nav_contact","/contact"]] as [string,string][]).map(([k,h])=>(
              <Link key={h} href={h} className="footer-link">{t(k)}</Link>
            ))}
          </div>
        </div>

        {/* Wordmark + copyright */}
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", paddingTop:24, overflow:"hidden", userSelect:"none" }}>
          <div style={{ fontFamily:"'Space Grotesk',Arial,sans-serif", fontSize:"clamp(32px,6vw,80px)", fontWeight:700, letterSpacing:"-0.05em", color:"rgba(255,255,255,0.05)", lineHeight:0.9, marginBottom:28, whiteSpace:"nowrap" }}>
            humana ai
          </div>
          <div className="footer-bottom">
            <span className="footer-copy">
              © {year} Humana AI — Powered by{" "}
              <a href="https://qatarcpd.com" target="_blank" rel="noopener noreferrer" style={{ color:"rgba(255,255,255,0.35)", textDecoration:"none" }}>Qatar CPD</a>.
              {" "}{t("footer_rights")}
            </span>
            <div style={{ display:"flex", gap:20 }}>
              {([["nav_terms","/terms"],["nav_contact","/contact"]] as [string,string][]).map(([k,h])=>(
                <Link key={h} href={h} className="footer-copy" style={{ textDecoration:"none", color:"rgba(255,255,255,0.25)" }}>{t(k)}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
