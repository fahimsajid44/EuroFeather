import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Globe2,
  FileCheck2,
  CalendarClock,
  MessagesSquare,
  ClipboardCheck,
  CircleDollarSign,
  ShieldCheck,
  HandHeart,
  ArrowRight,
  Plane,
} from 'lucide-react';

/* ---------------------------------------------------------------
   VISA PROCESSING — "The Route" identity, namespaced "vp-".
   Three sections: how the visa process works, staged service
   charges, and the "we're not an agency" commitment note.
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
    <div ref={ref} className={`vp-reveal ${inView ? 'vp-reveal-visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');
      .vp-root { font-family: 'Inter', sans-serif; background: ${PAPER}; }
      .vp-reveal { opacity: 0; transform: translateY(22px) scale(.985); transition: opacity .65s ${EASE}, transform .65s ${EASE}; }
      .vp-reveal-visible { opacity: 1; transform: translateY(0) scale(1); }
      .vp-eyebrow { display: inline-flex; align-items: center; gap: 10px; }
      .vp-eyebrow-dot { width: 7px; height: 7px; border-radius: 50%; background: ${GOLD}; box-shadow: 0 0 0 3px ${GOLD_TINT}; }
      .vp-eyebrow-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: ${GOLD}; }
      .vp-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; color: ${INK}; letter-spacing: -0.01em; }
      .vp-title .foil { background: ${GOLD_GRADIENT}; background-size: 260% 100%; -webkit-background-clip: text; background-clip: text; color: transparent; animation: vpFoil 7s ease-in-out infinite; }
      @keyframes vpFoil { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
      .vp-divider { position: relative; max-width: 1280px; margin: 0 auto; padding: 0 24px; }
      .vp-divider::before { content: ''; display: block; height: 0; border-top: 1.5px dashed ${LINE}; }
      .vp-divider .waypoint { position: absolute; left: 50%; top: 0; transform: translate(-50%, -50%); width: 8px; height: 8px; border-radius: 50%; background: ${GOLD}; box-shadow: 0 0 0 4px ${PAPER}; }

      .vp-header { position: relative; overflow: hidden; background: ${PAPER_DIM}; border-bottom: 1px solid ${LINE}; }
      .vp-header::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(ellipse 640px 340px at 12% 0%, ${ROUTE_TINT} 0%, transparent 62%), radial-gradient(ellipse 520px 320px at 100% 100%, ${GOLD_TINT} 0%, transparent 60%); pointer-events: none; }
      .vp-header::after { content: ''; position: absolute; inset: 0; background-image: radial-gradient(${LINE} 1px, transparent 1px); background-size: 24px 24px; -webkit-mask-image: radial-gradient(ellipse 700px 420px at 20% 20%, #000 0%, transparent 72%); mask-image: radial-gradient(ellipse 700px 420px at 20% 20%, #000 0%, transparent 72%); opacity: 0.55; pointer-events: none; }
      .vp-header-plane { position: absolute; top: 30%; left: -6%; color: ${GOLD}; opacity: 0.8; animation: vpFly 6.5s ${EASE} infinite; }
      @keyframes vpFly { 0% { transform: translateX(0) translateY(0) rotate(8deg); opacity: 0; } 10% { opacity: 0.8; } 90% { opacity: 0.8; } 100% { transform: translateX(112vw) translateY(-30px) rotate(8deg); opacity: 0; } }
      .vp-header-tag { display: inline-flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: ${GOLD}; border: 1px solid rgba(168,129,47,0.35); border-radius: 999px; padding: 7px 14px; }

      .vp-gate-line { position: absolute; left: 6%; right: 6%; top: 27px; height: 0; border-top: 1.5px dashed ${LINE}; z-index: 0; }
      @media (max-width: 900px) { .vp-gate-line { display: none; } }
      .vp-gate-card { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; text-align: center; }
      .vp-gate-icon { width: 56px; height: 56px; border-radius: 50%; background: ${PAPER}; border: 1.5px solid ${GOLD}; color: ${ROUTE}; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; position: relative; box-shadow: 0 0 0 6px ${PAPER}; transition: transform .35s ${EASE}, background-color .35s ${EASE}, color .35s ${EASE}; }
      .vp-gate-card:hover .vp-gate-icon { transform: translateY(-4px) scale(1.06); background: ${ROUTE}; color: ${PAPER}; }
      .vp-gate-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; letter-spacing: 0.14em; color: ${GOLD}; text-transform: uppercase; margin-bottom: 6px; }
      .vp-gate-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 14.5px; color: ${INK}; margin-bottom: 6px; }
      .vp-gate-desc { font-size: 12.5px; line-height: 1.55; color: ${MUTED}; max-width: 190px; }

      .vp-fee-card { position: relative; border-radius: 10px; background: #fff; border: 1px solid ${LINE}; padding: 28px 26px 24px; transition: transform .35s ${EASE}, box-shadow .35s ${EASE}; }
      .vp-fee-card:hover { transform: translateY(-4px); box-shadow: 0 30px 54px -28px rgba(10,15,31,0.22); }
      .vp-fee-card.is-highlight { border-color: ${GOLD}; }
      .vp-fee-stage { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 600; letter-spacing: 0.12em; color: ${MUTED}; text-transform: uppercase; }
      .vp-fee-amount { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 34px; color: ${INK}; margin-top: 10px; display: flex; align-items: baseline; gap: 6px; }
      .vp-fee-amount span { font-size: 14px; font-weight: 600; color: ${MUTED}; }
      .vp-fee-perf { position: relative; height: 0; border-top: 1.5px dashed ${LINE}; margin: 18px -1px 16px; }
      .vp-fee-perf::before, .vp-fee-perf::after { content: ''; position: absolute; top: -8px; width: 16px; height: 16px; border-radius: 50%; background: ${PAPER}; }
      .vp-fee-perf::before { left: -9px; } .vp-fee-perf::after { right: -9px; }
      .vp-fee-desc { font-size: 13px; line-height: 1.6; color: ${MUTED}; }
      .vp-fee-note { display: flex; align-items: flex-start; gap: 12px; border-radius: 10px; border: 1px dashed ${GOLD}; background: ${GOLD_TINT}; padding: 18px 20px; }
      .vp-fee-note-text { font-size: 13.5px; line-height: 1.65; color: ${INK}; }
      .vp-fee-note-text strong { color: ${ROUTE_DEEP}; }

      .vp-paper-panel { position: relative; border-radius: 14px; background: ${PAPER_DIM}; border: 1px solid ${LINE}; overflow: hidden; }
      .vp-paper-panel::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(ellipse 640px 340px at 8% 0%, ${ROUTE_TINT} 0%, transparent 62%), radial-gradient(ellipse 520px 320px at 100% 100%, ${GOLD_TINT} 0%, transparent 60%); pointer-events: none; }
      .vp-letter { position: relative; border-radius: 10px; background: #fff; border: 1px solid ${LINE}; padding: 32px 30px; }
      .vp-letter-mark { width: 44px; height: 44px; border-radius: 50%; background: ${ROUTE}; color: ${PAPER}; display: flex; align-items: center; justify-content: center; margin-bottom: 18px; }
      .vp-letter-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 17px; color: ${INK}; margin-bottom: 10px; }
      .vp-letter-body { font-size: 14px; line-height: 1.75; color: ${MUTED}; }
      .vp-letter-sign { margin-top: 20px; padding-top: 16px; border-top: 1px dashed ${LINE}; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 14px; color: ${ROUTE}; }

      .vp-cta-panel { position: relative; border-radius: 14px; overflow: hidden; background: ${PAPER_DIM}; border: 1px solid ${LINE}; padding: 52px 32px; text-align: center; }
      .vp-cta-panel::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(ellipse 640px 340px at 8% 0%, ${ROUTE_TINT} 0%, transparent 62%), radial-gradient(ellipse 520px 320px at 100% 100%, ${GOLD_TINT} 0%, transparent 60%); pointer-events: none; }
      .vp-cta-btn { position: relative; display: inline-flex; align-items: center; gap: 9px; margin-top: 22px; padding: 15px 30px; border-radius: 10px; background: ${GOLD_GRADIENT}; background-size: 220% 100%; color: ${INK}; font-size: 14px; font-weight: 700; transition: background-position .5s ${EASE}, transform .25s ${EASE}; box-shadow: 0 20px 40px -20px rgba(30,58,120,0.35); }
      .vp-cta-btn:hover { background-position: 100% 0; transform: translateY(-2px); }

      @media (max-width: 640px) { .vp-cta-panel { padding: 40px 20px; border-radius: 10px; } .vp-cta-btn { width: 100%; justify-content: center; } }
      @media (prefers-reduced-motion: reduce) {
        .vp-root *, .vp-root *::before, .vp-root *::after { transition-duration: 0.001ms !important; animation-duration: 0.001ms !important; }
        .vp-reveal { opacity: 1 !important; transform: none !important; }
        .vp-header-plane { display: none; }
      }
    `}</style>
  );
}

function RouteDivider() {
  return <div className="vp-divider" aria-hidden="true"><span className="waypoint" /></div>;
}

function SectionHeading({ eyebrow, title, emphasis, sub }) {
  return (
    <Reveal className="flex flex-col items-center text-center mb-14">
      <span className="vp-eyebrow"><span className="vp-eyebrow-dot" /><span className="vp-eyebrow-label">{eyebrow}</span></span>
      <h2 className="vp-title mt-4 text-3xl md:text-4xl">{title} <span className="foil">{emphasis}</span></h2>
      {sub && <p className="mt-4 max-w-xl text-sm leading-relaxed" style={{ color: MUTED }}>{sub}</p>}
    </Reveal>
  );
}

function GateCard({ icon: Icon, label, title, desc, delay }) {
  return (
    <Reveal delay={delay}>
      <div className="vp-gate-card">
        <div className="vp-gate-icon"><Icon size={20} color="currentColor" strokeWidth={1.75} /></div>
        <span className="vp-gate-label">{label}</span>
        <span className="vp-gate-title">{title}</span>
        <span className="vp-gate-desc">{desc}</span>
      </div>
    </Reveal>
  );
}

function FeeCard({ stage, amount, unit, desc, delay, highlight }) {
  return (
    <Reveal delay={delay}>
      <div className={`vp-fee-card h-full ${highlight ? 'is-highlight' : ''}`}>
        <span className="vp-fee-stage">{stage}</span>
        <div className="vp-fee-amount">{amount} <span>{unit}</span></div>
        <div className="vp-fee-perf" />
        <p className="vp-fee-desc">{desc}</p>
      </div>
    </Reveal>
  );
}

export default function VisaProcessing() {
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="vp-root">
      <GlobalStyle />
      <Navbar />

      <section className="vp-header">
        <Plane size={24} className="vp-header-plane" />
        <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-20 flex flex-col items-center text-center">
          <Reveal className="flex flex-col items-center">
            <span className="vp-header-tag"><Globe2 size={13} /> G02 — Visa Processing</span>
            <h1 className="mt-6 text-4xl md:text-5xl leading-[1.1]" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: INK, maxWidth: 700 }}>
              Complete visa guidance and documentation, handled with the embassy's checklist in hand.
            </h1>
            <p className="mt-6 text-base leading-relaxed" style={{ color: MUTED, maxWidth: 560 }}>
              From document assembly to interview prep, we stay with you through every step of the visa process.
            </p>
          </Reveal>
        </div>
      </section>

      <RouteDivider />

      <section className="max-w-7xl mx-auto px-6 py-20">
        <SectionHeading eyebrow="The process" title="Four gates to your" emphasis="visa" sub="Each stage is prepared in order, so nothing reaches the embassy incomplete." />
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-6">
          <div className="vp-gate-line" aria-hidden="true" />
          <GateCard icon={FileCheck2} label="Gate 01" title="Document Assembly" desc="We check every document against the embassy's exact requirements." delay={0} />
          <GateCard icon={ClipboardCheck} label="Gate 02" title="Application Filing" desc="Forms completed and filed correctly, the first time." delay={80} />
          <GateCard icon={CalendarClock} label="Gate 03" title="Appointment Booking" desc="Your visa appointment scheduled and confirmed on your behalf." delay={160} />
          <GateCard icon={MessagesSquare} label="Gate 04" title="Interview Preparation" desc="A walkthrough of what to expect, so you arrive ready and calm." delay={240} />
        </div>
      </section>

      <RouteDivider />

      <section className="max-w-7xl mx-auto px-6 py-20">
        <SectionHeading eyebrow="Charges" title="Transparent," emphasis="staged fees" sub="Two payments, tied to real milestones — never a lump sum up front." />
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <FeeCard stage="Stage 1 — Profile review" amount="150" unit="EUR" desc="Charged once we've reviewed your profile and shortlisted suitable universities for you." delay={0} highlight />
          <FeeCard stage="Stage 2 — Visa or arrival" amount="1,000" unit="EUR" desc="The remaining service fee, payable once you've received your visa or arrived in Germany." delay={100} />
        </div>
        <Reveal delay={200}>
          <div className="vp-fee-note">
            <CircleDollarSign size={20} color={GOLD} className="flex-shrink-0 mt-0.5" />
            <p className="vp-fee-note-text"><strong>University application fees and Uni-Assist fees are not included</strong> in our service charges and are paid separately, directly by the applicant.</p>
          </div>
        </Reveal>
      </section>

      <RouteDivider />

      <section className="max-w-7xl mx-auto px-6 py-20">
        <Reveal>
          <div className="vp-paper-panel">
            <div className="relative p-8 lg:p-12">
              <div className="flex flex-col items-center text-center mb-10">
                <span className="vp-eyebrow"><span className="vp-eyebrow-dot" /><span className="vp-eyebrow-label">Our commitment</span></span>
                <h2 className="vp-title mt-4 text-3xl md:text-4xl">A note on <span className="foil">how we work</span></h2>
              </div>
              <div className="vp-letter">
                <div className="vp-letter-mark"><ShieldCheck size={20} /></div>
                <div className="vp-letter-title">We're not an agency.</div>
                <p className="vp-letter-body">
                  Applying for your visa independently is entirely possible using embassy websites and public guides. We know the process can be time-consuming and, at times, overwhelming — so if you'd like step-by-step assistance over a longer period, we ask for a reasonable service fee in return for our time and effort. For general questions or basic guidance, we're always happy to help free of charge.
                </p>
                <div className="vp-letter-sign">— Euro Feather Team</div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <Reveal>
          <div className="vp-cta-panel">
            <span className="vp-eyebrow" style={{ justifyContent: 'center', display: 'inline-flex' }}>
              <span className="vp-eyebrow-dot" /><span className="vp-eyebrow-label">Ready when you are</span>
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: INK }}>
              Let's get your visa moving.
            </h2>
            <p className="mt-4 max-w-lg mx-auto text-sm leading-relaxed" style={{ color: MUTED }}>
              Questions about the checklist or the charges? Reach out before you commit to anything — that part is always free.
            </p>
            <a href="/consultation" className="vp-cta-btn"><HandHeart size={16} /> Book Your Free Consultation <ArrowRight size={16} /></a>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}