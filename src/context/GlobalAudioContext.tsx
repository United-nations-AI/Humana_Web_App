"use client";
import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react";

interface GlobalAudioContextType {
  hasAudio:  boolean;   // audio active (playing or paused at a position)
  isPlaying: boolean;   // currently outputting sound
  toggleAudio: () => void;
  stopAudio:   () => void;
  // called by WaveformPlayer
  registerAudio:  (id: symbol, controls: { toggle: () => void; stop: () => void }) => void;
  setAudioPlaying:(id: symbol, playing: boolean) => void;
  releaseAudio:   (id: symbol) => void;
}

const Ctx = createContext<GlobalAudioContextType>({
  hasAudio: false, isPlaying: false,
  toggleAudio: () => {}, stopAudio: () => {},
  registerAudio: () => {}, setAudioPlaying: () => {}, releaseAudio: () => {},
});

export function GlobalAudioProvider({ children }: { children: ReactNode }) {
  const [hasAudio,  setHasAudio]  = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const ctrlRef    = useRef<{ toggle: () => void; stop: () => void } | null>(null);
  const activeId   = useRef<symbol | null>(null);

  const registerAudio = useCallback((id: symbol, controls: { toggle: () => void; stop: () => void }) => {
    // If a different player is taking over, stop the current one so it doesn't
    // keep playing silently in the background with no UI to control it.
    if (activeId.current !== null && activeId.current !== id && ctrlRef.current) {
      ctrlRef.current.stop();
    }
    activeId.current  = id;
    ctrlRef.current   = controls;
    setHasAudio(true);
    setIsPlaying(true);
  }, []);

  const setAudioPlaying = useCallback((id: symbol, playing: boolean) => {
    if (activeId.current !== id) return;
    setIsPlaying(playing);
  }, []);

  const releaseAudio = useCallback((id: symbol) => {
    if (activeId.current !== id) return;
    activeId.current = null;
    ctrlRef.current  = null;
    setHasAudio(false);
    setIsPlaying(false);
  }, []);

  const toggleAudio = useCallback(() => ctrlRef.current?.toggle(), []);

  const stopAudio = useCallback(() => {
    ctrlRef.current?.stop();
    ctrlRef.current  = null;
    activeId.current = null;
    setHasAudio(false);
    setIsPlaying(false);
  }, []);

  return (
    <Ctx.Provider value={{ hasAudio, isPlaying, toggleAudio, stopAudio, registerAudio, setAudioPlaying, releaseAudio }}>
      {children}
    </Ctx.Provider>
  );
}

export function useGlobalAudio() {
  return useContext(Ctx);
}
