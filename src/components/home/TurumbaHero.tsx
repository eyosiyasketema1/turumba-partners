"use client";

/* Turumba landing hero background — a live 3D globe (cobe) over a deep Blue Ocean field.
   Hover a city to see it and connect it to Addis, click to send a message, drag or move the pointer to turn it.
   Plus the journey strip and word cycler. Ported from turumba-hero.jsx. */

import { useEffect, useState } from "react";
import { Icon } from "./ds";
import { HeroGlobe } from "./HeroGlobe";
import { useClock, useNarrow } from "./hooks";

const HERO_BLUE = "#1565c0";
const HERO_BLUE3 = "#1565c0"; // accent = brand primary

export function TurumbaHero() {
  const narrow = useNarrow(900);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "radial-gradient(ellipse 70% 80% at 72% 50%, #08284d 0%, #041426 62%)" }}>
      {/* the globe sits to the right of the headline (behind it on small screens) */}
      <div
        style={narrow
          ? { position: "absolute", width: "135vw", aspectRatio: "1 / 1", right: "-62vw", top: "22%", opacity: 0.55 }
          : { position: "absolute", width: "62%", aspectRatio: "1 / 1", right: "-10%", top: "50%", transform: "translateY(-50%)" } /* same size and place as the partners page globe */}
      >
        <HeroGlobe onHoverChange={setHovered} />
      </div>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(90deg, rgba(4,20,38,0.85) 0%, rgba(4,20,38,0.45) 30%, rgba(4,20,38,0) 50%)" }} />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(180deg, rgba(4,20,38,0.55) 0%, rgba(4,20,38,0) 22%, rgba(4,20,38,0) 72%, rgba(4,20,38,0.92) 100%)" }} />
      <div style={{ position: "absolute", right: "var(--th-gutter, 48px)", top: 104, pointerEvents: "none", display: narrow ? "none" : "flex", alignItems: "center", gap: 12, font: "500 13px 'DM Sans', system-ui, sans-serif", color: "rgba(161,193,230,0.9)" }}>
        <span style={{ width: 10, height: 10, borderRadius: 999, background: "#1565c0", display: "inline-block" }} />
        {hovered ? `Click to send a message from ${hovered}` : "Hover a city · click to send a message · drag to turn"}
      </div>
    </div>
  );
}

/* the film's core idea, as a live strip: seven steps, one journey */
const JOURNEY: [string, string][] = [["Sees a message", "Eye"], ["Clicks a link", "MousePointerClick"], ["Starts a conversation", "MessagesSquare"],
  ["Asks a question", "CircleHelp"], ["Needs follow-up", "Bell"], ["Needs discipleship", "BookOpen"], ["Needs someone alongside", "HeartHandshake"]];

export function TurumbaJourneyStrip() {
  const t = useClock();
  const narrow = useNarrow(900);
  const PER = 1.4, n = JOURNEY.length, cyc = (t % (PER * n + 1.2)) / PER;
  const active = Math.min(n - 1, Math.floor(cyc));
  const prog = Math.min(1, cyc / (n - 1));

  if (narrow) {
    const s = JOURNEY[active];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ position: "relative", height: 2, background: "rgba(161,193,230,0.25)", borderRadius: 2 }}>
          <div style={{ position: "absolute", left: 0, top: 0, height: 2, width: `${(prog * 100).toFixed(1)}%`, background: HERO_BLUE, transition: "width 0.25s linear" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(21,101,192,0.18)", border: "1px solid rgba(21,101,192,0.6)", display: "flex", alignItems: "center", justifyContent: "center", color: HERO_BLUE3, flex: "none" }}>
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
  return (
    <div style={{ position: "relative", display: "grid", gridTemplateColumns: `repeat(${n}, 1fr)`, gap: 10, alignItems: "start" }}>
      <div style={{ position: "absolute", left: "7%", right: "7%", top: 21, height: 2, background: "rgba(161,193,230,0.25)" }} />
      <div style={{ position: "absolute", left: "7%", top: 21, height: 2, width: `${(prog * 86).toFixed(2)}%`, background: HERO_BLUE, transition: "width 0.25s linear" }} />
      <div style={{ position: "absolute", left: `calc(7% + ${(prog * 86).toFixed(2)}% - 6px)`, top: 16, width: 12, height: 12, borderRadius: 999, background: "#ffffff", boxShadow: "0 0 0 6px rgba(21,101,192,0.35)", transition: "left 0.25s linear" }} />
      {JOURNEY.map((s, i) => {
        const on = i <= active;
        return (
          <div key={s[0]} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center" }}>
            <div style={{ width: 44, height: 44, borderRadius: 8, background: on ? "rgba(21,101,192,0.18)" : "rgba(6,30,58,0.9)", border: `1px solid ${on ? "rgba(21,101,192,0.6)" : "rgba(161,193,230,0.25)"}`, display: "flex", alignItems: "center", justifyContent: "center", color: on ? HERO_BLUE3 : "#8f8f8f", position: "relative", transition: "all 0.3s" }}>
              <Icon name={s[1]} size={20} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: on ? "#ffffff" : "rgba(161,193,230,0.7)", transition: "color 0.3s", lineHeight: 1.3 }}>{s[0]}</div>
          </div>
        );
      })}
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
