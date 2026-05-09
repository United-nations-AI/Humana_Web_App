// Singleton AudioContext pre-unlocked within the user's Send gesture.
// Must be primed by calling primeAudioCtx() from a click/keydown handler.
// TTSPlayer reuses this context for auto-play — avoids the autoplay-policy
// restriction that blocks AudioContext.resume() outside a gesture frame.

let _ctx: AudioContext | null = null;

export function primeAudioCtx(): void {
  if (typeof window === "undefined") return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Ctor = window.AudioContext ?? (window as any).webkitAudioContext;
  if (!_ctx || _ctx.state === "closed") {
    _ctx = new Ctor();
  }
  _ctx.resume().catch(() => {});
}

export function getSharedCtx(): AudioContext | null {
  if (!_ctx || _ctx.state === "closed") return null;
  return _ctx;
}
