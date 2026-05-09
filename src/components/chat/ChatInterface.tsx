"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { uuid } from "@/lib/uuid";

const F = "var(--font-space,Arial)";
const M = "var(--font-jetbrains,monospace)";

interface Message { id:string; role:"user"|"assistant"; content:string; }

const WELCOME: Message = {
  id:"welcome", role:"assistant",
  content:"Hello, I'm Humana AI — your free human rights assistant, powered by Qatar CPD.\n\nI can help you with:\n• Universal Declaration of Human Rights (all 30 articles)\n• International treaties & UN conventions\n• Asylum, refugee, and immigration rights\n• Reporting human rights violations\n• Civil, political, economic & social rights\n\nWhat would you like to know?",
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [sessionId]             = useState(() => uuid());
  const bottomRef               = useRef<HTMLDivElement>(null);
  const textareaRef             = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, loading]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg: Message = { id: uuid(), role:"user", content:text };
    setMessages(p => [...p, userMsg]);
    setInput("");
    if (textareaRef.current) { textareaRef.current.style.height = "24px"; }
    setLoading(true);
    try {
      const res  = await fetch("/api/chat", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ message:text, sessionId }) });
      const data = await res.json();
      setMessages(p => [...p, { id: uuid(), role:"assistant", content: data.response || "Sorry, I couldn't generate a response. Please try again." }]);
    } catch {
      setMessages(p => [...p, { id: uuid(), role:"assistant", content:"Connection issue. Please check your internet and try again." }]);
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  }, [input, loading, sessionId]);

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const formatContent = (text: string) =>
    text.split("\n").map((line, i, arr) => (
      <span key={i}>{line}{i < arr.length-1 && <br/>}</span>
    ));

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 64px)", background:"#fafafa" }}>

      {/* Chat header */}
      <div style={{ background:"#fff", borderBottom:"1px solid rgba(1,1,32,0.08)", padding:"14px 0", flexShrink:0 }}>
        <div className="container" style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontFamily:F, fontSize:15, fontWeight:700, letterSpacing:"-0.025em", color:"#010120" }}>Humana AI</div>
            <div style={{ fontFamily:M, fontSize:9, fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(1,1,32,0.35)" }}>Human Rights Assistant · Free · No Login</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:"#22c55e", display:"inline-block" }}/>
            <span style={{ fontFamily:F, fontSize:12, color:"rgba(1,1,32,0.4)", letterSpacing:"-0.01em" }}>Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-scroll" style={{ flex:1, padding:"24px 0" }}>
        <div className="container" style={{ maxWidth:760, display:"flex", flexDirection:"column", gap:20, paddingBottom:8 }}>
          {messages.map(msg => (
            <div key={msg.id} className="fade-up" style={{ display:"flex", justifyContent: msg.role==="user" ? "flex-end" : "flex-start", alignItems:"flex-start", gap:10 }}>
              {msg.role === "assistant" && (
                <div style={{ width:32, height:32, borderRadius:6, background:"#fff", border:"1px solid rgba(1,1,32,0.1)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2, overflow:"hidden" }}>
                  <img src="/humanahi-logo.png" alt="Humana AI" style={{ width:28, height:28, objectFit:"contain" }} />
                </div>
              )}
              <div style={{
                maxWidth:"78%", padding:"12px 16px", borderRadius: msg.role==="user" ? "12px 4px 12px 12px" : "4px 12px 12px 12px",
                background: msg.role==="user" ? "#010120" : "#fff",
                border: msg.role==="user" ? "none" : "1px solid rgba(1,1,32,0.09)",
                boxShadow: msg.role==="user" ? "none" : "rgba(1,1,32,0.05) 0 2px 8px",
              }}>
                <p style={{ fontFamily:F, fontSize:14, fontWeight:400, lineHeight:1.7, letterSpacing:"-0.01em", color: msg.role==="user" ? "#fff" : "#010120", margin:0 }}>
                  {formatContent(msg.content)}
                </p>
              </div>
            </div>
          ))}

          {/* Typing */}
          {loading && (
            <div className="fade-up" style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:6, background:"#010120", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2 }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.6"/>
                  <path d="M2.5 8h11M8 2.5v11" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </div>
              <div style={{ padding:"14px 18px", borderRadius:"4px 12px 12px 12px", background:"#fff", border:"1px solid rgba(1,1,32,0.09)", boxShadow:"rgba(1,1,32,0.05) 0 2px 8px", display:"flex", gap:5, alignItems:"center" }}>
                {[0,1,2].map(i => (
                  <span key={i} className={`dot${i+1}`} style={{ width:6, height:6, borderRadius:"50%", background:"rgba(1,1,32,0.3)", display:"inline-block" }}/>
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>
      </div>

      {/* Input */}
      <div style={{ background:"#fff", borderTop:"1px solid rgba(1,1,32,0.08)", padding:"16px 0 20px", flexShrink:0 }}>
        <div className="container" style={{ maxWidth:760 }}>
          <div style={{ display:"flex", alignItems:"flex-end", gap:10, border:"1px solid rgba(1,1,32,0.14)", borderRadius:8, padding:"10px 10px 10px 16px", background:"#fff", boxShadow:"rgba(1,1,32,0.06) 0 2px 12px" }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => { setInput(e.target.value); e.target.style.height="24px"; e.target.style.height=Math.min(e.target.scrollHeight,128)+"px"; }}
              onKeyDown={onKey}
              placeholder="Ask about human rights, international law, your freedoms..."
              rows={1}
              style={{ flex:1, resize:"none", border:"none", outline:"none", fontFamily:F, fontSize:14, fontWeight:400, lineHeight:1.6, letterSpacing:"-0.01em", color:"#010120", background:"transparent", minHeight:24, maxHeight:128 }}
            />
            <button onClick={send} disabled={!input.trim()||loading} style={{
              width:38, height:38, borderRadius:5, border:"none", flexShrink:0,
              background: (!input.trim()||loading) ? "rgba(1,1,32,0.07)" : "#010120",
              cursor: (!input.trim()||loading) ? "not-allowed" : "pointer",
              display:"flex", alignItems:"center", justifyContent:"center", transition:"background 0.15s",
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M12.5 7L2 2l2.5 5L2 12l10.5-5z" fill={(!input.trim()||loading) ? "rgba(1,1,32,0.25)" : "#fff"}/>
              </svg>
            </button>
          </div>
          <p style={{ fontFamily:M, fontSize:9, fontWeight:500, letterSpacing:"0.06em", color:"rgba(1,1,32,0.28)", textAlign:"center", marginTop:10, textTransform:"uppercase" }}>
            Humana AI may make mistakes · Verify critical legal information with a qualified professional
          </p>
        </div>
      </div>
    </div>
  );
}
