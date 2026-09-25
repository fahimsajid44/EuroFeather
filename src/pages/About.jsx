import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  ShieldCheck,
  Users,
  Globe2,
  HeartHandshake,
  Plane,
  ArrowRight,
  Quote,
} from 'lucide-react';
import logo from '../assets/Euro_Feather_Logo_No_BG.png';

/* ---------------------------------------------------------------
   ABOUT — "The Route", extended with its own signature object.

   Where Contact is a boarding pass and Home is a full itinerary,
   About is the one document that actually holds a story: a
   passport. An open bio-data page (who we are, on paper) faces a
   page of ink stamps (what we stand for), stamped down one by one
   as they scroll into view. Below it, the company's own history
   reads like the stamps collected on a real passport's later pages
   — a dated line of entries along the same route-line motif used
   everywhere else on the site.
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

const GOLD_GRADIENT = `linear-gradient(115deg, ${GOLD} 0%, ${GOLD_SOFT} 45%, ${GOLD} 70%, ${GOLD_SOFT} 100%)`;
const EASE = 'cubic-bezier(.16,1,.3,1)';
const STAMP_EASE = 'cubic-bezier(.34,1.56,.64,1)';

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
      className={`about-reveal ${inView ? 'about-reveal-visible' : ''} ${className}`}
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
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&family=Caveat:wght@600&display=swap');

      .about-root { font-family: 'Inter', sans-serif; background: ${PAPER}; }

      .about-reveal {
        opacity: 0;
        transform: translateY(22px) scale(.985);
        transition: opacity .7s ${EASE}, transform .7s ${EASE};
        will-change: transform, opacity;
      }
      .about-reveal-visible { opacity: 1; transform: translateY(0) scale(1); }

      .about-eyebrow { display: inline-flex; align-items: center; gap: 10px; }
      .about-eyebrow-dot {
        width: 7px; height: 7px; border-radius: 50%; background: ${GOLD};
        box-shadow: 0 0 0 3px ${GOLD_TINT};
      }
      .about-eyebrow-label {
        font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600;
        letter-spacing: 0.16em; text-transform: uppercase; color: ${GOLD};
      }
      .about-title {
        font-family: 'Space Grotesk', sans-serif; font-weight: 700; color: ${INK};
        letter-spacing: -0.01em;
      }
      .about-title .foil {
        background: ${GOLD_GRADIENT}; background-size: 260% 100%;
        -webkit-background-clip: text; background-clip: text; color: transparent;
        animation: aboutFoilSweep 7s ease-in-out infinite;
      }
      @keyframes aboutFoilSweep {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }

      .about-route-divider { position: relative; max-width: 1280px; margin: 0 auto; padding: 0 24px; }
      .about-route-divider::before { content: ''; display: block; height: 0; border-top: 1.5px dashed ${LINE}; }
      .about-route-divider .waypoint {
        position: absolute; left: 50%; top: 0; transform: translate(-50%, -50%);
        width: 8px; height: 8px; border-radius: 50%; background: ${GOLD};
        box-shadow: 0 0 0 4px ${PAPER};
      }

      /* --- header band, shared visual language with Contact --- */
      .about-header { position: relative; overflow: hidden; background: ${PAPER_DIM}; border-bottom: 1px solid ${LINE}; }
      .about-header::before {
        content: ''; position: absolute; inset: 0;
        background-image:
          radial-gradient(ellipse 640px 340px at 12% 0%, ${ROUTE_TINT} 0%, transparent 62%),
          radial-gradient(ellipse 520px 320px at 100% 100%, ${GOLD_TINT} 0%, transparent 60%);
        pointer-events: none;
      }
      .about-header::after {
        content: ''; position: absolute; inset: 0;
        background-image: radial-gradient(${LINE} 1px, transparent 1px);
        background-size: 24px 24px;
        -webkit-mask-image: radial-gradient(ellipse 700px 420px at 20% 20%, #000 0%, transparent 72%);
        mask-image: radial-gradient(ellipse 700px 420px at 20% 20%, #000 0%, transparent 72%);
        opacity: 0.55; pointer-events: none;
      }

      /* --- mission / quote block --- */
      .quote-card {
        position: relative; border-radius: 14px; background: #ffffff;
        border: 1px solid ${LINE}; padding: 40px 36px;
        box-shadow: 0 30px 60px -34px rgba(10,15,31,0.2);
      }
      .quote-mark {
        width: 44px; height: 44px; border-radius: 12px;
        background: ${GOLD_TINT}; border: 1px solid rgba(168,129,47,0.3); color: ${GOLD};
        display: flex; align-items: center; justify-content: center; margin-bottom: 20px;
      }
      .quote-text {
        font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 21px; line-height: 1.5;
        color: ${INK}; letter-spacing: -0.005em;
      }
      .quote-attr {
        margin-top: 18px; display: flex; align-items: center; gap: 10px;
        font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.1em;
        text-transform: uppercase; color: ${MUTED};
      }
      .quote-attr::before { content: ''; width: 22px; height: 1.5px; background: ${GOLD}; }

      /* =================================================================
         PASSPORT — the page's one signature object.
      ================================================================= */
      .passport-stage { max-width: 1080px; margin: 0 auto; padding: 10px 24px 0; perspective: 1600px; }

      .passport-cover-peek {
        max-width: 900px; margin: 0 auto; height: 34px; border-radius: 14px 14px 0 0;
        background: linear-gradient(155deg, ${ROUTE_DEEP} 0%, ${ROUTE_NIGHT} 100%);
        box-shadow: 0 -2px 0 rgba(255,255,255,0.04) inset;
        position: relative; z-index: 0;
      }

      .passport-spread {
        position: relative; z-index: 1; display: flex; max-width: 900px; margin: 0 auto;
        border-radius: 4px 4px 16px 16px; overflow: visible;
        box-shadow: 0 50px 90px -40px rgba(6,10,23,0.4), 0 2px 0 rgba(255,255,255,0.5) inset;
        transform: rotateX(1.5deg);
        transform-origin: top center;
      }

      .passport-page {
        flex: 1 1 50%; background: ${PAPER};
        background-image: radial-gradient(${LINE} 1px, transparent 1px);
        background-size: 20px 20px;
        padding: 40px 36px 34px;
        position: relative;
      }
      .passport-page-left { border-radius: 4px 0 0 16px; }
      .passport-page-right { border-radius: 0 4px 16px 0; }

      .passport-spine {
        flex: 0 0 18px;
        background: linear-gradient(90deg, rgba(10,15,31,0.14), rgba(10,15,31,0.02) 30%, rgba(10,15,31,0.02) 70%, rgba(10,15,31,0.14));
      }

      .passport-kicker {
        font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 600;
        letter-spacing: 0.14em; text-transform: uppercase; color: ${GOLD};
        display: flex; align-items: center; justify-content: space-between;
        border-bottom: 1px dashed ${LINE}; padding-bottom: 14px; margin-bottom: 22px;
      }

      .passport-id-row { display: flex; gap: 20px; align-items: flex-start; margin-bottom: 26px; }
      .passport-photo {
        width: 92px; height: 108px; flex-shrink: 0; border-radius: 6px;
        background: #ffffff;
        border: 1px solid rgba(168,129,47,0.35);
        box-shadow: 0 4px 14px -6px rgba(10,15,31,0.35);
        display: flex; align-items: center; justify-content: center; padding: 8px;
      }
      .passport-photo img { width: 100%; height: 100%; object-fit: contain; }
      .passport-signature {
        font-family: 'Caveat', cursive; font-size: 26px; color: ${ROUTE}; line-height: 1;
        transform: rotate(-2deg);
      }
      .passport-signature-label {
        font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: 0.1em;
        text-transform: uppercase; color: ${MUTED}; margin-top: 6px;
      }

      .passport-fields { display: flex; flex-direction: column; gap: 15px; }
      .passport-field-label {
        font-family: 'JetBrains Mono', monospace; font-size: 9.5px; font-weight: 600;
        letter-spacing: 0.12em; text-transform: uppercase; color: ${MUTED};
      }
      .passport-field-value {
        font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px; color: ${INK};
        margin-top: 3px;
      }

      .passport-mrz {
        margin-top: 24px; padding-top: 16px; border-top: 1px dashed ${LINE};
        font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.08em;
        color: ${MUTED}; line-height: 1.7; word-break: break-all;
      }

      /* stamps page */
      .stamp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 22px 18px; }
      .stamp {
        --r: 0deg;
        display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px;
        padding: 18px 10px 16px; border-radius: 10px;
        transform: rotate(var(--r)) scale(0.4);
        opacity: 0;
        transition: transform .55s ${STAMP_EASE}, opacity .4s ease;
      }
      .about-reveal-visible .stamp { transform: rotate(var(--r)) scale(1); opacity: 1; }
      .stamp-ring {
        width: 62px; height: 62px; border-radius: 50%;
        border: 2px solid ${ROUTE}; position: relative;
        display: flex; align-items: center; justify-content: center;
        color: ${ROUTE};
      }
      .stamp-ring::before {
        content: ''; position: absolute; inset: 5px; border-radius: 50%;
        border: 1px dashed ${ROUTE};
      }
      .stamp-title {
        font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13px; color: ${ROUTE};
        text-transform: uppercase; letter-spacing: 0.03em;
      }
      .stamp-desc { font-size: 11.5px; line-height: 1.5; color: ${MUTED}; max-width: 160px; }
      .stamp-code {
        font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.1em;
        color: ${GOLD}; text-transform: uppercase;
      }

      @media (max-width: 720px) {
        .passport-spread { flex-direction: column; border-radius: 4px 4px 16px 16px; }
        .passport-page-left { border-radius: 4px 4px 0 0; }
        .passport-page-right { border-radius: 0 0 16px 16px; }
        .passport-spine { flex: 0 0 14px; width: 100%; height: 14px;
          background: linear-gradient(180deg, rgba(10,15,31,0.14), rgba(10,15,31,0.02) 30%, rgba(10,15,31,0.02) 70%, rgba(10,15,31,0.14)); }
        .stamp-grid { grid-template-columns: 1fr 1fr; }
      }

      /* =================================================================
         TIMELINE — history read as stamped entries along the route.
      ================================================================= */
      .history-rail { position: relative; max-width: 780px; margin: 0 auto; }
      .history-rail::before {
        content: ''; position: absolute; left: 20px; top: 6px; bottom: 6px; width: 0;
        border-left: 1.5px dashed ${LINE};
      }
      @media (min-width: 860px) {
        .history-rail::before { left: 50%; }
      }
      .history-entry { position: relative; padding-left: 56px; margin-bottom: 34px; }
      .history-entry:last-child { margin-bottom: 0; }
      .history-dot {
        position: absolute; left: 20px; top: 4px; transform: translateX(-50%);
        width: 13px; height: 13px; border-radius: 50%; background: ${PAPER};
        border: 2px solid ${GOLD};
        box-shadow: 0 0 0 4px ${PAPER};
      }
      .history-year {
        font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700;
        letter-spacing: 0.1em; color: ${GOLD};
      }
      .history-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 16px; color: ${INK}; margin-top: 4px; }
      .history-desc { font-size: 13.5px; line-height: 1.6; color: ${MUTED}; margin-top: 6px; max-width: 480px; }

      @media (min-width: 860px) {
        .history-entry { width: 50%; padding-left: 0; }
        /* Each HistoryEntry is wrapped in its own <Reveal> div, so
           .history-entry is always the sole child of that wrapper —
           nth-child(odd/even) on .history-entry itself would always
           match "odd". Alternation is keyed off the wrapper's own
           position among its siblings inside .history-rail instead. */
        .history-rail > .about-reveal:nth-child(odd) .history-entry {
          padding-right: 48px; text-align: right; margin-left: 0;
        }
        .history-rail > .about-reveal:nth-child(even) .history-entry {
          padding-left: 48px; margin-left: 50%;
        }
        .history-rail > .about-reveal:nth-child(odd) .history-dot { left: auto; right: -6.5px; transform: none; }
        .history-rail > .about-reveal:nth-child(even) .history-dot { left: -6.5px; transform: none; }
        .history-rail > .about-reveal:nth-child(odd) .history-desc { margin-left: auto; }
      }

      /* --- stats ticket row --- */
      .stat-strip {
        display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px;
        background: ${LINE}; border: 1px solid ${LINE}; border-radius: 14px; overflow: hidden;
      }
      @media (min-width: 760px) { .stat-strip { grid-template-columns: repeat(4, 1fr); } }
      .stat-tile {
        background: #ffffff; padding: 30px 20px; text-align: center;
        display: flex; flex-direction: column; align-items: center; gap: 6px;
      }
      .stat-code {
        font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700;
        letter-spacing: 0.14em; color: ${GOLD}; text-transform: uppercase;
      }
      .stat-value { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 30px; color: ${INK}; }
      .stat-label { font-size: 12px; color: ${MUTED}; }

      /* --- crew cards --- */
      .crew-card {
        position: relative; border-radius: 10px; background: #ffffff;
        border: 1px solid ${LINE}; padding: 26px 22px; text-align: center;
        transition: transform .35s ${EASE}, box-shadow .35s ${EASE}, border-color .35s ${EASE};
      }
      .crew-card:hover { transform: translateY(-6px); box-shadow: 0 30px 54px -30px rgba(30,58,120,0.24); border-color: ${GOLD}; }
      .crew-avatar {
        width: 68px; height: 68px; border-radius: 50%; margin: 0 auto 16px;
        display: flex; align-items: center; justify-content: center;
        font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 19px;
        background: linear-gradient(155deg, ${ROUTE_DEEP} 0%, ${ROUTE_NIGHT} 100%);
        color: ${GOLD_SOFT}; border: 2px solid ${GOLD_SOFT};
      }
      .crew-name { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; color: ${INK}; }
      .crew-role { font-size: 12.5px; color: ${MUTED}; margin-top: 3px; }
      .crew-id {
        display: inline-block; margin-top: 12px;
        font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.1em;
        color: ${ROUTE}; background: ${ROUTE_TINT}; padding: 3px 9px; border-radius: 6px;
      }

      /* --- closing CTA (shared visual language with Home's boarding-panel) --- */
      .about-boarding-panel {
        position: relative; border-radius: 14px; overflow: hidden;
        background: ${PAPER_DIM}; border: 1px solid ${LINE};
        padding: 56px 32px; text-align: center;
      }
      .about-boarding-panel::before {
        content: ''; position: absolute; inset: 0;
        background-image:
          radial-gradient(ellipse 640px 340px at 8% 0%, ${ROUTE_TINT} 0%, transparent 62%),
          radial-gradient(ellipse 520px 320px at 100% 100%, ${GOLD_TINT} 0%, transparent 60%);
        pointer-events: none;
      }
      .about-boarding-panel::after {
        content: ''; position: absolute; inset: 0;
        background-image: radial-gradient(${LINE} 1px, transparent 1px);
        background-size: 24px 24px;
        -webkit-mask-image: radial-gradient(ellipse 700px 420px at 30% 20%, #000 0%, transparent 72%);
        mask-image: radial-gradient(ellipse 700px 420px at 30% 20%, #000 0%, transparent 72%);
        opacity: 0.55; pointer-events: none;
      }
      .about-boarding-plane {
        position: absolute; top: 18%; left: -6%; color: ${GOLD}; opacity: 0.9;
        animation: aboutBoardingFly 5.5s ${EASE} infinite;
      }
      @keyframes aboutBoardingFly {
        0% { transform: translateX(0) translateY(0) rotate(8deg); opacity: 0; }
        10% { opacity: 0.9; } 90% { opacity: 0.9; }
        100% { transform: translateX(112vw) translateY(-34px) rotate(8deg); opacity: 0; }
      }
      .about-boarding-cta {
        position: relative; display: inline-flex; align-items: center; gap: 9px;
        margin-top: 26px; padding: 15px 30px; border-radius: 10px;
        background: ${GOLD_GRADIENT}; background-size: 220% 100%;
        color: ${INK}; font-size: 14px; font-weight: 700; cursor: pointer;
        transition: background-position .5s ${EASE}, transform .25s ${EASE};
        box-shadow: 0 20px 40px -20px rgba(30,58,120,0.35);
      }
      .about-boarding-cta:hover { background-position: 100% 0; transform: translateY(-2px); }
      .about-boarding-cta:active { transform: translateY(0) scale(.98); }

      @media (max-width: 640px) {
        .about-boarding-panel { padding: 40px 20px; border-radius: 10px; }
        .about-boarding-cta { width: 100%; justify-content: center; padding: 14px 22px; }
        .passport-page { padding: 30px 22px 26px; }
      }

      @media (prefers-reduced-motion: reduce) {
        .about-root *, .about-root *::before, .about-root *::after {
          transition-duration: 0.001ms !important;
          animation-duration: 0.001ms !important;
        }
        .about-reveal { opacity: 1 !important; transform: none !important; }
        .stamp { opacity: 1 !important; transform: none !important; }
        .about-boarding-plane { display: none; }
      }
    `}</style>
  );
}

/* ---------------------------- pieces ---------------------------- */

function RouteDivider() {
  return (
    <div className="about-route-divider" aria-hidden="true">
      <span className="waypoint" />
    </div>
  );
}

function SectionHeading({ eyebrow, title, emphasis, sub }) {
  return (
    <Reveal className="flex flex-col items-center text-center mb-14">
      <span className="about-eyebrow">
        <span className="about-eyebrow-dot" />
        <span className="about-eyebrow-label">{eyebrow}</span>
      </span>
      <h2 className="about-title mt-4 text-3xl md:text-4xl">
        {title} {emphasis && <span className="foil">{emphasis}</span>}
      </h2>
      {sub && (
        <p className="mt-4 max-w-xl text-sm leading-relaxed" style={{ color: MUTED }}>
          {sub}
        </p>
      )}
    </Reveal>
  );
}

function Stamp({ icon: Icon, title, desc, code, rotate }) {
  return (
    <div className="stamp" style={{ '--r': `${rotate}deg` }}>
      <div className="stamp-ring">
        <Icon size={24} strokeWidth={1.75} />
      </div>
      <span className="stamp-title">{title}</span>
      <span className="stamp-desc">{desc}</span>
      <span className="stamp-code">{code}</span>
    </div>
  );
}

function HistoryEntry({ year, title, desc }) {
  return (
    <div className="history-entry">
      <span className="history-dot" />
      <div className="history-year">{year}</div>
      <div className="history-title">{title}</div>
      <div className="history-desc">{desc}</div>
    </div>
  );
}

function StatTile({ code, value, label }) {
  return (
    <div className="stat-tile">
      <span className="stat-code">{code}</span>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}



/* ---------------------------- page ---------------------------- */

export default function About() {
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-root">
      <GlobalStyle />

      <Navbar />

      {/* HEADER */}
      <section className="about-header">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20 relative text-center">
          <Reveal className="flex flex-col items-center">
            <span className="about-eyebrow">
              <span className="about-eyebrow-dot" />
              <span className="about-eyebrow-label">Since 2019 · Frankfurt, Germany</span>
            </span>
            <h1 className="about-title mt-4 text-4xl md:text-5xl">
              Who We <span className="foil">Are</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm md:text-base leading-relaxed" style={{ color: MUTED }}>
              A small counseling team that treats every application like a route to be
              planned properly — not a form to be filed quickly.
            </p>
          </Reveal>
        </div>
      </section>

      <RouteDivider />

      {/* MISSION */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <Reveal>
            <span className="about-eyebrow">
              <span className="about-eyebrow-dot" />
              <span className="about-eyebrow-label">Why we exist</span>
            </span>
            <h2 className="about-title mt-4 text-2xl md:text-3xl">
              We plan routes, <span className="foil">not templates</span>
            </h2>
            <p className="mt-5 text-sm leading-relaxed" style={{ color: MUTED }}>
              Euro Feather started with a simple frustration: too many students were
              handed the same shortlist of universities regardless of their grades,
              budget, or goals. We built our practice around the opposite idea — one
              counselor, one file, one plan, followed all the way from the first
              conversation to the day you land.
            </p>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: MUTED }}>
              We're based in Frankfurt and work closely with students across
              Bangladesh and South Asia, which means we sit on both ends of the
              route we're planning for you.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div className="quote-card">
              <div className="quote-mark">
                <Quote size={20} strokeWidth={2} />
              </div>
              <p className="quote-text">
                "Every student who sits down with us asks the same question first —
                is this actually possible for me. Building an honest answer to that,
                before anything else, is the entire job."
              </p>
              <div className="quote-attr">Founding Team, Euro Feather</div>
            </div>
          </Reveal>
        </div>
      </section>

      <RouteDivider />

      {/* PASSPORT — signature element */}
      <section className="py-20">
        <SectionHeading
          eyebrow="Our passport"
          title="What we stand"
          emphasis="for"
          sub="The details a real passport carries, and the four things we hold ourselves to on every file we open."
        />
        <div className="passport-stage">
          <div className="passport-cover-peek" aria-hidden="true" />
          <Reveal>
            <div className="passport-spread">
              {/* bio-data page */}
              <div className="passport-page passport-page-left">
                <div className="passport-kicker">
                  <span>Bio Data</span>
                  <span>P&lt;EUF</span>
                </div>
                <div className="passport-id-row">
                  <div className="passport-photo">
                    <img src={logo} alt="Euro Feather emblem" />
                  </div>
                  <div>
                    <div className="passport-field-label">Registered Name</div>
                    <div className="passport-field-value">Euro Feather</div>
                    <div className="passport-signature">Euro&nbsp;Feather</div>
                    <div className="passport-signature-label">Authorized Signature</div>
                  </div>
                </div>
                <div className="passport-fields">
                  <div>
                    <div className="passport-field-label">Type</div>
                    <div className="passport-field-value">Overseas Education Consultancy</div>
                  </div>
                  <div>
                    <div className="passport-field-label">Headquartered</div>
                    <div className="passport-field-value">Frankfurt, Germany</div>
                  </div>
                  <div>
                    <div className="passport-field-label">Established</div>
                    <div className="passport-field-value">2020</div>
                  </div>
                  <div>
                    <div className="passport-field-label">Languages Spoken</div>
                    <div className="passport-field-value">English · German · Bengali</div>
                  </div>
                </div>
                <div className="passport-mrz">
                  EUROFEATHER&lt;&lt;OVERSEAS&lt;EDUCATION&lt;CONSULTANCY&lt;&lt;&lt;&lt;<br />
                  FRA2019&lt;&lt;7COUNTRIES&lt;&lt;500PLUS&lt;PLACED&lt;&lt;&lt;&lt;&lt;&lt;&lt;9
                </div>
              </div>

              <div className="passport-spine" aria-hidden="true" />

              {/* stamps page */}
              <div className="passport-page passport-page-right">
                <div className="passport-kicker">
                  <span>Endorsements</span>
                  <span>04 / 04</span>
                </div>
                <div className="stamp-grid">
                  <Stamp icon={ShieldCheck} title="Transparency" desc="Every fee shown up front, nothing added later." code="STAMP · TRN" rotate={-6} />
                  <Stamp icon={Users} title="Personal Attention" desc="One counselor, one file, no hand-offs." code="STAMP · ATN" rotate={5} />
                  <Stamp icon={HeartHandshake} title="Reliability" desc="We stay reachable well past the visa stamp." code="STAMP · REL" rotate={-4} />
                  <Stamp icon={Globe2} title="Global Reach" desc="Recognized routes across seven countries." code="STAMP · GLB" rotate={7} />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <RouteDivider />

      {/* HISTORY */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <SectionHeading
          eyebrow="Stamped along the way"
          title="Our"
          emphasis="History"
          sub="A short, honest timeline — not because a company needs one, but because the order actually explains how we got here."
        />
        <div className="history-rail">
          <Reveal><HistoryEntry year="2020" title="Founded in Frankfurt" desc="Started guiding a first small cohort of students into German public universities." /></Reveal>
          <Reveal delay={60}><HistoryEntry year="2020" title="Widened the route" desc="Added Hungary and other H+/H- listed universities across Europe." /></Reveal>
          <Reveal delay={120}><HistoryEntry year="2022" title="Opened direct channels" desc="Launched WhatsApp and video consultations for students across Bangladesh and South Asia." /></Reveal>
          <Reveal delay={180}><HistoryEntry year="2023" title="Crossed 500 placements" desc="Added South Korea and Estonia as new study destinations." /></Reveal>
          <Reveal delay={240}><HistoryEntry year="2025" title="Built free tools" desc="Released the CGPA converter and grade calculator so students can self-assess before applying." /></Reveal>
          <Reveal delay={300}><HistoryEntry year="2026" title="Still counseling by hand" desc="Every plan is still reviewed by an actual advisor before it reaches a student." /></Reveal>
        </div>
      </section>

      <RouteDivider />

      {/* STATS */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <Reveal>
          <div className="stat-strip">
            <StatTile code="EST" value="2020" label="Founded" />
            <StatTile code="PAX" value="500+" label="Students guided" />
            <StatTile code="RTE" value="7" label="Study destinations" />
            <StatTile code="SUC" value="98%" label="Visa success rate" />
          </div>
        </Reveal>
      </section>

      <RouteDivider />



      {/* CLOSING CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <Reveal>
          <div className="about-boarding-panel">
            <Plane size={22} className="about-boarding-plane" />
            <span className="about-eyebrow" style={{ justifyContent: 'center' }}>
              <span className="about-eyebrow-dot" />
              <span className="about-eyebrow-label">Ready when you are</span>
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: INK }}>
              Let's stamp the next page together.
            </h2>
            <p className="mt-4 max-w-lg mx-auto text-sm leading-relaxed" style={{ color: MUTED }}>
              Book a free consultation and we'll start your file the same way we start
              every one — by listening first.
            </p>
            <a href="/consultation" className="about-boarding-cta">
              Book Your Free Consultation <ArrowRight size={16} />
            </a>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}