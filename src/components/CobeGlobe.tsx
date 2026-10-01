"use client";

import createGlobe from "cobe";
import Image from "next/image";
import { useEffect, useRef } from "react";

type LatLon = [number, number];

const ADDIS: LatLon = [9.03, 38.74];

// Polaroid card for every city. Photos live in /public.
const POLAROIDS = [
  { id: "addis", src: "/addis.jpg", caption: "Addis Ababa", rotate: -6 },
  { id: "dubai", src: "/dubai.jpg", caption: "Dubai", rotate: -4 },
  { id: "moscow", src: "/moscow.jpg", caption: "Moscow", rotate: 5 },
  { id: "london", src: "/london.jpg", caption: "London", rotate: 6 },
  { id: "johannesburg", src: "/johannesburg.jpg", caption: "Johannesburg", rotate: -5 },
  { id: "newyork", src: "/newyork.jpg", caption: "New York", rotate: 4 },
  { id: "brasilia", src: "/brasilia.jpg", caption: "Brasília", rotate: -6 },
  { id: "tokyo", src: "/tokyo.jpg", caption: "Tokyo", rotate: 5 },
  { id: "canberra", src: "/canberra.jpg", caption: "Canberra", rotate: -4 },
];

// Destinations the arcs travel to, in the order they are drawn (nearest first)
const DESTINATIONS: { id: string; location: LatLon }[] = [
  { id: "dubai", location: [25.2, 55.27] },
  { id: "moscow", location: [55.76, 37.62] },
  { id: "london", location: [51.51, -0.13] },
  { id: "johannesburg", location: [-26.2, 28.05] },
  { id: "newyork", location: [40.71, -74.01] },
  { id: "brasilia", location: [-15.79, -47.88] },
  { id: "tokyo", location: [35.68, 139.65] },
  { id: "canberra", location: [-35.28, 149.13] },
];

const FIRST_ARC_DELAY = 1400; // ms, lets the hero fade-in finish first
const ARC_STEP = 800; // ms between the start of each arc
const ARC_DURATION = 2200; // ms for one arc to travel from Addis to its destination
const SPIN_DELAY = FIRST_ARC_DELAY + (DESTINATIONS.length - 1) * ARC_STEP + 600; // starts turning as the last arc is drawn

const toVec = ([lat, lon]: LatLon) => {
  const la = (lat * Math.PI) / 180;
  const lo = (lon * Math.PI) / 180;
  return [Math.cos(la) * Math.cos(lo), Math.cos(la) * Math.sin(lo), Math.sin(la)];
};

// Point a fraction t of the way along the great circle from a to b
const slerp = (a: LatLon, b: LatLon, t: number): LatLon => {
  const va = toVec(a);
  const vb = toVec(b);
  const dot = Math.min(1, Math.max(-1, va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2]));
  const omega = Math.acos(dot);
  if (omega < 1e-6) return b;
  const s = Math.sin(omega);
  const k1 = Math.sin((1 - t) * omega) / s;
  const k2 = Math.sin(t * omega) / s;
  const v = [0, 1, 2].map((i) => k1 * va[i] + k2 * vb[i]);
  return [(Math.asin(v[2]) * 180) / Math.PI, (Math.atan2(v[1], v[0]) * 180) / Math.PI];
};

const easeInOut = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2; // easeInOutSine

export default function CobeGlobe({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const BASE_THETA = (ADDIS[0] * Math.PI) / 180 + 0.05;
    // Face Addis Ababa at the start
    let phi = Math.PI - ((ADDIS[1] * Math.PI) / 180 - Math.PI / 2);
    let theta = BASE_THETA;
    let raf = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      phi += (e.clientX - lastX) / 150;
      theta = Math.max(-0.9, Math.min(0.9, theta + (e.clientY - lastY) / 150));
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
      canvas.style.cursor = "grab";
    };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    const baseMarkers = [{ location: ADDIS, size: 0.035, id: "addis" }];

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
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.2, 0.4, 1],
      glowColor: [0.1, 0.1, 0.2],
      markers: baseMarkers,
      arcs: [],
      arcColor: [0.3, 0.5, 1],
      arcWidth: 0.4,
      arcHeight: 0.3,
    });

    const startTime = performance.now();
    let arrived = 0; // destinations whose arc has completed (markers added)
    let arcsDone = false;

    const tick = () => {
      const elapsed = performance.now() - startTime;
      const spinning = elapsed >= SPIN_DELAY;

      if (!dragging) {
        // Released: ease the tilt back to normal and keep spinning
        theta += (BASE_THETA - theta) * 0.06;
        if (spinning && !reduceMotion) phi += 0.004;
      }

      const update: Parameters<typeof globe.update>[0] = { phi, theta };

      if (!arcsDone) {
        // Each arc's end point travels along the great circle from Addis, so the line draws itself
        const arcs = [];
        let done = 0;
        for (let i = 0; i < DESTINATIONS.length; i++) {
          const raw = (elapsed - FIRST_ARC_DELAY - i * ARC_STEP) / ARC_DURATION;
          if (raw <= 0) break;
          const p = reduceMotion ? 1 : Math.min(1, raw);
          if (p >= 1) done++;
          arcs.push({ from: ADDIS, to: p >= 1 ? DESTINATIONS[i].location : slerp(ADDIS, DESTINATIONS[i].location, easeInOut(p)) });
        }
        update.arcs = arcs;
        if (done !== arrived) {
          arrived = done;
          update.markers = [
            ...baseMarkers,
            ...DESTINATIONS.slice(0, done).map((d) => ({ location: d.location, size: 0.025, id: d.id })),
          ];
        }
        if (done === DESTINATIONS.length) arcsDone = true;
      }

      globe.update(update);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      cancelAnimationFrame(raf);
      globe.destroy();
    };
  }, []);

  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <canvas
        ref={canvasRef}
        width={1000}
        height={1000}
        style={{ width: "100%", height: "100%", aspectRatio: "1 / 1", cursor: "grab", touchAction: "pan-y" }}
      />
      {POLAROIDS.map((p) => (
        <div
          key={p.id}
          className="pointer-events-none absolute"
          style={
            {
              positionAnchor: `--cobe-${p.id}`,
              bottom: "anchor(top)",
              left: "anchor(center)",
              translate: "-50% -8px",
              opacity: `var(--cobe-visible-${p.id}, 0)`,
              filter: `blur(calc((1 - var(--cobe-visible-${p.id}, 0)) * 8px))`,
              transition: "opacity 0.3s, filter 0.3s",
            } as React.CSSProperties
          }
        >
          <div
            className="bg-white p-[6px] pb-[22px] shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            style={{ transform: `rotate(${p.rotate}deg)`, width: 84 }}
          >
            <div className="relative w-full aspect-square bg-neutral-300 overflow-hidden">
              <Image src={p.src} alt="" fill sizes="84px" className="object-cover" />
            </div>
            <div className="mt-[5px] text-center text-[9px] leading-none font-medium text-neutral-700 tracking-wide">
              {p.caption}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
