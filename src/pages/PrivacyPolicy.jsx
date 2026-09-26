import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  CheckCircle2,
  UserCheck,
  Building2,
  Landmark,
  Lock,
  Cookie,
  FileText,
  Plane,
  ArrowRight,
  ShieldAlert,
  Globe2,
  Mail,
  CreditCard,
  Scale,
} from 'lucide-react';

/* ---------------------------------------------------------------
   PRIVACY POLICY — same "Route" identity as every other page
   (Navbar / Hero / Home / About / Contact / Terms / Footer): paper
   field, sapphire route line, single gilt accent, Space Grotesk /
   Inter / JetBrains Mono. Class names stay namespaced "privacy-"
   to avoid collision with the other pages' identical tokens.

   Content below is adapted from the Euro Feather Datenschutzerklärung.
   Fields still in [brackets] need to be filled in with the real
   controller / provider details before this goes live.
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
      className={`privacy-reveal ${inView ? 'privacy-reveal-visible' : ''} ${className}`}
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

      .privacy-root { font-family: 'Inter', sans-serif; background: ${PAPER}; }

      .privacy-reveal {
        opacity: 0;
        transform: translateY(22px) scale(.985);
        transition: opacity .7s ${EASE}, transform .7s ${EASE};
        will-change: transform, opacity;
      }
      .privacy-reveal-visible { opacity: 1; transform: translateY(0) scale(1); }

      .privacy-eyebrow { display: inline-flex; align-items: center; gap: 10px; }
      .privacy-eyebrow-dot {
        width: 7px; height: 7px; border-radius: 50%; background: ${GOLD};
        box-shadow: 0 0 0 3px ${GOLD_TINT};
      }
      .privacy-eyebrow-label {
        font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600;
        letter-spacing: 0.16em; text-transform: uppercase; color: ${GOLD};
      }
      .privacy-title {
        font-family: 'Space Grotesk', sans-serif; font-weight: 700; color: ${INK};
        letter-spacing: -0.01em;
      }
      .privacy-title .foil {
        background: ${GOLD_GRADIENT}; background-size: 260% 100%;
        -webkit-background-clip: text; background-clip: text; color: transparent;
        animation: privacyFoilSweep 7s ease-in-out infinite;
      }
      @keyframes privacyFoilSweep {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }

      /* --- justified body copy, applied everywhere prose appears --- */
      .privacy-justify {
        text-align: justify;
        text-align-last: left;
        -webkit-hyphens: auto;
        hyphens: auto;
      }

      .privacy-route-divider { position: relative; max-width: 1280px; margin: 0 auto; padding: 0 24px; }
      .privacy-route-divider::before { content: ''; display: block; height: 0; border-top: 1.5px dashed ${LINE}; }
      .privacy-route-divider .waypoint {
        position: absolute; left: 50%; top: 0; transform: translate(-50%, -50%);
        width: 8px; height: 8px; border-radius: 50%; background: ${GOLD};
        box-shadow: 0 0 0 4px ${PAPER};
      }

      /* --- header band, same wash as About/Contact/Terms --- */
      .privacy-header { position: relative; overflow: hidden; background: ${PAPER_DIM}; border-bottom: 1px solid ${LINE}; }
      .privacy-header::before {
        content: ''; position: absolute; inset: 0;
        background-image:
          radial-gradient(ellipse 640px 340px at 12% 0%, ${ROUTE_TINT} 0%, transparent 62%),
          radial-gradient(ellipse 520px 320px at 100% 100%, ${GOLD_TINT} 0%, transparent 60%);
        pointer-events: none;
      }
      .privacy-header::after {
        content: ''; position: absolute; inset: 0;
        background-image: radial-gradient(${LINE} 1px, transparent 1px);
        background-size: 24px 24px;
        -webkit-mask-image: radial-gradient(ellipse 700px 420px at 20% 20%, #000 0%, transparent 72%);
        mask-image: radial-gradient(ellipse 700px 420px at 20% 20%, #000 0%, transparent 72%);
        opacity: 0.55; pointer-events: none;
      }

      /* --- intro / controller card --- */
      .privacy-intro-card {
        position: relative; border-radius: 14px; background: #ffffff;
        border: 1px solid ${LINE}; padding: 34px 32px;
        box-shadow: 0 30px 60px -34px rgba(10,15,31,0.2);
      }
      .privacy-intro-card p { font-size: 14.5px; line-height: 1.75; color: ${MUTED}; }
      .privacy-intro-card p + p { margin-top: 14px; }
      .privacy-intro-card strong { color: ${INK}; font-weight: 700; }

      .privacy-controller-grid {
        margin-top: 18px; padding-top: 18px; border-top: 1px dashed ${LINE};
        display: grid; grid-template-columns: 1fr 1fr; gap: 10px 28px;
        font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${INK};
      }
      .privacy-controller-grid span { color: ${MUTED}; }
      @media (max-width: 640px) { .privacy-controller-grid { grid-template-columns: 1fr; } }

      /* --- data-collected ticket (two coupons, one perforation) --- */
      .privacy-ticket {
        position: relative; display: flex; border-radius: 16px; overflow: visible;
        background: #ffffff; border: 1px solid ${LINE};
        box-shadow: 0 40px 80px -40px rgba(10,15,31,0.28);
      }
      .privacy-ticket-main { flex: 1 1 55%; padding: 38px 40px; }
      .privacy-ticket-perf { position: relative; flex: 0 0 0; width: 0; border-left: 2px dashed ${LINE}; }
      .privacy-ticket-perf::before, .privacy-ticket-perf::after {
        content: ''; position: absolute; left: -13px; width: 26px; height: 26px;
        border-radius: 50%; background: ${PAPER};
      }
      .privacy-ticket-perf::before { top: -13px; }
      .privacy-ticket-perf::after { bottom: -13px; }
      .privacy-ticket-stub {
        flex: 1 1 45%; padding: 38px 34px; background: ${PAPER_DIM};
        border-radius: 0 16px 16px 0;
      }
      .privacy-ticket-kicker {
        display: flex; align-items: center; gap: 9px;
        font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 600;
        letter-spacing: 0.14em; text-transform: uppercase; color: ${GOLD};
        border-bottom: 1px dashed ${LINE}; padding-bottom: 16px; margin-bottom: 20px;
      }
      .privacy-doc-item { display: flex; align-items: flex-start; gap: 10px; font-size: 13.5px; color: ${INK}; line-height: 1.5; margin-bottom: 12px; }
      .privacy-doc-item:last-child { margin-bottom: 0; }
      .privacy-doc-item svg { flex-shrink: 0; margin-top: 1.5px; color: ${ROUTE}; }
      .privacy-doc-note { margin-top: 4px; font-size: 12px; color: ${MUTED}; line-height: 1.55; }

      @media (max-width: 760px) {
        .privacy-ticket { flex-direction: column; }
        .privacy-ticket-main { padding: 30px 26px; }
        .privacy-ticket-perf { width: auto; height: 0; border-left: none; border-top: 2px dashed ${LINE}; }
        .privacy-ticket-perf::before, .privacy-ticket-perf::after { top: -13px; left: auto; }
        .privacy-ticket-perf::before { left: -13px; }
        .privacy-ticket-perf::after { right: -13px; left: auto; }
        .privacy-ticket-stub { border-radius: 0 0 16px 16px; padding: 30px 26px; }
      }

      /* --- scope / use / share / process cards --- */
      .privacy-scope-card {
        position: relative; border-radius: 10px; background: #ffffff;
        border: 1px solid ${LINE}; padding: 24px; height: 100%;
        transition: transform .35s ${EASE}, border-color .35s ${EASE}, box-shadow .35s ${EASE};
      }
      .privacy-scope-card:hover { transform: translateY(-4px); border-color: ${GOLD}; box-shadow: 0 26px 46px -26px rgba(30,58,120,0.22); }
      .privacy-scope-icon {
        width: 40px; height: 40px; border-radius: 10px;
        background: ${GOLD_TINT}; border: 1px solid rgba(168,129,47,0.3);
        display: flex; align-items: center; justify-content: center; margin-bottom: 16px; color: ${ROUTE};
      }
      .privacy-scope-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 14.5px; color: ${INK}; margin-bottom: 8px; }
      .privacy-scope-desc { font-size: 13px; line-height: 1.65; color: ${MUTED}; }
      .privacy-scope-basis {
        margin-top: 10px; display: inline-block; font-family: 'JetBrains Mono', monospace;
        font-size: 10.5px; letter-spacing: 0.04em; color: ${ROUTE}; background: ${ROUTE_TINT};
        border: 1px solid rgba(30,58,120,0.18); border-radius: 6px; padding: 3px 8px;
      }

      /* --- rights checklist card --- */
      .privacy-rights-card {
        position: relative; border-radius: 14px; background: #ffffff;
        border: 1px solid ${LINE}; padding: 34px 32px;
        box-shadow: 0 30px 60px -34px rgba(10,15,31,0.2);
      }
      .privacy-rights-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 28px; margin-top: 10px; }
      @media (max-width: 640px) { .privacy-rights-grid { grid-template-columns: 1fr; } }
      .privacy-right-item { display: flex; align-items: flex-start; gap: 10px; }
      .privacy-right-item svg { flex-shrink: 0; margin-top: 2px; color: ${ROUTE}; }
      .privacy-right-item-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13.5px; color: ${INK}; }
      .privacy-right-item-desc { font-size: 12.5px; color: ${MUTED}; line-height: 1.55; margin-top: 2px; }

      .privacy-complaint-note {
        margin-top: 24px; padding-top: 20px; border-top: 1px dashed ${LINE};
        font-size: 13px; line-height: 1.7; color: ${MUTED};
      }

      /* --- note callout (retention / cookies / transfers / changes) --- */
      .privacy-note {
        position: relative; border-radius: 14px; overflow: hidden;
        background: ${PAPER_DIM}; border: 1px solid rgba(168,129,47,0.35);
        padding: 32px 30px; height: 100%;
      }
      .privacy-note::before {
        content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px;
        background: ${GOLD_GRADIENT};
      }
      .privacy-note-head { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
      .privacy-note-icon {
        width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
        background: ${GOLD_TINT}; border: 1px solid rgba(168,129,47,0.35);
        display: flex; align-items: center; justify-content: center; color: ${GOLD};
      }
      .privacy-note-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15.5px; color: ${INK}; }
      .privacy-note p { font-size: 13.5px; line-height: 1.7; color: ${MUTED}; }
      .privacy-note p + p { margin-top: 12px; }

      /* --- closing CTA, shared visual language with the rest of the site --- */
      .privacy-boarding-panel {
        position: relative; border-radius: 14px; overflow: hidden;
        background: ${PAPER_DIM}; border: 1px solid ${LINE};
        padding: 56px 32px; text-align: center;
      }
      .privacy-boarding-panel::before {
        content: ''; position: absolute; inset: 0;
        background-image:
          radial-gradient(ellipse 640px 340px at 8% 0%, ${ROUTE_TINT} 0%, transparent 62%),
          radial-gradient(ellipse 520px 320px at 100% 100%, ${GOLD_TINT} 0%, transparent 60%);
        pointer-events: none;
      }
      .privacy-boarding-panel::after {
        content: ''; position: absolute; inset: 0;
        background-image: radial-gradient(${LINE} 1px, transparent 1px);
        background-size: 24px 24px;
        -webkit-mask-image: radial-gradient(ellipse 700px 420px at 30% 20%, #000 0%, transparent 72%);
        mask-image: radial-gradient(ellipse 700px 420px at 30% 20%, #000 0%, transparent 72%);
        opacity: 0.55; pointer-events: none;
      }
      .privacy-boarding-plane {
        position: absolute; top: 18%; left: -6%; color: ${GOLD}; opacity: 0.9;
        animation: privacyBoardingFly 5.5s ${EASE} infinite;
      }
      @keyframes privacyBoardingFly {
        0% { transform: translateX(0) translateY(0) rotate(8deg); opacity: 0; }
        10% { opacity: 0.9; } 90% { opacity: 0.9; }
        100% { transform: translateX(112vw) translateY(-34px) rotate(8deg); opacity: 0; }
      }
      .privacy-boarding-cta {
        position: relative; display: inline-flex; align-items: center; gap: 9px;
        margin-top: 26px; padding: 15px 30px; border-radius: 10px;
        background: ${GOLD_GRADIENT}; background-size: 220% 100%;
        color: ${INK}; font-size: 14px; font-weight: 700; cursor: pointer;
        transition: background-position .5s ${EASE}, transform .25s ${EASE};
        box-shadow: 0 20px 40px -20px rgba(30,58,120,0.35);
      }
      .privacy-boarding-cta:hover { background-position: 100% 0; transform: translateY(-2px); }
      .privacy-boarding-cta:active { transform: translateY(0) scale(.98); }

      .privacy-updated {
        text-align: center; font-family: 'JetBrains Mono', monospace; font-size: 11.5px;
        letter-spacing: 0.08em; color: ${MUTED}; margin-top: 10px;
      }

      @media (max-width: 640px) {
        .privacy-boarding-panel { padding: 40px 20px; border-radius: 10px; }
        .privacy-boarding-cta { width: 100%; justify-content: center; padding: 14px 22px; }
        .privacy-intro-card, .privacy-rights-card { padding: 26px 22px; }
      }

      @media (prefers-reduced-motion: reduce) {
        .privacy-root *, .privacy-root *::before, .privacy-root *::after {
          transition-duration: 0.001ms !important;
          animation-duration: 0.001ms !important;
        }
        .privacy-reveal { opacity: 1 !important; transform: none !important; }
        .privacy-boarding-plane { display: none; }
      }
    `}</style>
  );
}

/* ---------------------------- pieces ---------------------------- */

function RouteDivider() {
  return (
    <div className="privacy-route-divider" aria-hidden="true">
      <span className="waypoint" />
    </div>
  );
}

function SectionHeading({ eyebrow, title, emphasis, sub }) {
  return (
    <Reveal className="flex flex-col items-center text-center mb-14">
      <span className="privacy-eyebrow">
        <span className="privacy-eyebrow-dot" />
        <span className="privacy-eyebrow-label">{eyebrow}</span>
      </span>
      <h2 className="privacy-title mt-4 text-3xl md:text-4xl">
        {title} {emphasis && <span className="foil">{emphasis}</span>}
      </h2>
      {sub && (
        <p className="privacy-justify mt-4 max-w-xl text-sm leading-relaxed" style={{ color: MUTED }}>
          {sub}
        </p>
      )}
    </Reveal>
  );
}

function ScopeCard({ icon: Icon, title, desc, basis, delay }) {
  return (
    <Reveal delay={delay}>
      <div className="privacy-scope-card">
        <div className="privacy-scope-icon">
          <Icon size={18} strokeWidth={1.75} />
        </div>
        <div className="privacy-scope-title">{title}</div>
        <div className="privacy-scope-desc privacy-justify">{desc}</div>
        {basis && <span className="privacy-scope-basis">{basis}</span>}
      </div>
    </Reveal>
  );
}

function RightItem({ title, desc }) {
  return (
    <div className="privacy-right-item">
      <CheckCircle2 size={16} strokeWidth={2} />
      <div>
        <div className="privacy-right-item-title">{title}</div>
        <div className="privacy-right-item-desc privacy-justify">{desc}</div>
      </div>
    </div>
  );
}

/* ---------------------------- page ---------------------------- */

export default function PrivacyPolicy() {
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="privacy-root">
      <GlobalStyle />

      <Navbar />

      {/* HEADER */}
      <section className="privacy-header">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20 relative text-center">
          <Reveal className="flex flex-col items-center">
            <span className="privacy-eyebrow">
              <span className="privacy-eyebrow-dot" />
              <span className="privacy-eyebrow-label">Your data, handled with care</span>
            </span>
            <h1 className="privacy-title mt-4 text-4xl md:text-5xl">
              Privacy <span className="foil">Policy</span>
            </h1>
            <p className="privacy-justify mt-4 max-w-xl text-sm md:text-base leading-relaxed mx-auto" style={{ color: MUTED }}>
              What we process, why we process it, and who we share it with — in plain language,
              alongside the legal basis under the GDPR.
            </p>
          </Reveal>
        </div>
      </section>

      <RouteDivider />

      {/* 1. CONTROLLER & CONTACT */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <SectionHeading
          eyebrow="Section 1"
          title="Controller &amp;"
          emphasis="Contact"
        />
        <Reveal>
          <div className="privacy-intro-card">
            <p className="privacy-justify">
              The controller responsible for this website and the Euro Feather consultancy
              service is <strong>[Full legal name / legal entity]</strong>, trading as{' '}
              <strong>Euro Feather</strong>. If we have appointed a data protection officer,
              their contact details are provided below as well.
            </p>
            <div className="privacy-controller-grid">
              <div><span>Trading name:</span> Euro Feather</div>
              <div><span>Address:</span> [Business postal address]</div>
              <div><span>Email:</span> [privacy contact email]</div>
              <div><span>Telephone:</span> [Telephone, if used]</div>
              <div><span>Data protection officer:</span> [details, if appointed]</div>
            </div>
          </div>
        </Reveal>
      </section>

      <RouteDivider />

      {/* 2. WHAT WE PROCESS AND WHY */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <SectionHeading
          eyebrow="Section 2"
          title="What We Process"
          emphasis="&amp; Why"
          sub="Every category below explains what we collect, what we use it for, and the legal basis we rely on under the GDPR."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <ScopeCard
            icon={Globe2}
            title="Website Visits"
            desc="When you open the website, our hosting provider may process technical information such as your IP address, date and time of access, requested page, browser information and server logs to deliver and protect the site."
            basis="Art. 6(1)(f) GDPR"
            delay={0}
          />
          <ScopeCard
            icon={Mail}
            title="Free Enquiries"
            desc="If you email us or use a contact form to request free advice, we process your name, contact information and message in order to respond to you."
            basis="Art. 6(1)(b) / 6(1)(f) GDPR"
            delay={60}
          />
          <ScopeCard
            icon={FileText}
            title="Paid Application Support"
            desc="To provide the agreed service, we process what you send us — contact details, CV, transcripts, certificates, language results, application statements, correspondence and application documents — to assess requirements and prepare and submit your applications."
            basis="Art. 6(1)(b) GDPR"
            delay={120}
          />
          <ScopeCard
            icon={UserCheck}
            title="Application Email &amp; Accounts"
            desc="You create and control the email account used for applications. If you give us access to assist with agreed tasks, we use it only for that purpose, and you can withdraw our access once the agreed work ends."
            basis="Art. 6(1)(b) GDPR"
            delay={180}
          />
          <ScopeCard
            icon={CreditCard}
            title="Payments &amp; Records"
            desc="We process contract and payment information to administer payments, issue invoices and meet our accounting and tax duties."
            basis="Art. 6(1)(b) / 6(1)(c) GDPR"
            delay={240}
          />
        </div>
      </section>

      <RouteDivider />

      {/* 3. WHO RECEIVES THE INFORMATION */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <SectionHeading
          eyebrow="Section 3"
          title="Who Receives"
          emphasis="This Information"
          sub="We only share what's needed to move your application forward. We never sell your documents or use them for advertising or testimonials without a separate, appropriate basis."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <ScopeCard
            icon={Building2}
            title="Universities &amp; Platforms"
            desc="As needed for the agreed applications, your information is sent to the universities and application platforms selected together with you, such as [list platforms actually used]. Those organisations process submitted applications under their own privacy notices."
            delay={0}
          />
          <ScopeCard
            icon={ShieldAlert}
            title="Service Providers"
            desc="Providers who process data on our behalf, such as [email provider], [cloud document storage], [website host], [booking provider] and [payment provider], under appropriate processing agreements where required."
            delay={80}
          />
          <ScopeCard
            icon={Landmark}
            title="Assistants &amp; Contractors"
            desc="[If assistants or contractors — including anyone outside the EU/EEA — can access student documents, their role and location are identified here, along with the applicable safeguard. If none, only the authorized Euro Feather operator has access.]"
            delay={160}
          />
        </div>
      </section>

      <RouteDivider />

      {/* 4. TRANSFERS OUTSIDE THE EU/EEA */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="privacy-note">
              <div className="privacy-note-head">
                <div className="privacy-note-icon">
                  <Plane size={18} strokeWidth={1.75} />
                </div>
                <span className="privacy-note-title">Transfers Outside the EU/EEA</span>
              </div>
              <p className="privacy-justify">
                Applications to universities or service providers outside the EU/EEA, use of
                providers located there, or remote access by staff or contractors there, may
                involve an international transfer of personal data. [Describe the actual
                destinations, recipients and applicable transfer basis or safeguards; remove
                this notice only if no such transfers occur.]
              </p>
              <p className="privacy-justify">
                Contact <strong>[privacy email]</strong> to request information about applicable
                safeguards. Your own application to an institution outside the EU/EEA is treated
                separately from transfers to Euro Feather's service providers.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <RouteDivider />

      {/* 5. YOUR RIGHTS */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <SectionHeading
          eyebrow="Section 7"
          title="Your"
          emphasis="Rights"
          sub="Subject to the statutory conditions, the following rights are available to you under the GDPR."
        />
        <Reveal>
          <div className="privacy-rights-card">
            <div className="privacy-rights-grid">
              <RightItem title="Access" desc="Request access to the personal data we hold about you." />
              <RightItem title="Rectification" desc="Ask us to correct inaccurate or incomplete data." />
              <RightItem title="Erasure" desc="Ask us to delete your data, subject to statutory conditions." />
              <RightItem title="Restriction" desc="Ask us to restrict processing in certain cases." />
              <RightItem title="Portability" desc="Request a copy of your data in a portable format." />
              <RightItem title="Object" desc="Object to processing based on Article 6(1)(f) GDPR." />
              <RightItem title="Withdraw consent" desc="Withdraw any consent at any time, with future effect." />
              <RightItem title="Complain" desc="Lodge a complaint with a data protection supervisory authority." />
            </div>
            <div className="privacy-complaint-note privacy-justify">
              To exercise any of these rights, contact <strong>[privacy email]</strong>. For a
              controller established in Rhineland-Palatinate, the competent supervisory authority
              is generally the State Commissioner for Data Protection and Freedom of Information
              of Rhineland-Palatinate. [Check the actual place of establishment and supervisory
              authority before publishing.]
            </div>
          </div>
        </Reveal>
      </section>

      <RouteDivider />

      {/* 6/7. RETENTION + COOKIES */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <SectionHeading
          eyebrow="Sections 5 &amp; 6"
          title="Retention"
          emphasis="&amp; Cookies"
        />
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Reveal delay={0}>
            <div className="privacy-note">
              <div className="privacy-note-head">
                <div className="privacy-note-icon">
                  <Lock size={18} strokeWidth={1.75} />
                </div>
                <span className="privacy-note-title">Retention &amp; Deletion</span>
              </div>
              <p className="privacy-justify">
                We keep application documents and working copies only while needed for the
                agreed service. When the service ends, we delete copies no longer needed from
                systems under our control within <strong>[insert a realistic period, e.g. 30 days]</strong>.
                The same rule applies if an application is refused, withdrawn or abandoned.
              </p>
              <p className="privacy-justify">
                Technical backups are deleted or overwritten according to{' '}
                <strong>[actual backup cycle]</strong> and are not used for ordinary service
                work. Invoices and accounting records are kept for the periods required by law.
                Documents already sent to a university or platform are retained by that
                recipient under its own rules; we cannot delete the recipient's copies.
              </p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="privacy-note">
              <div className="privacy-note-head">
                <div className="privacy-note-icon">
                  <Cookie size={18} strokeWidth={1.75} />
                </div>
                <span className="privacy-note-title">Cookies &amp; Analytics</span>
              </div>
              <p className="privacy-justify">
                [Describe every cookie or similar technology actually used, its provider,
                purpose and duration. Identify what is strictly necessary for the requested
                site service and what requires consent under § 25 TDDDG.]
              </p>
              <p className="privacy-justify">
                If analytics tools, advertising tools or embedded videos load third-party
                content, we describe their operation and consent mechanism here, and provide a
                way to withdraw consent where required.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <RouteDivider />

      {/* 8. CHANGES */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <Reveal>
          <div className="privacy-note">
            <div className="privacy-note-head">
              <div className="privacy-note-icon">
                <Scale size={18} strokeWidth={1.75} />
              </div>
              <span className="privacy-note-title">Changes to This Policy</span>
            </div>
            <p className="privacy-justify">
              We update this policy when our services, website tools or data practices change.
              The version published on this website states its effective date below.
            </p>
          </div>
        </Reveal>
      </section>

      {/* CLOSING CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <Reveal>
          <div className="privacy-boarding-panel">
            <Plane size={22} className="privacy-boarding-plane" />
            <span className="privacy-eyebrow" style={{ justifyContent: 'center' }}>
              <span className="privacy-eyebrow-dot" />
              <span className="privacy-eyebrow-label">Questions about your data?</span>
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: INK }}>
              We're glad to explain anything here.
            </h2>
            <p className="privacy-justify mt-4 max-w-lg mx-auto text-sm leading-relaxed" style={{ color: MUTED }}>
              Reach out any time to ask about your data, or to request access, correction or deletion.
            </p>
            <a href="/contact" className="privacy-boarding-cta">
              Contact Us <ArrowRight size={16} />
            </a>
            <div className="privacy-updated">Last updated: [date of publication]</div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}