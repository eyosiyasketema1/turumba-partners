"use client";

/* Turumba Landing — the home page. Ported from Claude Design "Turumba Landing.dc.html". */

import WaitingListModal from "@/components/WaitingListModal";
import { Badge, Button, Icon } from "./ds";
import { Reveal } from "./Reveal";
import { TurumbaHero, TurumbaJourneyStrip, TurumbaWordCycle } from "./TurumbaHero";
import dynamic from "next/dynamic";

/* The scroll story is pure animation driven by trig maths; server and browser round the last decimal differently,
   which triggers a hydration mismatch. Render it in the browser only, with a same-height placeholder (6 chapters × 100vh + 40vh). */
const TurumbaStory = dynamic(() => import("./TurumbaStory").then((m) => m.TurumbaStory), {
  ssr: false,
  loading: () => <div style={{ height: "640vh", background: "#041426" }} />,
});

const WHY = [
  { h: "One connected journey", p: "Every channel writes to one contact record and one history, so nothing is lost between a first message and a lasting relationship." },
  { h: "Automation that stays operationally visible", p: "Flows and sequences adapt to the person, and your team can see every step they take." },
  { h: "AI that explains itself", p: "Claude scores matches, surfaces patterns, and recommends the next step. You stay in control — every recommendation comes with its reasons." },
  { h: "Made for collaboration", p: "Churches, ministries, mentors, and content creators each contribute their strengths around the same person." },
];

const CAPS = [
  { name: "Unified history", icon: "History", blurb: "All messages, all channels, one search." },
  { name: "Realtime inbox", icon: "Inbox", blurb: "Every conversation, one queue, live." },
  { name: "Scheduling", icon: "CalendarClock", blurb: "One-time or recurring, set and forget." },
  { name: "Notes & assign", icon: "UserCheck", blurb: "Internal coordination, invisible to users." },
  { name: "Flows", icon: "Workflow", blurb: "Journeys that adapt to the person." },
  { name: "Smart matching", icon: "HeartHandshake", blurb: "The right mentor, with the reasons." },
  { name: "AI recs", icon: "Sparkles", blurb: "Next-best content, explained." },
  { name: "Chat widgets", icon: "MessageSquare", blurb: "Your site, in the same inbox." },
];

const BIBLE = [
  { name: "Reading plans", icon: "BookOpen", blurb: "Daily passages, on the channel they already use." },
  { name: "Faith journeys & milestones", icon: "Route", blurb: "From first question to baptism, one timeline." },
  { name: "Verse of the day", icon: "Sun", blurb: "Scheduled broadcasts, personalized by language and stage." },
  { name: "Ask a mentor", icon: "MessagesSquare", blurb: "Questions about a passage routed to a real person." },
];

const VERSES = [
  { text: "How then shall they call on him in whom they have not believed? and how shall they believe in him of whom they have not heard? and how shall they hear without a preacher?", ref: "Romans 10:14" },
  { text: "Two are better than one; because they have a good reward for their labour. For if they fall, the one will lift up his fellow.", ref: "Ecclesiastes 4:9–10" },
  { text: "For as the body is one, and hath many members, and all the members of that one body, being many, are one body: so also is Christ.", ref: "1 Corinthians 12:12" },
];

const REASONS = [
  { icon: "Languages", text: "Amharic · shared language" },
  { icon: "TrendingUp", text: "Engagement rising 3 weeks" },
  { icon: "Clock", text: "Best time to reach · 6pm" },
  { icon: "Scale", text: "Dawit has capacity for 2" },
];

const eyebrow = (color: string) => ({ fontSize: 13, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color });
const h2 = { margin: 0, fontSize: 46, lineHeight: 1.08, fontWeight: 700, letterSpacing: "-0.02em", color: "#1565c0", textWrap: "pretty" as const };
const lead = { margin: 0, fontSize: 17, lineHeight: 1.6, color: "#363636", textWrap: "pretty" as const };

const openWaitingList = () => window.dispatchEvent(new Event("open-waiting-list"));

export default function HomeLanding() {
  return (
    <div className="turumba-home">
      {/* Hero */}
      <section data-screen-label="Hero" style={{ position: "relative", minHeight: "max(112vh, 860px)", color: "#ffffff", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <TurumbaHero />

        {/* space for the shared fixed navbar (72px) */}
        <div style={{ height: 72, flex: "none" }} />

        {/* hero copy — same treatment as the partners page hero: pill tag, 96px headline, 28px tagline, slide-up reveal */}
        <div data-rs="heropad" style={{ position: "relative", zIndex: 2, flex: 1, display: "flex", alignItems: "center", padding: "150px var(--th-gutter) 120px", pointerEvents: "none" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", pointerEvents: "auto", width: "fit-content", maxWidth: "100%" }}>
            <div className="th-mask" style={{ marginBottom: 52 }}>
              <div data-rs="pill" className="th-slide" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 9999, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", color: "#ffffff", fontSize: 20, lineHeight: "24px", fontWeight: 500, animationDelay: "0.2s" }}>
                <Icon name="Megaphone" size={20} />
                <TurumbaWordCycle />
              </div>
            </div>
            <div className="th-mask">
              <h1 data-rs="h1" className="th-slide" style={{ margin: 0, paddingBottom: 16, color: "#ffffff", fontSize: 96, lineHeight: "86px", fontWeight: 700, letterSpacing: "-0.02em", filter: "drop-shadow(0 10px 8px rgba(0,0,0,0.04)) drop-shadow(0 4px 3px rgba(0,0,0,0.1))", animationDelay: "0.3s" }}>
                One platform to message,<br className="th-br" /> automate, and engage —<br className="th-br" /> <span style={{ color: "#1c4bd1" }}>powered by AI.</span>
              </h1>
            </div>
            <div className="th-mask" style={{ marginTop: 32 }}>
              <p data-rs="tagline" className="th-slide" style={{ margin: 0, maxWidth: 896, fontSize: 28, lineHeight: "35px", fontWeight: 400, color: "rgba(255,255,255,0.8)", animationDelay: "0.4s" }}>
                Conversations move with the person, not the platform.<br className="th-br" /> One inbox, one contact record, one history —<br className="th-br" /> across every channel your team already uses.
              </p>
            </div>
            <div className="th-mask" style={{ padding: 2, margin: "46px -2px -2px" }}>
              <div data-rs="wrap" className="th-slide" style={{ display: "flex", alignItems: "center", gap: 14, animationDelay: "0.5s" }}>
                <Button variant="primary" size="lg" iconAfter="ArrowRight">Start now for free</Button>
                <a href="#vision" className="th-ghost-btn" style={{ display: "inline-flex", alignItems: "center", gap: 10, height: 44, padding: "0 24px", borderRadius: 9999, border: "1px solid rgba(255,255,255,0.4)", color: "#ffffff", fontSize: 15, fontWeight: 500 }}>
                  <Icon name="Play" size={16} />
                  Watch the vision
                </a>
              </div>
            </div>
          </div>
        </div>

        <div data-rs="pad" style={{ position: "relative", zIndex: 2, padding: "0 var(--th-gutter) 56px", pointerEvents: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(161,193,230,0.9)" }}>One person · one journey</span>
            <div style={{ flex: 1, height: 1, background: "rgba(161,193,230,0.2)" }} />
          </div>
          <TurumbaJourneyStrip />
        </div>
      </section>

      {/* The story, on scroll */}
      <section id="story" data-screen-label="The story" style={{ position: "relative", background: "#041426" }}>
        <TurumbaStory />
      </section>

      {/* Why */}
      <Reveal as="section" id="why" data-screen-label="Why Turumba" data-rs="pad pady grid2"
        style={{ padding: "120px var(--th-gutter)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, width: "100%", boxSizing: "border-box" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={eyebrow("#1565c0")}>Why Turumba</div>
          <h2 data-rs="h2" style={h2}>Built for teams that need both control and intelligence</h2>
          <p style={lead}>Messaging is the surface, but the work is keeping one person&apos;s story connected as it crosses platforms, teams, and organizations. Turumba keeps the context, the conversation, and the person together.</p>
        </div>
        <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column" }}>
          {WHY.map((w, i) => (
            <li key={w.h} className="th-why-item" style={{ display: "grid", gridTemplateColumns: "56px 1fr", gap: 20, padding: "26px 16px", margin: "0 -16px", borderRadius: 8, borderTop: "1px solid #e5e5e5", borderBottom: i === WHY.length - 1 ? "1px solid #e5e5e5" : undefined }}>
              <span style={{ fontSize: 20, fontWeight: 700, color: "#1565c0" }}>{i + 1}.</span>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em", color: "#1a1a1a" }}>{w.h}</div>
                <div style={{ marginTop: 6, fontSize: 15, lineHeight: 1.55, color: "#363636" }}>{w.p}</div>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>

      {/* Capabilities */}
      <section id="capabilities" data-screen-label="Capabilities" data-rs="pad pady" style={{ background: "#f7f7f7", borderTop: "1px solid #e5e5e5", borderBottom: "1px solid #e5e5e5", padding: "110px var(--th-gutter)" }}>
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 48 }}>
          <Reveal style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 720 }}>
            <div style={eyebrow("#1565c0")}>Capabilities</div>
            <h2 data-rs="h2" style={{ ...h2, fontSize: 42, lineHeight: 1.1 }}>Everything your team needs, nothing it doesn&apos;t</h2>
          </Reveal>
          <Reveal data-rs="grid4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {CAPS.map((c) => (
              <div key={c.name} className="th-cap-card" style={{ background: "#ffffff", border: "1px solid #e5e5e5", borderRadius: 8, padding: 24, display: "flex", flexDirection: "column", gap: 16, boxShadow: "0 1px 2px rgba(6,30,58,0.05)" }}>
                <div style={{ width: 44, height: 44, borderRadius: 8, background: "rgba(21,101,192,0.1)", border: "1px solid rgba(21,101,192,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#1565c0" }}>
                  <Icon name={c.icon} size={20} />
                </div>
                <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em", color: "#1a1a1a" }}>{c.name}</div>
                <div style={{ fontSize: 14, lineHeight: 1.5, color: "#363636" }}>{c.blurb}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* AI engine */}
      <Reveal as="section" id="ai" data-screen-label="AI engine" data-rs="pad pady grid2"
        style={{ padding: "120px var(--th-gutter)", width: "100%", boxSizing: "border-box", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={eyebrow("#1565c0")}>AI engine</div>
          <h2 data-rs="h2" style={h2}>Let AI turn messages into relationships</h2>
          <p style={lead}>Claude reads engagement, topic affinity, dropout risk, and the best time to reach someone — then recommends the right content, conversation, mentor, or community. People decide. AI explains.</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
            {["Smart matching", "AI recs", "Scoring", "Channel-adaptive content"].map((b) => <Badge key={b} variant="info">{b}</Badge>)}
          </div>
        </div>
        <div style={{ background: "#041426", borderRadius: 8, padding: 36, display: "flex", flexDirection: "column", gap: 18, color: "#ffffff", boxShadow: "0 24px 60px -28px rgba(6,30,58,0.55)" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#1565c0" }}>Recommendation · explained</div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.3 }}>Connect Selam with mentor Dawit</div>
          <div data-rs="grid3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {REASONS.map((r) => (
              <div key={r.text} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 6, background: "rgba(21,101,192,0.12)", border: "1px solid rgba(21,101,192,0.3)", fontSize: 13, fontWeight: 500, color: "#e5e5e5" }}>
                <Icon name={r.icon} size={16} />
                {r.text}
              </div>
            ))}
          </div>
          <div data-rs="stack" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 8, paddingTop: 18, borderTop: "1px solid rgba(161,193,230,0.2)", fontSize: 13, color: "rgba(161,193,230,0.9)" }}>
            <span>Confidence 0.91 · language match · workload balanced</span>
            <span style={{ color: "#1565c0", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 12 }}>Mentor coach decides</span>
          </div>
        </div>
      </Reveal>

      {/* Scripture & Bible engagement */}
      <section id="scripture" data-screen-label="Bible engagement" data-rs="pad pady" className="th-pattern th-pattern-soft" style={{ position: "relative", overflow: "hidden", background: "#041426", color: "#ffffff", padding: "120px var(--th-gutter)", borderTop: "1px solid rgba(161,193,230,0.12)" }}>
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 64 }}>
          <Reveal data-rs="grid2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <div style={eyebrow("#1565c0")}>Bible engagement</div>
              <h2 data-rs="h2" style={{ ...h2, color: "#ffffff" }}>Scripture that travels with the person</h2>
              <p style={{ ...lead, color: "rgba(255,255,255,0.72)" }}>Reading plans, daily passages, and milestone check-ins go out on the channel someone already uses. Mentors see where each person is in the Word — and every question about a passage reaches a real person.</p>
            </div>
            <div data-rs="grid4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {BIBLE.map((b) => (
                <div key={b.name} className="th-bible-card" style={{ background: "rgba(6,30,58,0.8)", border: "1px solid #0d3d73", borderRadius: 8, padding: 22, display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(21,101,192,0.14)", border: "1px solid rgba(21,101,192,0.35)", display: "flex", alignItems: "center", justifyContent: "center", color: "#1565c0" }}>
                    <Icon name={b.icon} size={18} />
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em" }}>{b.name}</div>
                  <div style={{ fontSize: 14, lineHeight: 1.5, color: "rgba(255,255,255,0.7)" }}>{b.blurb}</div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal data-rs="grid3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {VERSES.map((v) => (
              <figure key={v.ref} className="th-verse" style={{ margin: 0, padding: 32, borderRadius: 8, border: "1px solid rgba(21,101,192,0.35)", background: "linear-gradient(180deg, rgba(21,101,192,0.14), rgba(21,101,192,0.04))", display: "flex", flexDirection: "column", gap: 18, justifyContent: "space-between" }}>
                <blockquote style={{ margin: 0, fontSize: 21, lineHeight: 1.45, fontWeight: 500, letterSpacing: "-0.01em", color: "#ffffff", textWrap: "pretty" }}>“{v.text}”</blockquote>
                <figcaption style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#1565c0" }}>
                  <span style={{ width: 20, height: 1, background: "#1565c0" }} />{v.ref}
                </figcaption>
              </figure>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Vision video */}
      <section id="vision" data-screen-label="The vision" data-rs="pad pady" style={{ background: "#041426", padding: "120px var(--th-gutter)", color: "#ffffff", borderTop: "1px solid rgba(161,193,230,0.12)" }}>
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 40 }}>
          <Reveal data-rs="stack" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 40 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 760 }}>
              <div style={eyebrow("#1565c0")}>The vision</div>
              <h2 data-rs="h2" style={{ ...h2, color: "#ffffff" }}>From fragmented tools to connected infrastructure</h2>
              <p style={{ ...lead, color: "rgba(255,255,255,0.72)" }}>Three and a half minutes on why we are building Turumba, and who we are building it with.</p>
            </div>
            <div style={{ fontSize: 13, color: "rgba(161,193,230,0.9)", whiteSpace: "nowrap" }}>3:41 · sound on</div>
          </Reveal>
          <Reveal style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(161,193,230,0.2)", boxShadow: "0 24px 60px -28px rgba(6,30,58,0.9)", background: "#041426" }}>
            <iframe src="/vision/index.html" title="Turumba vision video" allow="autoplay; fullscreen" loading="lazy"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} />
          </Reveal>
        </div>
      </section>

      {/* CTA — a Blue Ocean → Indigo field with the trumpet sound-wave pattern (Brand Bible · Gradient 3, Pattern) */}
      <section data-screen-label="Call to action" data-rs="pad pady" className="th-pattern"
        style={{ position: "relative", overflow: "hidden", padding: "120px var(--th-gutter)", background: "linear-gradient(135deg, #1565c0 0%, #1c4bd1 55%, #371cd1 100%)", color: "#ffffff" }}>
        <Reveal style={{ position: "relative", zIndex: 1, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <blockquote style={{ margin: "0 0 12px", maxWidth: 760, fontSize: 18, lineHeight: 1.6, fontWeight: 500, color: "rgba(255,255,255,0.86)", textWrap: "pretty" }}>
            “Go ye therefore, and teach all nations… and, lo, I am with you alway, even unto the end of the world.”
            <span style={{ display: "block", marginTop: 10, fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#cfdff2" }}>Matthew 28:19–20</span>
          </blockquote>
          <div style={eyebrow("#cfdff2")}>Get started</div>
          <h2 data-rs="h2xl" style={{ margin: 0, fontSize: 52, lineHeight: 1.05, fontWeight: 700, letterSpacing: "-0.03em", color: "#ffffff", maxWidth: 900, textWrap: "pretty" }}>Help shape what comes next.</h2>
          <p style={{ ...lead, color: "rgba(255,255,255,0.86)", maxWidth: 620 }}>We are inviting builders, ministries, churches, innovators, technology partners, and Kingdom organizations to join us. Get early access, help shape the platform, explore collaboration.</p>
          <div data-rs="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 8 }}>
            <Button variant="inverse" size="lg" iconAfter="ArrowRight" onClick={openWaitingList}>Join the waiting list</Button>
            <Button variant="outline-light" size="lg" onClick={openWaitingList}>Request a demo</Button>
          </div>
        </Reveal>
      </section>


      <WaitingListModal />
    </div>
  );
}
