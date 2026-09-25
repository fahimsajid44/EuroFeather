import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  FileText,
  Target,
  Wallet,
  BookMarked,
  Languages,
  ListChecks,
  FileBarChart2,
  MessageSquareText,
  ArrowRight,
  Plane,
} from 'lucide-react';

/* ---------------------------------------------------------------
   COURSE & UNIVERSITY GUIDANCE — "The Route" identity, namespaced
   "cg-". Two sections: what we match on, and what you receive.
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

function useInView(threshold = 0.16) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { setInView(true); obs.unobserve(e.target); } });
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Reveal({ children, delay = 0, className = '' }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={`cg-reveal ${inView ? 'cg-reveal-visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');
      .cg-root { font-family: 'Inter', sans-serif; background: ${PAPER}; }
      .cg-reveal { opacity: 0; transform: translateY(22px) scale(.985); transition: opacity .65s ${EASE}, transform .65s ${EASE}; }
      .cg-reveal-visible { opacity: 1; transform: translateY(0) scale(1); }
      .cg-eyebrow { display: inline-flex; align-items: center; gap: 10px; }
      .cg-eyebrow-dot { width: 7px; height: 7px; border-radius: 50%; background: ${GOLD}; box-shadow: 0 0 0 3px ${GOLD_TINT}; }
      .cg-eyebrow-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: ${GOLD}; }
      .cg-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; color: ${INK}; letter-spacing: -0.01em; }
      .cg-title .foil { background: ${GOLD_GRADIENT}; background-size: 260% 100%; -webkit-background-clip: text; background-clip: text; color: transparent; animation: cgFoil 7s ease-in-out infinite; }
      @keyframes cgFoil { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
      .cg-divider { position: relative; max-width: 1280px; margin: 0 auto; padding: 0 24px; }
      .cg-divider::before { content: ''; display: block; height: 0; border-top: 1.5px dashed ${LINE}; }
      .cg-divider .waypoint { position: absolute; left: 50%; top: 0; transform: translate(-50%, -50%); width: 8px; height: 8px; border-radius: 50%; background: ${GOLD}; box-shadow: 0 0 0 4px ${PAPER}; }

      .cg-header { position: relative; overflow: hidden; background: ${PAPER_DIM}; border-bottom: 1px solid ${LINE}; }
      .cg-header::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(ellipse 640px 340px at 12% 0%, ${ROUTE_TINT} 0%, transparent 62%), radial-gradient(ellipse 520px 320px at 100% 100%, ${GOLD_TINT} 0%, transparent 60%); pointer-events: none; }
      .cg-header::after { content: ''; position: absolute; inset: 0; background-image: radial-gradient(${LINE} 1px, transparent 1px); background-size: 24px 24px; -webkit-mask-image: radial-gradient(ellipse 700px 420px at 20% 20%, #000 0%, transparent 72%); mask-image: radial-gradient(ellipse 700px 420px at 20% 20%, #000 0%, transparent 72%); opacity: 0.55; pointer-events: none; }
      .cg-header-plane { position: absolute; top: 30%; left: -6%; color: ${GOLD}; opacity: 0.8; animation: cgFly 6.5s ${EASE} infinite; }
      @keyframes cgFly { 0% { transform: translateX(0) translateY(0) rotate(8deg); opacity: 0; } 10% { opacity: 0.8; } 90% { opacity: 0.8; } 100% { transform: translateX(112vw) translateY(-30px) rotate(8deg); opacity: 0; } }
      .cg-header-tag { display: inline-flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: ${GOLD}; border: 1px solid rgba(168,129,47,0.35); border-radius: 999px; padding: 7px 14px; }

      .cg-leg-card { position: relative; border-radius: 8px; background: #fff; border: 1px solid ${LINE}; padding: 28px 24px 24px; overflow: hidden; transition: transform .35s ${EASE}, box-shadow .35s ${EASE}, border-color .35s ${EASE}; }
      .cg-leg-card::before { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 3px; background: ${GOLD_GRADIENT}; background-size: 220% 100%; transform: scaleX(0); transform-origin: left; transition: transform .45s ${EASE}; }
      .cg-leg-card:hover { transform: translateY(-6px); box-shadow: 0 30px 54px -26px rgba(30,58,120,0.24); border-color: ${GOLD}; }
      .cg-leg-card:hover::before { transform: scaleX(1); }
      .cg-leg-icon { width: 46px; height: 46px; border-radius: 12px; background: ${GOLD_TINT}; border: 1px solid rgba(168,129,47,0.3); color: ${ROUTE}; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; transition: transform .35s ${EASE}, background-color .35s ${EASE}, color .35s ${EASE}, border-color .35s ${EASE}; }
      .cg-leg-card:hover .cg-leg-icon { transform: translateY(-3px) rotate(-4deg); background: ${ROUTE}; border-color: ${ROUTE}; color: ${PAPER}; }

      .cg-stub-panel { position: relative; border-radius: 6px; background: #fff; border: 1px solid ${LINE}; padding: 30px 26px 26px; transition: transform .35s ${EASE}, box-shadow .35s ${EASE}; }
      .cg-stub-panel:hover { transform: translateY(-4px); box-shadow: 0 30px 54px -28px rgba(10,15,31,0.22); }
      .cg-stub-perf { position: relative; height: 0; border-top: 1.5px dashed ${LINE}; margin: 0 -1px 22px; }
      .cg-stub-perf::before, .cg-stub-perf::after { content: ''; position: absolute; top: -8px; width: 16px; height: 16px; border-radius: 50%; background: ${PAPER}; }
      .cg-stub-perf::before { left: -9px; } .cg-stub-perf::after { right: -9px; }
      .cg-stub-index { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 600; letter-spacing: 0.14em; color: ${MUTED}; text-transform: uppercase; }
      .cg-stub-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; color: ${INK}; }

      .cg-paper-panel { position: relative; border-radius: 14px; background: ${PAPER_DIM}; border: 1px solid ${LINE}; overflow: hidden; }
      .cg-paper-panel::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(ellipse 640px 340px at 8% 0%, ${ROUTE_TINT} 0%, transparent 62%), radial-gradient(ellipse 520px 320px at 100% 100%, ${GOLD_TINT} 0%, transparent 60%); pointer-events: none; }

      .cg-cta-panel { position: relative; border-radius: 14px; overflow: hidden; background: ${PAPER_DIM}; border: 1px solid ${LINE}; padding: 52px 32px; text-align: center; }
      .cg-cta-panel::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(ellipse 640px 340px at 8% 0%, ${ROUTE_TINT} 0%, transparent 62%), radial-gradient(ellipse 520px 320px at 100% 100%, ${GOLD_TINT} 0%, transparent 60%); pointer-events: none; }
      .cg-cta-btn { position: relative; display: inline-flex; align-items: center; gap: 9px; margin-top: 22px; padding: 15px 30px; border-radius: 10px; background: ${GOLD_GRADIENT}; background-size: 220% 100%; color: ${INK}; font-size: 14px; font-weight: 700; transition: background-position .5s ${EASE}, transform .25s ${EASE}; box-shadow: 0 20px 40px -20px rgba(30,58,120,0.35); }
      .cg-cta-btn:hover { background-position: 100% 0; transform: translateY(-2px); }

      @media (max-width: 640px) { .cg-cta-panel { padding: 40px 20px; border-radius: 10px; } .cg-cta-btn { width: 100%; justify-content: center; } }
      @media (prefers-reduced-motion: reduce) {
        .cg-root *, .cg-root *::before, .cg-root *::after { transition-duration: 0.001ms !important; animation-duration: 0.001ms !important; }
        .cg-reveal { opacity: 1 !important; transform: none !important; }
        .cg-header-plane { display: none; }
      }
    `}</style>
  );
}

function RouteDivider() {
  return <div className="cg-divider" aria-hidden="true"><span className="waypoint" /></div>;
}

function SectionHeading({ eyebrow, title, emphasis, sub }) {
  return (
    <Reveal className="flex flex-col items-center text-center mb-14">
      <span className="cg-eyebrow"><span className="cg-eyebrow-dot" /><span className="cg-eyebrow-label">{eyebrow}</span></span>
      <h2 className="cg-title mt-4 text-3xl md:text-4xl">{title} <span className="foil">{emphasis}</span></h2>
      {sub && <p className="mt-4 max-w-xl text-sm leading-relaxed" style={{ color: MUTED }}>{sub}</p>}
    </Reveal>
  );
}

function LegCard({ icon: Icon, title, desc, delay }) {
  return (
    <Reveal delay={delay}>
      <div className="cg-leg-card h-full">
        <div className="cg-leg-icon"><Icon size={20} color="currentColor" strokeWidth={1.75} /></div>
        <h3 className="text-[15px] font-bold mb-2" style={{ color: INK, fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{desc}</p>
      </div>
    </Reveal>
  );
}

export default function CourseGuidance() {
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="cg-root">
      <GlobalStyle />
      <Navbar />

      <section className="cg-header">
        <Plane size={24} className="cg-header-plane" />
        <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-20 flex flex-col items-center text-center">
          <Reveal className="flex flex-col items-center">
            <span className="cg-header-tag"><FileText size={13} /> G03 — Course &amp; University Guidance</span>
            <h1 className="mt-6 text-4xl md:text-5xl leading-[1.1]" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: INK, maxWidth: 700 }}>
              Personalized course matching, built around where you'll actually get in and thrive.
            </h1>
            <p className="mt-6 text-base leading-relaxed" style={{ color: MUTED, maxWidth: 560 }}>
              No generic lists. We match your grades, budget and goals against real course requirements before recommending anything.
            </p>
          </Reveal>
        </div>
      </section>

      <RouteDivider />

      <section className="max-w-7xl mx-auto px-6 py-20">
        <SectionHeading eyebrow="What we match on" title="Four things we" emphasis="weigh" sub="A course only makes your shortlist if it fits on all four counts — not just the one that looks impressive." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <LegCard icon={Target} title="Academic fit" desc="Your grades and subject background, matched against each program's real entry requirements." delay={0} />
          <LegCard icon={Wallet} title="Budget" desc="Tuition, living costs and scholarships weighed against what you can realistically sustain." delay={80} />
          <LegCard icon={BookMarked} title="Career goals" desc="Where the course leads afterward, not just what it covers on paper." delay={160} />
          <LegCard icon={Languages} title="Language readiness" desc="Whether the program is taught in a language you're ready for, or one you'll need to prepare for." delay={240} />
        </div>
      </section>

      <RouteDivider />

      <section className="max-w-7xl mx-auto px-6 py-20">
        <SectionHeading eyebrow="What you receive" title="A shortlist you can" emphasis="actually act on" />
        <div className="grid sm:grid-cols-3 gap-6">
          <Reveal delay={0}>
            <div className="cg-stub-panel h-full">
              <div className="flex items-center justify-between mb-4">
                <span className="cg-stub-index">Output 01</span>
                <ListChecks size={16} color={GOLD} />
              </div>
              <h3 className="cg-stub-title text-base mb-4">Curated shortlist</h3>
              <div className="cg-stub-perf" />
              <p className="text-sm leading-relaxed" style={{ color: MUTED }}>A short, ranked list of courses and universities you're realistically positioned to get into.</p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="cg-stub-panel h-full">
              <div className="flex items-center justify-between mb-4">
                <span className="cg-stub-index">Output 02</span>
                <FileBarChart2 size={16} color={GOLD} />
              </div>
              <h3 className="cg-stub-title text-base mb-4">Side-by-side comparison</h3>
              <div className="cg-stub-perf" />
              <p className="text-sm leading-relaxed" style={{ color: MUTED }}>Tuition, duration, language and outcomes laid out together, so the trade-offs are clear.</p>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="cg-stub-panel h-full">
              <div className="flex items-center justify-between mb-4">
                <span className="cg-stub-index">Output 03</span>
                <MessageSquareText size={16} color={GOLD} />
              </div>
              <h3 className="cg-stub-title text-base mb-4">A straight recommendation</h3>
              <div className="cg-stub-perf" />
              <p className="text-sm leading-relaxed" style={{ color: MUTED }}>Our honest read on which option to pursue first, and why — not just a list left for you to decode.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <Reveal>
          <div className="cg-cta-panel">
            <span className="cg-eyebrow" style={{ justifyContent: 'center', display: 'inline-flex' }}>
              <span className="cg-eyebrow-dot" /><span className="cg-eyebrow-label">Not sure where to start</span>
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: INK }}>
              Let's find the right course together.
            </h2>
            <p className="mt-4 max-w-lg mx-auto text-sm leading-relaxed" style={{ color: MUTED }}>
              A free consultation is the fastest way to know what's realistic for your grades and budget.
            </p>
            <a href="/consultation" className="cg-cta-btn">Book Your Free Consultation <ArrowRight size={16} /></a>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}