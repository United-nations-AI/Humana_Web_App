"use client";
import { useState } from "react";
import type { ChatThread } from "@/types/chat";
import { groupThreadsByDate } from "@/lib/chat-storage";
import { useLang } from "@/context/LanguageContext";

interface Props {
  threads: ChatThread[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export default function ChatSidebar({ threads, activeId, onSelect, onNew, onDelete, onClearAll }: Props) {
  const [hoverId, setHoverId]   = useState<string | null>(null);
  const [confirm, setConfirm]   = useState(false);
  const groups = groupThreadsByDate(threads);
  const { t } = useLang();

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>

      {/* Top: logo + close */}
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <img src="/humanahi-logo.png" alt="Humana AI" style={{ width: 26, height: 26, objectFit: "contain", borderRadius: 5 }} />
          </div>
          <span className="sidebar-logo-name">Humana AI</span>
        </div>
      </div>

      {/* New chat */}
      <div className="sidebar-new-btn-wrap">
        <button onClick={onNew} className="sidebar-new-btn">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12M2 8h12" stroke="rgba(0,0,0,0.5)" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          {t("sidebar_new")}
        </button>
      </div>

      {/* Thread list */}
      <div className="sidebar-history">
        {threads.length === 0 && (
          <p className="sidebar-empty">{t("sidebar_empty")}<br/>{t("sidebar_start")}</p>
        )}
        {Object.entries(groups).map(([group, items]) =>
          items.length === 0 ? null : (
            <div key={group}>
              <div className="sidebar-group-label">{group}</div>
              {items.map(t => (
                <div key={t.id} className="sidebar-thread-row"
                  onMouseEnter={() => setHoverId(t.id)}
                  onMouseLeave={() => setHoverId(null)}
                >
                  <button
                    onClick={() => onSelect(t.id)}
                    className={`sidebar-thread-btn${activeId === t.id ? " active" : ""}`}
                  >
                    <div className="sidebar-thread-title">{t.title}</div>
                    <div className="sidebar-thread-meta">
                      {t.messages.length} message{t.messages.length !== 1 ? "s" : ""}
                    </div>
                  </button>
                  {(hoverId === t.id || activeId === t.id) && (
                    <button onClick={() => onDelete(t.id)} className="sidebar-delete-btn" title="Delete chat">
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 9a1 1 0 001 1h6a1 1 0 001-1l1-9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Footer: clear all */}
      {threads.length > 0 && (
        <div className="sidebar-footer">
          {confirm ? (
            <div className="sidebar-confirm-row">
              <button onClick={() => { onClearAll(); setConfirm(false); }} className="sidebar-confirm-yes">
                {t("sidebar_clear")}
              </button>
              <button onClick={() => setConfirm(false)} className="sidebar-confirm-no">
                Cancel
              </button>
            </div>
          ) : (
            <button onClick={() => setConfirm(true)} className="sidebar-clear-btn">
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 9a1 1 0 001 1h6a1 1 0 001-1l1-9" stroke="rgba(0,0,0,0.35)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {t("sidebar_clear")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
