import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import {
  GraduationCap,
  Globe2,
  FileText,
  Headphones,
  RefreshCw,
  Landmark,
  ArrowRight,
  Mail,
  MapPin,
  Plane,
  Users,
  Award,
  ShieldCheck,
  Compass,
  ClipboardCheck,
  Stamp,
  Luggage,
  MessageCircle,
} from 'lucide-react';

/* ---------------------------------------------------------------
   "THE ROUTE" — same identity as Navbar and Hero: a quiet paper
   field, a sapphire route line, a single gilt accent, built from
   dashed lines, waypoints and boarding-pass perforations, so the
   page reads as one continuous trip rather than stacked template
   sections. Class names stay namespaced "home-" to avoid collision
   with Navbar/Hero's identical tokens.
------------------------------------------------------------------*/
const INK = '#0A0F1F';
const PAPER = '#FAF9F5';
const PAPER_DIM = '#F1EFE7';
const ROUTE = '#1E3A78';
const ROUTE_TINT = '#EEF1F9';
const GOLD = '#A8812F';
const GOLD_SOFT = '#D8B872';
const GOLD_TINT = '#FBF4E3';
const LINE = '#E3E0D4';
const MUTED = '#84806E';

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
      className={`home-reveal ${inView ? 'home-reveal-visible' : ''} ${className}`}
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

      .home-root { font-family: 'Inter', sans-serif; background: ${PAPER}; }

      .home-reveal {
        opacity: 0;
        transform: translateY(22px) scale(.985);
        transition: opacity .65s ${EASE}, transform .65s ${EASE};
        will-change: transform, opacity;
      }
      .home-reveal-visible { opacity: 1; transform: translateY(0) scale(1); }

      .home-eyebrow { display: inline-flex; align-items: center; gap: 10px; }
      .home-eyebrow-dot {
        width: 7px; height: 7px; border-radius: 50%; background: ${GOLD};
        box-shadow: 0 0 0 3px ${GOLD_TINT};
      }
      .home-eyebrow-label {
        font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600;
        letter-spacing: 0.16em; text-transform: uppercase; color: ${GOLD};
      }
      .home-title {
        font-family: 'Space Grotesk', sans-serif; font-weight: 700; color: ${INK};
        letter-spacing: -0.01em;
      }
      .home-title .foil {
        background: ${GOLD_GRADIENT}; background-size: 260% 100%;
        -webkit-background-clip: text; background-clip: text; color: transparent;
        animation: homeFoilSweep 7s ease-in-out infinite;
      }
      @keyframes homeFoilSweep {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }

      .home-route-divider { position: relative; max-width: 1280px; margin: 0 auto; padding: 0 24px; }
      .home-route-divider::before { content: ''; display: block; height: 0; border-top: 1.5px dashed ${LINE}; }
      .home-route-divider.on-dark::before { border-top-color: rgba(216,184,114,0.3); }
      .home-route-divider .waypoint {
        position: absolute; left: 50%; top: 0; transform: translate(-50%, -50%);
        width: 8px; height: 8px; border-radius: 50%; background: ${GOLD};
        box-shadow: 0 0 0 4px var(--dot-bg, ${PAPER});
      }

      /* --- ticket-stub card used for services: icon now inverts on
             hover (soft gold chip → deep route fill) instead of the
             previous route-on-route combination that read muddy --- */
      .leg-card {
        position: relative; border-radius: 8px; background: #ffffff;
        border: 1px solid ${LINE}; padding: 30px 24px 26px; overflow: hidden;
        transition: transform .35s ${EASE}, box-shadow .35s ${EASE}, border-color .35s ${EASE};
      }
      .leg-card::before {
        content: ''; position: absolute; left: 0; right: 0; top: 0; height: 3px;
        background: ${GOLD_GRADIENT}; background-size: 220% 100%;
        transform: scaleX(0); transform-origin: left;
        transition: transform .45s ${EASE};
      }
      .leg-card:hover { transform: translateY(-6px); box-shadow: 0 30px 54px -26px rgba(30,58,120,0.24); border-color: ${GOLD}; }
      .leg-card:hover::before { transform: scaleX(1); }
      .leg-tag {
        font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 600;
        letter-spacing: 0.1em; color: ${MUTED};
        position: absolute; top: 22px; right: 22px;
      }
      .leg-icon {
        width: 52px; height: 52px; border-radius: 14px;
        background: ${GOLD_TINT}; border: 1px solid rgba(168,129,47,0.3);
        color: ${ROUTE};
        display: flex; align-items: center; justify-content: center;
        margin-bottom: 22px;
        transition: transform .35s ${EASE}, background-color .35s ${EASE}, color .35s ${EASE}, border-color .35s ${EASE};
      }
      .leg-card:hover .leg-icon { transform: translateY(-3px) rotate(-4deg); background: ${ROUTE}; border-color: ${ROUTE}; color: ${PAPER}; }

      /* --- flight plan: five gates connected by a single route line,
             standing in for a generic "how it works" step-list --- */
      .flight-plan { position: relative; }
      .flight-plan-line {
        position: absolute; left: 6%; right: 6%; top: 27px; height: 0;
        border-top: 1.5px dashed ${LINE}; z-index: 0;
      }
      @media (max-width: 900px) {
        .flight-plan-line { display: none; }
      }
      .gate-card { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; text-align: center; }
      .gate-icon {
        width: 56px; height: 56px; border-radius: 50%;
        background: ${PAPER}; border: 1.5px solid ${GOLD};
        color: ${ROUTE};
        display: flex; align-items: center; justify-content: center;
        margin-bottom: 16px; position: relative;
        box-shadow: 0 0 0 6px ${PAPER};
        transition: transform .35s ${EASE}, background-color .35s ${EASE}, color .35s ${EASE};
      }
      .gate-card:hover .gate-icon { transform: translateY(-4px) scale(1.06); background: ${ROUTE}; color: ${PAPER}; }
      .gate-label {
        font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700;
        letter-spacing: 0.14em; color: ${GOLD}; text-transform: uppercase; margin-bottom: 6px;
      }
      .gate-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 14.5px; color: ${INK}; margin-bottom: 6px; }
      .gate-desc { font-size: 12.5px; line-height: 1.55; color: ${MUTED}; max-width: 190px; }

      /* --- destination card --- */
      .dest-card {
        position: relative; border-radius: 6px; background: #ffffff;
        border: 1px solid ${LINE}; padding: 18px 14px 16px; text-align: center;
        height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;
        transition: transform .35s ${EASE}, box-shadow .35s ${EASE}, border-color .35s ${EASE};
      }
      .dest-card:hover { transform: translateY(-5px); box-shadow: 0 26px 46px -24px rgba(30,58,120,0.26); border-color: ${GOLD}; }
      .dest-code {
        font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 11px;
        letter-spacing: 0.14em; color: ${GOLD}; display: block; margin-top: 10px;
      }
      .dest-divider { border-top: 1px dashed ${LINE}; margin: 10px 0 8px; width: 100%; }
      .dest-name {
        font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 13.5px; color: ${INK};
        line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
        overflow: hidden; min-height: 2.7em;
      }

      /* --- why choose us: a light paper panel with the exact same
             field wash as the Hero (sapphire + gilt radial glow over
             the dot-grid chart texture), so this section reads as a
             return to the hero rather than a dark interruption --- */
      .paper-panel {
        position: relative; border-radius: 14px; background: ${PAPER_DIM};
        border: 1px solid ${LINE}; overflow: hidden;
      }
      .paper-panel::before {
        content: ''; position: absolute; inset: 0;
        background-image:
          radial-gradient(ellipse 640px 340px at 8% 0%, ${ROUTE_TINT} 0%, transparent 62%),
          radial-gradient(ellipse 520px 320px at 100% 100%, ${GOLD_TINT} 0%, transparent 60%);
        pointer-events: none;
      }
      .paper-panel::after {
        content: ''; position: absolute; inset: 0;
        background-image: radial-gradient(${LINE} 1px, transparent 1px);
        background-size: 24px 24px;
        -webkit-mask-image: radial-gradient(ellipse 700px 420px at 30% 20%, #000 0%, transparent 72%);
        mask-image: radial-gradient(ellipse 700px 420px at 30% 20%, #000 0%, transparent 72%);
        opacity: 0.55; pointer-events: none;
      }
      .why-card {
        position: relative; border-radius: 8px; background: #ffffff;
        border: 1px solid ${LINE}; padding: 24px;
        transition: transform .35s ${EASE}, border-color .35s ${EASE}, box-shadow .35s ${EASE};
      }
      .why-card:hover { transform: translateY(-4px); border-color: ${GOLD}; box-shadow: 0 26px 46px -26px rgba(30,58,120,0.22); }
      .why-icon {
        width: 40px; height: 40px; border-radius: 10px;
        background: ${GOLD_TINT}; border: 1px solid rgba(168,129,47,0.3);
        display: flex; align-items: center; justify-content: center; margin-bottom: 16px;
      }
      .why-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 14.5px; color: ${INK}; margin-bottom: 8px; }
      .why-desc { font-size: 13px; line-height: 1.6; color: ${MUTED}; }

      /* --- tools & resources: same premium treatment as the Services
             cards (inverting icon, gilt top accent, corner tag) so a
             2-up row still reads as substantial rather than sparse --- */
      .tool-card {
        position: relative; border-radius: 8px; background: #ffffff;
        border: 1px solid ${LINE}; overflow: hidden;
        padding: 32px 28px 28px; display: flex; flex-direction: column; gap: 14px;
        transition: transform .35s ${EASE}, box-shadow .35s ${EASE}, border-color .35s ${EASE};
      }
      .tool-card::before {
        content: ''; position: absolute; left: 0; right: 0; top: 0; height: 3px;
        background: ${GOLD_GRADIENT}; background-size: 220% 100%;
        transform: scaleX(0); transform-origin: left;
        transition: transform .45s ${EASE};
      }
      .tool-card:hover { transform: translateY(-6px); box-shadow: 0 30px 54px -26px rgba(30,58,120,0.24); border-color: ${GOLD}; }
      .tool-card:hover::before { transform: scaleX(1); }
      .tool-tag {
        font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 600;
        letter-spacing: 0.1em; color: ${MUTED};
        position: absolute; top: 24px; right: 24px;
      }
      .tool-icon {
        width: 52px; height: 52px; border-radius: 14px;
        background: ${GOLD_TINT}; border: 1px solid rgba(168,129,47,0.3);
        color: ${ROUTE};
        display: flex; align-items: center; justify-content: center;
        transition: transform .35s ${EASE}, background-color .35s ${EASE}, color .35s ${EASE}, border-color .35s ${EASE};
      }
      .tool-card:hover .tool-icon { transform: translateY(-3px) rotate(-4deg); background: ${ROUTE}; border-color: ${ROUTE}; color: ${PAPER}; }
      .tool-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 17px; color: ${INK}; }
      .tool-desc { font-size: 13.5px; line-height: 1.6; color: ${MUTED}; }

      .home-link {
        position: relative; display: inline-flex; align-items: center; gap: 5px;
        padding-bottom: 3px; font-weight: 600;
        transition: gap .25s ${EASE};
      }
      .home-link::after {
        content: ''; position: absolute; left: 0; bottom: 0; height: 1.5px; width: 0;
        background: ${GOLD_GRADIENT};
        transition: width .35s ${EASE};
      }
      .home-link:hover { gap: 8px; }
      .home-link:hover::after { width: 100%; }

      /* --- contact tiles: clickable cards for email / whatsapp / location,
             matching the same icon-chip + gilt-top-accent language as the
             Services and Tools cards so Contact feels native to the page
             instead of a bolted-on plain list --- */
      .contact-tile {
        position: relative; display: block; border-radius: 10px; background: #ffffff;
        border: 1px solid ${LINE}; padding: 28px 24px 26px; overflow: hidden;
        text-align: center; height: 100%;
        transition: transform .35s ${EASE}, box-shadow .35s ${EASE}, border-color .35s ${EASE};
      }
      .contact-tile::before {
        content: ''; position: absolute; left: 0; right: 0; top: 0; height: 3px;
        background: ${GOLD_GRADIENT}; background-size: 220% 100%;
        transform: scaleX(0); transform-origin: left;
        transition: transform .45s ${EASE};
      }
      .contact-tile:hover { transform: translateY(-6px); box-shadow: 0 30px 54px -26px rgba(30,58,120,0.24); border-color: ${GOLD}; }
      .contact-tile:hover::before { transform: scaleX(1); }
      .contact-tile-icon {
        width: 52px; height: 52px; border-radius: 14px;
        background: ${GOLD_TINT}; border: 1px solid rgba(168,129,47,0.3);
        color: ${ROUTE};
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto 18px;
        transition: transform .35s ${EASE}, background-color .35s ${EASE}, color .35s ${EASE}, border-color .35s ${EASE};
      }
      .contact-tile:hover .contact-tile-icon { transform: translateY(-3px) rotate(-4deg); background: ${ROUTE}; border-color: ${ROUTE}; color: ${PAPER}; }
      .contact-tile-label {
        font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 600;
        letter-spacing: 0.14em; text-transform: uppercase; color: ${GOLD}; margin-bottom: 8px;
      }
      .contact-tile-value {
        font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15.5px;
        color: ${INK}; line-height: 1.4; word-break: break-word;
      }
      .contact-tile-note { margin-top: 7px; font-size: 12.5px; color: ${MUTED}; line-height: 1.5; }

      html { scroll-behavior: smooth; }

      /* --- boarding call: closing CTA, now recoloured to the exact
             same light "paper panel" wash as the "Built on trust"
             section — PAPER_DIM base, sapphire glow top-left, gold
             glow bottom-right, same faint dot-grid texture — so the
             page closes in the same calm paper tone it opened in. --- */
      .boarding-panel {
        position: relative; border-radius: 14px; overflow: hidden;
        background: ${PAPER_DIM};
        border: 1px solid ${LINE};
        padding: 56px 32px;
        text-align: center;
      }
      .boarding-panel::before {
        content: ''; position: absolute; inset: 0;
        background-image:
          radial-gradient(ellipse 640px 340px at 8% 0%, ${ROUTE_TINT} 0%, transparent 62%),
          radial-gradient(ellipse 520px 320px at 100% 100%, ${GOLD_TINT} 0%, transparent 60%);
        pointer-events: none;
      }
      .boarding-panel::after {
        content: ''; position: absolute; inset: 0;
        background-image: radial-gradient(${LINE} 1px, transparent 1px);
        background-size: 24px 24px;
        -webkit-mask-image: radial-gradient(ellipse 700px 420px at 30% 20%, #000 0%, transparent 72%);
        mask-image: radial-gradient(ellipse 700px 420px at 30% 20%, #000 0%, transparent 72%);
        opacity: 0.55; pointer-events: none;
      }
      .boarding-plane {
        position: absolute; top: 18%; left: -6%;
        color: ${GOLD}; opacity: 0.9;
        animation: boardingFly 5.5s ${EASE} infinite;
      }
      @keyframes boardingFly {
        0% { transform: translateX(0) translateY(0) rotate(8deg); opacity: 0; }
        10% { opacity: 0.9; }
        90% { opacity: 0.9; }
        100% { transform: translateX(112vw) translateY(-34px) rotate(8deg); opacity: 0; }
      }
      .boarding-eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: ${GOLD}; }
      .boarding-cta {
        position: relative; display: inline-flex; align-items: center; gap: 9px;
        margin-top: 26px; padding: 15px 30px; border-radius: 10px;
        background: ${GOLD_GRADIENT}; background-size: 220% 100%;
        color: ${INK}; font-size: 14px; font-weight: 700;
        cursor: pointer;
        transition: background-position .5s ${EASE}, transform .25s ${EASE}, box-shadow .3s ${EASE};
        box-shadow: 0 20px 40px -20px rgba(30,58,120,0.35), 0 0 0 0 rgba(168,129,47,0.4);
        animation: boardingPulse 2.8s ${EASE} infinite;
      }
      .boarding-cta:hover { background-position: 100% 0; transform: translateY(-2px); animation-play-state: paused; }
      .boarding-cta:active { transform: translateY(0) scale(.98); }
      @keyframes boardingPulse {
        0% { box-shadow: 0 20px 40px -20px rgba(30,58,120,0.35), 0 0 0 0 rgba(168,129,47,0.35); }
        70% { box-shadow: 0 20px 40px -20px rgba(30,58,120,0.35), 0 0 0 14px rgba(168,129,47,0); }
        100% { box-shadow: 0 20px 40px -20px rgba(30,58,120,0.35), 0 0 0 0 rgba(168,129,47,0); }
      }

      @media (max-width: 640px) {
        .boarding-panel { padding: 40px 20px; border-radius: 10px; }
        .boarding-cta { width: 100%; justify-content: center; padding: 14px 22px; }
      }

      @media (prefers-reduced-motion: reduce) {
        .home-root *, .home-root *::before, .home-root *::after {
          transition-duration: 0.001ms !important;
          animation-duration: 0.001ms !important;
        }
        .home-reveal { opacity: 1 !important; transform: none !important; }
        .boarding-plane { display: none; }
        .boarding-cta { animation: none !important; }
        html { scroll-behavior: auto; }
      }
    `}</style>
  );
}

/* ---------------------------- pieces ---------------------------- */

function RouteDivider({ bg = PAPER, dark = false }) {
  return (
    <div className={`home-route-divider ${dark ? 'on-dark' : ''}`} aria-hidden="true">
      <span className="waypoint" style={{ '--dot-bg': bg }} />
    </div>
  );
}

function SectionHeading({ eyebrow, title, emphasis, sub, light = false }) {
  return (
    <Reveal className="flex flex-col items-center text-center mb-14">
      {eyebrow && (
        <span className="home-eyebrow">
          <span className="home-eyebrow-dot" style={light ? { boxShadow: '0 0 0 3px rgba(216,184,114,0.18)' } : undefined} />
          <span className="home-eyebrow-label" style={light ? { color: GOLD_SOFT } : undefined}>{eyebrow}</span>
        </span>
      )}
      <h2 className="home-title mt-4 text-3xl md:text-4xl" style={light ? { color: PAPER } : undefined}>
        {title} {emphasis && <span className="foil">{emphasis}</span>}
      </h2>
      {sub && (
        <p className="mt-4 max-w-xl text-sm leading-relaxed" style={{ color: light ? 'rgba(250,249,245,0.62)' : MUTED }}>
          {sub}
        </p>
      )}
    </Reveal>
  );
}

function ServiceCard({ icon: Icon, num, title, desc, delay }) {
  return (
    <Reveal delay={delay}>
      <div className="leg-card h-full">
        <span className="leg-tag">LEG {num}</span>
        <div className="leg-icon">
          <Icon size={22} color="currentColor" strokeWidth={1.75} />
        </div>
        <h3 className="text-base font-bold mb-2" style={{ color: INK, fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{desc}</p>
      </div>
    </Reveal>
  );
}

function GateCard({ icon: Icon, label, title, desc, delay }) {
  return (
    <Reveal delay={delay}>
      <div className="gate-card">
        <div className="gate-icon">
          <Icon size={20} color="currentColor" strokeWidth={1.75} />
        </div>
        <span className="gate-label">{label}</span>
        <span className="gate-title">{title}</span>
        <span className="gate-desc">{desc}</span>
      </div>
    </Reveal>
  );
}

function Flag({ children }) {
  return (
    <div
      className="rounded overflow-hidden flex-shrink-0 mx-auto"
      style={{ width: 56, height: 40, boxShadow: '0 2px 6px rgba(10,15,31,0.16)', border: '1px solid rgba(10,15,31,0.08)' }}
    >
      {children}
    </div>
  );
}

function GermanyFlag() {
  return <Flag><div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <div style={{ flex: 1, background: '#1a1a1a' }} /><div style={{ flex: 1, background: '#DD0000' }} /><div style={{ flex: 1, background: '#FFCE00' }} />
  </div></Flag>;
}
function HungaryFlag() {
  return <Flag><div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <div style={{ flex: 1, background: '#CE2939' }} /><div style={{ flex: 1, background: '#ffffff' }} /><div style={{ flex: 1, background: '#477050' }} />
  </div></Flag>;
}
function SouthKoreaFlag() {
  return <Flag><div style={{ height: '100%', width: '100%', background: '#ffffff', position: 'relative' }}>
    <div style={{ position: 'absolute', top: '50%', left: '50%', width: 18, height: 18, transform: 'translate(-50%,-50%)', borderRadius: '9999px', overflow: 'hidden', background: 'conic-gradient(#C60C30 0deg 180deg, #003478 180deg 360deg)' }} />
  </div></Flag>;
}
function EstoniaFlag() {
  return <Flag><div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <div style={{ flex: 1, background: '#0072CE' }} /><div style={{ flex: 1, background: '#000000' }} /><div style={{ flex: 1, background: '#ffffff' }} />
  </div></Flag>;
}
function SpainFlag() {
  return <Flag><div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <div style={{ flex: 1, background: '#AA151B' }} /><div style={{ flex: 2, background: '#F1BF00' }} /><div style={{ flex: 1, background: '#AA151B' }} />
  </div></Flag>;
}
function ItalyFlag() {
  return <Flag><div style={{ height: '100%', display: 'flex' }}>
    <div style={{ flex: 1, background: '#008C45' }} /><div style={{ flex: 1, background: '#ffffff' }} /><div style={{ flex: 1, background: '#CD212A' }} />
  </div></Flag>;
}
function EUFlag() {
  const dots = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
    return { left: `${50 + 34 * Math.cos(angle)}%`, top: `${50 + 34 * Math.sin(angle)}%` };
  });
  return <Flag><div style={{ height: '100%', width: '100%', background: '#003399', position: 'relative' }}>
    {dots.map((pos, i) => <span key={i} style={{ position: 'absolute', width: 4, height: 4, borderRadius: '9999px', background: '#FFCC00', left: pos.left, top: pos.top, transform: 'translate(-50%,-50%)' }} />)}
  </div></Flag>;
}

function DestinationCard({ flag, code, name, delay }) {
  return (
    <Reveal delay={delay} className="h-full">
      <div className="dest-card">
        {flag}
        <span className="dest-code">{code}</span>
        <div className="dest-divider" />
        <span className="dest-name">{name}</span>
      </div>
    </Reveal>
  );
}

function WhyCard({ icon: Icon, title, desc, delay }) {
  return (
    <Reveal delay={delay}>
      <div className="why-card h-full">
        <div className="why-icon"><Icon size={18} color={ROUTE} strokeWidth={1.75} /></div>
        <div className="why-title">{title}</div>
        <div className="why-desc">{desc}</div>
      </div>
    </Reveal>
  );
}

function ToolCard({ icon: Icon, tag, title, desc, linkLabel, href, delay }) {
  return (
    <Reveal delay={delay}>
      <div className="tool-card h-full">
        {tag && <span className="tool-tag">{tag}</span>}
        <div className="tool-icon">
          <Icon size={24} color="currentColor" strokeWidth={1.75} />
        </div>
        <h3 className="tool-title">{title}</h3>
        <p className="tool-desc">{desc}</p>
        <a href={href} className="home-link text-sm mt-1" style={{ color: ROUTE }}>
          {linkLabel} <ArrowRight size={14} />
        </a>
      </div>
    </Reveal>
  );
}

function ContactTile({ icon: Icon, label, value, note, href, external, delay }) {
  return (
    <Reveal delay={delay} className="h-full">
      <a
        className="contact-tile"
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        <div className="contact-tile-icon">
          <Icon size={22} color="currentColor" strokeWidth={1.75} />
        </div>
        <div className="contact-tile-label">{label}</div>
        <div className="contact-tile-value">{value}</div>
        {note && <div className="contact-tile-note">{note}</div>}
      </a>
    </Reveal>
  );
}

/* Brand mark for WhatsApp — kept local (same as the Contact page) so
   the home page has no dependency on an external icon set for it. */
function WhatsAppIcon({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M16.02 3C9.4 3 4 8.4 4 15.02c0 2.23.6 4.34 1.73 6.2L3 29l7.94-2.66a11.94 11.94 0 0 0 5.08 1.14h.01c6.62 0 12.02-5.4 12.02-12.02C28.05 8.4 22.65 3 16.02 3zm0 21.78h-.01a9.7 9.7 0 0 1-4.95-1.36l-.35-.21-4.7 1.57 1.58-4.58-.23-.37a9.72 9.72 0 0 1-1.5-5.21c0-5.38 4.38-9.76 9.77-9.76 2.61 0 5.06 1.02 6.9 2.86a9.68 9.68 0 0 1 2.86 6.9c0 5.39-4.39 9.76-9.77 9.76zm5.35-7.32c-.29-.15-1.73-.85-2-.95-.27-.1-.46-.15-.66.15-.2.29-.76.95-.93 1.14-.17.2-.34.22-.63.07-.29-.15-1.24-.46-2.36-1.46-.87-.78-1.46-1.73-1.63-2.02-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.19-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.66-1.58-.9-2.17-.24-.57-.48-.49-.66-.5h-.56c-.2 0-.51.07-.78.37-.27.29-1.02 1-1.02 2.44s1.05 2.83 1.2 3.02c.15.2 2.06 3.15 5 4.41.7.3 1.24.48 1.67.62.7.22 1.34.19 1.84.11.56-.08 1.73-.71 1.98-1.39.24-.68.24-1.27.17-1.39-.07-.13-.26-.2-.55-.35z" />
    </svg>
  );
}

/* ---------------------------- page ---------------------------- */

export default function Home() {
  useEffect(() => {
    // Browsers restore the previous scroll position on refresh by default
    // (scrollRestoration: 'auto'). Turn that off and force the page to
    // open at the top instead, the way a fresh page load should behave.
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  const destinations = [
    { flag: <GermanyFlag />, code: 'DE', name: 'Germany' },
    { flag: <HungaryFlag />, code: 'HU', name: 'Hungary' },
    { flag: <SouthKoreaFlag />, code: 'KR', name: 'South Korea' },
    { flag: <EstoniaFlag />, code: 'EE', name: 'Estonia' },
    { flag: <SpainFlag />, code: 'ES', name: 'Spain' },
    { flag: <ItalyFlag />, code: 'IT', name: 'Italy' },
    { flag: <EUFlag />, code: 'EU', name: 'Other European Countries' },
  ];

  return (
    <div className="home-root">
      <GlobalStyle />

      <Navbar />
      <Hero />

      <RouteDivider bg={PAPER} />

      {/* OUR SERVICES */}
      <section id="services" className="max-w-7xl mx-auto px-6 py-20">
        <SectionHeading
          eyebrow="A four-leg journey"
          title="Our"
          emphasis="Services"
          sub="Everything between deciding to study abroad and unpacking your bags on the other side, handled as one continuous route rather than separate errands."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ServiceCard icon={GraduationCap} num="01" title="Admission Support" desc="We help you apply for Bachelor's, Master's and language programs." delay={0} />
          <ServiceCard icon={Globe2} num="02" title="Visa Processing" desc="Complete visa guidance and documentation support." delay={80} />
          <ServiceCard icon={FileText} num="03" title="Course & University Guidance" desc="Personalized guidance to choose the right course and university." delay={160} />
          <ServiceCard icon={Headphones} num="04" title="Pre-Departure Support" desc="We guide you for a smooth journey to your dream destination." delay={240} />
        </div>
      </section>

      <RouteDivider bg={PAPER} />

      {/* HOW IT WORKS — flight plan */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <SectionHeading
          eyebrow="Your itinerary"
          title="How the"
          emphasis="Journey Unfolds"
          sub="Five gates, in order, from first conversation to landing card in hand. No step is skipped, and no step is a surprise."
        />
        <div className="flight-plan grid grid-cols-2 md:grid-cols-5 gap-y-12 gap-x-6">
          <div className="flight-plan-line" aria-hidden="true" />
          <GateCard icon={MessageCircle} label="Gate 01" title="Free Consultation" desc="We map your goals, budget and background before naming a single university." delay={0} />
          <GateCard icon={Compass} label="Gate 02" title="Course & University Match" desc="A shortlist built around where you'll actually get in and thrive." delay={80} />
          <GateCard icon={ClipboardCheck} label="Gate 03" title="Application & Documents" desc="We prepare, check and submit every document so nothing bounces back." delay={160} />
          <GateCard icon={Stamp} label="Gate 04" title="Visa Processing" desc="Interview prep and paperwork handled with the embassy's checklist in hand." delay={240} />
          <GateCard icon={Luggage} label="Gate 05" title="Pre-Departure & Arrival" desc="Flights, housing and the first-week checklist, sorted before you fly." delay={320} />
        </div>
      </section>

      <RouteDivider bg={PAPER} />

      {/* STUDY DESTINATIONS */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <SectionHeading eyebrow="Where students land" title="Study" emphasis="Destinations" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-5">
          {destinations.map((d, i) => (
            <DestinationCard key={d.name} {...d} delay={i * 60} />
          ))}
        </div>
      </section>

      <RouteDivider bg={PAPER} />

      {/* WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <Reveal>
          <div className="paper-panel">
            <div className="relative p-8 lg:p-12">
              <SectionHeading
                eyebrow="Why Euro Feather"
                title="Built on"
                emphasis="trust"
                sub="Not a generic package — a plan built around your grades, your budget and your goals, backed by people who stay reachable after you land."
              />
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <WhyCard icon={Users} title="One-on-one counseling" desc="Every plan is shaped around you, not a template." delay={0} />
                <WhyCard icon={ShieldCheck} title="Transparent charges" desc="Every fee shown up front, with nothing added later." delay={80} />
                <WhyCard icon={Award} title="Recognized network" desc="Only H+, H- and H+/- listed, recognized universities." delay={160} />
                <WhyCard icon={Headphones} title="Support past arrival" desc="We stay reachable well beyond the visa stamp." delay={240} />
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <RouteDivider bg={PAPER} />

      {/* TOOLS & RESOURCES */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <Reveal delay={0}>
          <div className="paper-panel">
            <div className="relative p-8 lg:p-12">
              <div className="flex flex-col items-center text-center mb-14">
                <span className="home-eyebrow">
                  <span className="home-eyebrow-dot" />
                  <span className="home-eyebrow-label">Plan ahead</span>
                </span>
                <h2 className="mt-4 text-3xl md:text-4xl" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: INK }}>
                  Tools &amp; <span className="foil">Resources</span>
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-8">
                <ToolCard icon={RefreshCw} tag="TOOL 01" title="CGPA Converter" desc="Convert your Bangladeshi CGPA into the equivalent German grading scale in seconds." linkLabel="Convert Now" href="/resources/cgpa-converter" delay={0} />
                <ToolCard icon={Landmark} tag="TOOL 02" title="Recognized Universities" desc="Browse the full H+, H- and H+/- listed universities recognized by German authorities." linkLabel="View List" href="/resources/recognized-universities" delay={100} />
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <RouteDivider bg={PAPER} />

      {/* CONTACT */}
      <section id="contact" className="max-w-7xl mx-auto px-6 py-20">
        <SectionHeading
          eyebrow="We're one message away"
          title="Get in"
          emphasis="Touch"
          sub="However you reach us, it starts the same journey."
        />
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <ContactTile
            icon={Mail}
            label="Email"
            value="eurofeather.de@gmail.com"
            note="We reply within 24 hours"
            href="mailto:eurofeather.de@gmail.com"
            delay={0}
          />
          <ContactTile
            icon={WhatsAppIcon}
            label="WhatsApp"
            value="+49 1573 7419397"
            note="Quick, informal questions"
            href="https://wa.me/4915737419397"
            external
            delay={80}
          />
          <ContactTile
            icon={MapPin}
            label="Location"
            value="Frankfurt, Germany"
            note="Visits by appointment"
            href="https://www.openstreetmap.org/?mlat=50.1109&mlon=8.6821#map=13/50.1109/8.6821"
            external
            delay={160}
          />
        </div>
      </section>

      {/* BOARDING CALL — closing CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <Reveal>
          <div className="boarding-panel">
            <Plane size={22} className="boarding-plane" />
            <span className="boarding-eyebrow">Final Call</span>
            <h2 className="mt-4 text-3xl md:text-4xl" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: INK }}>
              Your seat to Europe is waiting.
            </h2>
            <p className="mt-4 max-w-lg mx-auto text-sm leading-relaxed" style={{ color: MUTED }}>
              Talk to a counselor today and get a clear, honest plan for your application — no obligation, no pressure.
            </p>
            <a href="/consultation" className="boarding-cta">
              Book Your Free Consultation <ArrowRight size={16} />
            </a>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}