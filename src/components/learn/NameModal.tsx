"use client";
import { useState } from "react";

interface Props {
  courseTitle: string;
  initialName?: string;
  onConfirm: (name: string) => void;
  onCancel: () => void;
}

export default function NameModal({ courseTitle, initialName = "", onConfirm, onCancel }: Props) {
  const [name, setName] = useState(initialName);
  const valid = name.trim().length >= 2;

  return (
    <div className="learn-modal-overlay" onClick={onCancel}>
      <div className="learn-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="label-xs" style={{ color:"#1B4FD8", marginBottom:10 }}>Before You Begin</div>
        <h3 className="heading-3" style={{ fontSize:22, color:"#0C1228", marginBottom:8 }}>What should we call you?</h3>
        <p className="body-text" style={{ fontSize:14, color:"#64748B", marginBottom:22 }}>
          Your name will appear on the certificate you earn when you complete <strong style={{ color:"#1E293B" }}>{courseTitle}</strong>.
        </p>

        <form onSubmit={e => { e.preventDefault(); if (valid) onConfirm(name.trim()); }}>
          <label className="form-label" htmlFor="learner-name">Full name</label>
          <input
            id="learner-name"
            className="form-input"
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Amina Rahman"
            maxLength={60}
          />
          <p className="mono-label" style={{ color:"#A8BEDB", marginTop:8 }}>
            Stored only in this browser · No account required
          </p>

          <div style={{ display:"flex", gap:10, marginTop:24 }}>
            <button type="button" onClick={onCancel} className="btn-outline" style={{ flex:1, fontSize:14, padding:"11px 16px" }}>
              Cancel
            </button>
            <button type="submit" disabled={!valid} className="btn-primary"
              style={{ flex:2, fontSize:14, padding:"11px 16px", opacity: valid ? 1 : 0.5, cursor: valid ? "pointer" : "not-allowed" }}>
              Start Course →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
