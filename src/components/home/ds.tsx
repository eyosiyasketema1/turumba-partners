"use client";

/* Turumba Design System primitives (Button, Icon, Badge, ChannelTile), ported from the
   Claude Design bundle `_ds/turumba-design-system/_ds_bundle.js`. */

import { createElement, useState, type CSSProperties, type ReactNode } from "react";
import {
  IconAlertTriangle, IconArrowRight, IconBell, IconBook, IconBrain, IconBrandMessenger, IconBrandTelegram, IconBrandWhatsapp,
  IconBroadcast, IconBuildingChurch, IconBuildingCommunity, IconBulb, IconCalendarTime, IconClick, IconClock, IconEye,
  IconFileText, IconHeartHandshake, IconHelpCircle, IconHistory, IconInbox, IconLanguage, IconMail, IconMenu2, IconMessage,
  IconMessage2, IconMessageCircle, IconMessages, IconNetwork, IconPencil, IconPlayerPlay, IconRoute, IconScale, IconSend,
  IconSitemap, IconSparkles, IconSpeakerphone, IconStack2, IconSun, IconTrendingUp, IconUser, IconUserCheck, IconUsers, IconWorld,
  IconBrandMessengerFilled, IconBrandWhatsappFilled, IconMailFilled, IconMessageFilled, IconWorldFilled,
  IconMaximize, IconPlayerPauseFilled, IconPlayerPlayFilled, IconRotateClockwise, IconVolume, IconVolumeOff,
  type Icon as TablerIcon,
} from "@tabler/icons-react";
import { forwardRef, type SVGProps } from "react";

/* Tabler has no filled Telegram mark, so this is one drawn to the same 24px grid: the brand's circle with the paper plane cut out. */
const IconBrandTelegramFilled = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement> & { size?: number | string; stroke?: number | string; color?: string }>(
  function IconBrandTelegramFilled({ size = 24, color = "currentColor", stroke: _stroke, ...rest }, ref) {
    void _stroke;
    return (
      <svg ref={ref} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={color} {...rest}>
        <path fillRule="evenodd" d="M12 2a10 10 0 1 1 0 20a10 10 0 0 1 0-20zm4.38 6.2c.3-.12.6.14.52.47l-1.7 8.03c-.1.45-.58.64-.95.38l-2.6-1.92-1.3 1.25c-.15.15-.4.08-.45-.12l-.47-1.95-2.33-.77c-.36-.12-.38-.62-.03-.76l9.31-3.6zm-1.94 2.33l-4.7 3.27.35 1.42.12-1.04 4.23-3.65z" />
      </svg>
    );
  },
) as unknown as TablerIcon;

/* Icons come from Tabler (tabler.io/icons) — 24px grid, 2px stroke, matching the brand bible's iconography spec.
   Keys keep the names used across the page, so call sites read naturally. Brand marks use the official brand icons. */
const ICONS: Record<string, TablerIcon> = {
  ArrowRight: IconArrowRight, Bell: IconBell, BookOpen: IconBook, Brain: IconBrain, Building2: IconBuildingCommunity,
  CalendarClock: IconCalendarTime, Church: IconBuildingChurch, CircleHelp: IconHelpCircle, Clock: IconClock, Eye: IconEye,
  FileText: IconFileText, Globe: IconWorld, HeartHandshake: IconHeartHandshake, History: IconHistory, Inbox: IconInbox,
  Languages: IconLanguage, Layers: IconStack2, Lightbulb: IconBulb, Mail: IconMail, Megaphone: IconSpeakerphone, Menu: IconMenu2,
  MessageCircle: IconMessageCircle, MessageSquare: IconMessage, MessageSquareText: IconMessage2, MessagesSquare: IconMessages,
  MousePointerClick: IconClick, Network: IconNetwork, PenTool: IconPencil, Play: IconPlayerPlay, Radio: IconBroadcast,
  Route: IconRoute, Scale: IconScale, Send: IconSend, Sparkles: IconSparkles, Sun: IconSun, TrendingUp: IconTrendingUp,
  TriangleAlert: IconAlertTriangle, User: IconUser, UserCheck: IconUserCheck, Users: IconUsers, Workflow: IconSitemap,
  // brand icons
  BrandWhatsapp: IconBrandWhatsapp, BrandTelegram: IconBrandTelegram, BrandMessenger: IconBrandMessenger,
  // filled variants (channel marks in the story)
  BrandWhatsappFilled: IconBrandWhatsappFilled, BrandTelegramFilled: IconBrandTelegramFilled, BrandMessengerFilled: IconBrandMessengerFilled,
  MessageFilled: IconMessageFilled, MailFilled: IconMailFilled, GlobeFilled: IconWorldFilled,
  // video player
  PlayFilled: IconPlayerPlayFilled, PauseFilled: IconPlayerPauseFilled, Replay: IconRotateClockwise,
  Volume: IconVolume, VolumeOff: IconVolumeOff, Maximize: IconMaximize,
};

/* official brand colours for channel marks */
export const BRAND_COLORS = { whatsapp: "#25D366", telegram: "#26A5E4", messenger: "#0084FF" } as const;

/* accepts PascalCase ("MessageCircle") or kebab-case ("message-circle") Lucide names */
function resolveIcon(name: string): TablerIcon | null {
  if (ICONS[name]) return ICONS[name];
  const pascal = name.replace(/(^|-)([a-z0-9])/g, (_, __, c: string) => c.toUpperCase());
  return ICONS[pascal] ?? null;
}

export function Icon({ name, size = 16, color, strokeWidth = 2 }: { name: string; size?: number; color?: string; strokeWidth?: number }) {
  const glyph = resolveIcon(name);
  if (!glyph) return null;
  // icons come from a static lookup table, so createElement here never remounts
  return createElement(glyph, { size, color: color ?? "currentColor", stroke: strokeWidth, style: { flex: "none" }, "aria-hidden": true });
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
  whatsapp: { label: "WhatsApp", icon: "BrandWhatsapp", color: "#25D366", deep: "#25D366" },
  sms: { label: "SMS", icon: "message-square", color: "#1565c0", deep: "#1565c0" },
  email: { label: "Email", icon: "mail", color: "#1565c0", deep: "#1565c0" },
  telegram: { label: "Telegram", icon: "BrandTelegram", color: "#26A5E4", deep: "#26A5E4" },
  messenger: { label: "Messenger", icon: "BrandMessenger", color: "#0084FF", deep: "#0084FF" },
  smpp: { label: "SMPP", icon: "network", color: "#1565c0", deep: "#1565c0" },
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
