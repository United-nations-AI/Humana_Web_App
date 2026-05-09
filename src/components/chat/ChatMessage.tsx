"use client";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message } from "@/types/chat";
import { useGlobalAudio } from "@/context/GlobalAudioContext";
import { getSharedCtx } from "@/lib/audioCtx";

const icons: Record<string, string> = { image:"🖼", pdf:"📄", text:"📝", url:"🔗" };

function AttBadge({ att, dark }: { att: NonNullable<Message["attachments"]>[number]; dark?: boolean }) {
  return (
    <div className={dark ? "att-badge-dark" : "att-badge"}>
      <span style={{ fontSize:12 }}>{icons[att.type] ?? "📎"}</span>
      <span className="att-badge-name">{att.name}</span>
    </div>
  );
}

function fmt(s: number) {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

// ─── Shared Web Audio playback hook ──────────────────────────────────────────
// Returns a stable set of controls and state for playing an AudioBuffer.
// Both VoicePlayer (user recordings) and TTSPlayer (AI responses) use this.

function useAudioPlayback() {
  const [playing,  setPlaying]  = useState(false);
  const [ended,    setEnded]    = useState(false);
  const [current,  setCurrent]  = useState(0);
  const [duration, _setDuration] = useState(0);

  const ctxRef    = useRef<AudioContext | null>(null);
  const bufRef    = useRef<AudioBuffer  | null>(null);
  const nodeRef   = useRef<AudioBufferSourceNode | null>(null);
  const startRef  = useRef(0);
  const offsetRef = useRef(0);
  const manualRef = useRef(false);
  const rafRef    = useRef(0);
  const aliveRef  = useRef(true);
  const durRef    = useRef(0); // mirror of duration for getProgress (no stale closure)

  // Wraps the React setter so durRef stays in sync for getProgress
  const setDuration = useCallback((d: number) => {
    durRef.current = d;
    _setDuration(d);
  }, []);

  // Reads AudioContext time directly — perfectly synced, no React state lag.
  // Only valid while playing (startRef is stale when paused).
  const getProgress = useCallback((): number => {
    const ctx = ctxRef.current;
    if (!ctx || durRef.current === 0) return 0;
    return Math.min(ctx.currentTime - startRef.current, durRef.current) / durRef.current;
  }, []);

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
      cancelAnimationFrame(rafRef.current);
      manualRef.current = true;
      try { nodeRef.current?.stop(); } catch {}
      // Null out first to prevent any concurrent or Strict-Mode second cleanup from
      // attempting to close the same context object again (InvalidStateError).
      const ctx = ctxRef.current;
      ctxRef.current = null;
      if (ctx && ctx !== getSharedCtx() && ctx.state !== "closed") {
        ctx.close().catch(() => {});
      }
    };
  }, []);

  const killNode = () => {
    manualRef.current = true;
    try { nodeRef.current?.stop(); } catch {}
    nodeRef.current = null;
    cancelAnimationFrame(rafRef.current);
  };

  const playFromBuf = (from: number, ctx: AudioContext, buf: AudioBuffer) => {
    killNode();

    const startNow = () => {
      const node = ctx.createBufferSource();
      node.buffer = buf;
      node.connect(ctx.destination);
      manualRef.current = false;

      node.onended = () => {
        if (manualRef.current || !aliveRef.current) return;
        cancelAnimationFrame(rafRef.current);
        offsetRef.current = 0;
        setCurrent(0);
        setPlaying(false);
        setEnded(true);
      };

      node.start(0, from);
      nodeRef.current  = node;
      startRef.current = ctx.currentTime - from;
      offsetRef.current = from;
      setPlaying(true);
      setEnded(false);

      const dur = buf.duration;
      const tick = () => {
        if (!aliveRef.current) return;
        setCurrent(Math.min(ctx.currentTime - startRef.current, dur));
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    if (ctx.state === "running") {
      startNow();
    } else {
      // Context suspended (autoplay policy or not yet unlocked) — resume then play.
      // On user gesture (toggle click) this succeeds; on auto-play it may stay blocked,
      // in which case the waveform shows in paused state for manual play.
      ctx.resume().then(() => {
        if (aliveRef.current && ctx.state === "running") startNow();
      }).catch(() => {});
    }
  };

  const toggle = () => {
    if (playing) {
      const pos = ctxRef.current
        ? Math.min(ctxRef.current.currentTime - startRef.current, duration)
        : offsetRef.current;
      offsetRef.current = pos;
      killNode();
      setPlaying(false);
    } else if (ctxRef.current && bufRef.current) {
      playFromBuf(offsetRef.current, ctxRef.current, bufRef.current);
    }
  };

  const restart = () => {
    if (!ctxRef.current || !bufRef.current) return;
    offsetRef.current = 0;
    setCurrent(0);
    setEnded(false);
    playFromBuf(0, ctxRef.current, bufRef.current);
  };

  const seek = (v: number) => {
    if (!isFinite(v) || duration <= 0 || !ctxRef.current || !bufRef.current) return;
    const t = Math.max(0, Math.min(v, duration));
    offsetRef.current = t;
    setCurrent(t);
    if (ended) setEnded(false);
    if (playing) playFromBuf(t, ctxRef.current, bufRef.current);
  };

  // Stops audio and resets to start without replaying
  const stop = useCallback(() => {
    killNode();
    offsetRef.current = 0;
    setCurrent(0);
    setPlaying(false);
    setEnded(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { playing, ended, current, duration, setDuration,
           ctxRef, bufRef, aliveRef, playFromBuf, toggle, restart, seek, stop, getProgress };
}

// ─── Waveform UI (shared by both players) ────────────────────────────────────

// Deterministic bar heights from duration: short audio → 15 bars, long → up to 50.
// seed varies by variant so user/AI waveforms look distinct.
function genBars(duration: number, seed: number): number[] {
  const n = duration > 0 ? Math.min(50, Math.max(15, Math.round(duration * 1.5))) : 15;
  return Array.from({ length: n }, (_, i) => {
    const t = i * 2.1 + seed;
    const v = Math.abs(Math.sin(t) * 0.65 + Math.sin(t * 1.9 + 1.2) * 0.35);
    return Math.round(22 + 68 * v); // 22–90 range
  });
}

function WaveformPlayer({
  playing, ended, current, duration,
  onToggle, onRestart, onSeek, onStop,
  variant, label, getProgress,
}: {
  playing: boolean; ended: boolean; current: number; duration: number;
  onToggle: () => void; onRestart: () => void; onSeek: (v: number) => void;
  onStop?: () => void;
  variant: "dark" | "light"; label?: string;
  getProgress?: () => number;
}) {
  const remaining   = duration > 0 ? duration - current : 0;
  const showRestart = !playing && (ended || current > 0);
  const ic          = variant === "light" ? "#fff" : "rgba(1,1,32,0.72)";
  const dimOpacity  = variant === "light" ? "0.38" : "0.28";

  const bars = useMemo(() => genBars(duration, variant === "light" ? 3.7 : 0), [duration, variant]);

  const barRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ── Global audio context wiring ──────────────────────────────────────────
  const { registerAudio, setAudioPlaying, releaseAudio } = useGlobalAudio();
  // Stable per-instance ID — prevents one player from releasing another's registration
  const myId = useRef<symbol>(Symbol());
  // Always-fresh refs so context callbacks never hold stale closures
  const toggleRef = useRef(onToggle);
  const stopRef   = useRef(onStop ?? onToggle);
  toggleRef.current = onToggle;
  stopRef.current   = onStop ?? onToggle;

  const stableToggle = useCallback(() => toggleRef.current(), []);
  const stableStop   = useCallback(() => stopRef.current(),   []);

  useEffect(() => {
    const id = myId.current;
    if (playing) {
      registerAudio(id, { toggle: stableToggle, stop: stableStop });
    } else if (ended) {
      releaseAudio(id);
    } else {
      setAudioPlaying(id, false); // paused
    }
  }, [playing, ended, registerAudio, setAudioPlaying, releaseAudio, stableToggle, stableStop]);

  // Release on unmount so the transport clears if the message scrolls away
  useEffect(() => {
    const id = myId.current;
    return () => releaseAudio(id);
  }, [releaseAudio]);

  // Drive bar opacity directly via DOM — bypasses React rendering for perfect sync.
  // When playing: RAF reads AudioContext time via getProgress() at 60 fps.
  // When paused/stopped: one-time paint from React state `current`.
  useEffect(() => {
    const els = barRefs.current;
    const n   = els.length;
    if (n === 0) return;

    const paint = (ratio: number) => {
      els.forEach((bar, i) => {
        if (!bar) return;
        bar.style.opacity = i < ratio * n ? "1" : dimOpacity;
      });
    };

    if (!playing || !getProgress) {
      paint(duration > 0 ? current / duration : 0);
      return;
    }

    let raf: number;
    const tick = () => {
      paint(getProgress());
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, current, duration, getProgress, dimOpacity]);

  return (
    <div className={`voice-player${variant === "light" ? " voice-player--light" : ""}`}>
      <button onClick={onToggle} className="voice-player-btn"
        aria-label={playing ? "Pause" : ended ? "Replay" : "Play"}>
        {playing ? (
          <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
            <rect x="0"   y="0" width="3.5" height="12" rx="1.2" fill={ic}/>
            <rect x="6.5" y="0" width="3.5" height="12" rx="1.2" fill={ic}/>
          </svg>
        ) : (
          <svg width="11" height="13" viewBox="0 0 11 13" fill="none">
            <path d="M1 1.5l9 5-9 5V1.5z" fill={ic} stroke={ic} strokeWidth="0.8" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      <div className="voice-player-track" onClick={e => {
        if (duration <= 0) return;
        const r = e.currentTarget.getBoundingClientRect();
        onSeek(((e.clientX - r.left) / r.width) * duration);
      }}>
        {bars.map((h, i) => (
          <div key={i}
            ref={el => { barRefs.current[i] = el; }}
            className="voice-player-bar"
            style={{ height: `${Math.round(h * 0.22)}px` }}
          />
        ))}
      </div>

      <span className="voice-player-time">
        {playing ? `-${fmt(remaining)}`
          : current > 0 && !ended ? `${fmt(current)} / ${fmt(duration)}`
          : fmt(duration)}
      </span>

      {showRestart && (
        <button onClick={onRestart} className="voice-player-btn" aria-label="Restart">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M3 8a5 5 0 105-5H5.5" stroke={ic} strokeWidth="1.7" strokeLinecap="round"/>
            <path d="M3 3.5v4h4"           stroke={ic} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      {label && (
        <span style={{ fontSize:9, fontFamily:"'JetBrains Mono',monospace",
          color: variant === "light" ? "#64748B" : "rgba(255,255,255,0.4)",
          letterSpacing:"0.06em", textTransform:"uppercase", flexShrink:0 }}>
          {label}
        </span>
      )}
    </div>
  );
}

// ─── User voice recording player ─────────────────────────────────────────────

function VoicePlayer({ src }: { src: string }) {
  const pb = useAudioPlayback();
  const [ready,  setReady]  = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let ctx: AudioContext | null = null;
    fetch(src)
      .then(r => r.arrayBuffer())
      .then(ab => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const Ctx = window.AudioContext ?? (window as any).webkitAudioContext;
        ctx = new Ctx() as AudioContext;
        pb.ctxRef.current = ctx;
        return ctx.decodeAudioData(ab);
      })
      .then(buf => {
        if (!pb.aliveRef.current) return;
        // Re-assert after async decode gap — Strict Mode cleanup can null ctxRef
        // between fetch and here, which would break toggle/restart.
        if (ctx) pb.ctxRef.current = ctx;
        pb.bufRef.current = buf;
        pb.setDuration(buf.duration);
        setReady(true);
      })
      .catch(e => {
        console.warn("[VoicePlayer] decode error:", e);
        // Blob URLs are revoked on page reload — show graceful fallback instead of infinite spinner
        if (pb.aliveRef.current) setFailed(true);
      });
  // pb is stable (from useRef internals) — intentionally no dep array churn
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  if (failed) {
    return (
      <div className="voice-player" style={{ justifyContent:"center", padding:"6px 12px" }}>
        <span style={{ fontSize:10, opacity:0.4, letterSpacing:"0.04em" }}>Recording unavailable</span>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="voice-player" style={{ justifyContent:"center", padding:"8px 12px" }}>
        <div style={{ width:12, height:12, borderRadius:"50%",
          border:"1.5px solid rgba(255,255,255,0.2)", borderTopColor:"rgba(255,255,255,0.8)",
          animation:"spin 0.7s linear infinite" }} />
      </div>
    );
  }

  return (
    <WaveformPlayer
      playing={pb.playing} ended={pb.ended}
      current={pb.current} duration={pb.duration}
      onToggle={pb.toggle} onRestart={pb.restart} onSeek={pb.seek}
      onStop={pb.stop} variant="dark" getProgress={pb.getProgress}
    />
  );
}

// ─── AI TTS player ────────────────────────────────────────────────────────────

function stripMarkdown(md: string): string {
  return md
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/^>\s+/gm, "")
    .replace(/^---+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

type TTSStage = "idle" | "loading" | "error" | "ready";

function TTSPlayer({ text, autoPlay }: { text: string; autoPlay?: boolean }) {
  const [stage, setStage] = useState<TTSStage>(autoPlay ? "loading" : "idle");
  const pb = useAudioPlayback();
  const didFetchRef = useRef(false);

  // Auto-fetch and play when this becomes the latest AI response.
  // Deps include autoPlay so the effect fires when the prop changes false → true.
  // didFetchRef ensures we only fetch once even if autoPlay bounces.
  useEffect(() => {
    if (!autoPlay || didFetchRef.current) return;
    didFetchRef.current = true;
    setStage("loading");

    let cancelled = false;

    // Use the shared context pre-unlocked during the user's Send gesture.
    // AudioContext.resume() only works within a user-gesture frame; the shared
    // ctx was already resumed in ChatInput.send() so it's already "running" here.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Ctor = window.AudioContext ?? (window as any).webkitAudioContext;
    const ctx = getSharedCtx() ?? (new Ctor() as AudioContext);
    pb.ctxRef.current = ctx;
    if (ctx.state !== "running") ctx.resume().catch(() => {});

    (async () => {
      try {
        const res  = await fetch("/api/tts", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ text: stripMarkdown(text).slice(0, 4000) }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        const binary = atob(data.audio);
        const bytes  = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const buf = await ctx.decodeAudioData(bytes.buffer.slice(0));

        // cancelled = Strict Mode cleanup fired before we finished — discard result
        if (cancelled || !pb.aliveRef.current) return;

        pb.ctxRef.current = ctx;
        pb.bufRef.current = buf;
        pb.setDuration(buf.duration);
        setStage("ready");
        pb.playFromBuf(0, ctx, buf);
      } catch (e) {
        console.error("[TTSPlayer autoPlay]", e);
        if (!cancelled && pb.aliveRef.current) setStage("error");
      }
    })();

    return () => {
      cancelled = true;
      didFetchRef.current = false; // allow second Strict Mode mount to retry
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay]); // re-runs when autoPlay flips true; text/ctx captured at that point

  const handleListen = async () => {
    if (stage !== "idle" && stage !== "error") return;
    setStage("loading");

    // Create AudioContext within the user-gesture frame — required on iOS
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Ctx = window.AudioContext ?? (window as any).webkitAudioContext;
    const ctx = new Ctx() as AudioContext;
    pb.ctxRef.current = ctx;
    await ctx.resume(); // unlock audio within gesture

    try {
      const res  = await fetch("/api/tts", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ text: stripMarkdown(text).slice(0, 4000) }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Decode base64 → AudioBuffer directly — no intermediate blob URL
      const binary = atob(data.audio);
      const bytes  = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

      const buf = await ctx.decodeAudioData(bytes.buffer.slice(0));
      if (!pb.aliveRef.current) return;

      pb.ctxRef.current = ctx; // re-assert after async gap (Strict Mode safety)
      pb.bufRef.current = buf;
      pb.setDuration(buf.duration);
      setStage("ready");
      pb.playFromBuf(0, ctx, buf);
    } catch (e) {
      console.error("[TTSPlayer]", e);
      if (pb.aliveRef.current) setStage("error");
    }
  };

  // Idle / error state — show trigger button
  if (stage === "idle" || stage === "error") {
    return (
      <div className="tts-trigger">
        <button onClick={handleListen} className="tts-listen-btn"
          title="Listen to this response in female AI voice">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M2 5.5v5h3l4 3v-11L5 5.5H2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
            <path d="M12 4a6 6 0 010 8"   stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            <path d="M10 6a3 3 0 010 4"   stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          Listen
        </button>
        {stage === "error" && <span className="tts-error-label">Unavailable — try again</span>}
      </div>
    );
  }

  // Loading state
  if (stage === "loading") {
    return (
      <div className="tts-trigger">
        <button className="tts-listen-btn tts-listen-btn--busy" disabled>
          <div style={{ width:11, height:11, borderRadius:"50%",
            border:"1.5px solid #E0E8F4", borderTopColor:"#1B4FD8",
            animation:"spin 0.7s linear infinite" }} />
          Generating audio…
        </button>
      </div>
    );
  }

  // Ready — full waveform player (light variant for AI bubble background)
  return (
    <WaveformPlayer
      playing={pb.playing} ended={pb.ended}
      current={pb.current} duration={pb.duration}
      onToggle={pb.toggle} onRestart={pb.restart} onSeek={pb.seek}
      onStop={pb.stop} variant="light" label="AI Voice · Nova"
      getProgress={pb.getProgress}
    />
  );
}

// ─── Main ChatMessage component ───────────────────────────────────────────────

export default function ChatMessage({ msg, isLast, autoPlayTTS }: { msg: Message; isLast: boolean; autoPlayTTS?: boolean }) {
  const isUser    = msg.role === "user";
  const audioAtts = msg.attachments?.filter(a => a.type === "audio") ?? [];
  const otherAtts = msg.attachments?.filter(a => a.type !== "audio") ?? [];

  const copyToClipboard = () => navigator.clipboard?.writeText(msg.content);

  return (
    <div className={`msg-row ${isUser ? "user" : "assistant"}${isLast ? " fade-up" : ""}`}>

      {/* AI avatar */}
      {!isUser && (
        <div className="ai-avatar">
          <img src="/humanahi-logo.png" alt="Humana AI"
            style={{ width:28, height:28, objectFit:"contain" }} />
        </div>
      )}

      <div className="msg-body">

        {/* User: non-audio attachment badges */}
        {isUser && otherAtts.length > 0 && (
          <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"flex-end", marginBottom:6 }}>
            {otherAtts.map(a => <AttBadge key={a.id} att={a} dark/>)}
          </div>
        )}

        {/* User: image thumbnails */}
        {isUser && otherAtts.some(a => a.type === "image") && (
          <div style={{ display:"flex", flexWrap:"wrap", gap:6, justifyContent:"flex-end", marginBottom:6 }}>
            {otherAtts.filter(a => a.type === "image").map(a => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={a.id} src={a.content} alt={a.name}
                style={{ maxWidth:200, maxHeight:200, borderRadius:8, objectFit:"cover",
                  border:"1px solid rgba(255,255,255,0.15)" }}/>
            ))}
          </div>
        )}

        {/* Message bubble */}
        {isUser ? (
          <div className="msg-bubble-user">
            <p className="msg-user-text">{msg.content}</p>
            {audioAtts.map(a => <VoicePlayer key={a.id} src={a.content} />)}
          </div>
        ) : (
          <div className="msg-bubble-ai">
            <div className="ai-prose">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* AI: source attachment badges */}
        {!isUser && otherAtts.length > 0 && (
          <div style={{ display:"flex", flexWrap:"wrap", marginTop:6 }}>
            {otherAtts.map(a => <AttBadge key={a.id} att={a}/>)}
          </div>
        )}

        {/* AI: TTS player — only auto-plays for the message freshly generated this session */}
        {!isUser && <TTSPlayer text={msg.content} autoPlay={autoPlayTTS} />}

        {/* AI: actions */}
        {!isUser && (
          <div style={{ display:"flex", gap:4, marginTop:4 }}>
            <button onClick={copyToClipboard} className="msg-copy-btn" title="Copy response">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="#A8BEDB" strokeWidth="1.4"/>
                <path d="M3 11V3a1 1 0 011-1h8" stroke="#A8BEDB" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <span className="msg-copy-label">Copy</span>
            </button>
          </div>
        )}

        {/* Timestamp */}
        <div className={`msg-timestamp${isUser ? " user" : ""}`}>
          {new Date(msg.timestamp).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" })}
        </div>
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="user-avatar">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="6" r="3" stroke="rgba(255,255,255,0.85)" strokeWidth="1.4"/>
            <path d="M2 14c0-3 2.7-5 6-5s6 2 6 5" stroke="rgba(255,255,255,0.85)" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </div>
      )}
    </div>
  );
}
