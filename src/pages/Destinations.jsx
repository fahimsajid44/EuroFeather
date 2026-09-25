import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  MapPin,
  Wallet,
  Briefcase,
  Languages,
  Landmark,
  ArrowRight,
  Plane,
  Sparkles,
  Clock,
} from 'lucide-react';

/* ---------------------------------------------------------------
   DESTINATIONS — "The Route" identity, namespaced "dest-".
   Germany is the primary, fully-built destination; every other
   country is shown as a quiet "coming soon" waypoint rather than
   a competing option, so the page reads as one clear route rather
   than a menu of equal choices.
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
    <div ref={ref} className={`dest-reveal ${inView ? 'dest-reveal-visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');
      .dest-root { font-family: 'Inter', sans-serif; background: ${PAPER}; }
      .dest-reveal { opacity: 0; transform: translateY(22px) scale(.985); transition: opacity .65s ${EASE}, transform .65s ${EASE}; }
      .dest-reveal-visible { opacity: 1; transform: translateY(0) scale(1); }
      .dest-eyebrow { display: inline-flex; align-items: center; gap: 10px; }
      .dest-eyebrow-dot { width: 7px; height: 7px; border-radius: 50%; background: ${GOLD}; box-shadow: 0 0 0 3px ${GOLD_TINT}; }
      .dest-eyebrow-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: ${GOLD}; }
      .dest-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; color: ${INK}; letter-spacing: -0.01em; }
      .dest-title .foil { background: ${GOLD_GRADIENT}; background-size: 260% 100%; -webkit-background-clip: text; background-clip: text; color: transparent; animation: destFoil 7s ease-in-out infinite; }
      @keyframes destFoil { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
      .dest-divider { position: relative; max-width: 1280px; margin: 0 auto; padding: 0 24px; }
      .dest-divider::before { content: ''; display: block; height: 0; border-top: 1.5px dashed ${LINE}; }
      .dest-divider .waypoint { position: absolute; left: 50%; top: 0; transform: translate(-50%, -50%); width: 8px; height: 8px; border-radius: 50%; background: ${GOLD}; box-shadow: 0 0 0 4px ${PAPER}; }

      /* --- header --- */
      .dest-header { position: relative; overflow: hidden; background: ${PAPER_DIM}; border-bottom: 1px solid ${LINE}; }
      .dest-header::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(ellipse 640px 340px at 12% 0%, ${ROUTE_TINT} 0%, transparent 62%), radial-gradient(ellipse 520px 320px at 100% 100%, ${GOLD_TINT} 0%, transparent 60%); pointer-events: none; }
      .dest-header::after { content: ''; position: absolute; inset: 0; background-image: radial-gradient(${LINE} 1px, transparent 1px); background-size: 24px 24px; -webkit-mask-image: radial-gradient(ellipse 700px 420px at 20% 20%, #000 0%, transparent 72%); mask-image: radial-gradient(ellipse 700px 420px at 20% 20%, #000 0%, transparent 72%); opacity: 0.55; pointer-events: none; }
      .dest-header-plane { position: absolute; top: 30%; left: -6%; color: ${GOLD}; opacity: 0.8; animation: destFly 6.5s ${EASE} infinite; }
      @keyframes destFly { 0% { transform: translateX(0) translateY(0) rotate(8deg); opacity: 0; } 10% { opacity: 0.8; } 90% { opacity: 0.8; } 100% { transform: translateX(112vw) translateY(-30px) rotate(8deg); opacity: 0; } }
      .dest-header-tag { display: inline-flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: ${GOLD}; border: 1px solid rgba(168,129,47,0.35); border-radius: 999px; padding: 7px 14px; }

      /* --- Germany spotlight panel: the destination "boarding pass"
             with a large flag, headline stats and a route stamp --- */
      .dest-spotlight {
        position: relative; border-radius: 16px; overflow: hidden;
        background: #ffffff; border: 1px solid ${LINE};
        box-shadow: 0 40px 80px -40px rgba(10,15,31,0.28);
      }
      .dest-spotlight-band {
        height: 6px; width: 100%;
        background: linear-gradient(90deg, #1a1a1a 0 33.33%, #DD0000 33.33% 66.66%, #FFCE00 66.66% 100%);
      }
      .dest-spotlight-stamp {
        position: absolute; top: 28px; right: 28px;
        width: 74px; height: 74px; border-radius: 50%;
        border: 1.5px dashed ${GOLD};
        display: flex; align-items: center; justify-content: center;
        transform: rotate(-8deg);
      }
      .dest-spotlight-stamp-inner {
        font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 700;
        letter-spacing: 0.08em; text-transform: uppercase; color: ${GOLD};
        text-align: center; line-height: 1.5;
      }
      .dest-stat { border-radius: 10px; border: 1px solid ${LINE}; background: ${PAPER_DIM}; padding: 16px 18px; }
      .dest-stat-num { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 24px; color: ${INK}; }
      .dest-stat-label { font-size: 11.5px; color: ${MUTED}; margin-top: 3px; line-height: 1.4; }

      /* --- reason cards --- */
      .dest-leg-card { position: relative; border-radius: 8px; background: #fff; border: 1px solid ${LINE}; padding: 28px 24px 24px; overflow: hidden; transition: transform .35s ${EASE}, box-shadow .35s ${EASE}, border-color .35s ${EASE}; }
      .dest-leg-card::before { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 3px; background: ${GOLD_GRADIENT}; background-size: 220% 100%; transform: scaleX(0); transform-origin: left; transition: transform .45s ${EASE}; }
      .dest-leg-card:hover { transform: translateY(-6px); box-shadow: 0 30px 54px -26px rgba(30,58,120,0.24); border-color: ${GOLD}; }
      .dest-leg-card:hover::before { transform: scaleX(1); }
      .dest-leg-icon { width: 46px; height: 46px; border-radius: 12px; background: ${GOLD_TINT}; border: 1px solid rgba(168,129,47,0.3); color: ${ROUTE}; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; transition: transform .35s ${EASE}, background-color .35s ${EASE}, color .35s ${EASE}, border-color .35s ${EASE}; }
      .dest-leg-card:hover .dest-leg-icon { transform: translateY(-3px) rotate(-4deg); background: ${ROUTE}; border-color: ${ROUTE}; color: ${PAPER}; }

      /* --- upcoming destinations: same dest-card as Home, but with
             a "coming soon" ribbon and reduced opacity so Germany
             stays the clear focus --- */
      .dest-soon-card {
        position: relative; border-radius: 6px; background: #ffffff;
        border: 1px dashed ${LINE}; padding: 18px 14px 16px; text-align: center;
        height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;
        transition: transform .3s ${EASE}, border-color .3s ${EASE};
      }
      .dest-soon-card:hover { transform: translateY(-3px); border-color: ${GOLD}; }
      .dest-soon-flag { opacity: 0.72; filter: grayscale(0.15); }
      .dest-soon-name { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 13px; color: ${INK}; margin-top: 10px; }
      .dest-soon-tag {
        margin-top: 8px;
        display: inline-flex; align-items: center; gap: 4px;
        font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 600;
        letter-spacing: 0.08em; text-transform: uppercase; color: ${GOLD};
        background: ${GOLD_TINT}; padding: 3px 8px; border-radius: 999px;
      }

      .dest-paper-panel { position: relative; border-radius: 14px; background: ${PAPER_DIM}; border: 1px solid ${LINE}; overflow: hidden; }
      .dest-paper-panel::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(ellipse 640px 340px at 8% 0%, ${ROUTE_TINT} 0%, transparent 62%), radial-gradient(ellipse 520px 320px at 100% 100%, ${GOLD_TINT} 0%, transparent 60%); pointer-events: none; }

      .dest-cta-panel { position: relative; border-radius: 14px; overflow: hidden; background: ${PAPER_DIM}; border: 1px solid ${LINE}; padding: 52px 32px; text-align: center; }
      .dest-cta-panel::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(ellipse 640px 340px at 8% 0%, ${ROUTE_TINT} 0%, transparent 62%), radial-gradient(ellipse 520px 320px at 100% 100%, ${GOLD_TINT} 0%, transparent 60%); pointer-events: none; }
      .dest-cta-btn { position: relative; display: inline-flex; align-items: center; gap: 9px; margin-top: 22px; padding: 15px 30px; border-radius: 10px; background: ${GOLD_GRADIENT}; background-size: 220% 100%; color: ${INK}; font-size: 14px; font-weight: 700; transition: background-position .5s ${EASE}, transform .25s ${EASE}; box-shadow: 0 20px 40px -20px rgba(30,58,120,0.35); }
      .dest-cta-btn:hover { background-position: 100% 0; transform: translateY(-2px); }

      @media (max-width: 640px) {
        .dest-cta-panel { padding: 40px 20px; border-radius: 10px; }
        .dest-cta-btn { width: 100%; justify-content: center; }
        .dest-spotlight-stamp { width: 60px; height: 60px; top: 18px; right: 18px; }
      }
      @media (prefers-reduced-motion: reduce) {
        .dest-root *, .dest-root *::before, .dest-root *::after { transition-duration: 0.001ms !important; animation-duration: 0.001ms !important; }
        .dest-reveal { opacity: 1 !important; transform: none !important; }
        .dest-header-plane { display: none; }
      }
    `}</style>
  );
}

/* ---------------------------- flags ---------------------------- */

function Flag({ children, small }) {
  return (
    <div
      className="rounded overflow-hidden flex-shrink-0 mx-auto"
      style={{ width: small ? 48 : 72, height: small ? 34 : 52, boxShadow: '0 2px 6px rgba(10,15,31,0.16)', border: '1px solid rgba(10,15,31,0.08)' }}
    >
      {children}
    </div>
  );
}
function GermanyFlag({ small }) {
  return <Flag small={small}><div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <div style={{ flex: 1, background: '#1a1a1a' }} /><div style={{ flex: 1, background: '#DD0000' }} /><div style={{ flex: 1, background: '#FFCE00' }} />
  </div></Flag>;
}
function HungaryFlag({ small }) {
  return <Flag small={small}><div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <div style={{ flex: 1, background: '#CE2939' }} /><div style={{ flex: 1, background: '#ffffff' }} /><div style={{ flex: 1, background: '#477050' }} />
  </div></Flag>;
}
function SouthKoreaFlag({ small }) {
  return <Flag small={small}><div style={{ height: '100%', width: '100%', background: '#ffffff', position: 'relative' }}>
    <div style={{ position: 'absolute', top: '50%', left: '50%', width: 16, height: 16, transform: 'translate(-50%,-50%)', borderRadius: '9999px', overflow: 'hidden', background: 'conic-gradient(#C60C30 0deg 180deg, #003478 180deg 360deg)' }} />
  </div></Flag>;
}
function EstoniaFlag({ small }) {
  return <Flag small={small}><div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <div style={{ flex: 1, background: '#0072CE' }} /><div style={{ flex: 1, background: '#000000' }} /><div style={{ flex: 1, background: '#ffffff' }} />
  </div></Flag>;
}
function SpainFlag({ small }) {
  return <Flag small={small}><div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <div style={{ flex: 1, background: '#AA151B' }} /><div style={{ flex: 2, background: '#F1BF00' }} /><div style={{ flex: 1, background: '#AA151B' }} />
  </div></Flag>;
}
function ItalyFlag({ small }) {
  return <Flag small={small}><div style={{ height: '100%', display: 'flex' }}>
    <div style={{ flex: 1, background: '#008C45' }} /><div style={{ flex: 1, background: '#ffffff' }} /><div style={{ flex: 1, background: '#CD212A' }} />
  </div></Flag>;
}

/* ---------------------------- pieces ---------------------------- */

function RouteDivider() {
  return <div className="dest-divider" aria-hidden="true"><span className="waypoint" /></div>;
}

function SectionHeading({ eyebrow, title, emphasis, sub }) {
  return (
    <Reveal className="flex flex-col items-center text-center mb-14">
      <span className="dest-eyebrow"><span className="dest-eyebrow-dot" /><span className="dest-eyebrow-label">{eyebrow}</span></span>
      <h2 className="dest-title mt-4 text-3xl md:text-4xl">{title} <span className="foil">{emphasis}</span></h2>
      {sub && <p className="mt-4 max-w-xl text-sm leading-relaxed" style={{ color: MUTED }}>{sub}</p>}
    </Reveal>
  );
}

function LegCard({ icon: Icon, title, desc, delay }) {
  return (
    <Reveal delay={delay}>
      <div className="dest-leg-card h-full">
        <div className="dest-leg-icon"><Icon size={20} color="currentColor" strokeWidth={1.75} /></div>
        <h3 className="text-[15px] font-bold mb-2" style={{ color: INK, fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{desc}</p>
      </div>
    </Reveal>
  );
}

function SoonCard({ flag, name, delay }) {
  return (
    <Reveal delay={delay} className="h-full">
      <div className="dest-soon-card">
        <div className="dest-soon-flag">{flag}</div>
        <span className="dest-soon-name">{name}</span>
        <span className="dest-soon-tag"><Clock size={10} /> Coming soon</span>
      </div>
    </Reveal>
  );
}

/* ---------------------------- page ---------------------------- */

export default function Destinations() {
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  const upcoming = [
    { flag: <HungaryFlag />, name: 'Hungary' },
    { flag: <SouthKoreaFlag />, name: 'South Korea' },
    { flag: <EstoniaFlag />, name: 'Estonia' },
    { flag: <SpainFlag />, name: 'Spain' },
    { flag: <ItalyFlag />, name: 'Italy' },
  ];

  return (
    <div className="dest-root">
      <GlobalStyle />
      <Navbar />

      {/* HEADER */}
      <section className="dest-header">
        <Plane size={24} className="dest-header-plane" />
        <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-20 flex flex-col items-center text-center">
          <Reveal className="flex flex-col items-center">
            <span className="dest-header-tag"><MapPin size={13} /> Destinations</span>
            <h1 className="mt-6 text-4xl md:text-5xl leading-[1.1]" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: INK, maxWidth: 700 }}>
              Right now, our route leads to one place: Germany.
            </h1>
            <p className="mt-6 text-base leading-relaxed" style={{ color: MUTED, maxWidth: 560 }}>
              We've built our admission, visa and pre-departure process specifically around German universities — so every applicant gets deep, current expertise, not a scattered list of countries.
            </p>
          </Reveal>
        </div>
      </section>

      <RouteDivider />

      {/* GERMANY SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <SectionHeading eyebrow="Primary destination" title="Study in" emphasis="Germany" sub="Tuition-free public universities, English-taught Master's programs, and a job market that welcomes international graduates." />
        <Reveal>
          <div className="dest-spotlight">
            <div className="dest-spotlight-band" />
            <div className="relative p-8 lg:p-12">
              <div className="dest-spotlight-stamp">
                <span className="dest-spotlight-stamp-inner">Route<br />Verified</span>
              </div>
              <div className="flex flex-col md:flex-row gap-10 items-start">
                <GermanyFlag />
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: INK }}>
                    Federal Republic of Germany
                  </h3>
                  <p className="text-sm leading-relaxed mb-8" style={{ color: MUTED, maxWidth: 560 }}>
                    Home to some of Europe's strongest universities and a public higher-education system that charges little to no tuition — even for most international students. We work exclusively with recognized institutions, matched against the H+, H- and H+/- listings.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="dest-stat">
                      <div className="dest-stat-num">0€</div>
                      <div className="dest-stat-label">Tuition at most public universities</div>
                    </div>
                    <div className="dest-stat">
                      <div className="dest-stat-num">400+</div>
                      <div className="dest-stat-label">English-taught degree programs</div>
                    </div>
                    <div className="dest-stat">
                      <div className="dest-stat-num">18mo</div>
                      <div className="dest-stat-label">Post-study job-seeker visa</div>
                    </div>
                    <div className="dest-stat">
                      <div className="dest-stat-num">H+/H-</div>
                      <div className="dest-stat-label">Recognized-university filter we apply</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <RouteDivider />

      {/* WHY GERMANY */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <SectionHeading eyebrow="Why we focus here" title="Built around what" emphasis="Germany offers" sub="Four reasons Germany is where most of our students land — and why our process is built specifically for it." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <LegCard icon={Wallet} title="Low cost of study" desc="Little to no tuition at public universities, with a comparatively affordable cost of living." delay={0} />
          <LegCard icon={Languages} title="English-taught options" desc="A growing number of Bachelor's and Master's programs taught fully in English." delay={80} />
          <LegCard icon={Briefcase} title="Strong job market" desc="A post-study visa that gives graduates real time to find skilled work." delay={160} />
          <LegCard icon={Landmark} title="Recognized institutions" desc="We only work with H+, H- and H+/- listed universities, so your degree is properly recognized." delay={240} />
        </div>
      </section>

      <RouteDivider />

      {/* UPCOMING DESTINATIONS */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <Reveal>
          <div className="dest-paper-panel">
            <div className="relative p-8 lg:p-12">
              <div className="flex flex-col items-center text-center mb-12">
                <span className="dest-eyebrow"><Sparkles size={13} color={GOLD} /><span className="dest-eyebrow-label ml-1">On the horizon</span></span>
                <h2 className="dest-title mt-4 text-3xl md:text-4xl">More destinations, <span className="foil">coming soon</span></h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed" style={{ color: MUTED }}>
                  We're expanding carefully, one country at a time, so every destination we add gets the same depth of support as Germany does today.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
                {upcoming.map((c, i) => (
                  <SoonCard key={c.name} flag={c.flag} name={c.name} delay={i * 60} />
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <Reveal>
          <div className="dest-cta-panel">
            <span className="dest-eyebrow" style={{ justifyContent: 'center', display: 'inline-flex' }}>
              <span className="dest-eyebrow-dot" /><span className="dest-eyebrow-label">Start your route to Germany</span>
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: INK }}>
              Let's see where you fit in Germany.
            </h2>
            <p className="mt-4 max-w-lg mx-auto text-sm leading-relaxed" style={{ color: MUTED }}>
              A free consultation is the fastest way to know which universities and courses are realistic for you.
            </p>
            <a href="/consultation" className="dest-cta-btn">Book Your Free Consultation <ArrowRight size={16} /></a>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}