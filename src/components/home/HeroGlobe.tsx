"use client";

/* Home hero globe — the design's live network as a 3D globe with cobe (the same library as the partners page).
   - opens facing Africa, 22 cities as markers
   - messages travel between cities all the time, as arcs that draw themselves and fade
   - hover a city: it grows, arcs pulse to the cities it talks with, and its name shows
   - click: send a message from that city to one of its contacts, with a ring burst where it lands
   - the globe follows the pointer, slowly turns, and can be dragged
   Every accent (markers, arcs, rings, label) is the brand primary, Blue Ocean #1565C0. */

import createGlobe, { type Arc, type Marker } from "cobe";
import { useEffect, useRef, useState } from "react";

type LatLon = [number, number];

export const CITIES: { name: string; loc: LatLon }[] = [
  { name: "Nairobi", loc: [-1.3, 36.8] }, { name: "São Paulo", loc: [-23.5, -46.6] }, { name: "London", loc: [51.5, -0.1] },
  { name: "Seoul", loc: [37.5, 127] }, { name: "Los Angeles", loc: [34.05, -118.2] }, { name: "Delhi", loc: [28.6, 77.2] },
  { name: "Addis Ababa", loc: [9.0, 38.7] }, { name: "Cairo", loc: [30.0, 31.2] }, { name: "Lagos", loc: [6.5, 3.4] },
  { name: "New York", loc: [40.7, -74] }, { name: "Mexico City", loc: [19.4, -99.1] }, { name: "Paris", loc: [48.85, 2.35] },
  { name: "Berlin", loc: [52.5, 13.4] }, { name: "Johannesburg", loc: [-26.2, 28.0] }, { name: "Hanoi", loc: [21.0, 105.8] },
  { name: "Shanghai", loc: [31.2, 121.5] }, { name: "Tokyo", loc: [35.7, 139.7] }, { name: "Sydney", loc: [-33.9, 151.2] },
  { name: "Wellington", loc: [-41.3, 174.8] }, { name: "Buenos Aires", loc: [-34.6, -58.4] }, { name: "Toronto", loc: [43.7, -79.4] },
  { name: "Dubai", loc: [25.3, 55.3] },
];

// messages always on the move between countries (Africa-weighted, since the globe opens on Africa)
const PAIRS: [number, number][] = [
  [8, 2], [0, 21], [13, 1], [7, 12], [6, 0], [21, 5], [11, 8], [9, 2],
  [5, 15], [13, 17], [16, 3], [20, 10], [7, 6], [12, 0], [1, 19], [15, 14],
];

const toVec = ([lat, lon]: LatLon) => {
  const la = (lat * Math.PI) / 180, lo = (lon * Math.PI) / 180;
  return [Math.cos(la) * Math.cos(lo), Math.cos(la) * Math.sin(lo), Math.sin(la)];
};
const angle = (a: LatLon, b: LatLon) => {
  const va = toVec(a), vb = toVec(b);
  return Math.acos(Math.min(1, Math.max(-1, va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2])));
};
// point a fraction t along the great circle from a to b
const slerp = (a: LatLon, b: LatLon, t: number): LatLon => {
  const va = toVec(a), vb = toVec(b), om = angle(a, b);
  if (om < 1e-6) return b;
  const s = Math.sin(om), k1 = Math.sin((1 - t) * om) / s, k2 = Math.sin(t * om) / s;
  const v = [0, 1, 2].map((i) => k1 * va[i] + k2 * vb[i]);
  return [(Math.asin(v[2]) * 180) / Math.PI, (Math.atan2(v[1], v[0]) * 180) / Math.PI];
};
const easeInOut = (t: number) => -(Math.cos(Math.PI * Math.min(1, Math.max(0, t))) - 1) / 2;

// each city's contacts: the cities it is paired with, plus its nearest neighbours (3 in total)
const CONTACTS: number[][] = CITIES.map((c, i) => {
  const paired = PAIRS.flatMap(([a, b]) => (a === i ? [b] : b === i ? [a] : []));
  const nearest = CITIES.map((d, j) => ({ j, d: angle(c.loc, d.loc) })).filter((x) => x.j !== i).sort((x, y) => x.d - y.d).map((x) => x.j);
  return [...new Set([...paired, ...nearest])].slice(0, 3);
});

// brand primary (Blue Ocean #1565C0) as cobe RGB
const PRIMARY: [number, number, number] = [21 / 255, 101 / 255, 192 / 255];
const scale = (k: number): [number, number, number] => [PRIMARY[0] * k, PRIMARY[1] * k, PRIMARY[2] * k];

const CYCLE = 16; // seconds for the ambient messages to cycle through all pairs
const SEND_TRAVEL = 1.4, SEND_LIFE = 3.6;
// open facing Africa (≈ 3°N, 20°E)
const START: LatLon = [3, 20];

export function HeroGlobe({ onHoverChange }: { onHoverChange?: (name: string | null) => void }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const burstLayerRef = useRef<HTMLDivElement>(null);
  const onHoverRef = useRef(onHoverChange);
  const [cursor, setCursor] = useState<"grab" | "pointer" | "grabbing">("grab");

  useEffect(() => { onHoverRef.current = onHoverChange; }, [onHoverChange]);

  useEffect(() => {
    const canvas = canvasRef.current, host = hostRef.current;
    if (!canvas || !host) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const BASE_PHI = Math.PI - ((START[1] * Math.PI) / 180 - Math.PI / 2);
    const BASE_THETA = (START[0] * Math.PI) / 180 + 0.12;
    let phi = BASE_PHI, theta = BASE_THETA, spin = 0;
    let ptrNX = 0.5, ptrNY = 0.5;
    let hover = -1;
    let dragging = false, downX = 0, downY = 0, lastX = 0, lastY = 0, moved = false;
    const nextContact = CITIES.map(() => 0);
    const sends: { from: number; to: number; t0: number; burst: boolean }[] = [];
    const t0 = performance.now();
    const now = () => (performance.now() - t0) / 1000;

    const globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      width: 1000,
      height: 1000,
      phi,
      theta,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 30000,
      mapBrightness: 5,
      baseColor: [0.3, 0.32, 0.36],
      markerColor: PRIMARY,
      glowColor: [0.03, 0.12, 0.24],
      markers: [],
      arcs: [],
      arcColor: PRIMARY,
      arcWidth: 0.5,
      arcHeight: 0.28,
      markerElevation: 0.02,
    });

    // cobe wraps the canvas and appends one anchor <div> per marker id, in marker order,
    // positioned where that city projects on screen. We read those to hit-test and place overlays.
    const anchorOf = (i: number): HTMLElement | null => {
      const wrap = canvas.parentElement;
      return wrap ? (wrap.children[i + 1] as HTMLElement | undefined) ?? null : null;
    };
    const rootStyle = () => getComputedStyle(document.documentElement);
    const isVisible = (i: number, cs: CSSStyleDeclaration) => cs.getPropertyValue(`--cobe-visible-c${i}`).trim() !== "";
    const posOf = (i: number) => {
      const a = anchorOf(i), h = host.getBoundingClientRect();
      if (!a) return null;
      const r = a.getBoundingClientRect();
      return { x: r.left - h.left, y: r.top - h.top, cx: r.left, cy: r.top };
    };
    const nearest = (clientX: number, clientY: number, maxD: number) => {
      const cs = rootStyle();
      let best = -1, bd = maxD;
      for (let i = 0; i < CITIES.length; i++) {
        if (!isVisible(i, cs)) continue;
        const p = posOf(i);
        if (!p) continue;
        const d = Math.hypot(p.cx - clientX, p.cy - clientY);
        if (d < bd) { bd = d; best = i; }
      }
      return best;
    };
    const setHover = (i: number) => {
      if (i === hover) return;
      hover = i;
      onHoverRef.current?.(i >= 0 ? CITIES[i].name : null);
      setCursor(i >= 0 ? "pointer" : "grab");
    };

    const onDown = (e: PointerEvent) => {
      dragging = true; moved = false;
      downX = lastX = e.clientX; downY = lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      const h = host.getBoundingClientRect();
      ptrNX = (e.clientX - h.left) / h.width;
      ptrNY = (e.clientY - h.top) / h.height;
      if (dragging) {
        if (Math.hypot(e.clientX - downX, e.clientY - downY) > 4) { moved = true; setCursor("grabbing"); }
        if (moved) {
          spin += (e.clientX - lastX) / 160;
          theta = Math.max(-0.6, Math.min(0.9, theta + (e.clientY - lastY) / 200));
        }
        lastX = e.clientX; lastY = e.clientY;
        return;
      }
      setHover(nearest(e.clientX, e.clientY, 26));
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
      if (!moved) {
        // a click: send a message from the clicked (or nearest visible) city to its next contact
        let from = nearest(e.clientX, e.clientY, 60);
        if (from < 0) from = nearest(e.clientX, e.clientY, Infinity);
        if (from >= 0) {
          const contacts = CONTACTS[from];
          const to = contacts[nextContact[from] % contacts.length];
          nextContact[from]++;
          const t = now();
          for (let k = sends.length - 1; k >= 0; k--) if (t - sends[k].t0 > SEND_LIFE) sends.splice(k, 1);
          sends.push({ from, to, t0: t, burst: false });
        }
      }
      setCursor(hover >= 0 ? "pointer" : "grab");
    };
    const onLeave = () => { ptrNX = 0.5; ptrNY = 0.5; if (!dragging) setHover(-1); };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("pointerleave", onLeave);

    const burst = (city: number) => {
      const layer = burstLayerRef.current, p = posOf(city);
      if (!layer || !p || !isVisible(city, rootStyle())) return;
      const ring = document.createElement("div");
      ring.className = "hg-burst";
      ring.style.left = `${p.x}px`;
      ring.style.top = `${p.y}px`;
      layer.appendChild(ring);
      window.setTimeout(() => ring.remove(), 1000);
    };

    let raf = 0;
    const tick = () => {
      const t = now();
      if (!dragging) {
        if (!reduceMotion && hover < 0) spin += 0.0012;           // slow turn, pauses while a city is hovered
        theta += (BASE_THETA + (ptrNY - 0.5) * 0.22 - theta) * 0.05; // follow the pointer, ease back
      }
      phi += (BASE_PHI + spin + (ptrNX - 0.5) * 0.35 - phi) * 0.08;

      const active = new Set<number>();
      if (hover >= 0) { active.add(hover); CONTACTS[hover].forEach((c) => active.add(c)); }

      // markers: every city; the hovered city and its contacts grow (ids give us the anchors)
      const markers: Marker[] = CITIES.map((c, i) => ({
        location: c.loc,
        size: i === hover ? 0.05 : active.has(i) ? 0.04 : 0.03 + Math.sin(t * 1.3 + i) * 0.003,
        id: `c${i}`,
      }));

      const arcs: Arc[] = [];
      // ambient messages between countries, drawing themselves and fading out
      PAIRS.forEach(([a, b], i) => {
        const local = (t + i * (CYCLE / PAIRS.length)) % CYCLE;
        const fade = local < 4.5 ? Math.min(1, (4.5 - local) / 1.2) : 0;
        if (fade <= 0) return;
        const p = reduceMotion ? 1 : easeInOut(local / 2.2);
        arcs.push({ from: CITIES[a].loc, to: p >= 1 ? CITIES[b].loc : slerp(CITIES[a].loc, CITIES[b].loc, p), color: scale(0.6 + 0.6 * fade) });
      });
      // hovered city → its contacts
      if (hover >= 0) {
        const pulse = 1.1 + 0.4 * Math.sin(t * 6);
        CONTACTS[hover].forEach((c) => arcs.push({ from: CITIES[hover].loc, to: CITIES[c].loc, color: scale(pulse) }));
      }
      // sent messages
      for (const s of sends) {
        const age = t - s.t0;
        if (age < 0 || age > SEND_LIFE) continue;
        const p = Math.min(1, age / SEND_TRAVEL);
        const fade = Math.min(1, (SEND_LIFE - age) / 0.8);
        arcs.push({ from: CITIES[s.from].loc, to: p >= 1 ? CITIES[s.to].loc : slerp(CITIES[s.from].loc, CITIES[s.to].loc, easeInOut(p)), color: scale(0.6 + 1.0 * fade) });
        if (p >= 1 && !s.burst) { s.burst = true; burst(s.to); }
      }

      globe.update({ phi, theta, markers, arcs });

      // the hover label follows its city
      const label = labelRef.current;
      if (label) {
        const cs = rootStyle();
        const hp = hover >= 0 ? posOf(hover) : null;
        if (hp && isVisible(hover, cs)) {
          label.textContent = CITIES[hover].name.toUpperCase();
          label.style.transform = `translate(${hp.x}px, ${hp.y - 22}px) translate(-50%, -100%)`;
          label.style.opacity = "1";
        } else {
          label.style.opacity = "0";
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
      globe.destroy();
    };
  }, []);

  return (
    <div ref={hostRef} className="hero-globe" style={{ position: "relative", width: "100%", height: "100%" }}>
      <canvas
        ref={canvasRef}
        width={1000}
        height={1000}
        aria-label="Interactive globe: hover a city to see who it talks with, click to send a message"
        role="img"
        style={{ width: "100%", height: "100%", aspectRatio: "1 / 1", cursor, touchAction: "pan-y" }}
      />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div ref={burstLayerRef} />
        <div
          ref={labelRef}
          style={{
            position: "absolute", left: 0, top: 0, opacity: 0, transition: "opacity 0.2s", whiteSpace: "nowrap",
            padding: "8px 16px", borderRadius: 999, background: "rgba(4,20,38,0.92)", border: "1px solid #1565c0",
            color: "#ffffff", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em",
          }}
        />
      </div>
    </div>
  );
}
