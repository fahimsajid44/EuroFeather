import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Headphones,
  Luggage,
  Home as HomeIcon,
  IdCard,
  Ticket,
  CheckSquare,
  Users,
  MessageCircle,
  ArrowRight,
  Plane,
} from 'lucide-react';

/* ---------------------------------------------------------------
   PRE-DEPARTURE SUPPORT — "The Route" identity, namespaced "pd-".
   Two sections: before you fly, and after you land.
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
    <div ref={ref} className={`pd-reveal ${inView ? 'pd-reveal-visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');
      .pd-root { font-family: 'Inter', sans-serif; background: ${PAPER}; }
      .pd-reveal { opacity: 0; transform: translateY(22px) scale(.985); transition: opacity .65s ${EASE}, transform .65s ${EASE}; }
      .pd-reveal-visible { opacity: 1; transform: translateY(0) scale(1); }
      .pd-eyebrow { display: inline-flex; align-items: center; gap: 10px; }
      .pd-eyebrow-dot { width: 7px; height: 7px; border-radius: 50%; background: ${GOLD}; box-shadow: 0 0 0 3px ${GOLD_TINT}; }
      .pd-eyebrow-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: ${GOLD}; }
      .pd-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; color: ${INK}; letter-spacing: -0.01em; }
      .pd-title .foil { background: ${GOLD_GRADIENT}; background-size: 260% 100%; -webkit-background-clip: text; background-clip: text; color: transparent; animation: pdFoil 7s ease-in-out infinite; }
      @keyframes pdFoil { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
      .pd-divider { position: relative; max-width: 1280px; margin: 0 auto; padding: 0 24px; }
      .pd-divider::before { content: ''; display: block; height: 0; border-top: 1.5px dashed ${LINE}; }
      .pd-divider .waypoint { position: absolute; left: 50%; top: 0; transform: translate(-50%, -50%); width: 8px; height: 8px; border-radius: 50%; background: ${GOLD}; box-shadow: 0 0 0 4px ${PAPER}; }

      .pd-header { position: relative; overflow: hidden; background: ${PAPER_DIM}; border-bottom: 1px solid ${LINE}; }
      .pd-header::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(ellipse 640px 340px at 12% 0%, ${ROUTE_TINT} 0%, transparent 62%), radial-gradient(ellipse 520px 320px at 100% 100%, ${GOLD_TINT} 0%, transparent 60%); pointer-events: none; }
      .pd-header::after { content: ''; position: absolute; inset: 0; background-image: radial-gradient(${LINE} 1px, transparent 1px); background-size: 24px 24px; -webkit-mask-image: radial-gradient(ellipse 700px 420px at 20% 20%, #000 0%, transparent 72%); mask-image: radial-gradient(ellipse 700px 420px at 20% 20%, #000 0%, transparent 72%); opacity: 0.55; pointer-events: none; }
      .pd-header-plane { position: absolute; top: 30%; left: -6%; color: ${GOLD}; opacity: 0.8; animation: pdFly 6.5s ${EASE} infinite; }
      @keyframes pdFly { 0% { transform: translateX(0) translateY(0) rotate(8deg); opacity: 0; } 10% { opacity: 0.8; } 90% { opacity: 0.8; } 100% { transform: translateX(112vw) translateY(-30px) rotate(8deg); opacity: 0; } }
      .pd-header-tag { display: inline-flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: ${GOLD}; border: 1px solid rgba(168,129,47,0.35); border-radius: 999px; padding: 7px 14px; }

      .pd-pass-card { border-radius: 14px; background: #fff; border: 1px solid ${LINE}; box-shadow: 0 30px 60px -34px rgba(10,15,31,0.24); overflow: hidden; }
      .pd-pass-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 26px; background: ${INK}; }
      .pd-pass-title { font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 700; color: ${PAPER}; }
      .pd-pass-sub { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: ${GOLD_SOFT}; margin-top: 3px; }
      .pd-pass-perf { position: relative; height: 0; border-top: 1.5px dashed ${LINE}; }
      .pd-pass-perf::before, .pd-pass-perf::after { content: ''; position: absolute; top: -8px; width: 16px; height: 16px; border-radius: 50%; background: ${PAPER}; }
      .pd-pass-perf::before { left: -8px; } .pd-pass-perf::after { right: -8px; }
      .pd-doc-item { display: flex; align-items: flex-start; gap: 13px; padding: 15px 26px; border-bottom: 1px solid ${LINE}; transition: background-color .2s ${EASE}; }
      .pd-doc-item:last-child { border-bottom: none; }
      .pd-doc-item:hover { background: ${GOLD_TINT}; }
      .pd-doc-icon { width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0; margin-top: 1px; background: ${ROUTE_TINT}; display: flex; align-items: center; justify-content: center; }
      .pd-doc-name { font-size: 14px; font-weight: 600; color: ${INK}; line-height: 1.4; }
      .pd-doc-desc { font-size: 12.5px; color: ${MUTED}; margin-top: 2px; }

      .pd-leg-card { position: relative; border-radius: 8px; background: #fff; border: 1px solid ${LINE}; padding: 28px 24px 24px; overflow: hidden; transition: transform .35s ${EASE}, box-shadow .35s ${EASE}, border-color .35s ${EASE}; }
      .pd-leg-card::before { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 3px; background: ${GOLD_GRADIENT}; background-size: 220% 100%; transform: scaleX(0); transform-origin: left; transition: transform .45s ${EASE}; }
      .pd-leg-card:hover { transform: translateY(-6px); box-shadow: 0 30px 54px -26px rgba(30,58,120,0.24); border-color: ${GOLD}; }
      .pd-leg-card:hover::before { transform: scaleX(1); }
      .pd-leg-icon { width: 46px; height: 46px; border-radius: 12px; background: ${GOLD_TINT}; border: 1px solid rgba(168,129,47,0.3); color: ${ROUTE}; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; transition: transform .35s ${EASE}, background-color .35s ${EASE}, color .35s ${EASE}, border-color .35s ${EASE}; }
      .pd-leg-card:hover .pd-leg-icon { transform: translateY(-3px) rotate(-4deg); background: ${ROUTE}; border-color: ${ROUTE}; color: ${PAPER}; }

      .pd-cta-panel { position: relative; border-radius: 14px; overflow: hidden; background: #F1EFE7; border: 1px solid ${LINE}; padding: 52px 32px; text-align: center; }
      .pd-cta-panel::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(ellipse 640px 340px at 8% 0%, ${ROUTE_TINT} 0%, transparent 62%), radial-gradient(ellipse 520px 320px at 100% 100%, ${GOLD_TINT} 0%, transparent 60%); pointer-events: none; }
      .pd-cta-btn { position: relative; display: inline-flex; align-items: center; gap: 9px; margin-top: 22px; padding: 15px 30px; border-radius: 10px; background: ${GOLD_GRADIENT}; background-size: 220% 100%; color: ${INK}; font-size: 14px; font-weight: 700; transition: background-position .5s ${EASE}, transform .25s ${EASE}; box-shadow: 0 20px 40px -20px rgba(30,58,120,0.35); }
      .pd-cta-btn:hover { background-position: 100% 0; transform: translateY(-2px); }

      @media (max-width: 640px) {
        .pd-cta-panel { padding: 40px 20px; border-radius: 10px; }
        .pd-cta-btn { width: 100%; justify-content: center; }
        .pd-pass-header { padding: 18px 20px; }
        .pd-doc-item { padding: 14px 20px; }
      }
      @media (prefers-reduced-motion: reduce) {
        .pd-root *, .pd-root *::before, .pd-root *::after { transition-duration: 0.001ms !important; animation-duration: 0.001ms !important; }
        .pd-reveal { opacity: 1 !important; transform: none !important; }
        .pd-header-plane { display: none; }
      }
    `}</style>
  );
}

function RouteDivider() {
  return <div className="pd-divider" aria-hidden="true"><span className="waypoint" /></div>;
}

function SectionHeading({ eyebrow, title, emphasis, sub }) {
  return (
    <Reveal className="flex flex-col items-center text-center mb-14">
      <span className="pd-eyebrow"><span className="pd-eyebrow-dot" /><span className="pd-eyebrow-label">{eyebrow}</span></span>
      <h2 className="pd-title mt-4 text-3xl md:text-4xl">{title} <span className="foil">{emphasis}</span></h2>
      {sub && <p className="mt-4 max-w-xl text-sm leading-relaxed" style={{ color: MUTED }}>{sub}</p>}
    </Reveal>
  );
}

function DocItem({ icon: Icon, name, desc }) {
  return (
    <div className="pd-doc-item">
      <div className="pd-doc-icon"><Icon size={15} color={ROUTE} /></div>
      <div>
        <div className="pd-doc-name">{name}</div>
        {desc && <div className="pd-doc-desc">{desc}</div>}
      </div>
    </div>
  );
}

function LegCard({ icon: Icon, title, desc, delay }) {
  return (
    <Reveal delay={delay}>
      <div className="pd-leg-card h-full">
        <div className="pd-leg-icon"><Icon size={20} color="currentColor" strokeWidth={1.75} /></div>
        <h3 className="text-[15px] font-bold mb-2" style={{ color: INK, fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{desc}</p>
      </div>
    </Reveal>
  );
}

export default function PreDepartureSupport() {
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  const beforeYouFly = [
    { icon: Ticket, name: 'Flight booking', desc: 'Timed around your visa validity and semester start date.' },
    { icon: HomeIcon, name: 'Housing search', desc: 'Student housing or a short-term stay arranged before you land.' },
    { icon: CheckSquare, name: 'Packing & travel checklist', desc: 'What to bring, what to leave, and what to carry as hand luggage.' },
    { icon: Users, name: 'Pre-departure orientation', desc: 'A walkthrough of what your first days abroad will actually look like.' },
  ];

  return (
    <div className="pd-root">
      <GlobalStyle />
      <Navbar />

      <section className="pd-header">
        <Plane size={24} className="pd-header-plane" />
        <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-20 flex flex-col items-center text-center">
          <Reveal className="flex flex-col items-center">
            <span className="pd-header-tag"><Headphones size={13} /> G04 — Pre-Departure Support</span>
            <h1 className="mt-6 text-4xl md:text-5xl leading-[1.1]" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: INK, maxWidth: 700 }}>
              A smooth journey to your dream destination, before and after you land.
            </h1>
            <p className="mt-6 text-base leading-relaxed" style={{ color: MUTED, maxWidth: 560 }}>
              Visa in hand is not the finish line. We stay with you through booking flights, finding housing, and settling into your first weeks abroad.
            </p>
          </Reveal>
        </div>
      </section>

      <RouteDivider />

      <section className="max-w-5xl mx-auto px-6 py-20">
        <SectionHeading eyebrow="Before you fly" title="Everything sorted" emphasis="ahead of takeoff" sub="A short, practical checklist we work through with you in the weeks before departure." />
        <Reveal>
          <div className="pd-pass-card">
            <div className="pd-pass-header">
              <div>
                <div className="pd-pass-title">Pre-Departure Checklist</div>
                <div className="pd-pass-sub">Final leg, before boarding</div>
              </div>
              <Luggage size={22} color={GOLD_SOFT} />
            </div>
            <div className="pd-pass-perf" />
            <div>{beforeYouFly.map((item, i) => <DocItem key={i} {...item} />)}</div>
          </div>
        </Reveal>
      </section>

      <RouteDivider />

      <section className="max-w-7xl mx-auto px-6 py-20">
        <SectionHeading eyebrow="After you land" title="Support that continues" emphasis="past arrival" sub="Our service doesn't end at the airport gate — these are the steps we help with once you're on the ground." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <LegCard icon={IdCard} title="Residence permit" desc="Guidance through applying for your residence permit once you've arrived." delay={0} />
          <LegCard icon={HomeIcon} title="Settling in" desc="Help with registration, banking and the other first-week practicalities." delay={80} />
          <LegCard icon={MessageCircle} title="Ongoing contact" desc="You keep a direct line to us for questions well beyond your first month." delay={160} />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <Reveal>
          <div className="pd-cta-panel">
            <span className="pd-eyebrow" style={{ justifyContent: 'center', display: 'inline-flex' }}>
              <span className="pd-eyebrow-dot" /><span className="pd-eyebrow-label">Almost there</span>
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: INK }}>
              Let's plan your departure.
            </h2>
            <p className="mt-4 max-w-lg mx-auto text-sm leading-relaxed" style={{ color: MUTED }}>
              From flights to your first week abroad, we'll help you get every detail sorted in advance.
            </p>
            <a href="/consultation" className="pd-cta-btn">Book Your Free Consultation <ArrowRight size={16} /></a>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}