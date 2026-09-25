import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, MapPin, CalendarCheck } from 'lucide-react';

/* ---------------------------------------------------------------
   CONTACT PAGE — built on "THE ROUTE" identity shared with Navbar,
   Hero, Home and Footer (paper field, sapphire route line, gilt
   accent, Space Grotesk / Inter / JetBrains Mono).

   This page's signature: the contact block is drawn as one physical
   object — a boarding pass — rather than a grid of generic cards.
   Deep navy + foil gold on cream stock (the palette real airline
   premium-cabin documents use) instead of another cream+accent or
   dark+neon default. The main coupon carries the "flight data"
   (email / whatsapp / location / channel), a tear-perforation splits
   it from the stub, and the stub carries the status seal and
   boarding-group priority list — so "who to contact" and "how fast
   they'll respond" both live inside the same object, the way a real
   ticket carries the route and the boarding group together.
------------------------------------------------------------------*/
const INK = '#0A0F1F';
const PAPER = '#FAF9F5';
const PAPER_DIM = '#F1EFE7';
const ROUTE = '#1E3A78';
const ROUTE_DEEP = '#0B1B44';
const ROUTE_NIGHT = '#060A17';
const ROUTE_TINT = '#EEF1F9';
const GOLD = '#A8812F';
const GOLD_SOFT = '#D8B872';
const GOLD_TINT = '#FBF4E3';
const LINE = '#E3E0D4';
const MUTED = '#84806E';
const CREAM_TEXT = 'rgba(250,249,245,0.6)';

const GOLD_GRADIENT = `linear-gradient(115deg, ${GOLD} 0%, ${GOLD_SOFT} 45%, ${GOLD} 70%, ${GOLD_SOFT} 100%)`;
const EASE = 'cubic-bezier(.16,1,.3,1)';

/* ------------------------- scroll reveal ------------------------- */

function useInView(threshold = 0.16) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Reveal({ children, delay = 0, className = '' }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`contact-reveal ${inView ? 'contact-reveal-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ---------------------------- styles ---------------------------- */

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');

      .contact-root { font-family: 'Inter', sans-serif; background: ${PAPER}; }

      .contact-reveal {
        opacity: 0;
        transform: translateY(22px) scale(.985);
        transition: opacity .7s ${EASE}, transform .7s ${EASE};
        will-change: transform, opacity;
      }
      .contact-reveal-visible { opacity: 1; transform: translateY(0) scale(1); }

      .contact-eyebrow { display: inline-flex; align-items: center; gap: 10px; }
      .contact-eyebrow-dot {
        width: 7px; height: 7px; border-radius: 50%; background: ${GOLD};
        box-shadow: 0 0 0 3px ${GOLD_TINT};
      }
      .contact-eyebrow-label {
        font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600;
        letter-spacing: 0.16em; text-transform: uppercase; color: ${GOLD};
      }
      .contact-title {
        font-family: 'Space Grotesk', sans-serif; font-weight: 700; color: ${INK};
        letter-spacing: -0.01em;
      }
      .contact-title .foil {
        background: ${GOLD_GRADIENT}; background-size: 260% 100%;
        -webkit-background-clip: text; background-clip: text; color: transparent;
        animation: contactFoilSweep 7s ease-in-out infinite;
      }
      @keyframes contactFoilSweep {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }

      .contact-route-divider { position: relative; max-width: 1280px; margin: 0 auto; padding: 0 24px; }
      .contact-route-divider::before { content: ''; display: block; height: 0; border-top: 1.5px dashed ${LINE}; }
      .contact-route-divider .waypoint {
        position: absolute; left: 50%; top: 0; transform: translate(-50%, -50%);
        width: 8px; height: 8px; border-radius: 50%; background: ${GOLD};
        box-shadow: 0 0 0 4px ${PAPER};
      }

      /* --- header band --- */
      .contact-header {
        position: relative; overflow: hidden;
        background: ${PAPER_DIM};
        border-bottom: 1px solid ${LINE};
      }
      .contact-header::before {
        content: ''; position: absolute; inset: 0;
        background-image:
          radial-gradient(ellipse 640px 340px at 12% 0%, ${ROUTE_TINT} 0%, transparent 62%),
          radial-gradient(ellipse 520px 320px at 100% 100%, ${GOLD_TINT} 0%, transparent 60%);
        pointer-events: none;
      }
      .contact-header::after {
        content: ''; position: absolute; inset: 0;
        background-image: radial-gradient(${LINE} 1px, transparent 1px);
        background-size: 24px 24px;
        -webkit-mask-image: radial-gradient(ellipse 700px 420px at 20% 20%, #000 0%, transparent 72%);
        mask-image: radial-gradient(ellipse 700px 420px at 20% 20%, #000 0%, transparent 72%);
        opacity: 0.55; pointer-events: none;
      }

      /* =================================================================
         BOARDING PASS — the page's one signature object.
      ================================================================= */
      .bp-wrap { max-width: 1240px; margin: 0 auto; padding: 90px 24px 120px; }

      .boarding-pass {
        position: relative; display: flex; border-radius: 20px; overflow: visible;
        box-shadow: 0 50px 90px -40px rgba(6,10,23,0.45), 0 2px 0 rgba(255,255,255,0.4) inset;
      }

      /* main coupon: deep navy, foil fields, route watermark */
      .bp-main {
        position: relative; flex: 1 1 68%; overflow: hidden;
        background:
          radial-gradient(ellipse 520px 320px at 100% 0%, rgba(168,129,47,0.16) 0%, transparent 60%),
          linear-gradient(155deg, ${ROUTE_DEEP} 0%, ${ROUTE_NIGHT} 100%);
        border-radius: 20px 0 0 20px;
        padding: 48px 52px 42px;
        display: flex; flex-direction: column; gap: 32px;
      }
      .bp-main::after {
        content: ''; position: absolute; inset: 0; pointer-events: none;
        background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px);
        background-size: 16px 16px;
        -webkit-mask-image: radial-gradient(ellipse 520px 340px at 0% 100%, #000 0%, transparent 70%);
        mask-image: radial-gradient(ellipse 520px 340px at 0% 100%, #000 0%, transparent 70%);
      }
      .bp-route-line { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0.55; pointer-events: none; }

      .bp-top { position: relative; display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
      .bp-brand {
        font-family: 'JetBrains Mono', monospace; font-size: 12.5px; font-weight: 600;
        letter-spacing: 0.18em; text-transform: uppercase; color: ${GOLD_SOFT};
      }
      .bp-route-code {
        margin-top: 12px; display: flex; align-items: center; gap: 15px;
        font-family: 'Space Grotesk', sans-serif; font-weight: 700; color: ${PAPER};
        font-size: 36px; letter-spacing: 0.01em;
      }
      .bp-route-code .arrow { color: ${GOLD_SOFT}; font-size: 24px; }
      .bp-route-sub { margin-top: 6px; font-size: 13.5px; color: ${CREAM_TEXT}; letter-spacing: 0.02em; }
      .bp-class {
        text-align: right; font-family: 'JetBrains Mono', monospace;
        font-size: 11.5px; letter-spacing: 0.14em; text-transform: uppercase; color: ${CREAM_TEXT};
      }
      .bp-class strong { display: block; margin-top: 5px; font-size: 15.5px; color: ${GOLD_SOFT}; letter-spacing: 0.1em; }

      .bp-fields {
        position: relative; display: grid; grid-template-columns: repeat(2, 1fr);
        gap: 28px 38px; padding-top: 30px; border-top: 1px dashed rgba(216,184,114,0.25);
      }
      .bp-field { display: flex; flex-direction: column; gap: 9px; }
      a.bp-field { text-decoration: none; }
      .bp-field-label {
        display: flex; align-items: center; gap: 7px;
        font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600;
        letter-spacing: 0.14em; text-transform: uppercase; color: ${GOLD_SOFT};
      }
      .bp-field-label svg { flex-shrink: 0; }
      .bp-field-value {
        font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 20px;
        color: ${PAPER}; line-height: 1.35; transition: color .25s ${EASE};
        word-break: break-word;
      }
      a.bp-field:hover .bp-field-value { color: ${GOLD_SOFT}; }
      .bp-field-note { font-size: 13px; color: ${CREAM_TEXT}; }

      /* perforation between coupon and stub */
      .bp-perf {
        position: relative; flex: 0 0 0; width: 0;
        border-left: 2px dashed rgba(10,15,31,0.16);
      }
      .bp-perf::before, .bp-perf::after {
        content: ''; position: absolute; left: -13px; width: 26px; height: 26px;
        border-radius: 50%; background: ${PAPER};
      }
      .bp-perf::before { top: -13px; }
      .bp-perf::after { bottom: -13px; }

      /* stub: cream, seal + boarding groups */
      .bp-stub {
        flex: 1 1 32%; background: #ffffff; border-radius: 0 20px 20px 0;
        padding: 42px 38px 36px; display: flex; flex-direction: column; gap: 28px;
      }
      .bp-stub-head { display: flex; align-items: center; justify-content: space-between; }
      .bp-stub-label {
        font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600;
        letter-spacing: 0.14em; text-transform: uppercase; color: ${MUTED};
      }

      /* seal */
      .bp-seal-row { display: flex; justify-content: center; padding: 4px 0 2px; }
      .bp-seal {
        width: 136px; height: 136px; border-radius: 50%; flex-shrink: 0;
        display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px;
        border: 1.5px solid rgba(168,129,47,0.55);
        background: ${GOLD_TINT};
        transform: rotate(-9deg);
        position: relative;
      }
      .bp-seal::before {
        content: ''; position: absolute; inset: 8px; border-radius: 50%;
        border: 1px dashed rgba(168,129,47,0.55);
      }
      .bp-seal svg { color: ${GOLD}; }
      .bp-seal-line1 {
        font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px;
        letter-spacing: 0.03em; color: ${GOLD}; text-transform: uppercase; margin-top: 3px;
      }
      .bp-seal-line2 {
        font-family: 'JetBrains Mono', monospace; font-size: 9.5px; font-weight: 600;
        letter-spacing: 0.08em; color: ${GOLD}; text-transform: uppercase; text-align: center; line-height: 1.3;
      }

      .bp-status-note { text-align: center; font-size: 14px; color: ${MUTED}; line-height: 1.65; padding: 0 4px; }

      .bp-groups { display: flex; flex-direction: column; gap: 0; border-top: 1px dashed ${LINE}; }
      .bp-group { display: flex; align-items: flex-start; gap: 15px; padding: 17px 0; border-bottom: 1px dashed ${LINE}; }
      .bp-group-badge {
        width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center;
        font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 14px;
      }
      .bp-group-badge.tier-high { background: ${GOLD_TINT}; color: ${GOLD}; border: 1px solid rgba(168,129,47,0.35); }
      .bp-group-badge.tier-mid { background: ${ROUTE_TINT}; color: ${ROUTE}; border: 1px solid rgba(30,58,120,0.2); }
      .bp-group-badge.tier-low { background: ${PAPER_DIM}; color: ${MUTED}; border: 1px solid ${LINE}; }
      .bp-group-body { flex: 1; min-width: 0; }
      .bp-group-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
      .bp-group-name { font-size: 15px; font-weight: 700; color: ${INK}; }
      .bp-group-tag {
        font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 600;
        letter-spacing: 0.06em; text-transform: uppercase; white-space: nowrap;
      }
      .bp-group-tag.tier-high { color: ${GOLD}; }
      .bp-group-tag.tier-mid { color: ${ROUTE}; }
      .bp-group-tag.tier-low { color: ${MUTED}; }
      .bp-group-note { margin-top: 3px; font-size: 12.5px; color: ${MUTED}; line-height: 1.55; }

      .bp-barcode {
        height: 42px; margin-top: 4px;
        background-image: repeating-linear-gradient(
          90deg, ${INK} 0px, ${INK} 1px, transparent 1px, transparent 3px,
          ${INK} 3px, ${INK} 5px, transparent 5px, transparent 6px,
          ${INK} 6px, ${INK} 9px, transparent 9px, transparent 11px
        );
        opacity: 0.85;
      }
      .bp-barcode-code {
        margin-top: 8px; text-align: center; font-family: 'JetBrains Mono', monospace;
        font-size: 11px; letter-spacing: 0.16em; color: ${MUTED};
      }

      @media (max-width: 760px) {
        .boarding-pass { flex-direction: column; }
        .bp-main { border-radius: 20px 20px 0 0; padding: 34px 28px 28px; }
        .bp-fields { grid-template-columns: 1fr; }
        .bp-perf { width: auto; height: 0; border-left: none; border-top: 2px dashed rgba(10,15,31,0.16); }
        .bp-perf::before, .bp-perf::after { top: -11px; left: auto; }
        .bp-perf::before { left: -11px; }
        .bp-perf::after { right: -11px; left: auto; }
        .bp-stub { border-radius: 0 0 20px 20px; padding: 30px 28px 32px; }
        .bp-route-code { font-size: 26px; }
      }

      @media (prefers-reduced-motion: reduce) {
        .contact-root *, .contact-root *::before, .contact-root *::after {
          transition-duration: 0.001ms !important;
          animation-duration: 0.001ms !important;
        }
        .contact-reveal { opacity: 1 !important; transform: none !important; }
      }
    `}</style>
  );
}

/* ---------------------------- pieces ---------------------------- */

function RouteDivider() {
  return (
    <div className="contact-route-divider" aria-hidden="true">
      <span className="waypoint" />
    </div>
  );
}

/* Faint engraved flight-path watermark across the main coupon —
   the same route-line language used across the rest of the site,
   here as texture rather than a literal diagram. */
function RouteWatermark() {
  return (
    <svg className="bp-route-line" viewBox="0 0 640 320" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="bpRouteGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={GOLD_SOFT} stopOpacity="0" />
          <stop offset="50%" stopColor={GOLD_SOFT} stopOpacity="0.9" />
          <stop offset="100%" stopColor={GOLD_SOFT} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M-30,280 C110,230 150,120 280,140 C410,160 440,60 660,10"
        fill="none" stroke="url(#bpRouteGrad)" strokeWidth="1" strokeDasharray="1 7" strokeLinecap="round"
      />
      <circle cx="280" cy="140" r="2.5" fill={GOLD_SOFT} opacity="0.7" />
      <circle cx="440" cy="60" r="2.5" fill={GOLD_SOFT} opacity="0.5" />
    </svg>
  );
}

/* Brand mark for WhatsApp — kept local so the page has no dependency
   on any external icon set for it. */
function WhatsAppIcon({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M16.02 3C9.4 3 4 8.4 4 15.02c0 2.23.6 4.34 1.73 6.2L3 29l7.94-2.66a11.94 11.94 0 0 0 5.08 1.14h.01c6.62 0 12.02-5.4 12.02-12.02C28.05 8.4 22.65 3 16.02 3zm0 21.78h-.01a9.7 9.7 0 0 1-4.95-1.36l-.35-.21-4.7 1.57 1.58-4.58-.23-.37a9.72 9.72 0 0 1-1.5-5.21c0-5.38 4.38-9.76 9.77-9.76 2.61 0 5.06 1.02 6.9 2.86a9.68 9.68 0 0 1 2.86 6.9c0 5.39-4.39 9.76-9.77 9.76zm5.35-7.32c-.29-.15-1.73-.85-2-.95-.27-.1-.46-.15-.66.15-.2.29-.76.95-.93 1.14-.17.2-.34.22-.63.07-.29-.15-1.24-.46-2.36-1.46-.87-.78-1.46-1.73-1.63-2.02-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.19-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.66-1.58-.9-2.17-.24-.57-.48-.49-.66-.5h-.56c-.2 0-.51.07-.78.37-.27.29-1.02 1-1.02 2.44s1.05 2.83 1.2 3.02c.15.2 2.06 3.15 5 4.41.7.3 1.24.48 1.67.62.7.22 1.34.19 1.84.11.56-.08 1.73-.71 1.98-1.39.24-.68.24-1.27.17-1.39-.07-.13-.26-.2-.55-.35z" />
    </svg>
  );
}

/* Brand mark for YouTube — lucide-react in this project doesn't ship
   one, so it's a local SVG kept consistent with the WhatsApp mark. */
function YouTubeIcon({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 20" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M27.4 3.12a3.44 3.44 0 0 0-2.42-2.44C22.88 0 14 0 14 0S5.12 0 3.02.68A3.44 3.44 0 0 0 .6 3.12 36 36 0 0 0 0 10a36 36 0 0 0 .6 6.88 3.44 3.44 0 0 0 2.42 2.44C5.12 20 14 20 14 20s8.88 0 10.98-.68a3.44 3.44 0 0 0 2.42-2.44A36 36 0 0 0 28 10a36 36 0 0 0-.6-6.88zM11.2 14.29V5.71L18.5 10z" />
    </svg>
  );
}

/* -------------------- boarding pass sub-pieces -------------------- */

function BPField({ icon: Icon, label, value, note, href, external }) {
  return (
    <a
      className="bp-field"
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      <span className="bp-field-label">
        <Icon size={14} strokeWidth={2} />
        {label}
      </span>
      <span className="bp-field-value">{value}</span>
      {note && <span className="bp-field-note">{note}</span>}
    </a>
  );
}

function BoardingGroup({ tone, letter, name, tag, note }) {
  return (
    <div className="bp-group">
      <span className={`bp-group-badge tier-${tone}`}>{letter}</span>
      <div className="bp-group-body">
        <div className="bp-group-top">
          <span className="bp-group-name">{name}</span>
          <span className={`bp-group-tag tier-${tone}`}>{tag}</span>
        </div>
        <div className="bp-group-note">{note}</div>
      </div>
    </div>
  );
}

/* ---------------------------- page ---------------------------- */

export default function Contact() {
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="contact-root">
      <GlobalStyle />

      <Navbar />

      {/* PAGE HEADER */}
      <section className="contact-header">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20 relative text-center">
          <Reveal className="flex flex-col items-center">
            <span className="contact-eyebrow">
              <span className="contact-eyebrow-dot" />
              <span className="contact-eyebrow-label">We're one message away</span>
            </span>
            <h1 className="contact-title mt-4 text-4xl md:text-5xl">
              Get In <span className="foil">Touch</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm md:text-base leading-relaxed" style={{ color: MUTED }}>
              However you reach us, it starts the same journey. Here's your boarding pass.
            </p>
          </Reveal>
        </div>
      </section>

      <RouteDivider />

      {/* BOARDING PASS */}
      <section className="bp-wrap">
        <Reveal>
          <div className="boarding-pass">

            {/* main coupon */}
            <div className="bp-main">
              <RouteWatermark />

              <div className="bp-top">
                <div>
                  <div className="bp-brand">Euro Feather · Contact Coupon</div>
                  <div className="bp-route-code">
                    FRA <span className="arrow">✈</span> YOU
                  </div>
                  <div className="bp-route-sub">Frankfurt, Germany — wherever your application is headed</div>
                </div>
                <div className="bp-class">
                  Class
                  <strong>Consultation</strong>
                </div>
              </div>

              <div className="bp-fields">
                <BPField
                  icon={Mail}
                  label="Email"
                  value="eurofeather.de@gmail.com"
                  note="We reply within 24 hours"
                  href="mailto:eurofeather.de@gmail.com"
                />
                <BPField
                  icon={WhatsAppIcon}
                  label="WhatsApp"
                  value="+49 1573 7419397"
                  note="Quick, informal questions"
                  href="https://wa.me/4915737419397"
                  external
                />
                <BPField
                  icon={MapPin}
                  label="Location"
                  value="Frankfurt, Germany"
                  note="Visits by appointment"
                  href="https://www.openstreetmap.org/?mlat=50.1109&mlon=8.6821#map=13/50.1109/8.6821"
                  external
                />
                <BPField
                  icon={YouTubeIcon}
                  label="Channel"
                  value="@eurofeather"
                  note="Application walkthroughs on YouTube"
                  href="https://www.youtube.com/@eurofeather"
                  external
                />
              </div>
            </div>

            {/* perforation */}
            <div className="bp-perf" aria-hidden="true" />

            {/* stub */}
            <div className="bp-stub">
              <div className="bp-stub-head">
                <span className="bp-stub-label">Admit One</span>
                <span className="bp-stub-label">EF · 2026</span>
              </div>

              <div className="bp-seal-row">
                <div className="bp-seal">
                  <CalendarCheck size={26} strokeWidth={1.8} />
                  <span className="bp-seal-line1">Open</span>
                  <span className="bp-seal-line2">For Consultation</span>
                </div>
              </div>
              <div className="bp-status-note">
                Taking on new students now — book a slot to start the fastest.
              </div>

              <div className="bp-groups">
                <BoardingGroup
                  tone="high" letter="A" name="Book a Consultation"
                  tag="Priority" note="Reviewed first, often same-day"
                />
                <BoardingGroup
                  tone="mid" letter="B" name="Email"
                  tag="Standard" note="Answered within 24 hours"
                />
                <BoardingGroup
                  tone="low" letter="C" name="WhatsApp"
                  tag="General" note="For quick, simple questions"
                />
              </div>

              <div>
                <div className="bp-barcode" aria-hidden="true" />
                <div className="bp-barcode-code">EF · FRA · CONTACT</div>
              </div>
            </div>

          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}