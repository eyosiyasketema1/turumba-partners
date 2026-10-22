"use client";

/* The vision film as a proper video section.
   - waits on its first frame behind a poster with a big play button
   - starts by itself when the section scrolls into view, pauses when it leaves (until the viewer takes over)
   - custom controls: play / pause, scrub bar, time, mute, fullscreen
   The film itself is the exported Claude Design animation (public/vision/index.html), driven over postMessage. */

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Icon } from "./ds";

type VisionState = { time: number; duration: number; playing: boolean };

const fmt = (s: number) => {
  const m = Math.floor(s / 60), r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, "0")}`;
};

export function VisionPlayer() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [state, setState] = useState<VisionState>({ time: 0, duration: 221, playing: false });
  const [ready, setReady] = useState(false);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [soundBlocked, setSoundBlocked] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [scrub, setScrub] = useState<number | null>(null);
  const userPaused = useRef(false); // once the viewer pauses, scrolling won't restart it
  const hideTimer = useRef<number | null>(null);

  const send = (msg: Record<string, unknown>) => {
    const w = frameRef.current?.contentWindow;
    if (w) w.postMessage(msg, window.location.origin);
  };
  const play = () => { send({ type: "vision:play" }); send({ type: "vision:unlock" }); setStarted(true); userPaused.current = false; };
  const pause = (byUser: boolean) => { send({ type: "vision:pause" }); if (byUser) userPaused.current = true; };

  // progress reports from the film
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.source !== frameRef.current?.contentWindow) return;
      const d = e.data as { type?: string } & Partial<VisionState>;
      if (d?.type === "vision:state") {
        setReady(true);
        setState({ time: d.time ?? 0, duration: d.duration ?? 221, playing: !!d.playing });
      } else if (d?.type === "vision:audio-blocked") {
        setSoundBlocked(true);
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  // start when the section is reached, pause when it leaves
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !ready) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(([entry]) => {
      const w = frameRef.current?.contentWindow;
      if (!w) return;
      if (entry.intersectionRatio >= 0.6) {
        if (!userPaused.current && !reduce) {
          w.postMessage({ type: "vision:play" }, window.location.origin);
          setStarted(true);
        }
      } else if (entry.intersectionRatio < 0.25) {
        w.postMessage({ type: "vision:pause" }, window.location.origin);
      }
    }, { threshold: [0, 0.25, 0.6, 1] });
    io.observe(el);
    return () => io.disconnect();
  }, [ready]);

  // controls fade out while playing and the pointer is still
  const nudge = () => {
    setShowControls(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setShowControls(false), 2500);
  };
  useEffect(() => () => { if (hideTimer.current) window.clearTimeout(hideTimer.current); }, []);

  const ended = started && !state.playing && state.time >= state.duration - 0.1;
  const toggle = () => {
    if (state.playing) pause(true);
    else play();
  };
  const toggleMute = () => {
    const m = !muted;
    setMuted(m);
    send({ type: "vision:mute", muted: m });
    if (!m) { send({ type: "vision:unlock" }); setSoundBlocked(false); }
  };
  const enableSound = () => { setMuted(false); send({ type: "vision:mute", muted: false }); send({ type: "vision:unlock" }); setSoundBlocked(false); };
  const fullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  // scrubbing
  const trackRef = useRef<HTMLDivElement>(null);
  const timeAt = (clientX: number) => {
    const r = trackRef.current?.getBoundingClientRect();
    if (!r) return 0;
    return Math.max(0, Math.min(1, (clientX - r.left) / r.width)) * state.duration;
  };
  const onScrubDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setScrub(timeAt(e.clientX));
  };
  const onScrubMove = (e: ReactPointerEvent<HTMLDivElement>) => { if (scrub !== null) setScrub(timeAt(e.clientX)); };
  const onScrubUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (scrub === null) return;
    const t = timeAt(e.clientX);
    const wasPlaying = state.playing;
    send({ type: "vision:seek", time: t });
    if (wasPlaying) send({ type: "vision:play" });
    setStarted(true);
    setScrub(null);
  };

  const shown = scrub ?? state.time;
  const pct = state.duration ? (shown / state.duration) * 100 : 0;
  const controlsVisible = showControls || !state.playing || scrub !== null;

  return (
    <div
      ref={wrapRef}
      className="vp"
      onPointerMove={nudge}
      onPointerLeave={() => state.playing && setShowControls(false)}
      style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", borderRadius: 12, overflow: "hidden", background: "#041426", boxShadow: "0 30px 80px -30px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.08)" }}
    >
      <iframe
        ref={frameRef}
        src="/vision/index.html"
        title="Turumba vision film"
        allow="autoplay; fullscreen"
        loading="lazy"
        tabIndex={-1}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0, pointerEvents: "none" }}
      />

      {/* click anywhere on the picture to play / pause */}
      <button type="button" aria-label={state.playing ? "Pause video" : "Play video"} onClick={toggle} className="vp-hit" />

      {/* poster: before the first play, and again at the end */}
      {(!started || ended) && (
        <div className="vp-poster">
          <button type="button" onClick={play} className="vp-bigplay" aria-label={ended ? "Replay the vision film" : "Play the vision film"}>
            <Icon name={ended ? "Replay" : "PlayFilled"} size={34} />
          </button>
          <div className="vp-poster-meta">
            <span className="vp-chip">The vision</span>
            <span>{ended ? "Watch again" : `Watch the film · ${fmt(state.duration)}`}</span>
          </div>
        </div>
      )}

      {/* sound could not start automatically */}
      {started && soundBlocked && !muted && (
        <button type="button" className="vp-sound" onClick={enableSound}>
          <Icon name="Volume" size={16} /> Tap for sound
        </button>
      )}

      {/* control bar */}
      <div className="vp-bar" style={{ opacity: controlsVisible ? 1 : 0, transform: controlsVisible ? "none" : "translateY(8px)" }}>
        <div
          ref={trackRef}
          className="vp-track"
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.round(state.duration)}
          aria-valuenow={Math.round(shown)}
          tabIndex={0}
          onPointerDown={onScrubDown}
          onPointerMove={onScrubMove}
          onPointerUp={onScrubUp}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
              const t = Math.max(0, Math.min(state.duration, state.time + (e.key === "ArrowRight" ? 5 : -5)));
              send({ type: "vision:seek", time: t });
              if (state.playing) send({ type: "vision:play" });
            }
          }}
        >
          <div className="vp-track-fill" style={{ width: `${pct}%` }} />
          <div className="vp-track-knob" style={{ left: `${pct}%` }} />
        </div>
        <div className="vp-row">
          <button type="button" className="vp-btn" onClick={toggle} aria-label={state.playing ? "Pause" : "Play"}>
            <Icon name={state.playing ? "PauseFilled" : "PlayFilled"} size={20} />
          </button>
          <button type="button" className="vp-btn" onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"}>
            <Icon name={muted ? "VolumeOff" : "Volume"} size={20} />
          </button>
          <span className="vp-time">{fmt(shown)} <span style={{ opacity: 0.5 }}>/ {fmt(state.duration)}</span></span>
          <span style={{ flex: 1 }} />
          <button type="button" className="vp-btn" onClick={fullscreen} aria-label="Full screen">
            <Icon name="Maximize" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
