"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ChatSidebar from "./ChatSidebar";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import type { ChatThread, Message, Attachment } from "@/types/chat";
import {
  loadThreads, saveThreads, createThread,
  saveMessage, setThreadTitle, deleteThread, hydrateAudio,
} from "@/lib/chat-storage";
import { uuid } from "@/lib/uuid";
import { useLang } from "@/context/LanguageContext";
import { LANGUAGES } from "@/lib/i18n";
import { GlobalAudioProvider } from "@/context/GlobalAudioContext";

function ChatLayoutInner({ initialThreadId }: { initialThreadId?: string }) {
  const { t, lang, setLang } = useLang();
  const router  = useRouter();

  // Safe to read localStorage directly — this component is loaded with ssr:false
  const [threads, setThreads]   = useState<ChatThread[]>(() => loadThreads());
  const [activeId, setActiveId] = useState<string | null>(() => {
    const saved = loadThreads();
    // If a threadId came from the URL, honour it; else fall back to latest
    if (initialThreadId && saved.some(t => t.id === initialThreadId)) return initialThreadId;
    return saved.length > 0 ? saved[0].id : null;
  });
  const [loading, setLoading]       = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );
  const messagesRef        = useRef<HTMLDivElement>(null);
  const latestAiMsgIdRef   = useRef<string | null>(null);
  const langRef            = useRef<HTMLDivElement>(null);
  const [langOpen, setLangOpen] = useState(false);
  const currentLang = LANGUAGES.find(l => l.code === lang) ?? LANGUAGES[0];

  // On mount: handle URL → thread resolution, then hydrate audio blobs
  useEffect(() => {
    const raw = loadThreads();

    if (initialThreadId) {
      const found = raw.some(t => t.id === initialThreadId);
      if (!found) {
        // Thread not in this browser's history — redirect to /chat
        router.replace("/chat");
        return;
      }
    } else {
      // /chat with no threadId: redirect to latest thread, or stay for new-chat welcome
      if (raw.length > 0) {
        router.replace(`/chat/${raw[0].id}`);
        return;
      }
    }

    // Hydrate audio blob URLs from IndexedDB
    const hasIdb = raw.some(t =>
      t.messages.some(m => m.attachments?.some(a => a.type === "audio" && a.content.startsWith("idb:")))
    );
    if (hasIdb) {
      hydrateAudio(raw).then(hydrated => setThreads(hydrated));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist threads to localStorage on every change
  useEffect(() => {
    saveThreads(threads);
  }, [threads]);

  // Scroll messages container to bottom
  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [threads, activeId, loading]);

  // Close lang dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeThread = threads.find(t => t.id === activeId) ?? null;
  const messages: Message[] = activeThread?.messages ?? [];

  const newChat = useCallback(() => {
    const current = threads.find(t => t.id === activeId);
    if (current && current.messages.length === 0) return;
    const thread = createThread();
    setThreads(p => [thread, ...p]);
    setActiveId(thread.id);
    router.push(`/chat/${thread.id}`);
  }, [activeId, threads, router]);

  const selectThread = useCallback((id: string) => {
    setActiveId(id);
    router.push(`/chat/${id}`);
    if (window.innerWidth < 768) setSidebarOpen(false);
  }, [router]);

  const onDeleteThread = useCallback((id: string) => {
    setThreads(p => {
      const next = deleteThread(p, id);
      if (activeId === id) {
        const fallback = next[0]?.id ?? null;
        setActiveId(fallback);
        router.replace(fallback ? `/chat/${fallback}` : "/chat");
      }
      return next;
    });
  }, [activeId, router]);

  const clearAll = useCallback(() => {
    setThreads([]);
    setActiveId(null);
  }, []);

  const sendMessage = useCallback(async (text: string, attachments: Attachment[]) => {
    if (!text && attachments.length === 0) return;
    if (loading) return;

    let threadId = activeId;
    if (!threadId) {
      const thread = createThread();
      setThreads(p => [thread, ...p]);
      setActiveId(thread.id);
      router.push(`/chat/${thread.id}`);
      threadId = thread.id;
    }

    const userMsg: Message = {
      id: uuid(), role: "user",
      content: text || "(attached file)",
      attachments: attachments.length ? attachments : undefined,
      timestamp: Date.now(),
    };

    setThreads(p => {
      const target = p.find(t => t.id === threadId);
      let updated = saveMessage(p, threadId!, userMsg);
      if (target && target.messages.length === 0) {
        updated = setThreadTitle(updated, threadId!, (text || attachments[0]?.name || "New Chat").slice(0, 52));
      }
      return updated;
    });

    setLoading(true);

    try {
      const history = [
        ...(threads.find(t => t.id === threadId)?.messages ?? []),
        userMsg,
      ].slice(-20).map(m => {
        // Strip audio attachments — the transcript is already in m.content and
        // blob: URLs are browser-local so OpenAI can't access them anyway.
        const atts = m.attachments?.filter(a => a.type !== "audio");
        return {
          role: m.role,
          content: m.content,
          attachments: atts?.length
            ? atts.map(a => ({
                type: a.type, name: a.name,
                content: a.type === "image" ? a.content : a.content.slice(0, 6000),
              }))
            : undefined,
        };
      });

      const res  = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, sessionId: threadId, lang }),
      });
      const data = await res.json();

      const aiMsg: Message = {
        id: uuid(), role: "assistant", timestamp: Date.now(),
        content: data.response || "I couldn't generate a response. Please try again.",
      };
      latestAiMsgIdRef.current = aiMsg.id; // mark as the one to auto-play
      setThreads(p => saveMessage(p, threadId!, aiMsg));
    } catch {
      const errMsg: Message = {
        id: uuid(), role: "assistant", timestamp: Date.now(),
        content: "Connection issue. Please check your internet and try again.",
      };
      setThreads(p => saveMessage(p, threadId!, errMsg));
    } finally {
      setLoading(false);
    }
  }, [activeId, loading, threads, router, lang]);

  const sidebarClass = `sidebar-panel${sidebarOpen ? " sidebar-open" : " sidebar-closed"}`;

  return (
    <div className="chat-page">

      {/* Sidebar */}
      <aside className={sidebarClass}>
        <ChatSidebar
          threads={threads} activeId={activeId}
          onSelect={selectThread} onNew={newChat}
          onDelete={onDeleteThread} onClearAll={clearAll}
        />
      </aside>

      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="chat-main">

        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-inner">
            <button onClick={() => setSidebarOpen(v => !v)} className="chat-toggle-btn" aria-label="Toggle sidebar">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M2 4h12M2 8h12M2 12h12" stroke="#64748B" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="chat-header-title">
                {activeThread?.title ?? "Humana AI"}
              </div>
              <div className="chat-header-sub">{t("chat_subtitle")}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              {/* Navigation links */}
              <nav className="chat-header-nav">
                <Link href="/" className="chat-nav-link">Home</Link>
                <Link href="/chat" className="chat-nav-link active">Chat</Link>
                <Link href="/about" className="chat-nav-link">About</Link>
                <Link href="/contact" className="chat-nav-link">Contact</Link>
              </nav>
              {/* Language switcher */}
              <div className="chat-lang-wrap" ref={langRef}>
                <button className="chat-lang-btn" onClick={() => setLangOpen(v => !v)} aria-label="Switch language">
                  <span style={{ fontSize: 14, lineHeight: 1 }}>{currentLang.flag}</span>
                  <span>{currentLang.native}</span>
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
                {langOpen && (
                  <div className="chat-lang-drop">
                    {LANGUAGES.map(l => (
                      <button key={l.code} className={`chat-lang-opt${lang === l.code ? " active" : ""}`}
                        onClick={() => { setLang(l.code); setLangOpen(false); }}>
                        <span style={{ fontSize: 14, lineHeight: 1 }}>{l.flag}</span>
                        <span>{l.native}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Online indicator */}
              <span className="chat-online-dot" />
              <span className="chat-online-label">{t("chat_online")}</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages" ref={messagesRef}>
          <div className="chat-messages-inner">
            {messages.map((m, i) => (
              <ChatMessage
                key={m.id} msg={m}
                isLast={i === messages.length - 1 && !loading}
                autoPlayTTS={m.id === latestAiMsgIdRef.current}
              />
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="typing-row fade-up">
                <div className="ai-avatar">
                  <img src="/humanahi-logo.png" alt="Humana AI" style={{ width: 28, height: 28, objectFit: "contain" }} />
                </div>
                <div className="typing-bubble">
                  <span className="typing-dot dot1"/>
                  <span className="typing-dot dot2"/>
                  <span className="typing-dot dot3"/>
                </div>
              </div>
            )}

            {/* Welcome / empty state */}
            {messages.length === 0 && !loading && (
              <div className="chat-welcome">
                <h2 className="chat-welcome-heading">{t("chat_welcome")}</h2>
                <div className="chat-welcome-prompts">
                  {(["prompt_udhr", "prompt_report", "prompt_refugee", "prompt_iccpr"] as const).map(key => (
                    <button key={key} onClick={() => sendMessage(t(key), [])} className="chat-prompt-btn">
                      {t(key)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <ChatInput onSend={sendMessage} disabled={loading} />
      </div>
    </div>
  );
}

export default function ChatLayout({ initialThreadId }: { initialThreadId?: string }) {
  return (
    <GlobalAudioProvider>
      <ChatLayoutInner initialThreadId={initialThreadId} />
    </GlobalAudioProvider>
  );
}
