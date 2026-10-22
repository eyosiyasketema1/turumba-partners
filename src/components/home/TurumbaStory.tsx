"use client";

/* Turumba scroll story — the film's continuous composition, driven by scroll.
   One field of 22 nodes morphs through six chapters while text steps alongside.
   Ported from turumba-story.jsx. */

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Icon } from "./ds";
import { useWorldMap, type Pt } from "./hooks";

const SS_BLUE = "#1565c0", SS_BLUE3 = "#1565c0" /* accent = brand primary */, SS_CREAM = "#ffffff", SS_G500 = "#11519a", SS_G700 = "#0d3d73", SS_G800 = "#061e3a", SS_G900 = "#041426";
const SS_N = 22, SS_PERSON = 6, SS_MENTOR = 15;
// channels: real brand marks in their brand colours (Tabler brand icons); generic channels use the brand primary
const SS_CH = [
  { n: "WhatsApp", c: "#25D366", i: "BrandWhatsappFilled" }, { n: "SMS", c: "#1565c0", i: "MessageFilled" }, { n: "Email", c: "#1565c0", i: "MailFilled" },
  { n: "Telegram", c: "#26A5E4", i: "BrandTelegramFilled" }, { n: "Messenger", c: "#0084FF", i: "BrandMessengerFilled" }, { n: "Web chat", c: "#1565c0", i: "GlobeFilled" },
];
type Chan = (typeof SS_CH)[number];
const SS_STEPS: [string, string][] = [["Sees a message", "Eye"], ["Clicks a link", "MousePointerClick"], ["Starts a conversation", "MessagesSquare"],
  ["Asks a question", "CircleHelp"], ["Needs follow-up", "Bell"], ["Needs discipleship", "BookOpen"], ["Needs someone alongside", "HeartHandshake"]];
const SS_WP: Pt[] = SS_STEPS.map((_, i) => ({ x: 930 + i * 115, y: i % 2 ? 640 : 560 }));
const SS_SILOS = [{ label: "Platform A", idx: [0, 1], dx: -50, dy: -110 }, { label: "Ministry B", idx: [2, 3, 4], dx: 0, dy: 120 }, { label: "Organization C", idx: [5, 6], dx: 30, dy: -120 }];
function ssSilo(i: number) { for (let s = 0; s < 3; s++) if (SS_SILOS[s].idx.includes(i)) return s; return 0; }
const SS_PILLARS: [string, string][] = [["Communication", "Radio"], ["Context", "Layers"], ["Automation", "Workflow"], ["Artificial Intelligence", "Brain"], ["Content", "FileText"], ["Human Engagement", "HeartHandshake"]];
const SS_GROUPS = [{ t: "Churches", i: "Church", gift: "the right community" }, { t: "Ministries", i: "Building2", gift: "the right conversation" },
  { t: "Innovators", i: "Lightbulb", gift: "the right tools" }, { t: "Content creators", i: "PenTool", gift: "the right content" },
  { t: "Mentors", i: "HeartHandshake", gift: "the right mentor" }, { t: "Communities", i: "Users", gift: "the right people" }];
const SS_AITAGS: [string, string, number, number][] = [["Engagement rising", "TrendingUp", 840, 300], ["Dropout risk", "TriangleAlert", 1150, 420], ["Best time to reach", "Clock", 860, 760], ["Topic: hope", "Sparkles", 1160, 700]];
const SS_TAU = Math.PI * 2;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
function ssEase(p: number) { p = clamp(p, 0, 1); return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; }
function ssOut(p: number) { p = clamp(p, 0, 1); return 1 - Math.pow(1 - p, 3); }
function ssWin(p: number, a: number, b: number, f = 0.08) { return Math.min(clamp((p - a) / f, 0, 1), clamp((b - p) / f, 0, 1)); }
function ssRing(k: number, n: number, cx: number, cy: number, r: number, ry?: number): Pt { const a = (k / n) * SS_TAU - Math.PI / 2; return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * (ry || r) }; }
function ssBuild(fn: (i: number) => Pt) { const a: Pt[] = []; for (let i = 0; i < SS_N; i++) a.push(fn(i)); return a; }
const SS_RN: number[] = (() => { let s = 7; const out: number[] = []; for (let i = 0; i < 120; i++) { s = (s * 1664525 + 1013904223) % 4294967296; out.push(s / 4294967296); } return out; })();
const SS_L = {
  fragment: ssBuild((i) => { if (i === SS_PERSON) return { x: 820, y: 600 }; const cx = [800, 1700, 900, 1650, 1250][i % 5], cy = [210, 230, 930, 940, 170][i % 5]; return { x: cx + (SS_RN[i] - 0.5) * 260, y: cy + (SS_RN[i + 40] - 0.5) * 100 }; }),
  center: ssBuild((i) => { if (i === SS_PERSON) return { x: 1300, y: 540 }; const a = (i / SS_N) * SS_TAU, r = i % 2 ? 380 : 260; return { x: 1300 + Math.cos(a) * r, y: 540 + Math.sin(a) * r * 0.85 }; }),
  ring: ssBuild((i) => { if (i === SS_PERSON) return { x: 1300, y: 560 }; if (i < 6) return ssRing(i, 6, 1300, 560, 270, 210); const a = ((i - 6) / (SS_N - 6)) * SS_TAU + 0.3; return { x: 1300 + Math.cos(a) * 520, y: 560 + Math.sin(a) * 330 }; }),
  split: ssBuild((i) => { if (i === SS_PERSON) return { x: 1500, y: 560 }; if (i === SS_MENTOR) return { x: 1500, y: 340 }; if (i < 11) return { x: 860 + (i % 3) * 130, y: 360 + Math.floor(i / 3) * 110 }; const a = ((i - 11) / 11) * SS_TAU; return { x: 1500 + Math.cos(a) * 200, y: 560 + Math.sin(a) * 180 }; }),
};

const SS_CHAPTERS = [
  { eyebrow: "01 · The opportunity", h: "The world has never been more connected.", p: "A message can cross borders in seconds. Someone searching for answers can encounter hope at any time, from anywhere.", v: "How beautiful upon the mountains are the feet of him that bringeth good tidings, that publisheth peace.", vr: "Isaiah 52:7" },
  { eyebrow: "02 · The problem", h: "To that person, it is one journey.", p: "Behind the scenes, their story is fragmented across platforms, systems, teams, and organizations. We lose context. We lose connection. Sometimes, we lose the person.", v: "What man of you, having an hundred sheep, if he lose one of them, doth not… go after that which is lost, until he find it?", vr: "Luke 15:4" },
  { eyebrow: "03 · A different question", h: "What if the right context could stay connected?", p: "What if automation could adapt, and AI could help us understand complexity without replacing the human relationship?", v: "And how shall they hear without a preacher?", vr: "Romans 10:14" },
  { eyebrow: "04 · Turumba", h: "One connected journey.", p: "Communication, context, automation, AI, content, and human engagement — designed to work together around the person.", v: "Two are better than one; because they have a good reward for their labour.", vr: "Ecclesiastes 4:9" },
  { eyebrow: "05 · AI + human", h: "Human intelligence and artificial intelligence, working together.", p: "AI notices, understands, and recommends — and explains why. People bring wisdom, care, and relationship. People decide.", v: "Where no counsel is, the people fall: but in the multitude of counsellors there is safety.", vr: "Proverbs 11:14" },
  { eyebrow: "06 · Kingdom collaboration", h: "Better infrastructure for Kingdom collaboration.", p: "Churches, ministries, innovators, content creators, mentors, and communities — each contributing their unique strengths around the same person.", v: "For as the body is one, and hath many members… so also is Christ.", vr: "1 Corinthians 12:12" },
];

const FONT = "'DM Sans', system-ui, sans-serif";

export function TurumbaStory() {
  const W = 1920, H = 1080, CH = SS_CHAPTERS.length;
  const ref = useRef<HTMLDivElement>(null);
  const [st, setSt] = useState({ p: 0, t: 0, w: 1400 });
  const map = useWorldMap();

  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    let last = t0, smooth = -1;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = () => {
      const el = ref.current, now = performance.now();
      const dt = Math.min(0.25, (now - last) / 1000);
      last = now;
      if (el) {
        const r = el.getBoundingClientRect(), vh = window.innerHeight || 900;
        const target = clamp(-r.top / Math.max(1, r.height - vh), 0, 1) * CH;
        // ease the story towards the scroll position instead of jumping with every wheel step — smooth, frame-rate independent
        if (smooth < 0 || reduce) smooth = target;
        else smooth += (target - smooth) * (1 - Math.exp(-dt * 6));
        if (Math.abs(target - smooth) < 0.0005) smooth = target;
        setSt({ p: smooth, t: (now - t0) / 1000, w: window.innerWidth || 1400 });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [CH]);

  const P = st.p, t = st.t, narrow = st.w < 1280;
  const ch = Math.min(CH - 1, Math.floor(P)), lp = P - ch;
  const geo = map?.story.pts ?? SS_L.center;
  const layouts = [geo, SS_L.fragment, SS_L.center, SS_L.ring, SS_L.split, geo];
  // morph in the last 35% of each chapter
  const mix = ch < CH - 1 ? ssEase((lp - 0.65) / 0.35) : 0;
  const A = layouts[ch], B = layouts[Math.min(CH - 1, ch + 1)];
  const pos: Pt[] = [];
  for (let i = 0; i < SS_N; i++) pos.push({ x: A[i].x + (B[i].x - A[i].x) * mix, y: A[i].y + (B[i].y - A[i].y) * mix });
  const person = pos[SS_PERSON], mentor = pos[SS_MENTOR];
  const connBy = [0.5, 0.06, 0.35, 0.6, 0.5, 0.9];
  const conn = connBy[ch] + (connBy[Math.min(CH - 1, ch + 1)] - connBy[ch]) * mix;
  const edges: { i: number; j: number; o: number }[] = [];
  if (conn > 0.02) for (let i = 0; i < SS_N; i++) for (let j = i + 1; j < SS_N; j++) {
    const d = Math.hypot(pos[i].x - pos[j].x, pos[i].y - pos[j].y);
    if (d < 340) edges.push({ i, j, o: conn * (1 - d / 340) * 0.85 });
  }
  const pulses: { k: number; x: number; y: number; o: number }[] = [];
  if (conn > 0.15 && edges.length) {
    const count = Math.min(14, edges.length), step = Math.max(1, Math.floor(edges.length / count));
    for (let k = 0; k < count; k++) {
      const e = edges[(k * step) % edges.length], ph = (t * 0.42 + k * 0.137) % 1, a = pos[e.i], b = pos[e.j];
      pulses.push({ k, x: a.x + (b.x - a.x) * ph, y: a.y + (b.y - a.y) * ph, o: Math.sin(ph * Math.PI) * conn });
    }
  }
  const mapO = Math.max(ch === 0 ? 1 - mix : 0, ch === 5 ? 1 : ch === 4 ? mix : 0) * 0.9;
  const halo = (t % 2.6) / 2.6;
  const icon = (name: string, size: number, color?: string) => (
    <span style={{ display: "inline-flex", color: color || SS_BLUE3, lineHeight: 0 }}><Icon name={name} size={size} /></span>
  );

  // chapter 0: arcs
  const pairs: [number, number][] = [[2, 0], [9, 1], [16, 17], [11, 6], [4, 5], [12, 13], [10, 8], [21, 14]];
  const arcs = ch === 0 ? pairs.map(([ai, bi], i) => {
    const a = geo[ai], b = geo[bi];
    const local = (t + i * 1.6) % 12, p = clamp(local / 2.2, 0, 1), fade = local < 4.5 ? Math.min(1, (4.5 - local) / 1.2) : 0;
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 - 140, q = 1 - p;
    return { d: `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`, p, fade, hx: q * q * a.x + 2 * q * p * mx + p * p * b.x, hy: q * q * a.y + 2 * q * p * my + p * p * b.y };
  }) : [];
  // chapter 1: journey + silos
  const jDraw = ch === 1 ? ssOut(lp / 0.4) : 0;
  const frac = ch === 1 ? ssEase((lp - 0.42) / 0.2) : 0;
  const fragO = ch === 1 ? ssWin(lp, 0.02, 0.66, 0.08) : 0;
  const wp = SS_WP.map((p, i) => { const s = SS_SILOS[ssSilo(i)]; return { x: p.x + s.dx * frac, y: p.y + s.dy * frac }; });
  const chain: Pt[] = [{ x: 820, y: 600 }, ...wp];
  const segs: { i: number; x1: number; y1: number; x2: number; y2: number; o: number; cross: boolean }[] = [];
  for (let i = 0; i < chain.length - 1; i++) {
    const sp = clamp(jDraw * (chain.length - 1) - i, 0, 1);
    if (sp <= 0) continue;
    const a = chain[i], b = chain[i + 1];
    const cross = i > 0 && ssSilo(i - 1) !== ssSilo(i);
    segs.push({ i, x1: a.x, y1: a.y, x2: a.x + (b.x - a.x) * sp, y2: a.y + (b.y - a.y) * sp, o: cross ? 1 - frac : 1, cross });
  }
  const silos = SS_SILOS.map((s, si) => {
    const xs = s.idx.map((i) => wp[i].x), ys = s.idx.map((i) => wp[i].y);
    const x0 = Math.min(...xs) - 90, x1 = Math.max(...xs) + 90, y0 = 380 + s.dy * frac - 90, y1 = Math.max(...ys) + 100;
    return { s, x: x0, y: y0, w: x1 - x0, h: y1 - y0, o: ssOut((lp - 0.36 - si * 0.02) / 0.05) };
  });
  const personDim = ch === 1 ? 1 - 0.85 * ssOut((lp - 0.68) / 0.08) * (1 - mix) : 1;
  // chapter 3: ring
  const ringO = ch === 3 ? ssWin(lp, 0.02, 0.98, 0.1) : 0;
  const spoke = ch === 3 ? ssOut((lp - 0.1) / 0.25) : 0;
  const loop = ch === 3 ? ssOut((lp - 0.45) / 0.3) : 0;
  // chapter 4: AI + human
  const aiO = ch === 4 ? ssWin(lp, 0.02, 0.9, 0.1) : 0;
  const scanY = 330 + ssOut((lp - 0.05) / 0.35) * 400;
  const mentorLink = ch === 4 ? ssOut((lp - 0.3) / 0.2) : 0;
  const bridge = ch === 4 ? ssOut((lp - 0.55) / 0.2) : 0;
  // chapter 5: groups + arcs
  const gpts = map?.story.gpts ?? SS_GROUPS.map((_, i) => ssRing(i, 6, 1250, 540, 420, 300));
  const kO = ch === 5 ? ssOut((lp - 0.05) / 0.2) : 0;
  const karcs = gpts.map((g, i) => {
    const p = ch === 5 ? ssOut((lp - 0.3 - i * 0.05) / 0.2) : 0;
    const mx = (g.x + person.x) / 2, my = (g.y + person.y) / 2 - 120;
    const tt = [0.42, 0.42, 0.42, 0.28, 0.42, 0.62][i], q = 1 - tt;
    return { p, d: `M ${g.x} ${g.y} Q ${mx} ${my} ${person.x} ${person.y}`, tx: q * q * g.x + 2 * q * tt * mx + tt * tt * person.x, ty: q * q * g.y + 2 * q * tt * my + tt * tt * person.y - 26 };
  });

  // Visual hierarchy, three levels:
  //   1. key callout — one per chapter, solid primary with a glow (the thing to read on the graphic)
  //   2. supporting objects — channel marks, steps, pillars, groups: light text on a quiet surface
  //   3. ambient — the network and minor tags: dim outlines that recede
  const tag = (key: string, x: number, y: number, o: number, label: string, ic?: string, level: "key" | "minor" = "minor"): ReactNode => (
    <div key={key} style={{ position: "absolute", left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%`, transform: `translate(-50%,-50%) scale(${((level === "key" ? 0.86 : 0.92) + (level === "key" ? 0.14 : 0.08) * o).toFixed(3)})`, opacity: o, display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap",
      ...(level === "key"
        ? { font: `700 13px ${FONT}`, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#ffffff", background: SS_BLUE, border: `1px solid ${SS_BLUE}`, padding: "9px 16px", borderRadius: 999, boxShadow: "0 0 0 6px rgba(21,101,192,0.18), 0 10px 30px rgba(21,101,192,0.45)", zIndex: 2 }
        : { font: `600 11px ${FONT}`, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.6)", background: "rgba(4,20,38,0.6)", border: "1px solid rgba(255,255,255,0.12)", padding: "5px 11px", borderRadius: 999 }) }}>
      {ic ? <span style={{ display: "inline-flex", color: level === "key" ? "#ffffff" : SS_BLUE, lineHeight: 0 }}><Icon name={ic} size={level === "key" ? 16 : 13} /></span> : null}{label}
    </div>
  );
  const supportChip: CSSProperties = { display: "flex", alignItems: "center", gap: 8, font: `500 14px ${FONT}`, color: "rgba(255,255,255,0.88)", background: SS_G800, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px", whiteSpace: "nowrap", boxShadow: "0 6px 18px rgba(0,0,0,0.25)" };
  const tile = (key: string, chn: Chan, x: number, y: number, o: number, s = 1): ReactNode => (
    <div key={key} style={{ position: "absolute", left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%`, transform: `translate(-50%,-50%) scale(${(s * (0.88 + 0.12 * o)).toFixed(3)})`, opacity: o, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      {/* filled channel mark in its colour, no tile behind it */}
      <div style={{ width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center", filter: `drop-shadow(0 0 10px ${chn.c}55)` }}>{icon(chn.i, 34, chn.c)}</div>
      <div style={{ font: `700 11px ${FONT}`, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>{chn.n}</div>
    </div>
  );

  return (
    <div ref={ref} style={{ position: "relative", height: `${CH * 100 + 40}vh`, background: SS_G900 }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", left: 0, right: 0, top: 0, height: narrow ? "58%" : "100%", width: "100%" }}>
          <defs>
            <radialGradient id="ss-person-glow"><stop offset="0%" stopColor="#1565c0" stopOpacity="0.55" /><stop offset="100%" stopColor="#1565c0" stopOpacity="0" /></radialGradient>
          </defs>
          {map && mapO > 0.005 && <path d={map.story.d} fill="#061e3a" stroke="#0d3d73" strokeWidth="0.9" opacity={mapO} />}
          {edges.map((e) => <line key={`${e.i}-${e.j}`} x1={pos[e.i].x} y1={pos[e.i].y} x2={pos[e.j].x} y2={pos[e.j].y} stroke={SS_G500} strokeWidth="1" opacity={e.o * 0.55} />)}
          {pulses.map((p) => <circle key={`p${p.k}`} cx={p.x} cy={p.y} r="3.2" fill={SS_BLUE3} opacity={p.o} />)}
          {arcs.map((a, i) => a.fade > 0 ? (
            <g key={`a${i}`} opacity={a.fade * (1 - mix)}>
              <path d={a.d} fill="none" stroke={SS_BLUE3} strokeWidth="1.5" strokeDasharray="3000" strokeDashoffset={((1 - a.p) * 3000).toFixed(0)} opacity="0.85" />
              {a.p < 1 && <circle cx={a.hx} cy={a.hy} r="5" fill={SS_CREAM} />}
            </g>
          ) : null)}
          {fragO > 0.005 && (
            <g opacity={fragO}>
              {silos.map((b, i) => (
                <g key={`si${i}`} opacity={b.o}>
                  <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="6" fill={SS_G800} stroke={SS_G500} strokeWidth="1.1" strokeDasharray="8 8" />
                  <text x={b.x + b.w / 2} y={b.y + 30} textAnchor="middle" fill="#8f8f8f" style={{ font: `700 15px ${FONT}`, letterSpacing: "0.16em" }}>{b.s.label.toUpperCase()}</text>
                </g>
              ))}
              {segs.map((s) => <line key={`j${s.i}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={s.cross ? SS_BLUE3 : SS_BLUE} strokeWidth="2.4" opacity={s.o} strokeDasharray={s.cross && frac > 0.05 ? "6 10" : "none"} />)}
              {segs.filter((s) => s.cross).map((s) => <text key={`q${s.i}`} x={(s.x1 + s.x2) / 2} y={(s.y1 + s.y2) / 2 - 14} fill={SS_BLUE3} textAnchor="middle" opacity={frac} style={{ font: `700 24px ${FONT}` }}>?</text>)}
            </g>
          )}
          {ringO > 0.005 && (
            <g opacity={ringO}>
              {[0, 1, 2, 3, 4, 5].map((k) => { const p = ssRing(k, 6, 1300, 560, 270, 210); return <line key={`sp${k}`} x1={p.x} y1={p.y} x2={p.x + (1300 - p.x) * spoke} y2={p.y + (560 - p.y) * spoke} stroke={SS_G500} strokeWidth="1.3" />; })}
              {[0, 1, 2, 3, 4, 5].map((k) => { const p = ssRing(k, 6, 1300, 560, 270, 210), ph = (t * 0.5 + k * 0.17) % 1; return <circle key={`spp${k}`} cx={p.x + (1300 - p.x) * ph} cy={p.y + (560 - p.y) * ph} r="3.6" fill={SS_CH[k].c} opacity={spoke * Math.sin(ph * Math.PI)} />; })}
              <ellipse cx="1300" cy="560" rx="270" ry="210" fill="none" stroke={SS_BLUE} strokeWidth="2" strokeDasharray="1600" strokeDashoffset={((1 - loop) * 1600).toFixed(0)} transform="rotate(-90 1300 560)" />
            </g>
          )}
          {aiO > 0.005 && (
            <g opacity={aiO}>
              <line x1="820" y1={scanY} x2="1160" y2={scanY} stroke={SS_BLUE3} strokeWidth="1.4" opacity={ssWin(lp, 0.05, 0.45, 0.05)} />
              {pos.slice(0, 11).filter((p, i) => i !== SS_PERSON && p.y < scanY && [1, 4, 8].includes(i)).map((p, i) => <circle key={`hi${i}`} cx={p.x} cy={p.y} r="11" fill="none" stroke={SS_BLUE3} strokeWidth="1.4" />)}
              <line x1={mentor.x} y1={mentor.y} x2={mentor.x + (person.x - mentor.x) * mentorLink} y2={mentor.y + (person.y - mentor.y) * mentorLink} stroke={SS_BLUE} strokeWidth="3" strokeLinecap="round" />
              <line x1="1160" y1="560" x2={1160 + 300 * bridge} y2="560" stroke={SS_BLUE} strokeWidth="2" />
            </g>
          )}
          {ch === 5 && karcs.map((a, i) => <path key={`k${i}`} d={a.d} fill="none" stroke={SS_BLUE} strokeWidth="1.6" strokeDasharray="3000" strokeDashoffset={((1 - a.p) * 3000).toFixed(0)} opacity="0.85" />)}
          {pos.map((p, i) => (
            <circle key={`n${i}`} cx={p.x} cy={p.y} r={i === SS_PERSON ? 13 : i === SS_MENTOR && aiO > 0.5 ? 8 : 4.5} fill={i === SS_PERSON ? "#ffffff" : i === SS_MENTOR && aiO > 0.5 ? SS_BLUE : SS_G700}
              stroke={i === SS_PERSON ? SS_BLUE : SS_G500} strokeWidth={i === SS_PERSON ? 4 : 1} opacity={i === SS_PERSON ? personDim : 0.6} />
          ))}
          {/* the person is always the focal point: soft glow + pulsing ring */}
          <circle cx={person.x} cy={person.y} r={34} fill="url(#ss-person-glow)" opacity={personDim} />
          <circle cx={person.x} cy={person.y} r={14 + halo * 56} fill="none" stroke={SS_BLUE} strokeWidth="1.6" opacity={(1 - halo) * 0.7 * personDim} />
        </svg>

        {/* HTML overlays (percent-positioned in the 1920x1080 space) */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: narrow ? "58%" : "100%", pointerEvents: "none", transform: narrow ? "scale(0.62)" : "none", transformOrigin: "50% 50%" }}>
          {fragO > 0.005 && (
            <div style={{ position: "absolute", inset: 0, opacity: fragO }}>
              {SS_STEPS.map((_, i) => { const si = SS_SILOS[ssSilo(i)]; return tile(`t${i}`, SS_CH[i % 5], SS_WP[i].x + si.dx * frac, 380 + si.dy * frac, ssOut((lp - 0.02 - i * 0.02) / 0.05), 1 - 0.12 * frac); })}
              {SS_STEPS.map((s, i) => {
                const o = clamp((jDraw * 7 - i - 0.6) / 0.4, 0, 1);
                return (
                  <div key={`c${i}`} style={{ position: "absolute", left: `${(wp[i].x / W) * 100}%`, top: `${((wp[i].y + (i % 2 ? 24 : -24)) / H) * 100}%`, opacity: o, transform: `translate(-50%,${i % 2 ? "0" : "-100%"})`, ...supportChip, font: `500 13px ${FONT}`, padding: "6px 10px", gap: 6 }}>
                    {icon(s[1], 14)}{s[0]}
                  </div>
                );
              })}
              {tag("one", 820, 668, ssOut((lp - 0.02) / 0.05), "One person", "User", "key")}
            </div>
          )}
          {ringO > 0.005 && (
            <div style={{ position: "absolute", inset: 0, opacity: ringO }}>
              {SS_CH.map((c, k) => { const p = ssRing(k, 6, 1300, 560, 270, 210); return tile(`rt${k}`, c, p.x, p.y, ssOut((lp - 0.05 - k * 0.02) / 0.06), 0.9); })}
              {SS_PILLARS.map((pl, i) => {
                const q = ssRing(i + 0.5, 6, 1300, 560, 520, 330);
                return (
                  <div key={pl[0]} style={{ position: "absolute", left: `${(q.x / W) * 100}%`, top: `${(q.y / H) * 100}%`, transform: "translate(-50%,-50%)", opacity: ssOut((lp - 0.35 - i * 0.03) / 0.08), ...supportChip }}>
                    {icon(pl[1], 16)}{pl[0]}
                  </div>
                );
              })}
              {tag("ocj", 1300, 610, ssOut((lp - 0.7) / 0.08), "One connected journey", "User", "key")}
            </div>
          )}
          {aiO > 0.005 && (
            <div style={{ position: "absolute", inset: 0, opacity: aiO }}>
              {SS_AITAGS.map((a, i) => tag(`ai${i}`, a[2], a[3], ssOut((lp - 0.12 - i * 0.06) / 0.06), a[0], a[1]))}
              {tag("mentor", mentor.x + 120, mentor.y, ssOut((lp - 0.32) / 0.06), "Mentor", "HeartHandshake")}
              {tag("rec", 1300, 470, ssOut((lp - 0.6) / 0.06), "Recommendation · explained", "Sparkles", "key")}
            </div>
          )}
          {ch === 5 && (
            <div style={{ position: "absolute", inset: 0 }}>
              {SS_GROUPS.map((g, i) => (
                <div key={g.t} style={{ position: "absolute", left: `${(gpts[i].x / W) * 100}%`, top: `${((gpts[i].y - 40) / H) * 100}%`, transform: "translate(-50%,-50%)", opacity: kO * clamp((0.34 - lp) / 0.06, 0, 1), ...supportChip, fontWeight: 600 }}>
                  {icon(g.i, 16)}{g.t}
                </div>
              ))}
              {!narrow && karcs.map((a, i) => tag(`g${i}`, a.tx, a.ty, clamp((a.p - 0.7) / 0.3, 0, 1), SS_GROUPS[i].gift))}
            </div>
          )}
        </div>

        {/* chapter copy */}
        <div style={narrow
          ? { position: "absolute", left: 24, right: 24, bottom: 56, display: "flex", alignItems: "flex-end", pointerEvents: "none", minHeight: 260 }
          : { position: "absolute", left: "var(--th-gutter, 24px)", top: 0, bottom: 0, width: 540, display: "flex", alignItems: "center", pointerEvents: "none" }}>
          <div style={narrow
            ? { position: "absolute", left: -24, right: -24, top: -140, bottom: -56, background: "linear-gradient(180deg, rgba(4,20,38,0) 0%, rgba(4,20,38,0.92) 30%, rgba(4,20,38,1) 100%)" }
            : { position: "absolute", left: "calc(-1 * var(--th-gutter, 24px))", top: 0, bottom: 0, width: "calc(704px + var(--th-gutter, 24px))", background: "linear-gradient(90deg, rgba(4,20,38,0.96) 0%, rgba(4,20,38,0.85) 60%, rgba(4,20,38,0) 100%)" }} />
          {SS_CHAPTERS.map((c, i) => {
            const o = ssEase(ssWin(P, i + 0.02, i + 0.98, 0.16));
            if (o <= 0.002) return null;
            // incoming copy rises in, outgoing copy lifts away — with a soft blur, so chapters dissolve into each other
            const dir = P < i + 0.5 ? 1 : -1, y = (1 - o) * 28 * dir;
            return (
              <div key={i} style={{ position: "absolute", left: 0, right: 0, opacity: o, transform: `translate3d(0, ${y.toFixed(1)}px, 0)`, filter: o < 0.995 ? `blur(${((1 - o) * 6).toFixed(2)}px)` : "none", willChange: "transform, opacity, filter", display: "flex", flexDirection: "column", gap: narrow ? 12 : 18 }}>
                {/* chapter marker — numeral, rule, name (the brand bible's section-divider pattern) */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
                  <div style={{ font: `700 ${narrow ? 52 : 88}px ${FONT}`, lineHeight: 0.82, letterSpacing: "-0.04em", color: "transparent", WebkitTextStroke: `1.5px ${SS_BLUE}` }}>{c.eyebrow.split(" · ")[0]}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: narrow ? 2 : 6 }}>
                    <span style={{ width: 28, height: 1, background: SS_BLUE }} />
                    <span style={{ font: `700 12px ${FONT}`, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>{c.eyebrow.split(" · ")[1]}</span>
                  </div>
                </div>
                {narrow && i === 5 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {SS_GROUPS.map((g, k) => {
                      const go = clamp((karcs[k].p - 0.7) / 0.3, 0, 1);
                      return (
                        <div key={`gl${k}`} style={{ opacity: go, font: `700 10px ${FONT}`, letterSpacing: "0.12em", textTransform: "uppercase", color: SS_BLUE3, background: SS_BLUE + "1f", border: `1px solid ${SS_BLUE}55`, padding: "4px 9px", borderRadius: 999, whiteSpace: "nowrap" }}>{g.gift}</div>
                      );
                    })}
                  </div>
                )}
                <div style={{ font: `700 ${narrow ? 30 : 52}px ${FONT}`, lineHeight: 1.04, letterSpacing: "-0.025em", color: SS_CREAM, textWrap: "balance", marginTop: narrow ? 2 : 6 }}>{c.h}</div>
                <div style={{ font: `400 ${narrow ? 15 : 18}px ${FONT}`, lineHeight: 1.6, color: "rgba(255,255,255,0.75)", textWrap: "pretty", maxWidth: 480 }}>{c.p}</div>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginTop: narrow ? 4 : 14, maxWidth: 440 }}>
                  <div style={{ width: 2, alignSelf: "stretch", background: SS_BLUE, borderRadius: 2, flex: "none" }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ font: `italic 400 ${narrow ? 13 : 14}px ${FONT}`, lineHeight: 1.55, color: "rgba(255,255,255,0.55)", textWrap: "pretty" }}>“{c.v}”</div>
                    <div style={{ font: `700 10px ${FONT}`, letterSpacing: "0.2em", textTransform: "uppercase", color: SS_BLUE }}>{c.vr}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* progress rail: chapter counter above the dots */}
        <div style={{ position: "absolute", right: narrow ? 14 : 40, top: narrow ? 20 : "50%", transform: narrow ? "none" : "translateY(-50%)", display: "flex", flexDirection: narrow ? "row" : "column", gap: 12, alignItems: "center" }}>
          {!narrow && <div style={{ font: `700 11px ${FONT}`, letterSpacing: "0.12em", color: "rgba(255,255,255,0.75)", marginBottom: 6 }}>{String(ch + 1).padStart(2, "0")}<span style={{ color: "rgba(255,255,255,0.35)" }}> / {String(CH).padStart(2, "0")}</span></div>}
          {SS_CHAPTERS.map((_, i) => {
            const on = i === ch, done = i < ch;
            return <div key={i} style={{ width: on ? (narrow ? 26 : 6) : 6, height: on ? (narrow ? 6 : 26) : 6, borderRadius: 999, background: on ? SS_BLUE : done ? "rgba(21,101,192,0.55)" : "rgba(255,255,255,0.18)", transition: "all 0.3s" }} />;
          })}
        </div>
        <div style={{ position: "absolute", left: "50%", bottom: 28, transform: "translateX(-50%)", font: `700 11px ${FONT}`, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(161,193,230,0.7)", opacity: P < 0.3 ? 1 : 0, transition: "opacity 0.4s", whiteSpace: "nowrap" }}>
          Scroll to follow the journey
        </div>
      </div>
    </div>
  );
}
