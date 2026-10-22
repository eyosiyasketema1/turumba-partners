"use client";

/* Turumba landing hero background — a live 3D globe (cobe) over a deep Blue Ocean field.
   Hover a city to see who it talks with, click to send a message, drag or move the pointer to turn it.
   Plus the journey strip and word cycler. Ported from turumba-hero.jsx. */

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Icon } from "./ds";
import { motion } from "framer-motion";
import { HeroGlobe } from "./HeroGlobe";
import { useInViewClock, useNarrow } from "./hooks";

const HERO_BLUE = "#1565c0";

export function TurumbaHero() {
  const narrow = useNarrow(900);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "radial-gradient(ellipse 70% 80% at 72% 50%, #08284d 0%, #041426 62%)" }}>
      {/* the globe sits to the right of the headline (behind it on small screens) */}
      <div
        style={narrow
          ? { position: "absolute", width: "135vw", aspectRatio: "1 / 1", right: "-62vw", top: "22%", opacity: 0.55 }
          : { position: "absolute", width: "62%", aspectRatio: "1 / 1", right: "-10%", top: "50%", transform: "translateY(-50%)" } /* same size and place as the partners page globe */}
      >
        {/* same entrance as the partners page globe: fades in and grows slightly */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: "100%", height: "100%" }}
        >
          <HeroGlobe />
        </motion.div>
      </div>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(90deg, rgba(4,20,38,0.85) 0%, rgba(4,20,38,0.45) 30%, rgba(4,20,38,0) 50%)" }} />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(180deg, rgba(4,20,38,0.55) 0%, rgba(4,20,38,0) 22%, rgba(4,20,38,0) 72%, rgba(4,20,38,0.92) 100%)" }} />
    </div>
  );
}

/* the film's core idea, as a live strip: seven steps, one journey */
const JOURNEY: [string, string][] = [["Sees a message", "Eye"], ["Clicks a link", "MousePointerClick"], ["Starts a conversation", "MessagesSquare"],
  ["Asks a question", "CircleHelp"], ["Needs follow-up", "Bell"], ["Needs discipleship", "BookOpen"], ["Needs someone alongside", "HeartHandshake"]];

export function TurumbaJourneyStrip() {
  // starts from "Sees a message" when the strip scrolls into view, and restarts each time it comes back
  const ref = useRef<HTMLDivElement>(null);
  const t = useInViewClock(ref);
  const narrow = useNarrow(900);
  const PER = 1.4, n = JOURNEY.length, cyc = (t % (PER * n + 1.2)) / PER;
  const active = Math.min(n - 1, Math.floor(cyc));
  const prog = Math.min(1, cyc / (n - 1));

  // only the current step is lit (white tile, primary icon, bigger, soft ring); once the line moves on it returns to its first state
  const tile = (i: number, base: number): CSSProperties => {
    const current = i === active, reached = current;
    return {
      width: base, height: base, borderRadius: 10, flex: "none", position: "relative", zIndex: 1,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: reached ? "#ffffff" : "#061e3a",
      border: `1px solid ${reached ? "#ffffff" : "rgba(161,193,230,0.25)"}`,
      color: reached ? HERO_BLUE : "#8f8f8f",
      transform: `scale(${current ? 1.25 : 1})`,
      boxShadow: current ? "0 0 0 6px rgba(21,101,192,0.35), 0 8px 24px rgba(0,0,0,0.35)" : "none",
      transition: "transform 0.35s cubic-bezier(.2,.8,.2,1), background 0.3s, color 0.3s, border-color 0.3s, box-shadow 0.3s",
    };
  };

  if (narrow) {
    const s = JOURNEY[active];
    return (
      <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ position: "relative", height: 2, background: "rgba(161,193,230,0.25)", borderRadius: 2 }}>
          <div style={{ position: "absolute", left: 0, top: 0, height: 2, width: `${(prog * 100).toFixed(1)}%`, background: HERO_BLUE }} />
          <div style={{ position: "absolute", left: `${(prog * 100).toFixed(1)}%`, top: 1, width: 8, height: 8, borderRadius: 999, background: "#ffffff", transform: "translate(-50%, -50%)", boxShadow: "0 0 5px 2px rgba(255,255,255,0.85), 0 0 12px 5px rgba(21,101,192,0.9)" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ ...tile(active, 40), transform: "none" }}>
            <Icon name={s[1]} size={18} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(161,193,230,0.85)" }}>Step {active + 1} of {n}</div>
            <div style={{ fontSize: 15, fontWeight: 500, color: "#ffffff" }}>{s[0]}</div>
          </div>
        </div>
      </div>
    );
  }
  const SLOT = 64; // fixed slot height so tiles can grow without moving the labels; the line runs through its middle
  const EDGE = `((100% - ${(n - 1) * 10}px) / ${n * 2})`;   // centre of the first column
  const SPAN = `(100% - 2 * ${EDGE})`;                      // first centre → last centre
  return (
    <div ref={ref} style={{ position: "relative", display: "grid", gridTemplateColumns: `repeat(${n}, 1fr)`, gap: 10, alignItems: "start" }}>
      {/* the line runs from the centre of the first tile to the centre of the last, behind the tiles */}
      <div style={{ position: "absolute", zIndex: 0, left: `calc(${EDGE})`, right: `calc(${EDGE})`, top: SLOT / 2 - 1, height: 2, background: "rgba(161,193,230,0.25)" }} />
      <div style={{ position: "absolute", zIndex: 0, left: `calc(${EDGE})`, top: SLOT / 2 - 1, height: 2, width: `calc(${SPAN} * ${prog.toFixed(4)})`, background: HERO_BLUE }} />
      {/* glowing dot at the head of the moving line — same maths as the line, so they stay together */}
      <div style={{ position: "absolute", zIndex: 0, left: `calc(${EDGE} + ${SPAN} * ${prog.toFixed(4)})`, top: SLOT / 2, width: 10, height: 10, borderRadius: 999, background: "#ffffff", transform: "translate(-50%, -50%)", boxShadow: "0 0 6px 2px rgba(255,255,255,0.85), 0 0 16px 6px rgba(21,101,192,0.9), 0 0 32px 10px rgba(21,101,192,0.45)" }} />
      {JOURNEY.map((s, i) => (
        <div key={s[0]} style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" }}>
          <div style={{ height: SLOT, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={tile(i, 44)}>
              <Icon name={s[1]} size={20} />
            </div>
          </div>
          <div style={{ fontSize: 13, fontWeight: i === active ? 700 : 500, color: i === active ? "#ffffff" : "rgba(161,193,230,0.7)", transition: "color 0.3s", lineHeight: 1.3 }}>{s[0]}</div>
        </div>
      ))}
    </div>
  );
}

/* "Connected. / Intelligent. / Human-centered." — words stack in one grid cell, so the box is as wide as the longest word */
export function TurumbaWordCycle({ fontSize = 20, lineHeight = 24, fontWeight = 500, color = "#ffffff" }: { fontSize?: number; lineHeight?: number; fontWeight?: number; color?: string }) {
  const words = ["Connected.", "Intelligent.", "Human-centered."];
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((i) => i + 1), 2200);
    return () => clearInterval(id);
  }, []);
  const i = step % words.length;
  const shift = Math.round(lineHeight * 0.75);
  return (
    <span aria-live="polite" style={{ display: "inline-grid", overflow: "hidden", height: lineHeight, lineHeight: `${lineHeight}px`, fontSize, fontWeight, color }}>
      {words.map((w, k) => {
        const on = k === i;
        const up = k < i || (i === 0 && k === words.length - 1);
        return (
          <span key={w} aria-hidden={!on} style={{ gridArea: "1 / 1", whiteSpace: "nowrap", opacity: on ? 1 : 0, transform: on ? "none" : `translateY(${up ? -shift : shift}px)`, transition: "opacity 0.5s, transform 0.6s cubic-bezier(.2,.8,.2,1)" }}>
            {w}
          </span>
        );
      })}
    </span>
  );
}
