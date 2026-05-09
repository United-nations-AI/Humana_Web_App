"use client";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import type { Attachment } from "@/types/chat";
import { processFile, isValidUrl } from "@/lib/file-processor";
import { useLang } from "@/context/LanguageContext";
import { uuid } from "@/lib/uuid";
import { saveAudio } from "@/lib/audio-storage";
import { useGlobalAudio } from "@/context/GlobalAudioContext";
import { primeAudioCtx } from "@/lib/audioCtx";

const YEAR = new Date().getFullYear();

const ACCEPT = "image/*,.pdf,.txt,.md,.csv,.json,.js,.ts,.py,.html,.css,.xml,.yaml,.yml,.doc,.docx";

interface Props {
  onSend: (text: string, attachments: Attachment[]) => void;
  disabled: boolean;
}

// Pick the best supported audio MIME type for MediaRecorder
function bestMimeType(): string {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/mp4",
  ];
  return candidates.find(t => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(t)) ?? "audio/webm";
}

export default function ChatInput({ onSend, disabled }: Props) {
  const { lang, t }               = useLang();
  const { hasAudio, isPlaying, toggleAudio, stopAudio } = useGlobalAudio();
  const [text, setText]           = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [urlInput, setUrlInput]   = useState("");
  const [showUrl, setShowUrl]     = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [recording, setRecording] = useState(false);      // mic is live
  const [transcribing, setTranscribing] = useState(false); // waiting for Whisper

  const textareaRef        = useRef<HTMLTextAreaElement>(null);
  const fileInputRef       = useRef<HTMLInputElement>(null);
  const mediaRecorderRef   = useRef<MediaRecorder | null>(null);
  const audioChunksRef     = useRef<BlobPart[]>([]);
  const attachmentsRef     = useRef(attachments);
  useEffect(() => { attachmentsRef.current = attachments; }, [attachments]);

  const canSend = (text.trim() || attachments.length > 0) && !disabled && !processing && !recording && !transcribing;
  const isBusy  = recording || transcribing;

  const resizeTextarea = () => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "24px";
    textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
  };

  const send = (overrideText?: string, overrideAtts?: Attachment[]) => {
    const sendText = overrideText ?? text.trim();
    const sendAtts = overrideAtts  ?? attachments;
    if ((!sendText && sendAtts.length === 0) || disabled || processing) return;
    primeAudioCtx(); // unlock AudioContext within this user-gesture frame for auto-play
    onSend(sendText, sendAtts);
    setText("");
    setAttachments([]);
    setError(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "24px";
      if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
        textareaRef.current.blur();
      } else {
        textareaRef.current.focus();
      }
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  /* ── File / URL helpers ── */
  const addFiles = async (files: File[]) => {
    if (!files.length) return;
    setProcessing(true); setError(null);
    const results: Attachment[] = [];
    for (const f of files) {
      try { results.push(await processFile(f)); }
      catch (err) { setError((err as Error).message); }
    }
    setAttachments(p => [...p, ...results]);
    setProcessing(false);
  };

  const addUrl = async () => {
    const url = urlInput.trim();
    if (!isValidUrl(url)) { setError("Please enter a valid URL starting with http."); return; }
    setProcessing(true); setError(null);
    try {
      const res  = await fetch("/api/process-url", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const att: Attachment = { id: uuid(), type: "url", name: url.slice(0, 60), content: data.text, mimeType: "text/html" };
      setAttachments(p => [...p, att]);
      setUrlInput(""); setShowUrl(false);
    } catch (err) { setError((err as Error).message); }
    finally { setProcessing(false); }
  };

  /* ── Voice recording via MediaRecorder → OpenAI Whisper ── */
  const toggleVoice = async () => {
    // Stop if already recording
    if (recording) {
      primeAudioCtx(); // unlock within the stop-recording user gesture
      mediaRecorderRef.current?.stop();
      return;
    }

    if (typeof MediaRecorder === "undefined") {
      setError("Audio recording is not supported in this browser.");
      return;
    }

    setError(null);

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    } catch (err: any) {
      const name = err?.name ?? "";
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        setError("Microphone access denied. Please allow microphone permission in your browser or device settings, then try again.");
      } else if (name === "NotFoundError" || name === "DevicesNotFoundError") {
        setError("No microphone found. Please connect a microphone and try again.");
      } else {
        setError("Could not access the microphone. Please try again.");
      }
      return;
    }

    const mimeType = bestMimeType();
    const recorder = new MediaRecorder(stream, { mimeType });
    audioChunksRef.current = [];
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };

    recorder.onstop = async () => {
      // Stop all mic tracks immediately
      stream.getTracks().forEach(t => t.stop());
      setRecording(false);

      const blob = new Blob(audioChunksRef.current, { type: mimeType });
      if (blob.size < 500) {
        setError("Recording too short — please hold the mic button and speak clearly.");
        return;
      }

      setTranscribing(true);
      try {
        const form = new FormData();
        form.append("audio", blob, `recording.${mimeType.includes("mp4") ? "mp4" : mimeType.includes("ogg") ? "ogg" : "webm"}`);
        form.append("lang", lang);   // 2-letter ISO code — Whisper uses this for accuracy

        const res  = await fetch("/api/transcribe", { method: "POST", body: form });
        const data = await res.json();

        if (data.error) throw new Error(data.error);

        const transcript = (data.text ?? "").trim();
        if (!transcript) {
          setError("No speech detected in the recording. Please try again.");
          return;
        }

        // Attach a playable blob URL so the user can replay their recording
        const audioId  = uuid();
        const audioUrl = URL.createObjectURL(blob);
        const audioAtt: Attachment = {
          id: audioId,
          type: "audio",
          name: "Voice recording",
          content: audioUrl,
          mimeType,
        };
        // Persist to IndexedDB for cross-session replay (2-day TTL)
        saveAudio(audioId, blob);

        setText(transcript);
        resizeTextarea();
        send(transcript, [...attachmentsRef.current, audioAtt]);
      } catch (err) {
        setError("Voice transcription failed. Please check your connection and try again.");
      } finally {
        setTranscribing(false);
      }
    };

    recorder.start();
    setRecording(true);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    addFiles(Array.from(e.dataTransfer.files));
  };

  const onPaste = (e: React.ClipboardEvent) => {
    const files = Array.from(e.clipboardData.files);
    if (files.length) { e.preventDefault(); addFiles(files); }
  };

  const removeAttachment = (id: string) => setAttachments(p => p.filter(a => a.id !== id));
  const icons: Record<string, string> = { image: "🖼", pdf: "📄", text: "📝", url: "🔗" };

  /* ── Render ── */
  const placeholder = recording
    ? "Recording… tap ■ to stop"
    : transcribing
    ? "Transcribing with Whisper…"
    : t("input_placeholder");

  return (
    <div className="chat-input-area" onDragOver={e => e.preventDefault()} onDrop={onDrop}>
      <div className="chat-input-inner">

        {/* Error / permission notice */}
        {error && (
          <div className="chat-input-error">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="chat-input-error-close">×</button>
          </div>
        )}

        {/* Attachment chips */}
        {attachments.length > 0 && (
          <div className="chat-attachments-tray">
            {attachments.map(a => (
              <div key={a.id} className="chat-attachment-chip">
                {a.type === "image"
                  ? <img src={a.content} alt={a.name} style={{ width: 20, height: 20, objectFit: "cover", borderRadius: 3 }} />
                  : <span style={{ fontSize: 12 }}>{icons[a.type] ?? "📎"}</span>
                }
                <span className="chat-attachment-name">{a.name}</span>
                <button onClick={() => removeAttachment(a.id)} className="chat-attachment-remove">×</button>
              </div>
            ))}
          </div>
        )}

        {/* URL input */}
        {showUrl && (
          <div className="chat-url-row">
            <input
              type="url" value={urlInput} placeholder="Paste a URL to analyse…"
              onChange={e => setUrlInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addUrl()}
              className="chat-url-input"
            />
            <button onClick={addUrl} disabled={!urlInput.trim() || processing} className="chat-url-add-btn">Add</button>
            <button onClick={() => { setShowUrl(false); setUrlInput(""); }} className="chat-url-cancel-btn">Cancel</button>
          </div>
        )}

        {/* Main input row */}
        <div className={`chat-input-box${recording ? " chat-input-box--listening" : ""}`}>

          {/* Attach file */}
          <input ref={fileInputRef} type="file" multiple accept={ACCEPT} style={{ display: "none" }}
            onChange={e => e.target.files && addFiles(Array.from(e.target.files))} />
          <button onClick={() => fileInputRef.current?.click()} disabled={processing || isBusy}
            className="chat-icon-btn" title="Attach file">
            {processing ? <div className="spinner" />
              : <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M2 10.5V13h2.5l7-7L9 3.5l-7 7zM13.5 4a1 1 0 000-1.5l-1-1A1 1 0 0011 1.5L12.5 3l1 1z"
                    stroke="rgba(1,1,32,0.45)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>}
          </button>

          {/* Add URL */}
          <button onClick={() => setShowUrl(v => !v)} title="Add URL" disabled={isBusy}
            className="chat-icon-btn" style={{ background: showUrl ? "rgba(1,1,32,0.08)" : undefined }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M6 10s.5 2 3 2 4-1.5 4-4-1.5-4-4-4H7" stroke="rgba(1,1,32,0.45)" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M10 6s-.5-2-3-2-4 1.5-4 4 1.5 4 4 4h2" stroke="rgba(1,1,32,0.45)" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>

          {/* Mic button — tap to record, tap again to stop */}
          <button
            onClick={toggleVoice}
            disabled={disabled || transcribing}
            className={`chat-mic-btn${recording ? " chat-mic-btn--active" : ""}${transcribing ? " chat-mic-btn--transcribing" : ""}`}
            title={recording ? "Stop recording" : transcribing ? "Transcribing…" : "Voice input (OpenAI Whisper)"}
            aria-label={recording ? "Stop recording" : "Start voice input"}
          >
            {transcribing ? (
              <div className="spinner" />
            ) : recording ? (
              /* Stop square */
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <rect x="3" y="3" width="10" height="10" rx="2" fill="rgba(220,38,38,0.85)" />
              </svg>
            ) : (
              /* Microphone */
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect x="5.5" y="1" width="5" height="8" rx="2.5" stroke="rgba(1,1,32,0.55)" strokeWidth="1.4" />
                <path d="M2.5 8.5A5.5 5.5 0 0013.5 8.5" stroke="rgba(1,1,32,0.55)" strokeWidth="1.4" strokeLinecap="round" />
                <line x1="8" y1="14" x2="8" y2="11" stroke="rgba(1,1,32,0.55)" strokeWidth="1.4" strokeLinecap="round" />
                <line x1="5.5" y1="14.5" x2="10.5" y2="14.5" stroke="rgba(1,1,32,0.55)" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            )}
          </button>

          {/* Textarea */}
          <textarea ref={textareaRef} value={text}
            onChange={e => { setText(e.target.value); e.target.style.height = "24px"; e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px"; }}
            onKeyDown={onKey} onPaste={onPaste}
            placeholder={placeholder}
            rows={1}
            disabled={isBusy}
            className="chat-textarea"
          />

          {/* Audio transport — only shown when audio is active AND user is not typing */}
          {hasAudio && !text.trim() ? (
            <div className="chat-audio-transport">
              {/* Pause / Resume */}
              <button onClick={toggleAudio} className="chat-audio-btn"
                title={isPlaying ? "Pause audio" : "Resume audio"} aria-label={isPlaying ? "Pause" : "Resume"}>
                {isPlaying ? (
                  <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                    <rect x="0"   y="0" width="3.5" height="12" rx="1.2" fill="currentColor"/>
                    <rect x="6.5" y="0" width="3.5" height="12" rx="1.2" fill="currentColor"/>
                  </svg>
                ) : (
                  <svg width="11" height="12" viewBox="0 0 11 13" fill="none">
                    <path d="M1 1.5l9 5-9 5V1.5z" fill="currentColor" stroke="currentColor" strokeWidth="0.6" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
              {/* Stop */}
              <button onClick={stopAudio} className="chat-audio-btn chat-audio-btn--stop"
                title="Stop audio" aria-label="Stop audio">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <rect x="1" y="1" width="8" height="8" rx="1.5" fill="currentColor"/>
                </svg>
              </button>
            </div>
          ) : (
            /* Normal send button */
            <button onClick={() => send()} disabled={!canSend}
              className={`chat-send-btn${canSend ? " active" : " inactive"}`}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M12.5 7L2 2l2.5 5L2 12l10.5-5z" fill={canSend ? "#fff" : "rgba(1,1,32,0.25)"} />
              </svg>
            </button>
          )}
        </div>

        {/* Live status bar */}
        {(recording || transcribing) && (
          <div className="chat-voice-status">
            <span className="chat-voice-pulse" />
            {recording ? "Recording… tap ■ to stop and send" : "Transcribing with OpenAI Whisper…"}
          </div>
        )}

        {/* Hints + credit */}
        <div className="chat-input-hints">
          <span className="chat-input-hint">{t("input_hint")}: image · pdf · doc · txt · csv · url</span>
          <span className="chat-input-hint chat-input-credit">
            © {YEAR} Humana AI ·{" "}
            <a href="https://qatarcpd.com" target="_blank" rel="noopener noreferrer" className="chat-credit-link">Qatar CPD</a>
            {" · "}
            <Link href="/terms" className="chat-credit-link">Terms</Link>
            {" · "}
            <Link href="/contact" className="chat-credit-link">Contact</Link>
          </span>
          <span className="chat-input-hint">Enter to {t("input_send")} · Shift+Enter new line</span>
        </div>
      </div>
    </div>
  );
}
