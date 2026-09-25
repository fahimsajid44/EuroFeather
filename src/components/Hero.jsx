import { useEffect, useState } from 'react';
import { ArrowRight, Plane } from 'lucide-react';
import logo from '../assets/Euro_Feather_Logo_No_BG.png';

/* ---------------------------------------------------------------
   DESIGN TOKENS — shared with Navbar's "The Route" system.
   Same paper field, sapphire route, and gilt accent, so the hero
   reads as a continuation of the header rather than a new site.
   Class names below are namespaced with "hero-" so this component's
   plain <style> tag never collides with Navbar's identical tokens.
------------------------------------------------------------------*/
const INK = '#0A0F1F';
const PAPER = '#FAF9F5';
const PAPER_DIM = '#F1EFE7';
const ROUTE = '#1E3A78';
const ROUTE_DEEP = '#0B1B44';
const ROUTE_TINT = '#EEF1F9';
const GOLD = '#A8812F';
const GOLD_SOFT = '#D8B872';
const GOLD_TINT = '#FBF4E3';
const LINE = '#E3E0D4';
const LINE_SOFT = '#EAE7DB';
const MUTED = '#84806E';

const GOLD_GRADIENT = `linear-gradient(115deg, ${GOLD} 0%, ${GOLD_SOFT} 45%, ${GOLD} 70%, ${GOLD_SOFT} 100%)`;
const EASE = 'cubic-bezier(.16,1,.3,1)';
const EASE_FLIGHT = 'cubic-bezier(.45,.05,.55,.95)';

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');

      .hero-root { font-family: 'Inter', sans-serif; background: ${PAPER}; }

      /* --- ambient field: layered wash + a faint cartographic dot-grid,
             like the paper of a flight-planning chart, fading toward the edges --- */
      .hero-field { position: absolute; inset: 0; overflow: hidden; }
      .hero-field-wash {
        position: absolute; inset: 0;
        background-image:
          radial-gradient(ellipse 720px 480px at 90% 4%, ${ROUTE_TINT} 0%, transparent 60%),
          radial-gradient(ellipse 600px 420px at 4% 100%, ${GOLD_TINT} 0%, transparent 58%),
          radial-gradient(ellipse 900px 700px at 50% 50%, rgba(255,255,255,0.5) 0%, transparent 70%);
      }
      .hero-field-grid {
        position: absolute; inset: -10%;
        background-image: radial-gradient(${LINE_SOFT} 1px, transparent 1px);
        background-size: 26px 26px;
        -webkit-mask-image: radial-gradient(ellipse 900px 620px at 68% 30%, #000 0%, transparent 72%);
        mask-image: radial-gradient(ellipse 900px 620px at 68% 30%, #000 0%, transparent 72%);
        opacity: 0.7;
      }
      /* a faint great-circle arc, like a chart line spanning the whole field */
      .hero-field-arc {
        position: absolute; inset: 0; opacity: 0.5;
      }
      .hero-field-arc path { stroke: ${LINE}; stroke-width: 1; fill: none; }

      /* --- the flight path: draws itself in once on load, then a plane
             glyph travels the exact curve with natural cornering --- */
      .hero-path { position: absolute; inset: 0; pointer-events: none; overflow: visible; }
      .hero-path-line {
        stroke: ${LINE}; stroke-width: 1.5; stroke-linecap: round;
        fill: none;
        stroke-dasharray: 1400;
        stroke-dashoffset: 1400;
        animation: heroDrawPath 2.6s ${EASE} .5s forwards;
      }
      .hero-path-dot { fill: ${LINE}; }
      .hero-path-dot.is-gold { fill: ${GOLD}; }
      .hero-path-dot-pulse {
        fill: none; stroke: ${GOLD}; stroke-width: 1.5; opacity: 0;
        animation: heroPingDot 2.8s ${EASE} 3.2s infinite;
      }
      @keyframes heroDrawPath { to { stroke-dashoffset: 0; } }
      @keyframes heroPingDot {
        0% { opacity: 0.55; r: 4.5; }
        70% { opacity: 0; r: 15; }
        100% { opacity: 0; r: 15; }
      }

      .hero-plane {
        offset-path: path('M -40 480 C 180 560, 260 320, 460 300 S 760 120, 860 40');
        offset-rotate: auto;
        offset-distance: 0%;
        animation: heroFlyPath 6.5s ${EASE_FLIGHT} 3.1s infinite;
        color: ${GOLD};
        filter: drop-shadow(0 3px 6px rgba(168,129,47,0.35));
      }
      @keyframes heroFlyPath {
        0% { offset-distance: 0%; opacity: 0; }
        6% { opacity: 1; }
        92% { opacity: 1; }
        100% { offset-distance: 100%; opacity: 0; }
      }

      /* --- eyebrow --- */
      .hero-eyebrow-line { width: 30px; height: 1px; background: ${GOLD}; }

      /* --- foil sweep for the one gilt word in the headline --- */
      .foil-text {
        background: ${GOLD_GRADIENT};
        background-size: 260% 100%;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        animation: heroFoilSweep 7s ease-in-out infinite;
      }
      @keyframes heroFoilSweep {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }

      /* --- primary / ghost CTAs, same visual family as the navbar's route-cta --- */
      .hero-cta-primary {
        display: inline-flex; align-items: center; gap: 9px;
        padding: 14px 26px; border-radius: 10px;
        background: ${ROUTE};
        border: 1px solid ${ROUTE};
        color: ${PAPER}; font-size: 14px; font-weight: 600; letter-spacing: 0.01em;
        box-shadow: 0 14px 28px -14px rgba(30,58,120,0.5);
        transition: background-color .3s ${EASE}, border-color .3s ${EASE}, transform .25s ${EASE}, box-shadow .3s ${EASE};
      }
      .hero-cta-primary:hover { background: ${ROUTE_DEEP}; border-color: ${ROUTE_DEEP}; transform: translateY(-2px); box-shadow: 0 18px 32px -14px rgba(11,27,68,0.55); }
      .hero-cta-primary svg { transition: transform .25s ${EASE}, color .25s ${EASE}; }
      .hero-cta-primary:hover svg { transform: translateX(4px); color: ${GOLD_SOFT}; }

      .hero-cta-ghost {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 14px 24px; border-radius: 10px;
        background: transparent; color: ${INK};
        font-size: 14px; font-weight: 600;
        border: 1px solid ${LINE};
        transition: border-color .25s ${EASE}, background-color .25s ${EASE}, color .25s ${EASE};
      }
      .hero-cta-ghost:hover { border-color: ${ROUTE}; background: ${ROUTE_TINT}; color: ${ROUTE}; }

      /* --------------------------------------------------------------
         THE EMBLEM — same DNA as the navbar's logo mark, scaled up
         further still: a static track ring, a flowing dashed route
         that eases in and out rather than spinning at a flat rate,
         and a gilt waypoint tracing its own orbit with a soft trail.
      --------------------------------------------------------------- */
      .hero-mark { position: relative; width: 440px; height: 440px; flex-shrink: 0; }
      .hero-mark svg { position: absolute; inset: 0; display: block; overflow: visible; }
      .hero-ring-outer { stroke: ${LINE_SOFT}; }
      .hero-ring-track { stroke: ${LINE}; }
      .hero-ring-ticks { stroke: ${GOLD}; opacity: 0.5; }
      .hero-ring-path {
        stroke: ${ROUTE};
        stroke-dasharray: 4 13;
        stroke-linecap: round;
        animation: heroRouteFlow 6s ${EASE_FLIGHT} infinite;
      }
      @keyframes heroRouteFlow { to { stroke-dashoffset: -68; } }

      .hero-waypoint-orbit {
        position: absolute; inset: 0; margin: auto;
        width: 1px; height: 1px;
        animation: heroOrbitSpin 10s ${EASE_FLIGHT} infinite;
      }
      @keyframes heroOrbitSpin { to { transform: rotate(360deg); } }
      .hero-waypoint {
        position: absolute; top: -50%; left: 50%;
        width: 10px; height: 10px; border-radius: 50%;
        background: ${GOLD};
        transform: translate(-50%, calc(-1 * var(--hero-orbit-r)));
        box-shadow: 0 0 0 4px ${PAPER}, 0 0 14px 2px rgba(168,129,47,0.5);
      }
      .hero-waypoint-trail {
        position: absolute; top: -50%; left: 50%;
        width: 5px; height: 5px; border-radius: 50%;
        background: ${GOLD_SOFT}; opacity: 0.45;
        transform: translate(-50%, calc(-1 * var(--hero-orbit-r))) rotate(-22deg) translateY(0);
      }

      .hero-face {
        position: absolute; inset: 24%; border-radius: 50%;
        background: ${PAPER};
        box-shadow: 0 34px 70px -24px rgba(10,15,31,0.35), inset 0 0 0 1px ${LINE};
        display: flex; align-items: center; justify-content: center;
      }
      .hero-face img { width: 66%; height: 66%; object-fit: contain; }

      @media (max-width: 1024px) {
        .hero-mark { width: 340px; height: 340px; }
      }
      @media (max-width: 640px) {
        .hero-mark { width: 270px; height: 270px; }
      }

      /* --- boarding-pass tag chips, floating around the emblem --- */
      .hero-tag {
        display: inline-flex; align-items: center; gap: 7px;
        padding: 9px 14px; border-radius: 8px;
        font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 600; letter-spacing: 0.02em;
      }
      .hero-tag.is-dark { background: ${INK}; color: ${GOLD_SOFT}; box-shadow: 0 18px 34px -16px rgba(0,0,0,0.5); }
      .hero-tag.is-light { background: ${PAPER}; color: ${INK}; border: 1px solid ${LINE}; box-shadow: 0 16px 30px -18px rgba(10,15,31,0.2); }

      /* --- torn-edge perforation closing out the section, boarding-pass style --- */
      .hero-perf { position: relative; height: 0; border-top: 1.5px dashed ${LINE}; }
      .hero-perf::before, .hero-perf::after {
        content: ''; position: absolute; top: -9px;
        width: 18px; height: 18px; border-radius: 50%;
        background: var(--hero-perf-bg, #ffffff);
      }
      .hero-perf::before { left: -9px; }
      .hero-perf::after { right: -9px; }

      /* --- entrance --- */
      .hero-rise {
        opacity: 0; transform: translateY(18px);
        transition: opacity .7s ${EASE}, transform .7s ${EASE};
      }
      .hero-mounted .hero-rise { opacity: 1; transform: translateY(0); }

      @media (prefers-reduced-motion: reduce) {
        .hero-ring-path, .hero-waypoint-orbit, .foil-text, .hero-plane, .hero-path-line, .hero-path-dot-pulse {
          animation: none !important;
        }
        .hero-path-line { stroke-dashoffset: 0 !important; }
        .hero-plane { opacity: 1 !important; offset-distance: 46% !important; }
        .hero-rise { opacity: 1 !important; transform: none !important; transition: none !important; }
      }
    `}</style>
  );
}

/* a single dashed flight path arcing behind the hero copy: it draws
   itself in on load, waypoints already crossed sit quietly, and a
   small plane glyph makes the return trip along the exact curve,
   turning naturally with the line instead of just fading between dots */
function FlightPath() {
  return (
    <svg className="hero-path" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <path className="hero-path-line" d="M -40 480 C 180 560, 260 320, 460 300 S 760 120, 860 40" />
      <circle className="hero-path-dot" cx="260" cy="480" r="3.5" />
      <circle className="hero-path-dot" cx="460" cy="300" r="3.5" />
      <circle className="hero-path-dot is-gold" cx="700" cy="160" r="4.5" />
      <circle className="hero-path-dot-pulse" cx="700" cy="160" r="4.5" />
      <g className="hero-plane">
        <Plane size={16} fill="currentColor" strokeWidth={0} style={{ transform: 'translate(-8px, -8px) rotate(90deg)' }} />
      </g>
    </svg>
  );
}

/* a faint great-circle style arc, purely atmospheric, spanning the
   full field so the hero reads like a chart rather than empty paper */
function FieldArc() {
  return (
    <svg className="hero-field-arc" viewBox="0 0 1400 800" preserveAspectRatio="none" aria-hidden="true">
      <path d="M -60 620 Q 500 300 1460 520" strokeDasharray="1 9" />
      <path d="M -60 120 Q 700 340 1460 60" strokeDasharray="1 9" />
    </svg>
  );
}

function HeroMark() {
  return (
    <div className="hero-mark">
      <svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
        <circle className="hero-ring-outer" cx="160" cy="160" r="152" fill="none" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <circle className="hero-ring-track" cx="160" cy="160" r="138" fill="none" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
        <circle className="hero-ring-path" cx="160" cy="160" r="138" fill="none" strokeWidth="2" vectorEffect="non-scaling-stroke" transform="rotate(-90 160 160)" />
        {Array.from({ length: 40 }, (_, i) => {
          const angle = (i / 40) * 2 * Math.PI;
          const r1 = 152, r2 = i % 5 === 0 ? 140 : 146;
          const x1 = 160 + r1 * Math.cos(angle), y1 = 160 + r1 * Math.sin(angle);
          const x2 = 160 + r2 * Math.cos(angle), y2 = 160 + r2 * Math.sin(angle);
          return <line key={i} className="hero-ring-ticks" x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="1" vectorEffect="non-scaling-stroke" />;
        })}
      </svg>
      <div className="hero-waypoint-orbit" style={{ '--hero-orbit-r': '138px' }}>
        <span className="hero-waypoint-trail" style={{ '--hero-orbit-r': '138px' }} aria-hidden="true" />
        <span className="hero-waypoint" style={{ '--hero-orbit-r': '138px' }} aria-hidden="true" />
      </div>
      <div className="hero-face">
        <img src={logo} alt="Euro Feather emblem" />
      </div>
    </div>
  );
}

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className={`hero-root relative overflow-hidden ${mounted ? 'hero-mounted' : ''}`} style={{ position: 'relative' }}>
      <GlobalStyle />
      <div className="hero-field">
        <div className="hero-field-wash" />
        <div className="hero-field-grid" />
        <FieldArc />
      </div>
      <FlightPath />

      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-28 grid lg:grid-cols-2 gap-16 items-center relative">
        <div>
          <span className="inline-flex items-center gap-3 mb-6 hero-rise" style={{ transitionDelay: '.05s' }}>
            <span className="hero-eyebrow-line" />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD }}>
              European Admissions, Perfected
            </span>
          </span>

          <h1
            className="text-5xl md:text-6xl leading-[1.08] mb-6 hero-rise"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: INK, letterSpacing: '-0.01em', transitionDelay: '.12s' }}
          >
            Your future,
            <br />
            <span className="foil-text">sealed</span> in Europe.
          </h1>

          <p className="text-base leading-relaxed mb-9 max-w-md hero-rise" style={{ color: MUTED, transitionDelay: '.18s' }}>
            From your first application to the day you land — Euro Feather guides
            every step of your journey to study abroad with precision and care.
          </p>

          <div className="flex flex-wrap items-center gap-4 hero-rise" style={{ transitionDelay: '.24s' }}>
            <a href="#services" className="hero-cta-primary">
              Our Services <ArrowRight size={16} />
            </a>
            <a href="#contact" className="hero-cta-ghost">
              Contact Us
            </a>
          </div>
        </div>

        {/* Illustration: the route emblem — the same signature mark as the header, scaled up */}
        <div className="relative flex items-center justify-center hero-rise" style={{ minHeight: 440, transitionDelay: '.2s' }}>
          <HeroMark />

          <div className="hero-tag is-dark absolute" style={{ top: '2%', right: '0%' }}>
            <Plane size={12} />
            7 destinations
          </div>
          <div className="hero-tag is-light absolute" style={{ bottom: '2%', left: '-2%' }}>
            Trusted since 2020
          </div>
        </div>
      </div>

      <div className="hero-perf mx-6" style={{ '--hero-perf-bg': PAPER_DIM }} />
    </section>
  );
}