"use client";

/* Turumba Design System primitives (Button, Icon, Badge, ChannelTile), ported from the
   Claude Design bundle `_ds/turumba-design-system/_ds_bundle.js`. */

import { createElement, useState, type CSSProperties, type ReactNode } from "react";
import {
  ArrowRight, Bell, BookOpen, Brain, Building2, CalendarClock, Church, CircleHelp, Clock, Eye, FileText,
  Globe, HeartHandshake, History, Inbox, Languages, Layers, Lightbulb, Mail, Megaphone, Menu, MessageCircle,
  MessageSquare, MessageSquareText, MessagesSquare, MousePointerClick, Network, PenTool, Play, Radio,
  Route, Scale, Send, Sparkles, Sun, TrendingUp, TriangleAlert, User, UserCheck, Users, Workflow,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  ArrowRight, Bell, BookOpen, Brain, Building2, CalendarClock, Church, CircleHelp, Clock, Eye, FileText,
  Globe, HeartHandshake, History, Inbox, Languages, Layers, Lightbulb, Mail, Megaphone, Menu, MessageCircle,
  MessageSquare, MessageSquareText, MessagesSquare, MousePointerClick, Network, PenTool, Play, Radio,
  Route, Scale, Send, Sparkles, Sun, TrendingUp, TriangleAlert, User, UserCheck, Users, Workflow,
};

/* accepts PascalCase ("MessageCircle") or kebab-case ("message-circle") Lucide names */
function resolveIcon(name: string): LucideIcon | null {
  if (ICONS[name]) return ICONS[name];
  const pascal = name.replace(/(^|-)([a-z0-9])/g, (_, __, c: string) => c.toUpperCase());
  return ICONS[pascal] ?? null;
}

export function Icon({ name, size = 16, color, strokeWidth = 2 }: { name: string; size?: number; color?: string; strokeWidth?: number }) {
  const glyph = resolveIcon(name);
  if (!glyph) return null;
  // icons come from a static lookup table, so createElement here never remounts
  return createElement(glyph, { size, color: color ?? "currentColor", strokeWidth, style: { flex: "none" }, "aria-hidden": true });
}

type ButtonVariant = "primary" | "outline" | "secondary" | "ghost" | "inverse" | "outline-light";
// pill buttons, matching the site navbar ("Sign in" / "Start now for free"): 40px tall, 15px medium, fully rounded
const SIZES = { sm: { h: 34, px: 16, fs: 14 }, md: { h: 40, px: 20, fs: 15 }, lg: { h: 44, px: 24, fs: 15 } };

function palette(variant: ButtonVariant, hover: boolean) {
  switch (variant) {
    case "outline": return { bg: hover ? "rgba(0,0,0,0.05)" : "transparent", fg: "#1a1a1a", bd: "rgba(0,0,0,0.2)" };
    case "secondary": return { bg: hover ? "#e5e5e5" : "#eeeeee", fg: "#2b2a2a", bd: "transparent" };
    case "ghost": return { bg: hover ? "#f7f7f7" : "transparent", fg: "#1a1a1a", bd: "transparent" };
    // for Blue Ocean / dark grounds (Brand Bible: white on Blue Ocean, Prussian Blue, black)
    case "inverse": return { bg: hover ? "#e7eff9" : "#ffffff", fg: "#1565c0", bd: "transparent" };
    case "outline-light": return { bg: hover ? "rgba(255,255,255,0.1)" : "transparent", fg: "#ffffff", bd: "rgba(255,255,255,0.4)" };
    default: return { bg: hover ? "#11519a" : "#1565c0", fg: "#fff", bd: "transparent" };
  }
}

export function Button({
  variant = "primary", size = "md", icon, iconAfter, children, onClick, style,
}: {
  variant?: ButtonVariant; size?: keyof typeof SIZES; icon?: string; iconAfter?: string;
  children: ReactNode; onClick?: () => void; style?: CSSProperties;
}) {
  const [hover, setHover] = useState(false);
  const s = SIZES[size];
  const p = palette(variant, hover);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        height: s.h, padding: `0 ${s.px}px`, fontSize: s.fs, fontWeight: 500, fontFamily: "inherit",
        background: p.bg, color: p.fg, border: `1px solid ${p.bd}`, borderRadius: 9999, cursor: "pointer",
        boxShadow: variant === "primary" ? "0 1px 2px rgba(0,0,0,0.05)" : undefined,
        whiteSpace: "nowrap", transition: "background 150ms, border-color 150ms", ...style,
      }}
    >
      {icon ? <Icon name={icon} size={16} /> : null}
      {children}
      {iconAfter ? <Icon name={iconAfter} size={16} /> : null}
    </button>
  );
}

const BADGES = {
  info: { bg: "rgba(21,101,192,.08)", fg: "#0d3d73", bd: "rgba(21,101,192,.2)" },
  default: { bg: "#1565c0", fg: "#fff", bd: "#1565c0" },
};

export function Badge({ variant = "default", children }: { variant?: keyof typeof BADGES; children: ReactNode }) {
  const v = BADGES[variant];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, textTransform: "uppercase",
      letterSpacing: "0.12em", padding: "2px 8px", background: v.bg, color: v.fg, border: `1px solid ${v.bd}`,
      borderRadius: 9999, whiteSpace: "nowrap", lineHeight: "18px",
    }}>
      {children}
    </span>
  );
}

const CHANNELS = {
  whatsapp: { label: "WhatsApp", icon: "message-circle", color: "#22c55e", deep: "#16a34a" },
  sms: { label: "SMS", icon: "message-square", color: "#3b82f6", deep: "#1565c0" },
  email: { label: "Email", icon: "mail", color: "#8b5cf6", deep: "#7c3aed" },
  telegram: { label: "Telegram", icon: "send", color: "#0ea5e9", deep: "#0284c7" },
  messenger: { label: "Messenger", icon: "messages-square", color: "#1565c0", deep: "#1565c0" },
  smpp: { label: "SMPP", icon: "network", color: "#64748b", deep: "#475569" },
};
export type Channel = keyof typeof CHANNELS;

export function ChannelTile({ channel, size = 44 }: { channel: Channel; size?: number }) {
  const c = CHANNELS[channel];
  return (
    <div title={c.label} style={{
      width: size, height: size, display: "grid", placeItems: "center", background: c.color + "18",
      border: `1px solid ${c.color}40`, borderRadius: 6, color: c.deep, flexShrink: 0,
    }}>
      <Icon name={c.icon} size={Math.round(size * 0.5)} />
    </div>
  );
}
