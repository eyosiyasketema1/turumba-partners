"use client";

/* "Be a partner" — the Turumba waiting-list page.
   Ported from the Claude Design file "Turumba Waiting List" (dc runtime → React).
   The markup below is generated from that design; its hover/focus states live in waiting-list.css. */

import { Component, Fragment, type ChangeEvent, type KeyboardEvent, type MouseEvent, type SyntheticEvent } from "react";
import {
  IconBook, IconBrain, IconBuildingChurch, IconBulb, IconCode, IconCoins, IconFlask, IconHeartHandshake, IconKey, IconMail,
  IconMessage, IconMessageCircle, IconSend, IconUserStar, IconUsers, IconWorld,
  type Icon as TablerIcon,
} from "@tabler/icons-react";
import "./waiting-list.css";
import AnimatedButton from "@/components/ui/animated-button";

const ICONS: Record<string, TablerIcon> = {
  key: IconKey, mail: IconMail, "flask-conical": IconFlask, "message-square": IconMessage,
  handshake: IconHeartHandshake, users: IconUsers, "message-circle": IconMessageCircle, send: IconSend,
  world: IconWorld, church: IconBuildingChurch, "user-star": IconUserStar, code: IconCode, brain: IconBrain, book: IconBook,
  coins: IconCoins, bulb: IconBulb,
};
function WIcon({ name, size }: { name: string; size: number }) {
  const G = ICONS[name];
  return G ? <G size={size} stroke={2} aria-hidden /> : null;
}

const SHARE_URL = "https://turumba.net/waiting-list";

/* bento tiles: "feature" spans 2×2, "wide" spans two columns */
const AUDIENCE: { label: string; describes: string; icon: string; size?: "feature" | "wide" }[] = [
  { label: "Ministries and mission organizations", describes: "Ministry / Mission Organization", icon: "world", size: "feature" },
  { label: "Churches and church networks", describes: "Church / Church Network", icon: "church" },
  { label: "Digital ministry leaders", describes: "Ministry / Mission Organization", icon: "user-star" },
  { label: "Technology partners and developers", describes: "Technology Partner", icon: "code", size: "wide" },
  { label: "AI and data experts", describes: "Developer / Builder", icon: "brain" },
  { label: "Content and discipleship organizations", describes: "Content / Discipleship Organization", icon: "book" },
  { label: "Mentors and follow-up teams", describes: "Ministry / Mission Organization", icon: "handshake", size: "wide" },
  { label: "Researchers and innovators", describes: "Researcher", icon: "flask-conical" },
  { label: "Funders and strategic partners", describes: "Funder / Strategic Partner", icon: "coins" },
  { label: "Organizations exploring new models of digital engagement", describes: "Other", icon: "bulb", size: "wide" },
];
const BENEFITS: { text: string; icon: string; size?: "feature" | "wide" }[] = [
  { text: "Get early access to Turumba as new capabilities become available", icon: "key", size: "feature" },
  { text: "Receive updates about our product and vision", icon: "mail" },
  { text: "Be invited to early testing and pilot opportunities", icon: "flask-conical" },
  { text: "Share feedback that can help shape the platform", icon: "message-square", size: "wide" },
  { text: "Explore collaboration opportunities", icon: "handshake", size: "wide" },
  { text: "Connect with others thinking about the future of digital ministry and Kingdom collaboration", icon: "users", size: "wide" },
];

const SLIDE_MS = 5500;
const HERO_SLIDES = [
  { src: "/partners/explore-god-signing.jpg", alt: "Turumba and Explore God shaking hands at the partnership signing", caption: "Partnership signing with Explore God", pos: "50% 45%" },
  { src: "/partners/explore-god-agreement.jpg", alt: "Turumba and Explore God holding the signed partnership agreement", caption: "Turumba & Explore God — Partnership Agreement", pos: "50% 45%" },
  { src: "/partners/bgea-signing.jpg", alt: "Turumba and the Billy Graham Evangelistic Association signing the partnership agreement", caption: "Partnership signing with the Billy Graham Evangelistic Association", pos: "50% 50%" },
  { src: "/partners/bgea-handshake.jpg", alt: "Turumba and the Billy Graham Evangelistic Association shaking hands", caption: "Turumba & the Billy Graham Evangelistic Association", pos: "50% 40%" },
];

type Props = { ctaLabel?: string; showFundingOption?: boolean; requireOrganization?: boolean };
type Field = "fullName" | "email" | "organization" | "country" | "role" | "describes" | "challenge" | "notes";
type State = Record<Field, string> & {
  involvement: string[]; error: string; submitted: boolean; submittedName: string; modalOpen: boolean; copied: boolean;
  slide: number; slideTick: number;
};
type Inputish = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const EMPTY: State = {
  fullName: "", email: "", organization: "", country: "", role: "", describes: "", challenge: "", notes: "",
  involvement: [], error: "", submitted: false, submittedName: "", modalOpen: false, copied: false,
  slide: 0, slideTick: 0,
};

export default class WaitingListPage extends Component<Props, State> {
  state: State = { ...EMPTY };
  private io?: IntersectionObserver;
  private moveIOs: IntersectionObserver[] = [];
  private copyT?: number;
  private slideT?: number;
  private onScroll?: () => void;
  private onKey?: (e: globalThis.KeyboardEvent) => void;

  set(key: Field) {
    return (e: ChangeEvent<Inputish>) => this.setState({ [key]: e.target.value, error: "" } as Pick<State, Field | "error">);
  }

  onInvolvement = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    this.setState((s) => ({ involvement: checked ? s.involvement.concat([value]) : s.involvement.filter((x) => x !== value) }));
  };

  onPickAudience = (e: SyntheticEvent) => {
    const k = e as KeyboardEvent;
    if (e.type === "keydown" && k.key !== "Enter" && k.key !== " ") return;
    if (e.type === "keydown") e.preventDefault();
    const card = (e.target as HTMLElement).closest("[data-describes]");
    if (!card) return;
    this.setState({ describes: card.getAttribute("data-describes") || "", error: "" });
    this.onOpenForm();
  };

  onOpenForm = () => {
    this.setState({ modalOpen: true });
    document.body.style.overflow = "hidden";
    window.setTimeout(() => {
      const el = document.querySelector<HTMLInputElement>('[role="dialog"] input[type="text"]');
      el?.focus({ preventScroll: true });
    }, 60);
    if (this.onScroll) window.setTimeout(this.onScroll, 0);
  };

  onCloseForm = () => {
    this.setState({ modalOpen: false });
    document.body.style.overflow = "";
    if (this.onScroll) window.setTimeout(this.onScroll, 0);
  };

  onCopyLink = () => {
    const done = () => {
      this.setState({ copied: true });
      window.clearTimeout(this.copyT);
      this.copyT = window.setTimeout(() => this.setState({ copied: false }), 2200);
    };
    if (navigator.clipboard?.writeText) { navigator.clipboard.writeText(SHARE_URL).then(done, done); return; }
    done();
  };

  // hero carousel: advances on its own; picking a slide restarts the timer
  private armSlides = () => {
    window.clearInterval(this.slideT);
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    this.slideT = window.setInterval(() => this.setState((s) => ({ slide: (s.slide + 1) % HERO_SLIDES.length, slideTick: s.slideTick + 1 })), SLIDE_MS);
  };
  onSlide = (i: number) => { this.setState((s) => ({ slide: i, slideTick: s.slideTick + 1 })); this.armSlides(); };

  onBackdrop = (e: MouseEvent) => { if (e.target === e.currentTarget) this.onCloseForm(); };

  componentDidMount() {
    this.armSlides();
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    // fade-up reveal
    if (!reduce && "IntersectionObserver" in window) {
      const els = Array.from(document.querySelectorAll<HTMLElement>(".wlp [data-reveal]"));
      els.forEach((el, i) => {
        const d = (i % 6) * 70;
        el.style.opacity = "0";
        el.style.transform = "translateY(18px)";
        el.style.transition = `opacity .6s ease-out ${d}ms, transform .6s ease-out ${d}ms`;
      });
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            const t = en.target as HTMLElement;
            t.style.opacity = "1"; t.style.transform = "none"; io.unobserve(t);
          }
        });
      }, { threshold: 0.15 });
      els.forEach((el) => io.observe(el));
      this.io = io;
    }

    // "Together, we can move" cards: scattered dots join into a line
    const paint = (cardEl: HTMLElement, connected: boolean) => {
      const dots = Array.from(cardEl.querySelectorAll<HTMLElement>("[data-dot]"));
      dots.forEach((d, i) => {
        if (connected) {
          d.style.left = 12 + i * (76 / (dots.length - 1)) + "%"; d.style.top = "50%"; d.style.background = "#1565c0";
        } else {
          d.style.left = d.getAttribute("data-bx") || ""; d.style.top = d.getAttribute("data-by") || ""; d.style.background = "#cbd5e1";
        }
      });
      const rail = cardEl.querySelector<HTMLElement>("[data-rail]");
      if (rail) { rail.style.transform = connected ? "scaleX(1)" : "scaleX(0)"; rail.style.opacity = connected ? "1" : "0"; }
      const from = cardEl.querySelector<HTMLElement>("[data-from]");
      if (from) { from.style.color = connected ? "#94a3b8" : "#0f172a"; from.style.fontWeight = connected ? "500" : "700"; from.style.opacity = connected ? ".85" : "1"; }
      const to = cardEl.querySelector<HTMLElement>("[data-to]");
      if (to) { to.style.color = connected ? "#1565c0" : "#94a3b8"; to.style.fontWeight = connected ? "700" : "500"; to.style.opacity = connected ? "1" : ".6"; }
    };
    Array.from(document.querySelectorAll<HTMLElement>(".wlp [data-move]")).forEach((el, i) => {
      let seen = false, held = false;
      const connect = () => { if (!held) paint(el, true); };
      const mo = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting && !seen) { seen = true; window.setTimeout(connect, i * 160); mo.unobserve(en.target); }
        });
      }, { threshold: 0.4 });
      mo.observe(el);
      this.moveIOs.push(mo);
      el.addEventListener("mouseenter", () => { if (seen) paint(el, false); });
      el.addEventListener("mouseleave", () => { if (seen && !held) paint(el, true); });
      const toggle = () => { held = !held; paint(el, !held); };
      el.addEventListener("click", toggle);
      el.addEventListener("keydown", (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); toggle(); } });
    });

    // sticky "Join" bar: shows once the hero is gone, hides near the panel / while the form is open
    this.onScroll = () => {
      const bar = document.querySelector<HTMLElement>(".wlp [data-sticky-cta]");
      const hero = document.querySelector(".wlp [data-hero]");
      const form = document.getElementById("waiting-list");
      if (!bar) return;
      const past = hero ? hero.getBoundingClientRect().bottom < 0 : window.scrollY > 600;
      const panelNear = form ? form.getBoundingClientRect().top < window.innerHeight * 0.8 : false;
      const show = past && !panelNear && !this.state.modalOpen && !this.state.submitted;
      bar.style.transform = show ? "translateY(0)" : "translateY(120%)";
    };
    window.addEventListener("scroll", this.onScroll, { passive: true });
    this.onScroll();
    this.onKey = (e) => { if (e.key === "Escape" && this.state.modalOpen) this.onCloseForm(); };
    window.addEventListener("keydown", this.onKey);
    // the site's other "Join" buttons (navbar, footer) open this form too
    window.addEventListener("open-waiting-list", this.onOpenForm);
  }

  componentWillUnmount() {
    this.io?.disconnect();
    this.moveIOs.forEach((m) => m.disconnect());
    if (this.onScroll) window.removeEventListener("scroll", this.onScroll);
    if (this.onKey) window.removeEventListener("keydown", this.onKey);
    window.removeEventListener("open-waiting-list", this.onOpenForm);
    window.clearTimeout(this.copyT);
    window.clearInterval(this.slideT);
    document.body.style.overflow = "";
  }

  onSubmit = () => {
    const s = this.state;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email.trim());
    let error = "";
    if (!s.fullName.trim()) error = "Please add your full name.";
    else if (!emailOk) error = "Please add a valid email address.";
    else if ((this.props.requireOrganization ?? true) && !s.organization.trim()) error = "Please tell us which organization or ministry you serve.";
    if (error) { this.setState({ error }); return; }
    // TODO: send the response to Turumba's backend / CRM — like the old partners form, this only confirms on screen for now
    this.setState({ submitted: true, submittedName: s.fullName.trim().split(" ")[0], error: "" });
    window.setTimeout(() => { const b = document.querySelector("[data-modal-scroll]"); if (b) b.scrollTop = 0; }, 0);
  };

  onReset = () => this.setState({ ...EMPTY, modalOpen: this.state.modalOpen, slide: this.state.slide, slideTick: this.state.slideTick });

  renderVals() {
    const msg = encodeURIComponent("I've joined the Turumba waiting list — Digital Infrastructure for Kingdom Collaboration. The future should not be built alone. " + SHARE_URL);
    const req: Field[] = ["fullName", "email", "organization", "country", "role", "describes"];
    const filled = req.filter((k) => String(this.state[k] || "").trim()).length;
    const base = ["Early Access", "Pilot Partner", "Product Feedback", "Technology Collaboration", "Kingdom Collaboration", "Strategic Partnership"];
    const involvementOptions = base
      .concat((this.props.showFundingOption ?? true) ? ["Investment / Funding Discussion"] : [])
      .concat(["Just keep me updated"])
      .map((label) => ({ label, checked: this.state.involvement.indexOf(label) !== -1 }));
    return {
      ...this.state,
      showForm: !this.state.submitted,
      progressPct: Math.round((filled / req.length) * 100) + "%",
      progressLabel: filled + " of 6 details added",
      involvementLabel: this.state.involvement.length ? this.state.involvement.length + " selected" : "",
      shareUrl: "turumba.net/waiting-list",
      copyLabel: this.state.copied ? "Copied" : "Copy link",
      onCopyLink: this.onCopyLink,
      waHref: "https://wa.me/?text=" + msg,
      tgHref: "https://t.me/share/url?url=" + encodeURIComponent(SHARE_URL) + "&text=" + msg,
      mailHref: "mailto:?subject=" + encodeURIComponent("Join the Turumba waiting list") + "&body=" + msg,
      submittedInitial: (this.state.submittedName || "?").charAt(0).toUpperCase(),
      summaryOrg: this.state.organization.trim() || "—",
      summaryDescribes: this.state.describes || "—",
      summaryInvolvement: this.state.involvement.length ? this.state.involvement.join(", ") : "Just keep me updated",
      onPickAudience: this.onPickAudience,
      onScrollToForm: this.onOpenForm,
      onOpenForm: this.onOpenForm,
      onCloseForm: this.onCloseForm,
      onBackdrop: this.onBackdrop,
      hasError: !!this.state.error,
      involvementOptions,
      ctaLabel: this.props.ctaLabel ?? "Join the Movement",
      onFullName: this.set("fullName"), onEmail: this.set("email"), onOrganization: this.set("organization"),
      onCountry: this.set("country"), onRole: this.set("role"), onDescribes: this.set("describes"),
      onChallenge: this.set("challenge"), onNotes: this.set("notes"),
      onInvolvement: this.onInvolvement, onSubmit: this.onSubmit, onReset: this.onReset, onSlide: this.onSlide,
    };
  }

  render() {
    const v = this.renderVals();
    return (
      <div className="wlp" style={{ fontFamily: "'DM Sans',system-ui,sans-serif", color: "#0f172a", background: "#fff", WebkitFontSmoothing: "antialiased" }}>

      <section style={{ maxWidth: "1440px", margin: "0 auto", padding: "calc(clamp(64px,8vw,120px) + 56px) 24px clamp(64px,8vw,120px)" }}>
      <div data-hero="" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "clamp(40px,5vw,80px)", alignItems: "center" }}>
      <div>
      <div style={{ fontSize: "15px", fontWeight: "700", textTransform: "uppercase", letterSpacing: ".18em", color: "#1565c0", marginBottom: "28px" }}>An Invitation</div>
      <h1 style={{ fontSize: "clamp(34px,6vw,58px)", fontWeight: "700", letterSpacing: "-.03em", lineHeight: "1.06", margin: "0", color: "#0f172a" }}>An Invitation to Build Together</h1>
      <p style={{ fontSize: "clamp(20px,2.4vw,26px)", lineHeight: "1.5", fontWeight: "500", color: "#0f172a", margin: "40px 0 0", maxWidth: "760px" }}>This vision is bigger than one team.</p>
      <p style={{ fontSize: "19px", lineHeight: "1.65", color: "#64748b", margin: "24px 0 0", maxWidth: "760px", textWrap: "pretty" }}>Building meaningful digital infrastructure for Kingdom collaboration will require more than technology. It will require people and organizations willing to imagine, experiment, learn, and build together.</p>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "22px", marginTop: "44px" }}>
      <AnimatedButton onClick={v.onScrollToForm}>{v.ctaLabel}</AnimatedButton>
      <span style={{ fontSize: "16px", color: "#94a3b8" }}>Early access · pilot partners · collaboration</span>
      </div>

      </div>
      <div style={{ position: "relative" }}>
      {/* hero photos: two slides that cross-fade on their own, with indicators */}
      <div style={{ position: "relative", borderRadius: "8px", overflow: "hidden", aspectRatio: "4/5", width: "100%", maxHeight: "max(340px, calc(100svh - 300px))", background: "#e2e8f0" }}>
      {HERO_SLIDES.map((sl, i) => (
        <img key={sl.src} src={sl.src} alt={sl.alt} aria-hidden={i !== v.slide} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: sl.pos, display: "block", opacity: i === v.slide ? 1 : 0, transform: i === v.slide ? "scale(1)" : "scale(1.04)", transition: "opacity .9s ease, transform 6s ease-out" }} />
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: "36%", background: "linear-gradient(to bottom, rgba(4,20,38,.6), rgba(4,20,38,0))", pointerEvents: "none" }} />
      {/* tap the right half for the next photo, the left half for the previous one */}
      <button type="button" aria-label="Previous photo" onClick={() => v.onSlide((v.slide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)} className="wlp-car-zone wlp-car-zone--prev" />
      <button type="button" aria-label="Next photo" onClick={() => v.onSlide((v.slide + 1) % HERO_SLIDES.length)} className="wlp-car-zone wlp-car-zone--next" />
      {/* caption for the photo on screen */}
      <div style={{ position: "absolute", top: "36px", left: "20px", right: "20px", zIndex: 2, pointerEvents: "none" }}>
      {HERO_SLIDES.map((sl, i) => (
        <span key={sl.src} aria-hidden={i !== v.slide} style={{ position: i === 0 ? "relative" : "absolute", top: 0, left: 0, display: "block", color: "#fff", fontSize: "13px", fontWeight: "500", lineHeight: 1.4, textShadow: "0 1px 3px rgba(0,0,0,.4)", opacity: i === v.slide ? 1 : 0, transition: "opacity .9s ease" }}>{sl.caption}</span>
      ))}
      </div>
      <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 2 }}>
      <div role="tablist" aria-label="Hero photos" style={{ display: "flex", gap: "8px", flex: "none" }}>
      {HERO_SLIDES.map((sl, i) => (
        <button key={sl.src} type="button" role="tab" aria-selected={i === v.slide} aria-label={`Show photo ${i + 1}`} onClick={() => v.onSlide(i)} style={{ position: "relative", width: "28px", height: "4px", padding: 0, border: "none", borderRadius: "9999px", background: "rgba(255,255,255,.4)", cursor: "pointer", overflow: "hidden" }}>
          <span key={i === v.slide ? `on-${v.slideTick}` : "off"} style={{ position: "absolute", inset: 0, background: "#fff", borderRadius: "9999px", transformOrigin: "left center", transform: i === v.slide ? undefined : "scaleX(0)", animation: i === v.slide ? `wlp-slide ${SLIDE_MS}ms linear both` : "none" }} />
        </button>
      ))}
      </div>
      </div>
      </div>
      <div style={{ position: "relative", margin: "-56px 0 0 -24px", background: "#fff", borderRadius: "8px", padding: "24px 28px", boxShadow: "0 10px 30px -18px rgba(15,23,42,.35)", display: "inline-flex", alignItems: "center", gap: "18px" }}>
      <img src="/brand/turumba-logo-blue.svg" alt="Turumba" style={{ height: "32px", width: "auto", display: "block" }} />
      <span style={{ width: "1px", height: "24px", background: "#e2e8f0" }}></span>
      <span style={{ fontSize: "15px", fontWeight: "600", lineHeight: "1.35", color: "#64748b", maxWidth: "210px" }}>Digital Infrastructure for Kingdom Collaboration</span>
      </div>
      </div>
      </div>

      <div style={{ marginTop: "96px" }}>
      <div style={{ fontSize: "15px", fontWeight: "700", textTransform: "uppercase", letterSpacing: ".18em", color: "#64748b", marginBottom: "24px" }}>We are looking to connect with</div>
      <div onClick={v.onPickAudience} onKeyDown={v.onPickAudience} className="wlp-bento wlp-bento--aud">
      {AUDIENCE.map((c, i) => (
        <div key={c.label} data-reveal="" data-describes={c.describes} title={`Start your response as: ${c.describes}`} role="button" tabIndex={0} className={`wlp-tile wlp-tile--light ${c.size ? "wlp-tile--" + c.size : ""}`}>
          <span className="wlp-tile-ico"><WIcon name={c.icon} size={i === 0 ? 26 : 20} /></span>
          <span className="wlp-tile-label">{c.label}</span>
        </div>
      ))}
      </div>
      </div>

      <p style={{ fontSize: "19px", lineHeight: "1.65", color: "#64748b", margin: "64px 0 0", maxWidth: "820px", textWrap: "pretty" }}>We do not believe the future of Kingdom collaboration should be designed by one organization in isolation.</p>
      <p style={{ fontSize: "19px", lineHeight: "1.65", color: "#64748b", margin: "20px 0 0", maxWidth: "820px", textWrap: "pretty" }}>It should be shaped alongside the people who understand the challenges, serve people every day, and are willing to explore what becomes possible when technology, intelligence, and human relationships work together.</p>
      <p style={{ fontSize: "clamp(21px,2.6vw,28px)", lineHeight: "1.4", fontWeight: "600", color: "#0f172a", margin: "48px 0 0", maxWidth: "820px", letterSpacing: "-.01em" }}>If this vision resonates with you, we invite you to join us.</p>
      </section>
      <section style={{ position: "relative", overflow: "hidden", background: "#041426", color: "#f8fafc" }}>
      <div style={{ position: "absolute", top: "-200px", right: "-140px", width: "720px", height: "720px", borderRadius: "9999px", background: "radial-gradient(circle,rgba(21,101,192,.3),transparent 62%)", filter: "blur(60px)" }}></div>
      <div style={{ position: "absolute", inset: "0", opacity: ".025", backgroundImage: "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)", backgroundSize: "64px 64px" }}></div>
      <div style={{ position: "relative", maxWidth: "1440px", margin: "0 auto", padding: "clamp(64px,8vw,120px) 24px" }}>
      <div style={{ fontSize: "15px", fontWeight: "700", textTransform: "uppercase", letterSpacing: ".18em", color: "#60a5fa", marginBottom: "28px" }}>Early access</div>
      <h2 style={{ fontSize: "clamp(32px,5.5vw,60px)", fontWeight: "700", letterSpacing: "-.025em", lineHeight: "1.1", margin: "0", maxWidth: "900px", color: "#f8fafc" }}>Join the Turumba Waiting List</h2>
      <p style={{ fontSize: "clamp(22px,3.4vw,32px)", lineHeight: "1.35", fontWeight: "600", color: "#a1c1e6", margin: "28px 0 0", letterSpacing: "-.01em" }}>Help Shape What Comes Next.</p>
      <p style={{ fontSize: "19px", lineHeight: "1.65", color: "#94a3b8", margin: "32px 0 0", maxWidth: "820px", textWrap: "pretty" }}>Turumba is being built step by step, and we are opening the door to a community of early partners, pioneers, and organizations who want to be part of the journey.</p>

      <div style={{ fontSize: "15px", fontWeight: "700", textTransform: "uppercase", letterSpacing: ".18em", color: "#94a3b8", margin: "72px 0 24px" }}>By joining the waiting list, you can</div>
      <div className="wlp-bento wlp-bento--ben">
      {BENEFITS.map((c, i) => (
        <div key={c.text} data-reveal="" className={`wlp-tile wlp-tile--dark ${c.size ? "wlp-tile--" + c.size : ""}`}>
          <span className="wlp-tile-ico"><WIcon name={c.icon} size={i === 0 ? 26 : 22} /></span>
          <span className="wlp-tile-label">{c.text}</span>
        </div>
      ))}
      </div>

      <p style={{ fontSize: "19px", lineHeight: "1.65", color: "#94a3b8", margin: "64px 0 0", maxWidth: "860px", textWrap: "pretty" }}>We are especially interested in hearing from organizations facing real challenges in communication, follow-up, discipleship, engagement, content delivery, and collaboration.</p>
      <p style={{ fontSize: "19px", lineHeight: "1.65", color: "#94a3b8", margin: "20px 0 0", maxWidth: "860px", textWrap: "pretty" }}>You do not need to have all the answers. Neither do we.</p>
      <p style={{ fontSize: "19px", lineHeight: "1.65", color: "#94a3b8", margin: "20px 0 0", maxWidth: "860px", textWrap: "pretty" }}>But if you see the need for better digital infrastructure and believe we can build something more connected, intelligent, collaborative, and human-centered together, we would love to have you with us.</p>
      <p style={{ fontSize: "clamp(28px,4.4vw,44px)", lineHeight: "1.2", fontWeight: "700", color: "#f8fafc", margin: "56px 0 0", maxWidth: "820px", letterSpacing: "-.02em" }}>The future should not be built alone.</p>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "24px", marginTop: "40px" }}>
      <AnimatedButton tone="primary" onClick={v.onScrollToForm}>{v.ctaLabel}</AnimatedButton>
      <span style={{ fontSize: "16px", color: "#94a3b8" }}>Takes about a minute</span>
      </div>
      </div>
      </section>

      <section style={{ maxWidth: "1440px", margin: "0 auto", padding: "clamp(64px,8vw,120px) 24px 20px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: "24px", marginBottom: "40px" }}>
      <h2 style={{ fontSize: "clamp(30px,5vw,52px)", fontWeight: "700", letterSpacing: "-.025em", lineHeight: "1.1", margin: "0", color: "#0f172a" }}>Together, we can move</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "20px" }}>
      <div data-move="" role="button" tabIndex={0} className="wlp-19" style={{ border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden", background: "#fff", cursor: "pointer", transition: "border-color .2s ease-out,box-shadow .2s ease-out,transform .2s ease-out" }}>
      <div style={{ position: "relative", height: "150px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", overflow: "hidden" }}>
      <div data-rail="" style={{ position: "absolute", left: "12%", right: "12%", top: "50%", height: "2px", marginTop: "-1px", background: "#1565c0", opacity: "0", transform: "scaleX(0)", transformOrigin: "left center", transition: "transform .7s cubic-bezier(.4,0,.2,1),opacity .4s ease-out" }}></div>
      <div data-dot="" data-bx="14%" data-by="22%" style={{ position: "absolute", left: "14%", top: "22%", width: "14px", height: "14px", margin: "-7px 0 0 -7px", borderRadius: "9999px", background: "#cbd5e1", transition: "left .7s cubic-bezier(.4,0,.2,1),top .7s cubic-bezier(.4,0,.2,1),background-color .5s ease-out" }}></div>
      <div data-dot="" data-bx="38%" data-by="68%" style={{ position: "absolute", left: "38%", top: "68%", width: "14px", height: "14px", margin: "-7px 0 0 -7px", borderRadius: "9999px", background: "#cbd5e1", transition: "left .7s cubic-bezier(.4,0,.2,1),top .7s cubic-bezier(.4,0,.2,1),background-color .5s ease-out" }}></div>
      <div data-dot="" data-bx="64%" data-by="16%" style={{ position: "absolute", left: "64%", top: "16%", width: "14px", height: "14px", margin: "-7px 0 0 -7px", borderRadius: "9999px", background: "#cbd5e1", transition: "left .7s cubic-bezier(.4,0,.2,1),top .7s cubic-bezier(.4,0,.2,1),background-color .5s ease-out" }}></div>
      <div data-dot="" data-bx="82%" data-by="58%" style={{ position: "absolute", left: "82%", top: "58%", width: "14px", height: "14px", margin: "-7px 0 0 -7px", borderRadius: "9999px", background: "#cbd5e1", transition: "left .7s cubic-bezier(.4,0,.2,1),top .7s cubic-bezier(.4,0,.2,1),background-color .5s ease-out" }}></div>
      <div data-dot="" data-bx="26%" data-by="48%" style={{ position: "absolute", left: "26%", top: "48%", width: "14px", height: "14px", margin: "-7px 0 0 -7px", borderRadius: "9999px", background: "#cbd5e1", transition: "left .7s cubic-bezier(.4,0,.2,1),top .7s cubic-bezier(.4,0,.2,1),background-color .5s ease-out" }}></div>
      <div data-dot="" data-bx="52%" data-by="36%" style={{ position: "absolute", left: "52%", top: "36%", width: "14px", height: "14px", margin: "-7px 0 0 -7px", borderRadius: "9999px", background: "#cbd5e1", transition: "left .7s cubic-bezier(.4,0,.2,1),top .7s cubic-bezier(.4,0,.2,1),background-color .5s ease-out" }}></div>
      </div>
      <div style={{ padding: "26px 28px 30px" }}>
      <div data-from="" style={{ fontSize: "16px", fontWeight: "500", color: "#94a3b8", lineHeight: "1.45", transition: "color .35s ease-out,opacity .35s ease-out" }}>From fragmented tools</div>
      <div data-to="" style={{ fontSize: "23px", fontWeight: "700", letterSpacing: "-.015em", lineHeight: "1.3", color: "#0f172a", marginTop: "10px", transition: "color .35s ease-out,opacity .35s ease-out" }}>to connected infrastructure.</div>
      </div>
      </div>
      <div data-move="" role="button" tabIndex={0} className="wlp-20" style={{ border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden", background: "#fff", cursor: "pointer", transition: "border-color .2s ease-out,box-shadow .2s ease-out,transform .2s ease-out" }}>
      <div style={{ position: "relative", height: "150px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", overflow: "hidden" }}>
      <div data-rail="" style={{ position: "absolute", left: "12%", right: "12%", top: "50%", height: "2px", marginTop: "-1px", background: "#1565c0", opacity: "0", transform: "scaleX(0)", transformOrigin: "left center", transition: "transform .7s cubic-bezier(.4,0,.2,1),opacity .4s ease-out" }}></div>
      <div data-dot="" data-bx="16%" data-by="10%" style={{ position: "absolute", left: "16%", top: "10%", width: "14px", height: "14px", margin: "-7px 0 0 -7px", borderRadius: "9999px", background: "#cbd5e1", transition: "left .7s cubic-bezier(.4,0,.2,1),top .7s cubic-bezier(.4,0,.2,1),background-color .5s ease-out" }}></div>
      <div data-dot="" data-bx="16%" data-by="26%" style={{ position: "absolute", left: "16%", top: "26%", width: "14px", height: "14px", margin: "-7px 0 0 -7px", borderRadius: "9999px", background: "#cbd5e1", transition: "left .7s cubic-bezier(.4,0,.2,1),top .7s cubic-bezier(.4,0,.2,1),background-color .5s ease-out" }}></div>
      <div data-dot="" data-bx="16%" data-by="42%" style={{ position: "absolute", left: "16%", top: "42%", width: "14px", height: "14px", margin: "-7px 0 0 -7px", borderRadius: "9999px", background: "#cbd5e1", transition: "left .7s cubic-bezier(.4,0,.2,1),top .7s cubic-bezier(.4,0,.2,1),background-color .5s ease-out" }}></div>
      <div data-dot="" data-bx="16%" data-by="58%" style={{ position: "absolute", left: "16%", top: "58%", width: "14px", height: "14px", margin: "-7px 0 0 -7px", borderRadius: "9999px", background: "#cbd5e1", transition: "left .7s cubic-bezier(.4,0,.2,1),top .7s cubic-bezier(.4,0,.2,1),background-color .5s ease-out" }}></div>
      <div data-dot="" data-bx="16%" data-by="74%" style={{ position: "absolute", left: "16%", top: "74%", width: "14px", height: "14px", margin: "-7px 0 0 -7px", borderRadius: "9999px", background: "#cbd5e1", transition: "left .7s cubic-bezier(.4,0,.2,1),top .7s cubic-bezier(.4,0,.2,1),background-color .5s ease-out" }}></div>
      <div data-dot="" data-bx="16%" data-by="90%" style={{ position: "absolute", left: "16%", top: "90%", width: "14px", height: "14px", margin: "-7px 0 0 -7px", borderRadius: "9999px", background: "#cbd5e1", transition: "left .7s cubic-bezier(.4,0,.2,1),top .7s cubic-bezier(.4,0,.2,1),background-color .5s ease-out" }}></div>
      </div>
      <div style={{ padding: "26px 28px 30px" }}>
      <div data-from="" style={{ fontSize: "16px", fontWeight: "500", color: "#94a3b8", lineHeight: "1.45", transition: "color .35s ease-out,opacity .35s ease-out" }}>From messages</div>
      <div data-to="" style={{ fontSize: "23px", fontWeight: "700", letterSpacing: "-.015em", lineHeight: "1.3", color: "#0f172a", marginTop: "10px", transition: "color .35s ease-out,opacity .35s ease-out" }}>to meaningful relationships.</div>
      </div>
      </div>
      <div data-move="" role="button" tabIndex={0} className="wlp-21" style={{ border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden", background: "#fff", cursor: "pointer", transition: "border-color .2s ease-out,box-shadow .2s ease-out,transform .2s ease-out" }}>
      <div style={{ position: "relative", height: "150px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", overflow: "hidden" }}>
      <div data-rail="" style={{ position: "absolute", left: "12%", right: "12%", top: "50%", height: "2px", marginTop: "-1px", background: "#1565c0", opacity: "0", transform: "scaleX(0)", transformOrigin: "left center", transition: "transform .7s cubic-bezier(.4,0,.2,1),opacity .4s ease-out" }}></div>
      <div data-dot="" data-bx="10%" data-by="24%" style={{ position: "absolute", left: "10%", top: "24%", width: "14px", height: "14px", margin: "-7px 0 0 -7px", borderRadius: "9999px", background: "#cbd5e1", transition: "left .7s cubic-bezier(.4,0,.2,1),top .7s cubic-bezier(.4,0,.2,1),background-color .5s ease-out" }}></div>
      <div data-dot="" data-bx="19%" data-by="24%" style={{ position: "absolute", left: "19%", top: "24%", width: "14px", height: "14px", margin: "-7px 0 0 -7px", borderRadius: "9999px", background: "#cbd5e1", transition: "left .7s cubic-bezier(.4,0,.2,1),top .7s cubic-bezier(.4,0,.2,1),background-color .5s ease-out" }}></div>
      <div data-dot="" data-bx="46%" data-by="72%" style={{ position: "absolute", left: "46%", top: "72%", width: "14px", height: "14px", margin: "-7px 0 0 -7px", borderRadius: "9999px", background: "#cbd5e1", transition: "left .7s cubic-bezier(.4,0,.2,1),top .7s cubic-bezier(.4,0,.2,1),background-color .5s ease-out" }}></div>
      <div data-dot="" data-bx="55%" data-by="72%" style={{ position: "absolute", left: "55%", top: "72%", width: "14px", height: "14px", margin: "-7px 0 0 -7px", borderRadius: "9999px", background: "#cbd5e1", transition: "left .7s cubic-bezier(.4,0,.2,1),top .7s cubic-bezier(.4,0,.2,1),background-color .5s ease-out" }}></div>
      <div data-dot="" data-bx="81%" data-by="28%" style={{ position: "absolute", left: "81%", top: "28%", width: "14px", height: "14px", margin: "-7px 0 0 -7px", borderRadius: "9999px", background: "#cbd5e1", transition: "left .7s cubic-bezier(.4,0,.2,1),top .7s cubic-bezier(.4,0,.2,1),background-color .5s ease-out" }}></div>
      <div data-dot="" data-bx="90%" data-by="28%" style={{ position: "absolute", left: "90%", top: "28%", width: "14px", height: "14px", margin: "-7px 0 0 -7px", borderRadius: "9999px", background: "#cbd5e1", transition: "left .7s cubic-bezier(.4,0,.2,1),top .7s cubic-bezier(.4,0,.2,1),background-color .5s ease-out" }}></div>
      </div>
      <div style={{ padding: "26px 28px 30px" }}>
      <div data-from="" style={{ fontSize: "16px", fontWeight: "500", color: "#94a3b8", lineHeight: "1.45", transition: "color .35s ease-out,opacity .35s ease-out" }}>From isolated efforts</div>
      <div data-to="" style={{ fontSize: "23px", fontWeight: "700", letterSpacing: "-.015em", lineHeight: "1.3", color: "#0f172a", marginTop: "10px", transition: "color .35s ease-out,opacity .35s ease-out" }}>to intentional collaboration.</div>
      </div>
      </div>
      <div data-move="" role="button" tabIndex={0} className="wlp-22" style={{ border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden", background: "#fff", cursor: "pointer", transition: "border-color .2s ease-out,box-shadow .2s ease-out,transform .2s ease-out" }}>
      <div style={{ position: "relative", height: "150px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", overflow: "hidden" }}>
      <div data-rail="" style={{ position: "absolute", left: "12%", right: "12%", top: "50%", height: "2px", marginTop: "-1px", background: "#1565c0", opacity: "0", transform: "scaleX(0)", transformOrigin: "left center", transition: "transform .7s cubic-bezier(.4,0,.2,1),opacity .4s ease-out" }}></div>
      <div data-dot="" data-bx="8%" data-by="12%" style={{ position: "absolute", left: "8%", top: "12%", width: "14px", height: "14px", margin: "-7px 0 0 -7px", borderRadius: "9999px", background: "#cbd5e1", transition: "left .7s cubic-bezier(.4,0,.2,1),top .7s cubic-bezier(.4,0,.2,1),background-color .5s ease-out" }}></div>
      <div data-dot="" data-bx="92%" data-by="12%" style={{ position: "absolute", left: "92%", top: "12%", width: "14px", height: "14px", margin: "-7px 0 0 -7px", borderRadius: "9999px", background: "#cbd5e1", transition: "left .7s cubic-bezier(.4,0,.2,1),top .7s cubic-bezier(.4,0,.2,1),background-color .5s ease-out" }}></div>
      <div data-dot="" data-bx="8%" data-by="88%" style={{ position: "absolute", left: "8%", top: "88%", width: "14px", height: "14px", margin: "-7px 0 0 -7px", borderRadius: "9999px", background: "#cbd5e1", transition: "left .7s cubic-bezier(.4,0,.2,1),top .7s cubic-bezier(.4,0,.2,1),background-color .5s ease-out" }}></div>
      <div data-dot="" data-bx="92%" data-by="88%" style={{ position: "absolute", left: "92%", top: "88%", width: "14px", height: "14px", margin: "-7px 0 0 -7px", borderRadius: "9999px", background: "#cbd5e1", transition: "left .7s cubic-bezier(.4,0,.2,1),top .7s cubic-bezier(.4,0,.2,1),background-color .5s ease-out" }}></div>
      <div data-dot="" data-bx="50%" data-by="5%" style={{ position: "absolute", left: "50%", top: "5%", width: "14px", height: "14px", margin: "-7px 0 0 -7px", borderRadius: "9999px", background: "#cbd5e1", transition: "left .7s cubic-bezier(.4,0,.2,1),top .7s cubic-bezier(.4,0,.2,1),background-color .5s ease-out" }}></div>
      <div data-dot="" data-bx="50%" data-by="95%" style={{ position: "absolute", left: "50%", top: "95%", width: "14px", height: "14px", margin: "-7px 0 0 -7px", borderRadius: "9999px", background: "#cbd5e1", transition: "left .7s cubic-bezier(.4,0,.2,1),top .7s cubic-bezier(.4,0,.2,1),background-color .5s ease-out" }}></div>
      </div>
      <div style={{ padding: "26px 28px 30px" }}>
      <div data-from="" style={{ fontSize: "16px", fontWeight: "500", color: "#94a3b8", lineHeight: "1.45", transition: "color .35s ease-out,opacity .35s ease-out" }}>From technology that simply reaches people</div>
      <div data-to="" style={{ fontSize: "23px", fontWeight: "700", letterSpacing: "-.015em", lineHeight: "1.3", color: "#0f172a", marginTop: "10px", transition: "color .35s ease-out,opacity .35s ease-out" }}>to technology that helps us serve people better.</div>
      </div>
      </div>
      </div>
      </section>

      {/* Built for Partnership: a word from Turumba's CEO */}
      <section aria-labelledby="built-for-partnership">
      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "clamp(40px,6vw,72px) 24px 0" }}>
      <div className="wlp-bfp" data-reveal="">
        <div className="wlp-bfp-text">
          <div className="wlp-bfp-eyebrow">Turumba</div>
          <h2 id="built-for-partnership" className="wlp-bfp-title">Built for Partnership</h2>
          <div className="wlp-bfp-body">
            <p>Turumba was never designed to be just another platform. It was built on a simple belief: the best solutions are created together.</p>
            <p>We know that every organization understands its audience, mission, and context better than anyone else. While we bring the technology, engineering, and product expertise, you bring the vision, strategy, and insights that make meaningful engagement possible.</p>
            <p>That belief shapes every decision we make from our architecture and APIs to our user experience and product roadmap. We build Turumba to be flexible, collaborative, and adaptable because we believe technology should empower your strategy, not dictate it.</p>
            <p>We don&apos;t claim to have all the answers. We listen, we learn, and we build alongside our partners. Every feature we create is an opportunity to help organizations communicate more effectively, connect more deeply, and create lasting impact.</p>
            <p className="wlp-bfp-close">Turumba is more than software. It is a platform built for partnership.</p>
          </div>
        </div>
        <div className="wlp-bfp-side">
          <img className="wlp-bfp-photo" src="/partners/samson-usmael.jpg" alt="Samson Usmael, Chief Executive Officer of Turumba" loading="lazy" />
          <div className="wlp-bfp-sign">
            <span className="wlp-bfp-bar" />
            <span>
              <span className="wlp-bfp-name">Samson Usmael</span>
              <span className="wlp-bfp-role">Chief Executive Officer</span>
            </span>
          </div>
        </div>
      </div>
      </div>
      </section>

      <section id="waiting-list" style={{ maxWidth: "1440px", margin: "0 auto", padding: "clamp(56px,7vw,110px) 24px clamp(64px,8vw,120px)" }}>
      <div className="wlp-cta-panel" style={{ position: "relative", overflow: "hidden", borderRadius: "12px", padding: "clamp(40px,6vw,76px) clamp(24px,5vw,72px)", color: "#fff" }}>
      <div style={{ position: "relative" }}>
      <div style={{ fontSize: "15px", fontWeight: "700", textTransform: "uppercase", letterSpacing: ".18em", color: "rgba(255,255,255,.8)", marginBottom: "26px" }}>Early access</div>
      <h2 style={{ fontSize: "clamp(30px,5vw,52px)", fontWeight: "700", letterSpacing: "-.025em", lineHeight: "1.1", margin: "0", maxWidth: "820px", color: "#fff" }}>Join the Turumba Waiting List</h2>
      <p style={{ fontSize: "19px", lineHeight: "1.65", color: "rgba(255,255,255,.85)", margin: "24px 0 0", maxWidth: "760px", textWrap: "pretty" }}>Be among the early organizations, leaders, and builders helping shape the future of Digital Infrastructure for Kingdom Collaboration.</p>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "26px", marginTop: "44px" }}>
      <AnimatedButton tone="inverse" onClick={v.onOpenForm}>{v.ctaLabel}</AnimatedButton>
      <span style={{ fontSize: "16px", lineHeight: "1.5", color: "rgba(255,255,255,.8)", maxWidth: "380px" }}>Tell us who you are, what you&apos;re working on, and how you would like to be involved.</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "28px", fontSize: "15px", color: "rgba(255,255,255,.7)" }}><span style={{ width: "6px", height: "6px", borderRadius: "9999px", background: "rgba(255,255,255,.6)" }}></span>Nine short questions · about a minute</div>
      </div>
      </div>
      </section>

      


      {v.modalOpen && (<>
      <div onClick={v.onBackdrop} style={{ position: "fixed", inset: "0", zIndex: "100", background: "rgba(0,0,0,.6)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(12px,5vh,56px) clamp(10px,3vw,24px)", overflow: "hidden", overscrollBehavior: "contain", animation: "om-fade .2s ease-out" }}>
      <div role="dialog" aria-modal="true" aria-label="Join the Turumba Waiting List" style={{ position: "relative", width: "100%", maxWidth: "640px", background: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 40px 90px -40px rgba(15,23,42,.65)", borderRadius: "12px", animation: "om-pop .22s ease-out", display: "flex", flexDirection: "column", maxHeight: "calc(100svh - 2 * clamp(12px,5vh,56px))", overflow: "hidden" }}>
      <button type="button" onClick={v.onCloseForm} aria-label="Close" className="wlp-25" style={{ position: "absolute", zIndex: 2, top: "14px", right: "14px", width: "34px", height: "34px", display: "grid", placeItems: "center", border: "1px solid #e2e8f0", background: "#fff", borderRadius: "9999px", color: "#64748b", fontSize: "18px", lineHeight: "1", cursor: "pointer", transition: "background .18s ease-out,color .18s ease-out" }}>×</button>
      <div data-modal-scroll="" style={{ flex: "1 1 auto", minHeight: 0, overflowY: "auto", overscrollBehavior: "contain", padding: "clamp(22px,3.5vw,32px) clamp(18px,3.5vw,32px) clamp(24px,3.5vw,32px)" }}>
      <div style={{ fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: ".18em", color: "#1565c0", marginBottom: "10px" }}>Early access</div>
      <h2 style={{ fontSize: "clamp(22px,3vw,28px)", fontWeight: "700", letterSpacing: "-.025em", lineHeight: "1.12", margin: "0", maxWidth: "640px", color: "#0f172a" }}>Join the Turumba Waiting List</h2>
      <p style={{ fontSize: "15px", lineHeight: "1.6", color: "#64748b", margin: "9px 0 0", maxWidth: "620px", textWrap: "pretty" }}>Be among the early organizations, leaders, and builders helping shape the future of Digital Infrastructure for Kingdom Collaboration.</p>
      {v.submitted && (<>
      <div style={{ marginTop: "22px", border: "1px solid rgba(16,185,129,.3)", background: "rgba(16,185,129,.06)", borderRadius: "8px", padding: "20px 20px 24px" }}>
      <div style={{ position: "relative", height: "140px", border: "1px solid rgba(16,185,129,.22)", borderRadius: "8px", background: "#fff", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: "0", background: "linear-gradient(120deg,rgba(16,185,129,.07),transparent 55%,rgba(21,101,192,.07))", animation: "om-sheen 2.6s .4s both" }}></div>
      <div style={{ position: "absolute", left: "8%", right: "8%", top: "50%", height: "2px", marginTop: "-1px", background: "linear-gradient(to right,#6ee7b7,#1565c0)", transformOrigin: "left center", animation: "om-rail .9s .15s both" }}></div>
      <div style={{ position: "absolute", left: "8.00%", top: "50%", width: "12px", height: "12px", margin: "-6px 0 0 -6px", borderRadius: "9999px", background: "#a1c1e6", animation: "om-dotin .5s 0.34s both" }}></div>
      <div style={{ position: "absolute", left: "17.33%", top: "50%", width: "12px", height: "12px", margin: "-6px 0 0 -6px", borderRadius: "9999px", background: "#a1c1e6", animation: "om-dotin .5s 0.41s both" }}></div>
      <div style={{ position: "absolute", left: "26.67%", top: "50%", width: "12px", height: "12px", margin: "-6px 0 0 -6px", borderRadius: "9999px", background: "#a1c1e6", animation: "om-dotin .5s 0.48s both" }}></div>
      <div style={{ position: "absolute", left: "36.00%", top: "50%", width: "12px", height: "12px", margin: "-6px 0 0 -6px", borderRadius: "9999px", background: "#a1c1e6", animation: "om-dotin .5s 0.55s both" }}></div>
      <div style={{ position: "absolute", left: "45.33%", top: "50%", width: "12px", height: "12px", margin: "-6px 0 0 -6px", borderRadius: "9999px", background: "#a1c1e6", animation: "om-dotin .5s 0.62s both" }}></div>
      <div style={{ position: "absolute", left: "64.00%", top: "50%", width: "12px", height: "12px", margin: "-6px 0 0 -6px", borderRadius: "9999px", background: "#a1c1e6", animation: "om-dotin .5s 0.76s both" }}></div>
      <div style={{ position: "absolute", left: "73.33%", top: "50%", width: "12px", height: "12px", margin: "-6px 0 0 -6px", borderRadius: "9999px", background: "#a1c1e6", animation: "om-dotin .5s 0.83s both" }}></div>
      <div style={{ position: "absolute", left: "82.67%", top: "50%", width: "12px", height: "12px", margin: "-6px 0 0 -6px", borderRadius: "9999px", background: "#a1c1e6", animation: "om-dotin .5s 0.90s both" }}></div>
      <div style={{ position: "absolute", left: "92.00%", top: "50%", width: "12px", height: "12px", margin: "-6px 0 0 -6px", borderRadius: "9999px", background: "#a1c1e6", animation: "om-dotin .5s 0.97s both" }}></div>
      <div style={{ position: "absolute", left: "54.67%", top: "50%", width: "38px", height: "38px", margin: "-19px 0 0 -19px", borderRadius: "9999px", border: "2px solid #10b981", animation: "om-ring 2.8s 1.9s infinite" }}></div>
      <div style={{ position: "absolute", left: "54.67%", top: "50%", width: "38px", height: "38px", margin: "-19px 0 0 -19px", borderRadius: "9999px", background: "#1565c0", color: "#fff", display: "grid", placeItems: "center", fontSize: "14px", fontWeight: "700", letterSpacing: ".02em", boxShadow: "0 10px 26px -10px rgba(21,101,192,.75)", animation: "om-land .9s .95s both" }}>{v.submittedInitial}</div>
      <div style={{ position: "absolute", left: "54.67%", top: "50%", width: "140px", margin: "34px 0 0 -70px", textAlign: "center", fontSize: "14px", fontWeight: "700", textTransform: "uppercase", letterSpacing: ".16em", color: "#059669", animation: "om-rise .6s 1.7s both" }}>That&apos;s you</div>
      </div>
      <div style={{ fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: ".18em", color: "#059669", margin: "20px 0 0", animation: "om-rise .6s 1.9s both" }}>You&apos;ve joined the movement</div>
      <div style={{ fontSize: "clamp(26px,3.4vw,34px)", fontWeight: "700", letterSpacing: "-.015em", lineHeight: "1.2", color: "#0f172a", marginTop: "14px", animation: "om-rise .6s 2.05s both" }}>Thank you, {v.submittedName}.</div>
      <p style={{ fontSize: "16px", lineHeight: "1.65", color: "#475569", margin: "9px 0 0", maxWidth: "640px", animation: "om-rise .6s 2.2s both" }}>We have your details and will be in touch as new capabilities become available.</p>
      <div style={{ animation: "om-rise .6s 2.35s both" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "14px", marginTop: "18px" }}>
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "14px 16px" }}><div style={{ fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: ".16em", color: "#94a3b8" }}>Organization</div><div style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", marginTop: "8px" }}>{v.summaryOrg}</div></div>
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "14px 16px" }}><div style={{ fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: ".16em", color: "#94a3b8" }}>You are</div><div style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", marginTop: "8px" }}>{v.summaryDescribes}</div></div>
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "14px 16px" }}><div style={{ fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: ".16em", color: "#94a3b8" }}>Involvement</div><div style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", marginTop: "8px" }}>{v.summaryInvolvement}</div></div>
      </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", marginTop: "18px", animation: "om-rise .6s 2.5s both" }}>
      <AnimatedButton height={40} padX={20} onClick={v.onCloseForm}>Back to the vision</AnimatedButton>
      <button type="button" onClick={v.onReset} className="wlp-27" style={{ border: "1px solid rgba(0,0,0,.2)", background: "transparent", color: "#1a1a1a", borderRadius: "9999px", height: "40px", padding: "0 20px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "500", whiteSpace: "nowrap", cursor: "pointer", transition: "background .15s" }}>Add another response</button>
      </div>
      <div style={{ marginTop: "18px", paddingTop: "34px", borderTop: "1px solid rgba(16,185,129,.25)", animation: "om-rise .6s 2.65s both" }}>
      <div style={{ fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: ".18em", color: "#059669" }}>Invite others</div>
      <div style={{ fontSize: "clamp(22px,2.6vw,28px)", fontWeight: "700", letterSpacing: "-.015em", lineHeight: "1.25", color: "#0f172a", marginTop: "12px" }}>Invite others to join the movement.</div>
      <p style={{ fontSize: "15px", lineHeight: "1.6", color: "#475569", margin: "6px 0 0", maxWidth: "600px" }}>The future should not be built alone. Pass it on to someone who should be part of it.</p>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px", marginTop: "26px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: "1", minWidth: "280px", border: "1px solid #cbd5e1", background: "#fff", borderRadius: "6px", padding: "14px 18px" }}>
      <span style={{ fontSize: "15px", color: "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: "1", minWidth: "0" }}>{v.shareUrl}</span>
      <button type="button" onClick={v.onCopyLink} className="wlp-28" style={{ border: "none", background: "transparent", color: "#1565c0", fontSize: "14px", fontWeight: "700", cursor: "pointer", padding: "4px 6px", whiteSpace: "nowrap" }}>{v.copyLabel}</button>
      </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "14px" }}>
      <a href={v.waHref} target="_blank" rel="noopener" className="wlp-29" style={{ display: "flex", alignItems: "center", gap: "12px", border: "1px solid #e2e8f0", background: "#fff", borderRadius: "6px", padding: "11px 18px", fontSize: "14px", fontWeight: "600", color: "#0f172a", transition: "border-color .18s ease-out,transform .18s ease-out" }}><span style={{ color: "#1565c0", display: "grid", placeItems: "center" }}><span className="wlp-ico"><WIcon name="message-circle" size={18} /></span></span>WhatsApp</a>
      <a href={v.tgHref} target="_blank" rel="noopener" className="wlp-30" style={{ display: "flex", alignItems: "center", gap: "12px", border: "1px solid #e2e8f0", background: "#fff", borderRadius: "6px", padding: "11px 18px", fontSize: "14px", fontWeight: "600", color: "#0f172a", transition: "border-color .18s ease-out,transform .18s ease-out" }}><span style={{ color: "#1565c0", display: "grid", placeItems: "center" }}><span className="wlp-ico"><WIcon name="send" size={18} /></span></span>Telegram</a>
      <a href={v.mailHref} className="wlp-31" style={{ display: "flex", alignItems: "center", gap: "12px", border: "1px solid #e2e8f0", background: "#fff", borderRadius: "6px", padding: "11px 18px", fontSize: "14px", fontWeight: "600", color: "#0f172a", transition: "border-color .18s ease-out,transform .18s ease-out" }}><span style={{ color: "#1565c0", display: "grid", placeItems: "center" }}><span className="wlp-ico"><WIcon name="mail" size={18} /></span></span>Email</a>
      </div>
      </div>
      </div>
      </>)}

      {v.showForm && (<>
      <div style={{ marginTop: "22px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "12px" }}>
      <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}><span style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>Full Name <span style={{ color: "#1565c0" }}>*</span></span><input type="text" value={v.fullName} onChange={v.onFullName} placeholder="Your name" className="wlp-32" style={{ border: "1px solid #cbd5e1", borderRadius: "6px", padding: "10px 12px", fontSize: "15px", color: "#0f172a", background: "#fff", outline: "none" }} /></label>
      <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}><span style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>Email Address <span style={{ color: "#1565c0" }}>*</span></span><input type="email" value={v.email} onChange={v.onEmail} placeholder="you@organization.org" className="wlp-33" style={{ border: "1px solid #cbd5e1", borderRadius: "6px", padding: "10px 12px", fontSize: "15px", color: "#0f172a", background: "#fff", outline: "none" }} /></label>
      <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}><span style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>Organization / Ministry</span><input type="text" value={v.organization} onChange={v.onOrganization} placeholder="Where you serve" className="wlp-34" style={{ border: "1px solid #cbd5e1", borderRadius: "6px", padding: "10px 12px", fontSize: "15px", color: "#0f172a", background: "#fff", outline: "none" }} /></label>
      <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}><span style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>Country</span><input type="text" value={v.country} onChange={v.onCountry} placeholder="Country" className="wlp-35" style={{ border: "1px solid #cbd5e1", borderRadius: "6px", padding: "10px 12px", fontSize: "15px", color: "#0f172a", background: "#fff", outline: "none" }} /></label>
      <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}><span style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>Your Role</span><input type="text" value={v.role} onChange={v.onRole} placeholder="e.g. Director of Digital Ministry" className="wlp-36" style={{ border: "1px solid #cbd5e1", borderRadius: "6px", padding: "10px 12px", fontSize: "15px", color: "#0f172a", background: "#fff", outline: "none" }} /></label>
      <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}><span style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>What best describes you?</span><select value={v.describes} onChange={v.onDescribes} className="wlp-37" style={{ border: "1px solid #cbd5e1", borderRadius: "6px", padding: "10px 12px", fontSize: "15px", color: "#0f172a", background: "#fff", outline: "none", appearance: "none" }}>
      <option value="">Select one</option>
      <option value="Ministry / Mission Organization">Ministry / Mission Organization</option>
      <option value="Church / Church Network">Church / Church Network</option>
      <option value="Technology Partner">Technology Partner</option>
      <option value="Developer / Builder">Developer / Builder</option>
      <option value="Content / Discipleship Organization">Content / Discipleship Organization</option>
      <option value="Researcher">Researcher</option>
      <option value="Funder / Strategic Partner">Funder / Strategic Partner</option>
      <option value="Individual interested in the vision">Individual interested in the vision</option>
      <option value="Other">Other</option>
      </select></label>
      </div>

      <label style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "14px" }}><span style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>What challenge are you most interested in solving with Turumba?</span><textarea value={v.challenge} onChange={v.onChallenge} rows={3} placeholder="Communication, follow-up, discipleship, engagement, content delivery, collaboration…" className="wlp-38" style={{ border: "1px solid #cbd5e1", borderRadius: "6px", padding: "10px 12px", fontSize: "15px", color: "#0f172a", background: "#fff", outline: "none", resize: "vertical", lineHeight: "1.55" }}></textarea></label>

      <div style={{ marginTop: "18px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "14px", marginBottom: "10px" }}><span style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>How would you like to be involved?</span><span style={{ fontSize: "14px", fontWeight: "600", color: "#1565c0" }}>{v.involvementLabel}</span></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "12px" }}>
      {v.involvementOptions.map((opt, i) => (<Fragment key={i}>
      <label className="wlp-39" style={{ display: "flex", alignItems: "center", gap: "14px", border: "1px solid #e2e8f0", background: "#fff", borderRadius: "8px", padding: "10px 14px", fontSize: "15px", fontWeight: "500", cursor: "pointer" }}><input type="checkbox" value={opt.label} checked={opt.checked} onChange={v.onInvolvement} style={{ width: "18px", height: "18px", accentColor: "#1565c0", cursor: "pointer" }} />{opt.label}</label>
      </Fragment>))}
      </div>
      </div>

      <label style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "18px" }}><span style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>Anything else you&apos;d like us to know? <span style={{ color: "#94a3b8", fontWeight: "500" }}>(Optional)</span></span><textarea value={v.notes} onChange={v.onNotes} rows={3} className="wlp-40" style={{ border: "1px solid #cbd5e1", borderRadius: "6px", padding: "10px 12px", fontSize: "15px", color: "#0f172a", background: "#fff", outline: "none", resize: "vertical", lineHeight: "1.55" }}></textarea></label>

      {v.hasError && (<>
      <div style={{ marginTop: "14px", border: "1px solid rgba(239,68,68,.3)", background: "rgba(239,68,68,.06)", borderRadius: "8px", padding: "12px 14px", fontSize: "15px", fontWeight: "500", color: "#b91c1c" }}>{v.error}</div>
      </>)}

<div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "20px", marginTop: "24px" }}>
      <AnimatedButton onClick={v.onSubmit}>{v.ctaLabel}</AnimatedButton>
      <div style={{ fontSize: "14px", lineHeight: "1.5", color: "#64748b", maxWidth: "420px" }}>You&apos;re joining Turumba&apos;s early access and collaboration waiting list.</div>
      </div>
      <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#94a3b8", margin: "12px 0 0", maxWidth: "620px" }}>Tell us who you are, what you&apos;re working on, and how you would like to be involved.</p>
      </div>
      </>)}
      </div>
      </div>
      </div>
      </>)}

      <div data-sticky-cta="" style={{ position: "fixed", left: "0", right: "0", bottom: "0", zIndex: "50", background: "rgba(255,255,255,.94)", borderTop: "1px solid #e2e8f0", backdropFilter: "blur(10px)", padding: "14px clamp(16px,4vw,48px)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", transform: "translateY(120%)", transition: "transform .3s ease-out" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", minWidth: "0", flex: "1" }}>
      <img src="/brand/turumba-logo-blue.svg" alt="Turumba" style={{ height: "26px", width: "auto", flex: "none", display: "block" }} />
      <span className="wlp-sticky-text" style={{ width: "1px", height: "22px", background: "#e2e8f0" }}></span>
      <span className="wlp-sticky-text" style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", minWidth: "0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Help Shape What Comes Next.</span>
      </div>
      <AnimatedButton height={40} padX={20} onClick={v.onScrollToForm}>{v.ctaLabel}</AnimatedButton>
      </div>

      </div>
    );
  }
}
