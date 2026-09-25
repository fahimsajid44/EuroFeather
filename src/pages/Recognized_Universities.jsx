import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Landmark,
  ExternalLink,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Globe2,
  ClipboardCheck,
  ShieldCheck,
  Plane,
} from 'lucide-react';

/* ---------------------------------------------------------------
   "THE ROUTE" — same identity as Navbar / Hero / Home / CGPA
   Converter. This page's signature is a departures board: instead
   of a flight's ON TIME / DELAYED / CANCELLED, it shows a
   university's real recognition status — H+, H+/-, H- — the way
   Germany's own anabin database reports it. No calculator here;
   the honest, most useful thing this page can do is send students
   straight to the real, official source and explain exactly what
   they'll find there.
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
const MUTED = '#84806E';

const GOLD_GRADIENT = `linear-gradient(115deg, ${GOLD} 0%, ${GOLD_SOFT} 45%, ${GOLD} 70%, ${GOLD_SOFT} 100%)`;
const EASE = 'cubic-bezier(.16,1,.3,1)';

const ANABIN_URL = 'https://anabin.kmk.org';

const STATUS_BOARD = [
  {
    code: 'H+',
    flightStatus: 'ON TIME',
    tone: 'good',
    title: 'Recognized',
    desc: 'Germany treats this institution as equivalent to a German Hochschule. Most degrees from here are accepted.',
  },
  {
    code: 'H+/-',
    flightStatus: 'CASE-BY-CASE',
    tone: 'warn',
    title: 'Partially recognized',
    desc: 'Some programs at this institution are recognized and some are not — each degree is checked individually.',
  },
  {
    code: 'H-',
    flightStatus: 'NOT RECOGNIZED',
    tone: 'bad',
    title: 'Not recognized',
    desc: "This institution isn't currently rated as equivalent. An individual ZAB evaluation is usually needed instead.",
  },
];

const STEPS = [
  {
    icon: Globe2,
    label: 'Gate 01',
    title: 'Open the official database',
    desc: 'Go to anabin.kmk.org — the only site this check should ever be done on.',
  },
  {
    icon: Search,
    label: 'Gate 02',
    title: 'Search "Institutionen"',
    desc: 'Choose Institutionen, pick Bangladesh as the country, then type your university\'s name.',
  },
  {
    icon: ClipboardCheck,
    label: 'Gate 03',
    title: 'Read the status column',
    desc: 'Your university will show H+, H+/-, or H- — that\'s the recognition status Germany assigns it.',
  },
  {
    icon: ShieldCheck,
    label: 'Gate 04',
    title: 'Save your proof',
    desc: "Print or save the result page — you'll need it for admissions or visa paperwork later.",
  },
];

/* ---------------------------- styles ---------------------------- */

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');

      .ru-root { font-family: 'Inter', sans-serif; background: ${PAPER}; }

      .ru-eyebrow { display: inline-flex; align-items: center; gap: 10px; }
      .ru-eyebrow-dot { width: 7px; height: 7px; border-radius: 50%; background: ${GOLD}; box-shadow: 0 0 0 3px ${GOLD_TINT}; }
      .ru-eyebrow-label {
        font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600;
        letter-spacing: 0.16em; text-transform: uppercase; color: ${GOLD};
      }
      .ru-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; color: ${INK}; letter-spacing: -0.01em; }
      .ru-title .foil {
        background: ${GOLD_GRADIENT}; background-size: 260% 100%;
        -webkit-background-clip: text; background-clip: text; color: transparent;
        animation: ruFoilSweep 7s ease-in-out infinite;
      }
      @keyframes ruFoilSweep { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }

      .ru-route-divider { position: relative; max-width: 1280px; margin: 0 auto; padding: 0 24px; }
      .ru-route-divider::before { content: ''; display: block; height: 0; border-top: 1.5px dashed ${LINE}; }
      .ru-route-divider .waypoint {
        position: absolute; left: 50%; top: 0; transform: translate(-50%, -50%);
        width: 8px; height: 8px; border-radius: 50%; background: ${GOLD};
        box-shadow: 0 0 0 4px ${PAPER};
      }

      /* --- departures board: dark panel, mono type, split-flap feel --- */
      .board {
        position: relative; border-radius: 16px; overflow: hidden;
        background: ${INK};
        box-shadow: 0 40px 80px -40px rgba(10,15,31,0.35);
      }
      .board-header {
        display: flex; align-items: center; justify-content: space-between;
        padding: 20px 26px;
        border-bottom: 1px solid rgba(250,249,245,0.12);
      }
      .board-header-label {
        display: flex; align-items: center; gap: 9px;
        font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700;
        letter-spacing: 0.14em; text-transform: uppercase; color: ${GOLD_SOFT};
      }
      .board-header-sub {
        font-family: 'JetBrains Mono', monospace; font-size: 10px;
        letter-spacing: 0.1em; text-transform: uppercase; color: rgba(250,249,245,0.4);
      }
      .board-row {
        display: grid; grid-template-columns: 90px 1fr auto; align-items: center;
        gap: 18px; padding: 20px 26px;
        border-bottom: 1px solid rgba(250,249,245,0.08);
      }
      .board-row:last-child { border-bottom: none; }
      .board-code {
        font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 22px;
        color: ${PAPER};
      }
      .board-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 14.5px; color: ${PAPER}; margin-bottom: 3px; }
      .board-desc { font-size: 12.5px; line-height: 1.55; color: rgba(250,249,245,0.55); max-width: 460px; }
      .board-status {
        display: inline-flex; align-items: center; gap: 6px;
        font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 700;
        letter-spacing: 0.08em; text-transform: uppercase;
        padding: 6px 11px; border-radius: 999px;
        white-space: nowrap;
      }
      .board-status.good { background: rgba(168,129,47,0.18); color: ${GOLD_SOFT}; border: 1px solid rgba(216,184,114,0.4); }
      .board-status.warn { background: rgba(216,184,114,0.14); color: ${GOLD_SOFT}; border: 1px solid rgba(216,184,114,0.3); }
      .board-status.bad { background: rgba(220,90,90,0.14); color: #E89999; border: 1px solid rgba(220,90,90,0.32); }

      @media (max-width: 640px) {
        .board-row { grid-template-columns: 1fr; gap: 8px; }
        .board-status { width: fit-content; }
      }

      /* --- official-link CTA card --- */
      .official-card {
        position: relative; border-radius: 14px; overflow: hidden;
        background: ${PAPER_DIM}; border: 1px solid ${LINE};
        padding: 30px 28px;
        display: flex; align-items: center; justify-content: space-between; gap: 20px;
        flex-wrap: wrap;
      }
      .official-card::before {
        content: ''; position: absolute; inset: 0;
        background-image:
          radial-gradient(ellipse 520px 300px at 6% 0%, ${ROUTE_TINT} 0%, transparent 62%),
          radial-gradient(ellipse 460px 280px at 100% 100%, ${GOLD_TINT} 0%, transparent 60%);
        pointer-events: none;
      }
      .official-card-content { position: relative; display: flex; align-items: flex-start; gap: 16px; min-width: 240px; }
      .official-icon {
        width: 46px; height: 46px; border-radius: 12px; flex-shrink: 0;
        background: ${ROUTE_TINT}; border: 1px solid rgba(30,58,120,0.18);
        display: flex; align-items: center; justify-content: center;
      }
      .official-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15.5px; color: ${INK}; margin-bottom: 4px; }
      .official-desc { font-size: 12.5px; line-height: 1.55; color: ${MUTED}; max-width: 380px; }
      .official-link-btn {
        position: relative;
        display: inline-flex; align-items: center; gap: 9px;
        padding: 13px 22px; border-radius: 10px;
        background: ${ROUTE};
        color: ${PAPER}; font-size: 13.5px; font-weight: 700; letter-spacing: 0.01em;
        white-space: nowrap;
        transition: background-color .25s ${EASE}, transform .2s ${EASE}, box-shadow .25s ${EASE};
        box-shadow: 0 14px 26px -14px rgba(30,58,120,0.5);
      }
      .official-link-btn:hover { background: ${ROUTE_DEEP}; transform: translateY(-1px); }
      .official-link-btn:focus-visible { outline: none; box-shadow: 0 0 0 4px ${ROUTE_TINT}, 0 14px 26px -14px rgba(30,58,120,0.5); }

      /* --- steps: five gates connected by a single route line,
             reused from the Home page's "flight plan" pattern --- */
      .flight-plan { position: relative; }
      .flight-plan-line {
        position: absolute; left: 10%; right: 10%; top: 27px; height: 0;
        border-top: 1.5px dashed ${LINE}; z-index: 0;
      }
      @media (max-width: 820px) { .flight-plan-line { display: none; } }
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
      .gate-desc { font-size: 12.5px; line-height: 1.55; color: ${MUTED}; max-width: 200px; }

      /* --- info / disclaimer panel (centered) --- */
      .info-panel {
        position: relative; border-radius: 14px; background: ${PAPER_DIM};
        border: 1px solid ${LINE}; overflow: hidden; padding: 32px 28px;
      }
      .info-panel::before {
        content: ''; position: absolute; inset: 0;
        background-image:
          radial-gradient(ellipse 640px 340px at 8% 0%, ${ROUTE_TINT} 0%, transparent 62%),
          radial-gradient(ellipse 520px 320px at 100% 100%, ${GOLD_TINT} 0%, transparent 60%);
        pointer-events: none;
      }
      .info-panel-content {
        position: relative;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .info-grid {
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;
        text-align: left; max-width: 760px; width: 100%;
      }
      @media (max-width: 720px) { .info-grid { grid-template-columns: 1fr; } }
      .info-chip {
        background: #ffffff; border: 1px solid ${LINE}; border-radius: 10px; padding: 14px 16px;
      }
      .info-chip-label {
        display: flex; align-items: center; gap: 7px;
        font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; color: ${GOLD};
        letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px;
      }
      .info-chip-desc { font-size: 12.5px; line-height: 1.55; color: ${MUTED}; }

      .disclaimer {
        display: flex; gap: 10px; align-items: flex-start; justify-content: center;
        font-size: 12px; line-height: 1.6; color: ${MUTED}; text-align: left;
        border-top: 1px dashed ${LINE}; margin-top: 22px; padding-top: 18px;
        max-width: 640px; width: 100%;
      }

      /* --- glossary strip: German terms you'll actually see on the
             (German-only) anabin site, translated inline --- */
      .glossary-strip {
        display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px;
        justify-content: center; max-width: 680px;
      }
      .glossary-chip {
        display: flex; align-items: center; gap: 7px;
        background: #ffffff; border: 1px solid ${LINE}; border-radius: 999px;
        padding: 7px 13px 7px 6px; font-size: 12px;
      }
      .glossary-de {
        font-family: 'JetBrains Mono', monospace; font-weight: 700; color: ${ROUTE};
        background: ${ROUTE_TINT}; border-radius: 999px; padding: 3px 9px;
      }
      .glossary-en { color: ${MUTED}; }

      @media (prefers-reduced-motion: reduce) {
        .ru-root *, .ru-root *::before, .ru-root *::after {
          transition-duration: 0.001ms !important;
          animation-duration: 0.001ms !important;
        }
      }
    `}</style>
  );
}

/* ---------------------------- pieces ---------------------------- */

function RouteDivider() {
  return (
    <div className="ru-route-divider" aria-hidden="true">
      <span className="waypoint" />
    </div>
  );
}

function StatusIcon({ tone }) {
  if (tone === 'good') return <CheckCircle2 size={13} />;
  if (tone === 'warn') return <AlertTriangle size={13} />;
  return <XCircle size={13} />;
}

function GateCard({ icon: Icon, label, title, desc }) {
  return (
    <div className="gate-card">
      <div className="gate-icon">
        <Icon size={20} color="currentColor" strokeWidth={1.75} />
      </div>
      <span className="gate-label">{label}</span>
      <span className="gate-title">{title}</span>
      <span className="gate-desc">{desc}</span>
    </div>
  );
}

export default function RecognizedUniversities() {
  const [hovering, setHovering] = useState(false);

  return (
    <div className="ru-root">
      <GlobalStyle />
      <Navbar />

      {/* spacer to clear the fixed navbar, matches Navbar's own spacer height */}
      <div style={{ height: 76 }} />

      {/* HEADER */}
      <section className="max-w-5xl mx-auto px-6 pt-14 pb-10 text-center">
        <span className="ru-eyebrow justify-center flex">
          <span className="ru-eyebrow-dot" />
          <span className="ru-eyebrow-label">Free tool · Resources</span>
        </span>
        <h1 className="ru-title mt-4 text-3xl md:text-[42px]">
          Recognized <span className="foil">Universities</span>
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-sm md:text-[15px] leading-relaxed" style={{ color: MUTED }}>
          Before you apply anywhere, check whether your university is actually recognized in
          Germany. We don't run our own list — we send you straight to anabin, the German
          government's own database, and explain exactly what you'll find there.
        </p>
      </section>

      <RouteDivider />

      {/* OFFICIAL LINK CTA */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <div className="official-card">
          <div className="official-card-content">
            <div className="official-icon">
              <Landmark size={22} color={ROUTE} strokeWidth={1.75} />
            </div>
            <div>
              <div className="official-title">anabin — the official database</div>
              <div className="official-desc">
                Run by the ZAB (Germany's Central Office for Foreign Education) under the KMK,
                and updated continuously. This is the actual source German universities,
                embassies and uni-assist all check — not a copy, not a summary.
              </div>
            </div>
          </div>
          <a
            href={ANABIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="official-link-btn"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            Open anabin.kmk.org
            <ExternalLink size={16} style={{ transform: hovering ? 'translate(2px,-2px)' : 'none', transition: `transform .2s ${EASE}` }} />
          </a>
        </div>
      </section>

      <RouteDivider />

      {/* STATUS BOARD */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <div className="flex flex-col items-center text-center mb-10">
          <span className="ru-eyebrow">
            <span className="ru-eyebrow-dot" />
            <span className="ru-eyebrow-label">What the status means</span>
          </span>
          <h2 className="ru-title mt-4 text-2xl md:text-3xl">
            Read it like a <span className="foil">departures board</span>
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed" style={{ color: MUTED }}>
            Every institution on anabin carries one of three statuses. Here's what each one
            actually means for your application.
          </p>
        </div>

        <div className="board">
          <div className="board-header">
            <span className="board-header-label">
              <Plane size={13} /> University Status
            </span>
            <span className="board-header-sub">Source: anabin.kmk.org</span>
          </div>
          {STATUS_BOARD.map((row) => (
            <div className="board-row" key={row.code}>
              <span className="board-code">{row.code}</span>
              <div>
                <div className="board-title">{row.title}</div>
                <div className="board-desc">{row.desc}</div>
              </div>
              <span className={`board-status ${row.tone}`}>
                <StatusIcon tone={row.tone} /> {row.flightStatus}
              </span>
            </div>
          ))}
        </div>
      </section>

      <RouteDivider />

      {/* HOW TO CHECK — steps */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <div className="flex flex-col items-center text-center mb-14">
          <span className="ru-eyebrow">
            <span className="ru-eyebrow-dot" />
            <span className="ru-eyebrow-label">Four steps</span>
          </span>
          <h2 className="ru-title mt-4 text-2xl md:text-3xl">
            How to <span className="foil">check your university</span>
          </h2>
        </div>
        <div className="flight-plan grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-6">
          <div className="flight-plan-line" aria-hidden="true" />
          {STEPS.map((step) => (
            <GateCard key={step.label} {...step} />
          ))}
        </div>
      </section>

      <RouteDivider />

      {/* GLOSSARY + DISCLAIMER (centered) */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <div className="info-panel">
          <div className="info-panel-content">
            <span className="ru-eyebrow">
              <span className="ru-eyebrow-dot" />
              <span className="ru-eyebrow-label">Good to know</span>
            </span>
            <h2 className="ru-title mt-4 text-2xl md:text-3xl">
              anabin is in <span className="foil">German only</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed mx-auto" style={{ color: MUTED, maxWidth: 640 }}>
              You don't need to speak German to use it — just recognize a handful of terms
              on the page:
            </p>

            <div className="glossary-strip">
              <span className="glossary-chip"><span className="glossary-de">Institutionen</span><span className="glossary-en">Institutions</span></span>
              <span className="glossary-chip"><span className="glossary-de">Suchen</span><span className="glossary-en">Search</span></span>
              <span className="glossary-chip"><span className="glossary-de">Land</span><span className="glossary-en">Country</span></span>
              <span className="glossary-chip"><span className="glossary-de">Status</span><span className="glossary-en">Recognition status</span></span>
              <span className="glossary-chip"><span className="glossary-de">Hochschulabschlüsse</span><span className="glossary-en">Degree-level lookup</span></span>
            </div>

            <div className="info-grid mt-7">
              <div className="info-chip">
                <div className="info-chip-label"><Info size={13} /> Not listed?</div>
                <div className="info-chip-desc">
                  If your university isn't on anabin at all, that doesn't mean it's rejected —
                  it usually just needs an individual ZAB evaluation instead.
                </div>
              </div>
              <div className="info-chip">
                <div className="info-chip-label"><Info size={13} /> H+/- university?</div>
                <div className="info-chip-desc">
                  Look up your specific degree too, under Hochschulabschlüsse — the
                  institution's status alone isn't the final answer.
                </div>
              </div>
              <div className="info-chip">
                <div className="info-chip-label"><Info size={13} /> Keep proof</div>
                <div className="info-chip-desc">
                  Print or save the anabin result page — universities and embassies will
                  often ask to see it directly.
                </div>
              </div>
            </div>

            <div className="disclaimer">
              <Info size={15} style={{ marginTop: 1, flexShrink: 0, color: GOLD }} />
              <span>
                Recognition entries on anabin can change, and this page doesn't replace
                checking it yourself — always confirm your university's current status
                directly on anabin.kmk.org before you apply, and bring any questions to one
                of our counselors.
              </span>
            </div>
          </div>
        </div>
      </section>

      <RouteDivider />

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <span className="ru-eyebrow justify-center flex">
          <span className="ru-eyebrow-dot" />
          <span className="ru-eyebrow-label">Next step</span>
        </span>
        <h2 className="ru-title mt-4 text-2xl md:text-3xl">
          Found an H+/- or H- result and not sure what it means?
        </h2>
        <p className="mt-3 text-sm leading-relaxed max-w-lg mx-auto" style={{ color: MUTED }}>
          Bring it to a free consultation — we'll help you read the fine print and point you
          toward universities you can actually get into.
        </p>
        <a
          href="/consultation"
          className="inline-flex items-center gap-2 mt-7 px-7 py-3.5 rounded-lg font-bold text-sm"
          style={{ background: ROUTE, color: PAPER, boxShadow: '0 14px 26px -14px rgba(30,58,120,0.5)' }}
        >
          Book a Free Consultation <ArrowRight size={16} />
        </a>
      </section>

      <Footer />
    </div>
  );
}