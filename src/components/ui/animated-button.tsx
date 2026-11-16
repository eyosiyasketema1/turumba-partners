"use client";

/* AnimatedButton — from VengeanceUI (github.com/Ashutoshx7/VengeanceUI, "animated-button"),
   adapted for Turumba: brand colours, pill shape, site button sizing, no shadcn theme tokens.
   A light sweeps across the label and the border every six seconds; it presses in slightly on tap. */

import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

type Tone = "primary" | "inverse";

const TONES: Record<Tone, { bg: string; hover: string; fg: string; shine: string; border: string }> = {
  // Blue Ocean button for light or dark grounds
  primary: { bg: "#1565c0", hover: "#11519a", fg: "#ffffff", shine: "rgba(255,255,255,.85)", border: "rgba(255,255,255,.18)" },
  // white button for Blue Ocean / gradient grounds
  inverse: { bg: "#ffffff", hover: "#e7eff9", fg: "#1565c0", shine: "rgba(21,101,192,.75)", border: "rgba(21,101,192,.18)" },
};

type Props = Omit<HTMLMotionProps<"button">, "children"> &
  Pick<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
    children: ReactNode;
    tone?: Tone;
    height?: number;
    /** horizontal padding in px */
    padX?: number;
    /** seconds of rest between sweeps */
    every?: number;
  };

export default function AnimatedButton({ children, tone = "primary", height = 48, padX = 28, every = 6, className = "", style, type = "button", ...rest }: Props) {
  const t = TONES[tone];
  const still = useReducedMotion(); // no sweeping light for people who ask for less motion
  return (
    <motion.button
      type={type}
      {...rest}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.5 }}
      className={`tb-animated ${className}`}
      style={{
        position: "relative", overflow: "hidden", display: "inline-flex", alignItems: "center", justifyContent: "center",
        height, padding: `0 ${padX}px`, borderRadius: 9999, border: `1px solid ${t.border}`, background: t.bg, color: t.fg,
        fontSize: 15, fontWeight: 500, whiteSpace: "nowrap", cursor: "pointer", transition: "background-color 150ms",
        ["--tb-hover" as string]: t.hover,
        ...(style as CSSProperties),
      }}
    >
      {/* label, with a light sweeping across it */}
      <motion.span
        style={{
          position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: "100%",
          WebkitMaskImage: "linear-gradient(-75deg, #fff calc(var(--mask-x) + 20%), rgba(255,255,255,.35) calc(var(--mask-x) + 30%), #fff calc(var(--mask-x) + 100%))",
          maskImage: "linear-gradient(-75deg, #fff calc(var(--mask-x) + 20%), rgba(255,255,255,.35) calc(var(--mask-x) + 30%), #fff calc(var(--mask-x) + 100%))",
        }}
        initial={{ "--mask-x": "100%" } as Record<string, string>}
        animate={(still ? { "--mask-x": "100%" } : { "--mask-x": "-100%" }) as Record<string, string>}
        transition={{ repeat: Infinity, duration: 1, ease: "linear", repeatDelay: every }}
      >
        {children}
      </motion.span>

      {/* the same light running along the border */}
      <motion.span
        aria-hidden
        style={{
          position: "absolute", inset: 0, borderRadius: 9999, padding: 1, display: "block",
          background: `linear-gradient(-75deg, transparent 30%, ${t.shine} 50%, transparent 70%)`,
          backgroundSize: "200% 100%",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
        }}
        initial={{ backgroundPosition: "100% 0", opacity: 0 }}
        animate={still ? { opacity: 0 } : { backgroundPosition: ["100% 0", "0% 0"], opacity: [0, 1, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear", repeatDelay: every }}
      />
    </motion.button>
  );
}
