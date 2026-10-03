"use client";
import { useEffect, useRef, useState } from "react";
import { getWatched, saveWatched } from "@/lib/learn-storage";

/** Share of the video that must actually be played before the module can be completed. */
export const REQUIRED_SHARE = 0.9;
/** If the player never reports its state (blocked API), require this many seconds on the page instead. */
const FALLBACK_SECONDS = 300;

const YT_ORIGINS = ["https://www.youtube-nocookie.com", "https://www.youtube.com"];

interface Props {
  courseId: string;
  lessonId: string;
  videoId: string;
  title: string;
  alreadyComplete: boolean;
  onEligible: () => void;          // called once the viewing requirement is met
}

/* Embeds the lesson video and measures real playback time through the YouTube
   player's postMessage channel (no external script needed). Only time spent
   actually playing counts: skipping ahead with the scrubber earns nothing. */
export default function LessonVideo({ courseId, lessonId, videoId, title, alreadyComplete, onEligible }: Props) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [watched, setWatched]   = useState(() => getWatched(courseId, lessonId));
  const [duration, setDuration] = useState(0);
  const [fallback, setFallback] = useState(false);

  const watchedRef  = useRef(watched);
  const durationRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const playingRef  = useRef(false);
  const heardRef    = useRef(false);
  const eligibleRef = useRef(alreadyComplete);
  const onEligibleRef = useRef(onEligible);
  useEffect(() => { onEligibleRef.current = onEligible; }, [onEligible]);

  useEffect(() => {
    const required = () => fallbackRef.current ? FALLBACK_SECONDS : durationRef.current * REQUIRED_SHARE;
    const fallbackRef = { current: false };

    const credit = (seconds: number) => {
      watchedRef.current += seconds;
      setWatched(watchedRef.current);
      const need = required();
      if (!eligibleRef.current && need > 0 && watchedRef.current >= need) {
        eligibleRef.current = true;
        saveWatched(courseId, lessonId, watchedRef.current);
        onEligibleRef.current();
      }
    };

    const onMessage = (e: MessageEvent) => {
      if (!YT_ORIGINS.includes(e.origin) || e.source !== frameRef.current?.contentWindow) return;
      let data: { event?: string; info?: { currentTime?: number; duration?: number; playerState?: number } };
      try { data = typeof e.data === "string" ? JSON.parse(e.data) : e.data; } catch { return; }
      if (!data?.info) return;
      heardRef.current = true;
      const { currentTime, duration: d, playerState } = data.info;
      if (typeof d === "number" && d > 0 && d !== durationRef.current) { durationRef.current = d; setDuration(d); }
      if (typeof playerState === "number") playingRef.current = playerState === 1;
      if (typeof currentTime === "number") {
        const last = lastTimeRef.current;
        lastTimeRef.current = currentTime;
        if (last !== null && playingRef.current) {
          const delta = currentTime - last;
          if (delta > 0 && delta < 2) credit(delta);     // normal playback only; seeks are ignored
        }
      }
    };
    window.addEventListener("message", onMessage);

    // Ask the player to start reporting; repeat until it answers.
    const hello = setInterval(() => {
      if (heardRef.current) return;
      frameRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: lessonId, channel: "widget" }), "*");
    }, 800);

    // Fallback: no player reports after 20s → count visible time on the page instead.
    const fallbackTimer = setTimeout(() => {
      if (!heardRef.current) { fallbackRef.current = true; setFallback(true); }
    }, 20000);
    const tick = setInterval(() => {
      if (fallbackRef.current && document.visibilityState === "visible") credit(1);
    }, 1000);

    const persist = setInterval(() => saveWatched(courseId, lessonId, watchedRef.current), 5000);

    return () => {
      window.removeEventListener("message", onMessage);
      clearInterval(hello); clearInterval(tick); clearInterval(persist); clearTimeout(fallbackTimer);
      saveWatched(courseId, lessonId, watchedRef.current);
    };
  }, [courseId, lessonId]);

  const need = fallback ? FALLBACK_SECONDS : duration * REQUIRED_SHARE;
  const pct  = alreadyComplete ? 100 : need > 0 ? Math.min(100, Math.round((watched / need) * 100)) : 0;
  const met  = alreadyComplete || (need > 0 && watched >= need);

  return (
    <div>
      <div className="video-frame">
        <iframe
          ref={frameRef}
          src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="watch-meter">
        <div style={{ display:"flex", justifyContent:"space-between", gap:12, marginBottom:6 }}>
          <span className="mono-label" style={{ color: met ? "#16A34A" : "#64748B" }}>
            {met ? "✓ Viewing requirement met" : `Viewing progress · watch at least ${Math.round(REQUIRED_SHARE * 100)}% to continue`}
          </span>
          <span className="mono-label" style={{ color:"#1E293B" }}>{pct}%</span>
        </div>
        <div className="progress-track"><div className={`progress-fill${met ? " done" : ""}`} style={{ width:`${pct}%` }}/></div>
      </div>
    </div>
  );
}
