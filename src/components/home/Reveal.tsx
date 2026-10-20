"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

/* Fades + lifts its content in the first time it scrolls into view (the design's [data-reveal]). */
export function Reveal({
  as: Tag = "div", id, className = "", style, children, ...rest
}: {
  as?: ElementType; id?: string; className?: string; style?: CSSProperties; children: ReactNode;
  "data-rs"?: string; "data-screen-label"?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) { el.classList.add("is-shown"); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-shown"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} id={id} className={`th-reveal ${className}`} style={style} {...rest}>
      {children}
    </Tag>
  );
}
