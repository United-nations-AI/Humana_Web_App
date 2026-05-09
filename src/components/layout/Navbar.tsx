"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/context/LanguageContext";
import { LANGUAGES } from "@/lib/i18n";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const path = usePathname();
  const { lang, setLang, t } = useLang();
  const langRef = useRef<HTMLDivElement>(null);

  const links = [
    { key: "nav_home",    href: "/" },
    { key: "nav_chat",    href: "/chat" },
    { key: "nav_about",   href: "/about" },
    { key: "nav_contact", href: "/contact" },
  ];

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const currentLang = LANGUAGES.find(l => l.code === lang)!;

  return (
    <header className="nav-bar">
      <div className="wrap">
        <div className="nav-inner">

          {/* Logo */}
          <Link href="/" className="nav-logo">
            <div className="nav-logo-icon">
              <img src="/humanahi-logo.png" alt="Humana AI" style={{ width: 32, height: 32, objectFit: "contain", borderRadius: 6 }} />
            </div>
            <div>
              <div className="nav-logo-name">Humana AI</div>
              <div className="nav-logo-sub">by Qatar CPD</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="nav-links">
            {links.map(l => (
              <Link key={l.href} href={l.href} className={`nav-link${path === l.href ? " active" : ""}`}>
                {t(l.key)}
              </Link>
            ))}
          </nav>

          {/* Desktop right: lang + CTA */}
          <div className="nav-cta">
            {/* Language switcher */}
            <div className="lang-switcher" ref={langRef}>
              <button className="lang-btn" onClick={() => setLangOpen(v => !v)} aria-label="Switch language">
                <span style={{ fontSize: 16, lineHeight: 1 }}>{currentLang.flag}</span>
                <span>{currentLang.native}</span>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </button>
              {langOpen && (
                <div className="lang-dropdown">
                  {LANGUAGES.map(l => (
                    <button key={l.code} className={`lang-option${lang === l.code ? " active" : ""}`}
                      onClick={() => { setLang(l.code); setLangOpen(false); }}>
                      <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{l.flag}</span>
                      <span className="lang-option-native">{l.native}</span>
                      <span className="lang-option-label">{l.label}</span>
                      {lang === l.code && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginInlineStart: "auto" }}>
                          <path d="M2 6l3 3 5-5" stroke="#010120" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span className="nav-cta-label">Free · No Login</span>
            {path !== "/chat" && (
              <Link href="/chat" className="nav-cta-btn">{t("nav_cta")}</Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="nav-mobile-toggle" aria-label="Toggle menu">
            <span className="nav-mobile-line" style={{ transform: open ? "rotate(45deg) translate(5px,5px)" : "none" }}/>
            <span className="nav-mobile-line" style={{ opacity: open ? 0 : 1 }}/>
            <span className="nav-mobile-line" style={{ transform: open ? "rotate(-45deg) translate(5px,-5px)" : "none" }}/>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="nav-mobile-menu">
          <div className="wrap">
            <div className="nav-mobile-list">
              {links.map(l => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                  className={`nav-mobile-link${path === l.href ? " active" : ""}`}>
                  {t(l.key)}
                </Link>
              ))}
              {/* Mobile language row */}
              <div className="lang-mobile-row">
                {LANGUAGES.map(l => (
                  <button key={l.code} className={`lang-mobile-opt${lang === l.code ? " active" : ""}`}
                    onClick={() => { setLang(l.code); setOpen(false); }}>
                    {l.flag} {l.native}
                  </button>
                ))}
              </div>
              {path !== "/chat" && (
                <Link href="/chat" onClick={() => setOpen(false)} className="nav-mobile-cta">
                  {t("nav_cta")}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
