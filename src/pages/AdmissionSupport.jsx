import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  GraduationCap,
  ClipboardList,
  FileCheck2,
  Languages,
  Compass,
  ScrollText,
  Users2,
  BookOpenCheck,
  IdCard,
  Image,
  FileStack,
  ArrowRight,
  Plane,
} from 'lucide-react';

/* ---------------------------------------------------------------
   ADMISSION SUPPORT — "The Route" identity, namespaced "adm-".
   Two sections: what the service covers, and the document
   checklist applicants need to prepare.
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
    <div ref={ref} className={`adm-reveal ${inView ? 'adm-reveal-visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');
      .adm-root { font-family: 'Inter', sans-serif; background: ${PAPER}; }
      .adm-reveal { opacity: 0; transform: translateY(22px) scale(.985); transition: opacity .65s ${EASE}, transform .65s ${EASE}; }
      .adm-reveal-visible { opacity: 1; transform: translateY(0) scale(1); }
      .adm-eyebrow { display: inline-flex; align-items: center; gap: 10px; }
      .adm-eyebrow-dot { width: 7px; height: 7px; border-radius: 50%; background: ${GOLD}; box-shadow: 0 0 0 3px ${GOLD_TINT}; }
      .adm-eyebrow-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: ${GOLD}; }
      .adm-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; color: ${INK}; letter-spacing: -0.01em; }
      .adm-title .foil { background: ${GOLD_GRADIENT}; background-size: 260% 100%; -webkit-background-clip: text; background-clip: text; color: transparent; animation: admFoil 7s ease-in-out infinite; }
      @keyframes admFoil { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
      .adm-divider { position: relative; max-width: 1280px; margin: 0 auto; padding: 0 24px; }
      .adm-divider::before { content: ''; display: block; height: 0; border-top: 1.5px dashed ${LINE}; }
      .adm-divider .waypoint { position: absolute; left: 50%; top: 0; transform: translate(-50%, -50%); width: 8px; height: 8px; border-radius: 50%; background: ${GOLD}; box-shadow: 0 0 0 4px ${PAPER}; }

      .adm-header { position: relative; overflow: hidden; background: ${PAPER_DIM}; border-bottom: 1px solid ${LINE}; }
      .adm-header::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(ellipse 640px 340px at 12% 0%, ${ROUTE_TINT} 0%, transparent 62%), radial-gradient(ellipse 520px 320px at 100% 100%, ${GOLD_TINT} 0%, transparent 60%); pointer-events: none; }
      .adm-header::after { content: ''; position: absolute; inset: 0; background-image: radial-gradient(${LINE} 1px, transparent 1px); background-size: 24px 24px; -webkit-mask-image: radial-gradient(ellipse 700px 420px at 20% 20%, #000 0%, transparent 72%); mask-image: radial-gradient(ellipse 700px 420px at 20% 20%, #000 0%, transparent 72%); opacity: 0.55; pointer-events: none; }
      .adm-header-plane { position: absolute; top: 30%; left: -6%; color: ${GOLD}; opacity: 0.8; animation: admFly 6.5s ${EASE} infinite; }
      @keyframes admFly { 0% { transform: translateX(0) translateY(0) rotate(8deg); opacity: 0; } 10% { opacity: 0.8; } 90% { opacity: 0.8; } 100% { transform: translateX(112vw) translateY(-30px) rotate(8deg); opacity: 0; } }
      .adm-header-tag { display: inline-flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: ${GOLD}; border: 1px solid rgba(168,129,47,0.35); border-radius: 999px; padding: 7px 14px; }

      .adm-leg-card { position: relative; border-radius: 8px; background: #fff; border: 1px solid ${LINE}; padding: 28px 24px 24px; overflow: hidden; transition: transform .35s ${EASE}, box-shadow .35s ${EASE}, border-color .35s ${EASE}; }
      .adm-leg-card::before { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 3px; background: ${GOLD_GRADIENT}; background-size: 220% 100%; transform: scaleX(0); transform-origin: left; transition: transform .45s ${EASE}; }
      .adm-leg-card:hover { transform: translateY(-6px); box-shadow: 0 30px 54px -26px rgba(30,58,120,0.24); border-color: ${GOLD}; }
      .adm-leg-card:hover::before { transform: scaleX(1); }
      .adm-leg-icon { width: 46px; height: 46px; border-radius: 12px; background: ${GOLD_TINT}; border: 1px solid rgba(168,129,47,0.3); color: ${ROUTE}; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; transition: transform .35s ${EASE}, background-color .35s ${EASE}, color .35s ${EASE}, border-color .35s ${EASE}; }
      .adm-leg-card:hover .adm-leg-icon { transform: translateY(-3px) rotate(-4deg); background: ${ROUTE}; border-color: ${ROUTE}; color: ${PAPER}; }

      .adm-pass-card { border-radius: 14px; background: #fff; border: 1px solid ${LINE}; box-shadow: 0 30px 60px -34px rgba(10,15,31,0.24); overflow: hidden; }
      .adm-pass-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 26px; background: ${INK}; }
      .adm-pass-title { font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 700; color: ${PAPER}; }
      .adm-pass-sub { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: ${GOLD_SOFT}; margin-top: 3px; }
      .adm-pass-count { font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: 700; color: ${PAPER}; }
      .adm-pass-count-label { font-size: 9.5px; color: rgba(250,249,245,0.5); letter-spacing: 0.08em; text-transform: uppercase; }
      .adm-pass-perf { position: relative; height: 0; border-top: 1.5px dashed ${LINE}; }
      .adm-pass-perf::before, .adm-pass-perf::after { content: ''; position: absolute; top: -8px; width: 16px; height: 16px; border-radius: 50%; background: ${PAPER}; }
      .adm-pass-perf::before { left: -8px; } .adm-pass-perf::after { right: -8px; }
      .adm-doc-item { display: flex; align-items: flex-start; gap: 13px; padding: 15px 26px; border-bottom: 1px solid ${LINE}; transition: background-color .2s ${EASE}; }
      .adm-doc-item:last-child { border-bottom: none; }
      .adm-doc-item:hover { background: ${GOLD_TINT}; }
      .adm-doc-icon { width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0; margin-top: 1px; background: ${ROUTE_TINT}; display: flex; align-items: center; justify-content: center; }
      .adm-doc-name { font-size: 14px; font-weight: 600; color: ${INK}; line-height: 1.4; }
      .adm-doc-tag { margin-left: auto; flex-shrink: 0; align-self: center; font-family: 'JetBrains Mono', monospace; font-size: 9.5px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: ${GOLD}; background: ${GOLD_TINT}; padding: 3px 8px; border-radius: 999px; white-space: nowrap; }

      .adm-cta-panel { position: relative; border-radius: 14px; overflow: hidden; background: #F1EFE7; border: 1px solid ${LINE}; padding: 52px 32px; text-align: center; }
      .adm-cta-panel::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(ellipse 640px 340px at 8% 0%, ${ROUTE_TINT} 0%, transparent 62%), radial-gradient(ellipse 520px 320px at 100% 100%, ${GOLD_TINT} 0%, transparent 60%); pointer-events: none; }
      .adm-cta-btn { position: relative; display: inline-flex; align-items: center; gap: 9px; margin-top: 22px; padding: 15px 30px; border-radius: 10px; background: ${GOLD_GRADIENT}; background-size: 220% 100%; color: ${INK}; font-size: 14px; font-weight: 700; transition: background-position .5s ${EASE}, transform .25s ${EASE}; box-shadow: 0 20px 40px -20px rgba(30,58,120,0.35); }
      .adm-cta-btn:hover { background-position: 100% 0; transform: translateY(-2px); }

      @media (max-width: 640px) {
        .adm-cta-panel { padding: 40px 20px; border-radius: 10px; }
        .adm-cta-btn { width: 100%; justify-content: center; }
        .adm-pass-header { padding: 18px 20px; }
        .adm-doc-item { padding: 14px 20px; }
      }
      @media (prefers-reduced-motion: reduce) {
        .adm-root *, .adm-root *::before, .adm-root *::after { transition-duration: 0.001ms !important; animation-duration: 0.001ms !important; }
        .adm-reveal { opacity: 1 !important; transform: none !important; }
        .adm-header-plane { display: none; }
      }
    `}</style>
  );
}

function RouteDivider() {
  return <div className="adm-divider" aria-hidden="true"><span className="waypoint" /></div>;
}

function SectionHeading({ eyebrow, title, emphasis, sub }) {
  return (
    <Reveal className="flex flex-col items-center text-center mb-14">
      <span className="adm-eyebrow"><span className="adm-eyebrow-dot" /><span className="adm-eyebrow-label">{eyebrow}</span></span>
      <h2 className="adm-title mt-4 text-3xl md:text-4xl">{title} <span className="foil">{emphasis}</span></h2>
      {sub && <p className="mt-4 max-w-xl text-sm leading-relaxed" style={{ color: MUTED }}>{sub}</p>}
    </Reveal>
  );
}

function LegCard({ icon: Icon, title, desc, delay }) {
  return (
    <Reveal delay={delay}>
      <div className="adm-leg-card h-full">
        <div className="adm-leg-icon"><Icon size={20} color="currentColor" strokeWidth={1.75} /></div>
        <h3 className="text-[15px] font-bold mb-2" style={{ color: INK, fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{desc}</p>
      </div>
    </Reveal>
  );
}

function DocItem({ icon: Icon, name, tag }) {
  return (
    <div className="adm-doc-item">
      <div className="adm-doc-icon"><Icon size={15} color={ROUTE} /></div>
      <span className="adm-doc-name">{name}</span>
      {tag && <span className="adm-doc-tag">{tag}</span>}
    </div>
  );
}

export default function AdmissionSupport() {
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  const documents = [
    { icon: GraduationCap, name: "Bachelor's certificate", tag: "Master's applicants" },
    { icon: FileStack, name: "Bachelor's transcripts", tag: "Master's applicants" },
    { icon: ScrollText, name: 'Official grading system / scale from your university' },
    { icon: Users2, name: 'Letter of recommendation from a professor' },
    { icon: BookOpenCheck, name: 'HSC certificate and transcript' },
    { icon: BookOpenCheck, name: 'SSC certificate and transcript' },
    { icon: Languages, name: 'Language certificate (IELTS or equivalent)' },
    { icon: FileCheck2, name: 'Medium of Instruction certificate' },
    { icon: IdCard, name: 'Passport copy' },
    { icon: Image, name: 'One passport-size photograph' },
  ];

  return (
    <div className="adm-root">
      <GlobalStyle />
      <Navbar />

      <section className="adm-header">
        <Plane size={24} className="adm-header-plane" />
        <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-20 flex flex-col items-center text-center">
          <Reveal className="flex flex-col items-center">
            <span className="adm-header-tag"><GraduationCap size={13} /> G01 — Admission Support</span>
            <h1 className="mt-6 text-4xl md:text-5xl leading-[1.1]" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: INK, maxWidth: 700 }}>
              Bachelor's, Master's &amp; language programs — one application, fully handled.
            </h1>
            <p className="mt-6 text-base leading-relaxed" style={{ color: MUTED, maxWidth: 560 }}>
              You gather the documents. We shortlist the right universities, prepare your application and submit it — start to finish.
            </p>
          </Reveal>
        </div>
      </section>

      <RouteDivider />

      <section className="max-w-7xl mx-auto px-6 py-20">
        <SectionHeading eyebrow="What's included" title="From shortlist to" emphasis="submission" sub="Every applicant gets the same careful process, matched to Bachelor's, Master's and language-program routes alike." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <LegCard icon={ClipboardList} title="Profile review" desc="We assess your grades, background and goals before naming a single university." delay={0} />
          <LegCard icon={Compass} title="University shortlisting" desc="A shortlist built around where you'll realistically get in and thrive." delay={80} />
          <LegCard icon={FileCheck2} title="Application preparation" desc="Every document checked and formatted to each university's requirements." delay={160} />
          <LegCard icon={Languages} title="Language program guidance" desc="Support choosing and applying to language courses when they're part of your route." delay={240} />
          <LegCard icon={ScrollText} title="Submission & tracking" desc="We submit your application and follow up with the university on your behalf." delay={320} />
          <LegCard icon={Users2} title="Ongoing updates" desc="You hear from us at every milestone — no chasing required on your end." delay={400} />
        </div>
      </section>

      <RouteDivider />

      <section className="max-w-5xl mx-auto px-6 py-20">
        <SectionHeading eyebrow="Checklist" title="Documents you'll" emphasis="need to prepare" sub="This is the only real work on your side. Once these are ready, we take it from here." />
        <Reveal>
          <div className="adm-pass-card">
            <div className="adm-pass-header">
              <div>
                <div className="adm-pass-title">Application Document Set</div>
                <div className="adm-pass-sub">Bachelor's &amp; Master's</div>
              </div>
              <div className="text-right">
                <div className="adm-pass-count">{documents.length}</div>
                <div className="adm-pass-count-label">Items</div>
              </div>
            </div>
            <div className="adm-pass-perf" />
            <div>{documents.map((doc, i) => <DocItem key={i} {...doc} />)}</div>
          </div>
        </Reveal>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <Reveal>
          <div className="adm-cta-panel">
            <span className="adm-eyebrow" style={{ justifyContent: 'center', display: 'inline-flex' }}>
              <span className="adm-eyebrow-dot" /><span className="adm-eyebrow-label">Ready to apply</span>
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: INK }}>
              Start with a free profile review.
            </h2>
            <p className="mt-4 max-w-lg mx-auto text-sm leading-relaxed" style={{ color: MUTED }}>
              Send us your documents and we'll tell you honestly where you stand — no obligation.
            </p>
            <a href="/consultation" className="adm-cta-btn">Book Your Free Consultation <ArrowRight size={16} /></a>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}