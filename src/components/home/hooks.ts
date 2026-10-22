"use client";

import { useEffect, useState, type RefObject } from "react";

export type Pt = { x: number; y: number };
export type WorldMap = {
  hero: { d: string; pts: Pt[] };
  story: { d: string; pts: Pt[]; gpts: Pt[] };
};

/* Natural Earth projection of the world, pre-computed from world-atlas 110m (see public/world-map.json):
   `hero` is fitted to 1920×1080, `story` to the [600,150]–[1880,930] box used by the scroll story. */
let mapPromise: Promise<WorldMap | null> | null = null;
let mapCache: WorldMap | null = null;

function loadWorldMap() {
  if (!mapPromise) {
    mapPromise = fetch("/world-map.json")
      .then((r) => (r.ok ? (r.json() as Promise<WorldMap>) : null))
      .then((m) => (mapCache = m))
      .catch(() => null);
  }
  return mapPromise;
}

export function useWorldMap() {
  const [map, setMap] = useState<WorldMap | null>(mapCache);
  useEffect(() => {
    let alive = true;
    loadWorldMap().then((m) => { if (alive && m) setMap(m); });
    return () => { alive = false; };
  }, []);
  return map;
}

/* seconds since mount, updated every animation frame */
export function useClock() {
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const tick = () => { setT((performance.now() - t0) / 1000); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return t;
}

/* true below the given viewport width; false during SSR */
export function useNarrow(breakpoint = 900) {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 0.02}px)`);
    const update = () => setNarrow(mq.matches);
    const raf = requestAnimationFrame(update);
    mq.addEventListener("change", update);
    return () => { cancelAnimationFrame(raf); mq.removeEventListener("change", update); };
  }, [breakpoint]);
  return narrow;
}

/* seconds since the element scrolled into view (0 while it is out of view; restarts each time it comes back) */
export function useInViewClock<T extends Element>(ref: RefObject<T | null>, threshold = 0.35) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0, t0 = 0;
    const tick = () => { setT((performance.now() - t0) / 1000); raf = requestAnimationFrame(tick); };
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e.isIntersecting) { t0 = performance.now(); raf = requestAnimationFrame(tick); }
      else setT(0);
    }, { threshold });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [ref, threshold]);
  return t;
}
