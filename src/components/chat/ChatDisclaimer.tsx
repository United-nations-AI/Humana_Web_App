"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "humana_disclaimer_accepted";

export default function ChatDisclaimer({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // null = not yet checked (avoid flash), true = accepted, false = show modal
  const [accepted, setAccepted] = useState<boolean | null>(null);
  const [declining, setDeclining] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    setAccepted(stored === "true" ? true : false);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setAccepted(true);
  };

  const handleDecline = () => {
    setDeclining(true);
    setTimeout(() => router.push("/"), 300);
  };

  // Still loading from localStorage — render nothing to avoid flash
  if (accepted === null) return null;

  // Already accepted — render children directly
  if (accepted === true) return <>{children}</>;

  // Show disclaimer modal
  return (
    <>
      {/* Blurred page behind overlay */}
      <div style={{ filter: "blur(4px)", pointerEvents: "none", height: "100dvh", overflow: "hidden" }}>
        {children}
      </div>

      {/* Full-screen overlay */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
        background: "rgba(10,14,40,0.72)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        opacity: declining ? 0 : 1,
        transition: "opacity 0.3s ease",
      }}>
        <div style={{
          background: "#fff",
          borderRadius: 16,
          width: "100%",
          maxWidth: 580,
          maxHeight: "90dvh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 24px 64px rgba(10,14,40,0.35)",
          overflow: "hidden",
          border: "1px solid #E0E8F4",
        }}>

          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, #1E293B 0%, #0f172a 100%)",
            padding: "28px 32px 24px",
            flexShrink: 0,
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 12, marginBottom: 14,
            }}>
              {/* Shield icon */}
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: "rgba(59,130,246,0.18)",
                border: "1.5px solid rgba(59,130,246,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"
                    stroke="#3B82F6" strokeWidth="1.8" strokeLinejoin="round"/>
                  <path d="M9 12l2 2 4-4" stroke="#3B82F6" strokeWidth="1.8"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div style={{
                  fontFamily: "'JetBrains Mono','Courier New',monospace",
                  fontSize: 10, fontWeight: 500, letterSpacing: "0.1em",
                  textTransform: "uppercase", color: "rgba(99,130,246,0.8)",
                  marginBottom: 3,
                }}>Before You Enter</div>
                <div style={{
                  fontFamily: "'Space Grotesk',Arial,sans-serif",
                  fontSize: 19, fontWeight: 700, letterSpacing: "-0.03em",
                  color: "#fff", lineHeight: 1.2,
                }}>Important Disclaimer</div>
              </div>
            </div>
            <p style={{
              fontFamily: "'Space Grotesk',Arial,sans-serif",
              fontSize: 13, color: "rgba(255,255,255,0.55)",
              lineHeight: 1.6, margin: 0, letterSpacing: "-0.01em",
            }}>
              Please read the following carefully. You must agree to the terms below to access the Humana AI chat service.
            </p>
          </div>

          {/* Scrollable body */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "24px 32px",
            scrollbarWidth: "thin", scrollbarColor: "#C8D8F0 transparent",
          }}>

            {/* Section 1 — Free Service Notice */}
            <Section
              icon="🌍"
              color="#3B82F6"
              title="Free, Global Human Rights Platform"
              text="Humana AI is a free, publicly accessible platform dedicated to human rights education and awareness. This service is operated by Qatar CPD and is available to anyone worldwide at no cost, with no account or registration required."
            />

            {/* Section 2 — Serious Purpose */}
            <Section
              icon="⚖️"
              color="#f59e0b"
              title="A Serious Platform — Use Responsibly"
              text="This platform exists to provide access to human rights information, international law guidance, and humanitarian resources. It is intended for educational, advocacy, and awareness purposes. Misuse, harassment, or submission of harmful content is strictly prohibited."
            />

            {/* Section 3 — AI Disclaimer */}
            <Section
              icon="🤖"
              color="#8b5cf6"
              title="AI-Generated Responses — Verify Before Acting"
              text="All responses are generated by an AI language model. While we strive for accuracy, the AI can make mistakes, omit context, or produce outdated information. Do not treat any response as legal advice, professional counsel, or an authoritative ruling. Always verify critical information through official sources such as the United Nations, national human rights institutions, or qualified legal professionals."
            />

            {/* Section 4 — Not Legal Advice */}
            <Section
              icon="🚫"
              color="#ef4444"
              title="Not Legal Advice"
              text="Humana AI does not provide legal advice or legal representation. Responses should not be used as a substitute for advice from a qualified lawyer or legal professional. If you are in immediate danger or facing a legal emergency, contact local authorities or a licensed legal professional immediately."
            />

            {/* Section 5 — Data & Privacy */}
            <Section
              icon="🔒"
              color="#10b981"
              title="Privacy & Data"
              text="Humana AI logs conversation data solely to improve safety guardrails and service quality. No personally identifiable information is required. Your conversation data is stored securely and is not sold or shared with third parties for commercial purposes."
            />

            {/* Terms checkbox */}
            <div
              onClick={() => setChecked(v => !v)}
              style={{
                display: "flex", alignItems: "flex-start", gap: 12,
                padding: "14px 16px",
                background: checked ? "rgba(59,130,246,0.06)" : "#F8FAFC",
                border: `1.5px solid ${checked ? "rgba(59,130,246,0.35)" : "#E0E8F4"}`,
                borderRadius: 10, cursor: "pointer", marginTop: 4,
                transition: "all 0.15s",
              }}
            >
              <div style={{
                width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 1,
                border: `2px solid ${checked ? "#3B82F6" : "#C8D8F0"}`,
                background: checked ? "#3B82F6" : "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.15s",
              }}>
                {checked && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.8"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <p style={{
                fontFamily: "'Space Grotesk',Arial,sans-serif",
                fontSize: 13, color: "#1E293B", lineHeight: 1.55,
                margin: 0, letterSpacing: "-0.01em",
              }}>
                I have read and understood the above disclaimer. I accept the{" "}
                <a
                  href="/terms" target="_blank" rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  style={{ color: "#3B82F6", textDecoration: "underline" }}
                >
                  Terms & Conditions
                </a>{" "}
                and acknowledge that responses are AI-generated and should be independently verified.
              </p>
            </div>
          </div>

          {/* Footer buttons */}
          <div style={{
            padding: "18px 32px 24px",
            borderTop: "1px solid #E0E8F4",
            display: "flex", gap: 10, flexShrink: 0,
            background: "#fff",
          }}>
            <button
              onClick={handleDecline}
              style={{
                flex: 1,
                fontFamily: "'Space Grotesk',Arial,sans-serif",
                fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em",
                background: "#F8FAFC", color: "#64748B",
                border: "1.5px solid #E0E8F4", borderRadius: 8,
                padding: "11px 16px", cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => {
                (e.target as HTMLButtonElement).style.background = "#FEF2F2";
                (e.target as HTMLButtonElement).style.color = "#ef4444";
                (e.target as HTMLButtonElement).style.borderColor = "rgba(239,68,68,0.25)";
              }}
              onMouseLeave={e => {
                (e.target as HTMLButtonElement).style.background = "#F8FAFC";
                (e.target as HTMLButtonElement).style.color = "#64748B";
                (e.target as HTMLButtonElement).style.borderColor = "#E0E8F4";
              }}
            >
              Decline &amp; Return Home
            </button>
            <button
              onClick={handleAccept}
              disabled={!checked}
              style={{
                flex: 2,
                fontFamily: "'Space Grotesk',Arial,sans-serif",
                fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em",
                background: checked ? "#3B82F6" : "#E0E8F4",
                color: checked ? "#fff" : "#94A3B8",
                border: "none", borderRadius: 8,
                padding: "12px 20px", cursor: checked ? "pointer" : "not-allowed",
                transition: "all 0.15s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              }}
              onMouseEnter={e => {
                if (!checked) return;
                (e.target as HTMLButtonElement).style.background = "#2563EB";
              }}
              onMouseLeave={e => {
                if (!checked) return;
                (e.target as HTMLButtonElement).style.background = "#3B82F6";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8a5 5 0 1010 0A5 5 0 003 8z"
                  stroke="currentColor" strokeWidth="1.5"/>
                <path d="M6 8l2 2 3-3"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              I Agree &amp; Enter Chat
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function Section({ icon, color, title, text }: {
  icon: string; color: string; title: string; text: string;
}) {
  return (
    <div style={{
      display: "flex", gap: 12, marginBottom: 18,
      padding: "14px 16px",
      background: "#F8FAFC",
      border: "1px solid #E0E8F4",
      borderLeft: `3px solid ${color}`,
      borderRadius: "0 8px 8px 0",
    }}>
      <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <div>
        <div style={{
          fontFamily: "'Space Grotesk',Arial,sans-serif",
          fontSize: 13, fontWeight: 700, color: "#1E293B",
          letterSpacing: "-0.01em", marginBottom: 5,
        }}>{title}</div>
        <p style={{
          fontFamily: "'Space Grotesk',Arial,sans-serif",
          fontSize: 12.5, color: "#64748B", lineHeight: 1.65,
          margin: 0, letterSpacing: "-0.005em",
        }}>{text}</p>
      </div>
    </div>
  );
}
