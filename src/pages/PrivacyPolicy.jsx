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
  MessageCircleHeart,
  Plane,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

/* ---------------------------------------------------------------
   PRIVACY POLICY — same "Route" identity as every other page
   (Navbar / Hero / Home / About / Contact / Terms / Footer): paper
   field, sapphire route line, single gilt accent, Space Grotesk /
   Inter / JetBrains Mono. Class names stay namespaced "privacy-"
   to avoid collision with the other pages' identical tokens.
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

      /* --- intro card --- */
      .privacy-intro-card {
        position: relative; border-radius: 14px; background: #ffffff;
        border: 1px solid ${LINE}; padding: 34px 32px;
        box-shadow: 0 30px 60px -34px rgba(10,15,31,0.2);
      }
      .privacy-intro-card p { font-size: 14.5px; line-height: 1.75; color: ${MUTED}; }
      .privacy-intro-card p + p { margin-top: 14px; }
      .privacy-intro-card strong { color: ${INK}; font-weight: 700; }

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

      /* --- scope / use / share cards --- */
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
      .privacy-scope-desc { font-size: 13px; line-height: 1.6; color: ${MUTED}; }

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

      /* --- note callout (cookies / security) --- */
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
        <p className="mt-4 max-w-xl text-sm leading-relaxed" style={{ color: MUTED }}>
          {sub}
        </p>
      )}
    </Reveal>
  );
}

function DocItem({ children }) {
  return (
    <div className="privacy-doc-item">
      <CheckCircle2 size={16} strokeWidth={2} />
      <span>{children}</span>
    </div>
  );
}

function ScopeCard({ icon: Icon, title, desc, delay }) {
  return (
    <Reveal delay={delay}>
      <div className="privacy-scope-card">
        <div className="privacy-scope-icon">
          <Icon size={18} strokeWidth={1.75} />
        </div>
        <div className="privacy-scope-title">{title}</div>
        <div className="privacy-scope-desc">{desc}</div>
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
        <div className="privacy-right-item-desc">{desc}</div>
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

  const providedInfo = [
    'Full name and date of birth',
    'Email address, phone number and WhatsApp contact',
    'Academic certificates and transcripts',
    'Language certificates (e.g. IELTS)',
    'Passport copy and photograph',
    'Any information you share with us directly, by email or WhatsApp',
  ];

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
            <p className="mt-4 max-w-xl text-sm md:text-base leading-relaxed" style={{ color: MUTED }}>
              What we collect, why we collect it, and who we share it with — in plain language.
            </p>
          </Reveal>
        </div>
      </section>

      <RouteDivider />

      {/* INTRO */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <Reveal>
          <div className="privacy-intro-card">
            <p>
              Euro Feather ("we", "us", "our") provides overseas education consultancy
              services. This policy explains what personal information we collect when you
              use our website or work with us on your application, how we use it, and the
              choices you have about it.
            </p>
            <p>
              By contacting us, booking a consultation, or sending us your documents, you
              agree to the collection and use of information as described in this policy.
            </p>
          </div>
        </Reveal>
      </section>

      <RouteDivider />

      {/* WHAT WE COLLECT */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <SectionHeading
          eyebrow="Information"
          title="What We"
          emphasis="Collect"
          sub="Only what's needed to actually process your application — nothing sold, nothing collected for its own sake."
        />
        <Reveal>
          <div className="privacy-ticket">
            {/* provided by you */}
            <div className="privacy-ticket-main">
              <div className="privacy-ticket-kicker">
                <UserCheck size={14} />
                Information You Provide
              </div>
              {providedInfo.map((item) => (
                <DocItem key={item}>{item}</DocItem>
              ))}
            </div>

            <div className="privacy-ticket-perf" aria-hidden="true" />

            {/* collected automatically */}
            <div className="privacy-ticket-stub">
              <div className="privacy-ticket-kicker">
                <Cookie size={14} />
                Collected Automatically
              </div>
              <DocItem>Browser type and device information</DocItem>
              <DocItem>Pages visited and time spent on our site</DocItem>
              <DocItem>General location, from your IP address</DocItem>
              <div className="privacy-doc-note">
                We use this only to understand how our site is used and to keep it working
                correctly — see "Cookies" below.
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <RouteDivider />

      {/* HOW WE USE IT */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <SectionHeading
          eyebrow="Purpose"
          title="How We"
          emphasis="Use Your Information"
          sub="Every piece of information we ask for goes toward one of these three things."
        />
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <ScopeCard
            icon={FileText}
            title="Processing Your Application"
            desc="Reviewing your profile, shortlisting universities, and preparing and submitting your application and visa documents."
            delay={0}
          />
          <ScopeCard
            icon={MessageCircleHeart}
            title="Communicating With You"
            desc="Replying to your questions, sending updates on your application, and reaching you by email or WhatsApp when needed."
            delay={80}
          />
          <ScopeCard
            icon={Lock}
            title="Keeping Our Service Secure"
            desc="Protecting your account and documents from unauthorized access, and improving how our website works."
            delay={160}
          />
        </div>
      </section>

      <RouteDivider />

      {/* WHO WE SHARE WITH */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <SectionHeading
          eyebrow="Disclosure"
          title="Who We"
          emphasis="Share It With"
          sub="We only share what's needed to move your application forward — never for marketing, and never sold."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <ScopeCard
            icon={Building2}
            title="Universities &amp; Uni-Assist"
            desc="Your academic documents and application are shared with the universities and platforms you're applying through."
            delay={0}
          />
          <ScopeCard
            icon={Landmark}
            title="Embassies &amp; Authorities"
            desc="Your documents may be shared with German embassies, consulates or immigration authorities as part of your visa process."
            delay={80}
          />
          <ScopeCard
            icon={ShieldAlert}
            title="Service Providers"
            desc="Trusted tools we rely on to run our business — such as email and document storage — under confidentiality obligations."
            delay={160}
          />
        </div>
      </section>

      <RouteDivider />

      {/* YOUR RIGHTS */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <SectionHeading
          eyebrow="Your control"
          title="Your"
          emphasis="Rights"
          sub="Depending on where you live, you have some or all of the following rights over your data."
        />
        <Reveal>
          <div className="privacy-rights-card">
            <div className="privacy-rights-grid">
              <RightItem title="Access" desc="Ask us what personal data we hold about you." />
              <RightItem title="Correction" desc="Ask us to correct inaccurate or incomplete data." />
              <RightItem title="Deletion" desc="Ask us to delete your data once it's no longer needed." />
              <RightItem title="Restriction" desc="Ask us to limit how we use your data in certain cases." />
              <RightItem title="Portability" desc="Request a copy of your data in a portable format." />
              <RightItem title="Withdraw consent" desc="Withdraw consent at any time for optional processing." />
            </div>
          </div>
        </Reveal>
      </section>

      <RouteDivider />

      {/* RETENTION + COOKIES */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Reveal delay={0}>
            <div className="privacy-note">
              <div className="privacy-note-head">
                <div className="privacy-note-icon">
                  <Lock size={18} strokeWidth={1.75} />
                </div>
                <span className="privacy-note-title">Data Retention &amp; Security</span>
              </div>
              <p>
                We keep your information only for as long as needed to complete your
                application, meet legal requirements, or as agreed with you directly.
              </p>
              <p>
                We take reasonable technical and organizational steps to protect your data,
                but no method of storage or transmission over the internet is ever 100% secure.
              </p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="privacy-note">
              <div className="privacy-note-head">
                <div className="privacy-note-icon">
                  <Cookie size={18} strokeWidth={1.75} />
                </div>
                <span className="privacy-note-title">Cookies</span>
              </div>
              <p>
                Our website uses basic cookies to remember your preferences and understand how
                visitors use our site. You can disable cookies in your browser settings, though
                some parts of the site may not work as well as a result.
              </p>
            </div>
          </Reveal>
        </div>
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
            <p className="mt-4 max-w-lg mx-auto text-sm leading-relaxed" style={{ color: MUTED }}>
              Reach out any time to ask about your data, or to request access, correction or deletion.
            </p>
            <a href="/contact" className="privacy-boarding-cta">
              Contact Us <ArrowRight size={16} />
            </a>
            <div className="privacy-updated">Last updated: September 2026</div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}