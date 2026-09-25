import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  CheckCircle2,
  CreditCard,
  ClipboardList,
  ShieldAlert,
  Plane,
  ArrowRight,
  FileCheck2,
  HandHeart,
} from 'lucide-react';

/* ---------------------------------------------------------------
   TERMS & CONDITIONS — same "Route" identity as every other page
   (Navbar / Hero / Home / About / Contact / Footer): paper field,
   sapphire route line, single gilt accent, Space Grotesk / Inter /
   JetBrains Mono. Class names stay namespaced "terms-" to avoid
   collision with the other pages' identical tokens.

   Signature treatment: the two things a prospective client actually
   needs to check before agreeing — the document checklist and the
   fee schedule — are drawn as a boarding-pass-style two-part ticket
   (checklist coupon + fee stub, torn perforation between them), the
   same object language Contact and About already established.
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
      className={`terms-reveal ${inView ? 'terms-reveal-visible' : ''} ${className}`}
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

      .terms-root { font-family: 'Inter', sans-serif; background: ${PAPER}; }

      .terms-reveal {
        opacity: 0;
        transform: translateY(22px) scale(.985);
        transition: opacity .7s ${EASE}, transform .7s ${EASE};
        will-change: transform, opacity;
      }
      .terms-reveal-visible { opacity: 1; transform: translateY(0) scale(1); }

      .terms-eyebrow { display: inline-flex; align-items: center; gap: 10px; }
      .terms-eyebrow-dot {
        width: 7px; height: 7px; border-radius: 50%; background: ${GOLD};
        box-shadow: 0 0 0 3px ${GOLD_TINT};
      }
      .terms-eyebrow-label {
        font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600;
        letter-spacing: 0.16em; text-transform: uppercase; color: ${GOLD};
      }
      .terms-title {
        font-family: 'Space Grotesk', sans-serif; font-weight: 700; color: ${INK};
        letter-spacing: -0.01em;
      }
      .terms-title .foil {
        background: ${GOLD_GRADIENT}; background-size: 260% 100%;
        -webkit-background-clip: text; background-clip: text; color: transparent;
        animation: termsFoilSweep 7s ease-in-out infinite;
      }
      @keyframes termsFoilSweep {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }

      .terms-route-divider { position: relative; max-width: 1280px; margin: 0 auto; padding: 0 24px; }
      .terms-route-divider::before { content: ''; display: block; height: 0; border-top: 1.5px dashed ${LINE}; }
      .terms-route-divider .waypoint {
        position: absolute; left: 50%; top: 0; transform: translate(-50%, -50%);
        width: 8px; height: 8px; border-radius: 50%; background: ${GOLD};
        box-shadow: 0 0 0 4px ${PAPER};
      }

      /* --- header band, same wash as About/Contact --- */
      .terms-header { position: relative; overflow: hidden; background: ${PAPER_DIM}; border-bottom: 1px solid ${LINE}; }
      .terms-header::before {
        content: ''; position: absolute; inset: 0;
        background-image:
          radial-gradient(ellipse 640px 340px at 12% 0%, ${ROUTE_TINT} 0%, transparent 62%),
          radial-gradient(ellipse 520px 320px at 100% 100%, ${GOLD_TINT} 0%, transparent 60%);
        pointer-events: none;
      }
      .terms-header::after {
        content: ''; position: absolute; inset: 0;
        background-image: radial-gradient(${LINE} 1px, transparent 1px);
        background-size: 24px 24px;
        -webkit-mask-image: radial-gradient(ellipse 700px 420px at 20% 20%, #000 0%, transparent 72%);
        mask-image: radial-gradient(ellipse 700px 420px at 20% 20%, #000 0%, transparent 72%);
        opacity: 0.55; pointer-events: none;
      }

      /* --- intro / scope card --- */
      .terms-intro-card {
        position: relative; border-radius: 14px; background: #ffffff;
        border: 1px solid ${LINE}; padding: 34px 32px;
        box-shadow: 0 30px 60px -34px rgba(10,15,31,0.2);
      }
      .terms-intro-card p { font-size: 14.5px; line-height: 1.75; color: ${MUTED}; }
      .terms-intro-card p + p { margin-top: 14px; }
      .terms-intro-card strong { color: ${INK}; font-weight: 700; }

      /* =================================================================
         DOCUMENT + FEE TICKET — checklist coupon torn from a fee stub.
      ================================================================= */
      .terms-ticket {
        position: relative; display: flex; border-radius: 16px; overflow: visible;
        background: #ffffff; border: 1px solid ${LINE};
        box-shadow: 0 40px 80px -40px rgba(10,15,31,0.28);
      }
      .terms-ticket-main { flex: 1 1 62%; padding: 38px 40px; }
      .terms-ticket-perf { position: relative; flex: 0 0 0; width: 0; border-left: 2px dashed ${LINE}; }
      .terms-ticket-perf::before, .terms-ticket-perf::after {
        content: ''; position: absolute; left: -13px; width: 26px; height: 26px;
        border-radius: 50%; background: ${PAPER};
      }
      .terms-ticket-perf::before { top: -13px; }
      .terms-ticket-perf::after { bottom: -13px; }
      .terms-ticket-stub {
        flex: 1 1 38%; padding: 38px 34px; background: ${PAPER_DIM};
        border-radius: 0 16px 16px 0;
      }

      .terms-ticket-kicker {
        display: flex; align-items: center; gap: 9px;
        font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 600;
        letter-spacing: 0.14em; text-transform: uppercase; color: ${GOLD};
        border-bottom: 1px dashed ${LINE}; padding-bottom: 16px; margin-bottom: 20px;
      }

      .terms-doc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 24px; }
      .terms-doc-item { display: flex; align-items: flex-start; gap: 10px; font-size: 13.5px; color: ${INK}; line-height: 1.5; }
      .terms-doc-item svg { flex-shrink: 0; margin-top: 1.5px; color: ${ROUTE}; }

      .terms-fee-line { display: flex; flex-direction: column; gap: 4px; padding: 16px 0; border-bottom: 1px dashed ${LINE}; }
      .terms-fee-line:last-of-type { border-bottom: none; }
      .terms-fee-label {
        font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 600;
        letter-spacing: 0.1em; text-transform: uppercase; color: ${MUTED};
      }
      .terms-fee-value { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 24px; color: ${INK}; }
      .terms-fee-note { font-size: 12px; color: ${MUTED}; line-height: 1.5; }

      .terms-fee-total {
        margin-top: 18px; padding-top: 16px; border-top: 1.5px solid ${LINE};
        display: flex; align-items: baseline; justify-content: space-between;
      }
      .terms-fee-total-label { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; color: ${GOLD}; }
      .terms-fee-total-value { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 20px; color: ${GOLD}; }

      .terms-excl-note {
        margin-top: 16px; font-size: 11.5px; line-height: 1.55; color: ${MUTED};
        padding: 12px 14px; border-radius: 8px; background: #ffffff; border: 1px dashed ${LINE};
      }

      @media (max-width: 760px) {
        .terms-ticket { flex-direction: column; }
        .terms-ticket-main { padding: 30px 26px; }
        .terms-ticket-perf { width: auto; height: 0; border-left: none; border-top: 2px dashed ${LINE}; }
        .terms-ticket-perf::before, .terms-ticket-perf::after { top: -13px; left: auto; }
        .terms-ticket-perf::before { left: -13px; }
        .terms-ticket-perf::after { right: -13px; left: auto; }
        .terms-ticket-stub { border-radius: 0 0 16px 16px; padding: 30px 26px; }
        .terms-doc-grid { grid-template-columns: 1fr; }
      }

      /* --- scope card (what's included) --- */
      .terms-scope-card {
        position: relative; border-radius: 10px; background: #ffffff;
        border: 1px solid ${LINE}; padding: 24px;
        transition: transform .35s ${EASE}, border-color .35s ${EASE}, box-shadow .35s ${EASE};
      }
      .terms-scope-card:hover { transform: translateY(-4px); border-color: ${GOLD}; box-shadow: 0 26px 46px -26px rgba(30,58,120,0.22); }
      .terms-scope-icon {
        width: 40px; height: 40px; border-radius: 10px;
        background: ${GOLD_TINT}; border: 1px solid rgba(168,129,47,0.3);
        display: flex; align-items: center; justify-content: center; margin-bottom: 16px; color: ${ROUTE};
      }
      .terms-scope-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 14.5px; color: ${INK}; margin-bottom: 8px; }
      .terms-scope-desc { font-size: 13px; line-height: 1.6; color: ${MUTED}; }

      /* --- important note callout --- */
      .terms-note {
        position: relative; border-radius: 14px; overflow: hidden;
        background: ${PAPER_DIM}; border: 1px solid rgba(168,129,47,0.35);
        padding: 32px 30px;
      }
      .terms-note::before {
        content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px;
        background: ${GOLD_GRADIENT};
      }
      .terms-note-head { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
      .terms-note-icon {
        width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
        background: ${GOLD_TINT}; border: 1px solid rgba(168,129,47,0.35);
        display: flex; align-items: center; justify-content: center; color: ${GOLD};
      }
      .terms-note-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15.5px; color: ${INK}; }
      .terms-note p { font-size: 13.5px; line-height: 1.7; color: ${MUTED}; }
      .terms-note p + p { margin-top: 12px; }

      /* --- closing CTA, shared visual language with Home/About --- */
      .terms-boarding-panel {
        position: relative; border-radius: 14px; overflow: hidden;
        background: ${PAPER_DIM}; border: 1px solid ${LINE};
        padding: 56px 32px; text-align: center;
      }
      .terms-boarding-panel::before {
        content: ''; position: absolute; inset: 0;
        background-image:
          radial-gradient(ellipse 640px 340px at 8% 0%, ${ROUTE_TINT} 0%, transparent 62%),
          radial-gradient(ellipse 520px 320px at 100% 100%, ${GOLD_TINT} 0%, transparent 60%);
        pointer-events: none;
      }
      .terms-boarding-panel::after {
        content: ''; position: absolute; inset: 0;
        background-image: radial-gradient(${LINE} 1px, transparent 1px);
        background-size: 24px 24px;
        -webkit-mask-image: radial-gradient(ellipse 700px 420px at 30% 20%, #000 0%, transparent 72%);
        mask-image: radial-gradient(ellipse 700px 420px at 30% 20%, #000 0%, transparent 72%);
        opacity: 0.55; pointer-events: none;
      }
      .terms-boarding-plane {
        position: absolute; top: 18%; left: -6%; color: ${GOLD}; opacity: 0.9;
        animation: termsBoardingFly 5.5s ${EASE} infinite;
      }
      @keyframes termsBoardingFly {
        0% { transform: translateX(0) translateY(0) rotate(8deg); opacity: 0; }
        10% { opacity: 0.9; } 90% { opacity: 0.9; }
        100% { transform: translateX(112vw) translateY(-34px) rotate(8deg); opacity: 0; }
      }
      .terms-boarding-cta {
        position: relative; display: inline-flex; align-items: center; gap: 9px;
        margin-top: 26px; padding: 15px 30px; border-radius: 10px;
        background: ${GOLD_GRADIENT}; background-size: 220% 100%;
        color: ${INK}; font-size: 14px; font-weight: 700; cursor: pointer;
        transition: background-position .5s ${EASE}, transform .25s ${EASE};
        box-shadow: 0 20px 40px -20px rgba(30,58,120,0.35);
      }
      .terms-boarding-cta:hover { background-position: 100% 0; transform: translateY(-2px); }
      .terms-boarding-cta:active { transform: translateY(0) scale(.98); }

      @media (max-width: 640px) {
        .terms-boarding-panel { padding: 40px 20px; border-radius: 10px; }
        .terms-boarding-cta { width: 100%; justify-content: center; padding: 14px 22px; }
        .terms-intro-card { padding: 26px 22px; }
      }

      @media (prefers-reduced-motion: reduce) {
        .terms-root *, .terms-root *::before, .terms-root *::after {
          transition-duration: 0.001ms !important;
          animation-duration: 0.001ms !important;
        }
        .terms-reveal { opacity: 1 !important; transform: none !important; }
        .terms-boarding-plane { display: none; }
      }
    `}</style>
  );
}

/* ---------------------------- pieces ---------------------------- */

function RouteDivider() {
  return (
    <div className="terms-route-divider" aria-hidden="true">
      <span className="waypoint" />
    </div>
  );
}

function SectionHeading({ eyebrow, title, emphasis, sub }) {
  return (
    <Reveal className="flex flex-col items-center text-center mb-14">
      <span className="terms-eyebrow">
        <span className="terms-eyebrow-dot" />
        <span className="terms-eyebrow-label">{eyebrow}</span>
      </span>
      <h2 className="terms-title mt-4 text-3xl md:text-4xl">
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

function DocItem({ children }) {
  return (
    <div className="terms-doc-item">
      <CheckCircle2 size={16} strokeWidth={2} />
      <span>{children}</span>
    </div>
  );
}

function ScopeCard({ icon: Icon, title, desc, delay }) {
  return (
    <Reveal delay={delay}>
      <div className="terms-scope-card h-full">
        <div className="terms-scope-icon">
          <Icon size={18} strokeWidth={1.75} />
        </div>
        <div className="terms-scope-title">{title}</div>
        <div className="terms-scope-desc">{desc}</div>
      </div>
    </Reveal>
  );
}

/* ---------------------------- page ---------------------------- */

export default function TermsAndConditions() {
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  const documents = [
    "Bachelor's certificate (for Master's applicants)",
    "Bachelor's transcripts (for Master's applicants)",
    'Official grading system / scale from your university',
    'Letter of recommendation from a professor',
    'HSC (Higher Secondary Certificate) certificate and transcript',
    'SSC (Secondary School Certificate) certificate and transcript',
    'Language certificate (IELTS or equivalent)',
    'Medium of Instruction certificate',
    'Passport copy',
    'One passport-size photograph',
  ];

  return (
    <div className="terms-root">
      <GlobalStyle />

      <Navbar />

      {/* HEADER */}
      <section className="terms-header">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20 relative text-center">
          <Reveal className="flex flex-col items-center">
            <span className="terms-eyebrow">
              <span className="terms-eyebrow-dot" />
              <span className="terms-eyebrow-label">Please read before proceeding</span>
            </span>
            <h1 className="terms-title mt-4 text-4xl md:text-5xl">
              Terms &amp; <span className="foil">Conditions</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm md:text-base leading-relaxed" style={{ color: MUTED }}>
              What we ask for, what we charge, and what we actually do once you agree to work with us.
            </p>
          </Reveal>
        </div>
      </section>

      <RouteDivider />

      {/* INTRO / SCOPE */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <Reveal>
          <div className="terms-intro-card">
            <p>
              Thank you for reaching out. Once you agree to the terms set out on this page,
              we will handle your application on your behalf — from your first shortlist to
              the day you arrive in Germany. Below is what we ask you to prepare, what our
              service costs, and exactly where our responsibility begins and ends.
            </p>
            <p>
              By booking a consultation or sending us your documents, you confirm that you have
              read and agree to the terms described here.
            </p>
          </div>
        </Reveal>
      </section>

      <RouteDivider />

      {/* DOCUMENT CHECKLIST + FEE TICKET */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <SectionHeading
          eyebrow="Before you apply"
          title="Documents &amp;"
          emphasis="Charges"
          sub="One coupon for what to prepare, one stub for what it costs — the two things worth checking before you commit."
        />
        <Reveal>
          <div className="terms-ticket">
            {/* documents coupon */}
            <div className="terms-ticket-main">
              <div className="terms-ticket-kicker">
                <ClipboardList size={14} />
                Required Documents — Bachelor's &amp; Master's
              </div>
              <div className="terms-doc-grid">
                {documents.map((doc) => (
                  <DocItem key={doc}>{doc}</DocItem>
                ))}
              </div>
            </div>

            <div className="terms-ticket-perf" aria-hidden="true" />

            {/* fee stub */}
            <div className="terms-ticket-stub">
              <div className="terms-ticket-kicker">
                <CreditCard size={14} />
                Service Charges
              </div>

              <div className="terms-fee-line">
                <span className="terms-fee-label">Initial Fee</span>
                <span className="terms-fee-value">€150</span>
                <span className="terms-fee-note">Charged after we review your profile and shortlist suitable universities.</span>
              </div>

              <div className="terms-fee-line">
                <span className="terms-fee-label">Remaining Fee</span>
                <span className="terms-fee-value">€1,000</span>
                <span className="terms-fee-note">Payable after you receive your visa or arrive in Germany.</span>
              </div>

              <div className="terms-fee-total">
                <span className="terms-fee-total-label">Total Service Fee</span>
                <span className="terms-fee-total-value">€1,150</span>
              </div>

              <div className="terms-excl-note">
                University application fees and Uni-Assist fees are <strong style={{ color: INK }}>not included</strong> in
                our service charges and must be paid separately by the applicant.
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <RouteDivider />

      {/* WHAT WE HANDLE */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <SectionHeading
          eyebrow="Start to finish"
          title="What Our"
          emphasis="Support Covers"
          sub="You provide the documents above — we handle everything else, from the first application to your first weeks in Germany."
        />
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <ScopeCard
            icon={FileCheck2}
            title="Application to Visa"
            desc="We manage the entire application process from the initial stage until you receive your visa."
            delay={0}
          />
          <ScopeCard
            icon={Plane}
            title="Arrival in Germany"
            desc="Support continues right up to your arrival — you only need to supply the documents we ask for."
            delay={80}
          />
          <ScopeCard
            icon={HandHeart}
            title="After You Land"
            desc="We can also help with accommodation search, residence permit applications, and other first-week steps."
            delay={160}
          />
        </div>
      </section>

      <RouteDivider />

      {/* IMPORTANT NOTE */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <Reveal>
          <div className="terms-note">
            <div className="terms-note-head">
              <div className="terms-note-icon">
                <ShieldAlert size={18} strokeWidth={1.75} />
              </div>
              <span className="terms-note-title">A note on who we are</span>
            </div>
            <p>
              We would like to clarify that we are not an agency. We understand that the
              application process can be time-consuming and sometimes overwhelming for
              students. It is entirely possible to apply independently using resources such as
              university websites and online guides — some applicants simply prefer guided
              support for added confidence.
            </p>
            <p>
              If you require step-by-step assistance over a longer period, we ask a reasonable
              service fee for our time and effort. For general questions or basic guidance,
              we are always happy to help free of charge.
            </p>
          </div>
        </Reveal>
      </section>

      {/* CLOSING CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <Reveal>
          <div className="terms-boarding-panel">
            <Plane size={22} className="terms-boarding-plane" />
            <span className="terms-eyebrow" style={{ justifyContent: 'center' }}>
              <span className="terms-eyebrow-dot" />
              <span className="terms-eyebrow-label">Questions before you agree?</span>
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: INK }}>
              We're happy to walk you through it.
            </h2>
            <p className="mt-4 max-w-lg mx-auto text-sm leading-relaxed" style={{ color: MUTED }}>
              Reach out any time — general questions are always free, and we'll never start
              charging without your agreement first.
            </p>
            <a href="/contact" className="terms-boarding-cta">
              Contact Us <ArrowRight size={16} />
            </a>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}