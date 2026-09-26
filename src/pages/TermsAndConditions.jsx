import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Plane,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';

/* ---------------------------------------------------------------
   TERMS & CONDITIONS — same "Route" identity as every other page
   (Navbar / Hero / Home / About / Contact / Footer): paper field,
   sapphire route line, single gilt accent, Space Grotesk / Inter /
   JetBrains Mono. Class names stay namespaced "terms-" to avoid
   collision with the other pages' identical tokens.

   This page now carries two documents in one: a plain-language
   description of the services Euro Feather sells (drawn as the
   same boarding-pass-style document/fee ticket used before), and
   the full "Allgemeine Geschäftsbedingungen" (AGB) underneath it,
   laid out as ten numbered legal sections — the same object
   language ("stamped" numbered entries) About already established
   for its history timeline.

   A few fields in the AGB can only be filled in by Euro Feather
   itself (registered legal name, full address, tax treatment,
   the exact contract-formation process, and the legally-reviewed
   withdrawal notice). Those are marked with a clearly flagged
   "TodoNote" callout rather than invented, since guessing at legal
   specifics would be misleading rather than helpful.
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

function useInView(threshold = 0.12) {
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

      /* --- quick nav pills --- */
      .terms-quicknav { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-top: 24px; }
      .terms-quicknav a {
        font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700;
        letter-spacing: 0.06em; text-transform: uppercase; color: ${ROUTE};
        background: ${ROUTE_TINT}; border: 1px solid #D6DEF0;
        padding: 9px 18px; border-radius: 999px; text-decoration: none;
        transition: background-color .2s ${EASE}, border-color .2s ${EASE}, color .2s ${EASE};
      }
      .terms-quicknav a:hover { background: #ffffff; border-color: ${GOLD}; color: ${GOLD}; }

      /* --- intro / disclaimer cards --- */
      .terms-intro-card {
        position: relative; border-radius: 14px; background: #ffffff;
        border: 1px solid ${LINE}; padding: 34px 32px;
        box-shadow: 0 30px 60px -34px rgba(10,15,31,0.2);
      }
      .terms-intro-card p { font-size: 14.5px; line-height: 1.75; color: ${MUTED}; }
      .terms-intro-card p + p { margin-top: 14px; }
      .terms-intro-card strong { color: ${INK}; font-weight: 700; }

      .terms-note {
        position: relative; border-radius: 14px; overflow: hidden;
        background: ${PAPER_DIM}; border: 1px solid rgba(168,129,47,0.35);
        padding: 28px 28px;
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
      .terms-note p { font-size: 13.5px; line-height: 1.7; color: ${MUTED}; text-align: justify; hyphens: auto; }
      .terms-note p + p { margin-top: 10px; }

      /* =================================================================
         AGB — ten numbered legal sections, "stamped" like a real
         contract clause list rather than a wall of undifferentiated
         text.
      ================================================================= */
      .terms-legal-stack { display: flex; flex-direction: column; gap: 18px; }
      .terms-legal-section {
        position: relative; border-radius: 14px; background: #ffffff;
        border: 1px solid ${LINE}; padding: 28px 30px;
      }
      .terms-legal-head { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
      .terms-legal-num {
        width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
        background: ${GOLD_TINT}; border: 1.5px solid rgba(168,129,47,0.4);
        display: flex; align-items: center; justify-content: center;
        font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13px; color: ${GOLD};
      }
      .terms-legal-title-wrap { display: flex; align-items: center; gap: 9px; }
      .terms-legal-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 16.5px; color: ${INK}; }
      .terms-legal-body p { font-size: 13.5px; line-height: 1.75; color: ${MUTED}; text-align: justify; hyphens: auto; }
      .terms-legal-body p + p { margin-top: 12px; }

      .terms-todo {
        display: flex; gap: 10px; margin-top: 16px;
        background: ${GOLD_TINT}; border: 1px dashed rgba(168,129,47,0.5); border-radius: 9px;
        padding: 12px 14px; font-size: 12.5px; line-height: 1.65; color: #6B5320;
      }
      .terms-todo svg { flex-shrink: 0; margin-top: 2px; color: ${GOLD}; }
      .terms-todo strong { color: ${INK}; }

      .terms-inline-link { color: ${ROUTE}; font-weight: 600; text-decoration: underline; text-underline-offset: 2px; }

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

      .terms-updated {
        text-align: center; font-family: 'JetBrains Mono', monospace; font-size: 11.5px;
        letter-spacing: 0.08em; color: ${MUTED}; margin-top: 10px;
      }

      @media (max-width: 640px) {
        .terms-boarding-panel { padding: 40px 20px; border-radius: 10px; }
        .terms-boarding-cta { width: 100%; justify-content: center; padding: 14px 22px; }
        .terms-intro-card, .terms-legal-section { padding: 24px 22px; }
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

function TodoNote({ children }) {
  return (
    <div className="terms-todo">
      <AlertTriangle size={16} strokeWidth={2} />
      <span><strong>To confirm before publishing: </strong>{children}</span>
    </div>
  );
}

function LegalSection({ num, title, children }) {
  return (
    <Reveal>
      <div className="terms-legal-section" id={`agb-${num}`}>
        <div className="terms-legal-head">
          <span className="terms-legal-num">§{num}</span>
          <div className="terms-legal-title-wrap">
            <span className="terms-legal-title">{title}</span>
          </div>
        </div>
        <div className="terms-legal-body">{children}</div>
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
              The full legal terms that govern Euro Feather's paid consultancy service.
            </p>
          </Reveal>
        </div>
      </section>

      <RouteDivider />

      {/* BEFORE YOU PUBLISH */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <Reveal>
          <div className="terms-note">
            <div className="terms-note-head">
              <div className="terms-note-icon">
                <AlertTriangle size={18} strokeWidth={1.75} />
              </div>
              <span className="terms-note-title">Before this page goes live</span>
            </div>
            <p>
              This page is built from the service description and AGB text you provided. Your contract
              process, tax status and dispute-resolution participation are now filled in based on your
              answers — the one thing still missing is Euro Feather's full legal/registered business
              name and complete address, flagged in the gold box in § 1 below.
            </p>
            <p>
              We'd still recommend a final read-through by a lawyer familiar with German
              consumer-protection law (the BGB provisions referenced below) before publishing this page
              live — particularly the withdrawal notice in § 6, which follows the standard EU/German
              template but hasn't been checked against your exact service.
            </p>
          </div>
        </Reveal>
      </section>

      <RouteDivider />

      {/* ============================= AGB ============================= */}
      <section id="agb" className="max-w-5xl mx-auto px-6 py-16">
        <SectionHeading
          eyebrow="Legal"
          title="Terms and Conditions"
          emphasis="(AGB)"
          sub="Ten numbered clauses covering how a contract is formed, what each side is responsible for, pricing, cancellation, liability and applicable law."
        />

        <div className="terms-legal-stack">
          <LegalSection num="1" title="Provider and scope">
            <p>
              These terms apply to paid education and university application support provided by
              Euro Feather, based in Frankfurt, Germany, reachable at eurofeather.de@gmail.com
              ("Euro Feather"), to individual customers ("students"). Free website and YouTube content
              is general information and does not itself create a paid service contract.
            </p>
            <p>
              The individual written offer and any specifically agreed service description take
              precedence over these terms where they differ. These terms do not restrict mandatory
              consumer rights.
            </p>
            <TodoNote>
              Euro Feather's full legal/registered business name, complete street address, and
              commercial register number (if registered as a company) still need to be added here.
            </TodoNote>
          </LegalSection>

          <LegalSection num="2" title="Services and contract formation">
            <p>
              Euro Feather describes the agreed tasks, number of applications, service period, fee,
              payment schedule and any additional charges in an individual offer sent to the student.
              A contract is formed when the student replies to that written offer by email accepting
              it, and Euro Feather confirms that acceptance in writing by email. An enquiry or a free
              consultation does not itself oblige the student to buy a service.
            </p>
            <p>
              Work outside the agreed scope requires a separate agreement and a disclosed additional
              price. Euro Feather may provide practical assistance with forms and documents but does
              not decide eligibility or act as a university, immigration authority or lawyer.
            </p>
          </LegalSection>

          <LegalSection num="3" title="Working with the student">
            <p>
              The student supplies accurate, complete and authentic information and documents in time
              for the agreed work. The student checks application details and final materials before
              submission, where reasonably possible, and promptly forwards relevant communications
              from universities. The student remains responsible for statements and documents made in
              their name and for any third-party application fees.
            </p>
            <p>
              Applications are prepared together with the student. Euro Feather submits an application
              on the student's behalf only with the student's specific authorization for that
              application or platform. The student creates and controls any dedicated application
              email account. How Euro Feather accesses that account, if access is necessary, is agreed
              separately; the student may change or revoke access when the service ends. Euro Feather
              will not intentionally submit forged or misleading documents.
            </p>
          </LegalSection>

          <LegalSection num="4" title="Timing and third parties">
            <p>
              The student and Euro Feather agree practical deadlines in light of the universities'
              published deadlines. University portals, admissions decisions and third-party processing
              times are outside Euro Feather's control. Euro Feather will inform the student promptly
              if information or documents needed for an agreed task are missing, or if a material
              problem with the agreed timetable becomes known.
            </p>
          </LegalSection>

          <LegalSection num="5" title="Price and payment">
            <p>
              Euro Feather qualifies as a small business (Kleinunternehmer) under § 19 UStG. Prices
              shown to students are therefore final prices with no VAT added, and invoices issued do
              not show a separate VAT amount, in line with § 19 UStG. The total fee, included services,
              accepted payment methods and payment due dates are shown in the individual written offer
              before the student accepts it. Third-party charges (university, Uni-Assist, translation,
              certification and language-test fees) are payable separately by the student unless
              expressly included in the offer. Euro Feather provides an invoice or payment confirmation
              as required.
            </p>
            <TodoNote>
              Confirm the exact prices and payment due dates for every current package (beyond the
              initial/remaining-fee split shown above), and double-check with your accountant that the
              Kleinunternehmer exemption still applies once your annual revenue is known.
            </TodoNote>
          </LegalSection>

          <LegalSection num="6" title="Ending the service, cancellation and withdrawal">
            <p>
              Unless a specific written offer states otherwise, the standard service ends once the
              agreed applications have been completed and submission confirmations delivered; visa
              guidance, arrival support, accommodation search and residence-permit assistance are
              included only where the written offer expressly says so. The student may request a
              change to, or end, the service by contacting eurofeather.de@gmail.com. Euro Feather will
              explain any work already performed and the applicable payment or refund position under
              the agreement and mandatory law — no blanket "non-refundable" rule applies.
            </p>

            <p style={{ marginTop: 18, fontWeight: 700, color: INK }}>Right of withdrawal</p>
            <p>
              You have the right to withdraw from this contract within 14 days without giving any
              reason. The withdrawal period expires 14 days from the day the contract is concluded
              (see § 2 above). To exercise your right of withdrawal, you must inform us — Euro Feather,
              [full legal name and address to be inserted], eurofeather.de@gmail.com — of your decision
              by a clear statement (e.g. a letter sent by post or an email). You may use the model
              withdrawal form below, but it is not obligatory. To meet the withdrawal deadline, it is
              enough to send your notice of withdrawal before the 14-day period has expired.
            </p>
            <p>
              If you withdraw, we will reimburse all payments received from you without undue delay,
              and in any event not later than 14 days from the day we are informed of your decision to
              withdraw, using the same means of payment you used for the original transaction, unless
              expressly agreed otherwise. If you expressly requested that work begin during the
              withdrawal period and later withdraw, you must pay an amount proportional to the work
              already performed compared with the full scope of the contract.
            </p>

            <p style={{ marginTop: 18, fontWeight: 700, color: INK }}>Model withdrawal form</p>
            <p>(Complete and return this form only if you wish to withdraw from the contract.)</p>
            <p>
              To: Euro Feather, [full legal name and address to be inserted], eurofeather.de@gmail.com
              <br />
              I/We hereby give notice that I/we withdraw from my/our contract for the provision of the
              following service: [describe the service]
              <br />
              Ordered on: [date]
              <br />
              Name of consumer(s): [name]
              <br />
              Address of consumer(s): [address]
              <br />
              Signature of consumer(s) (only if this form is submitted on paper): [signature]
              <br />
              Date: [date]
            </p>

            <TodoNote>
              This withdrawal notice and model form follow the standard EU/German template, but still
              needs (1) your full legal name and address inserted in both places above, and (2) a
              lawyer's confirmation that it matches your actual service. Since contracts are formed by
              email rather than an automated online checkout, the electronic withdrawal button required
              by § 356a BGB likely does not apply to you yet — revisit this if you later add online
              payment or an ordering button to the website.
            </TodoNote>
          </LegalSection>

          <LegalSection num="7" title="Outcomes and responsibility">
            <p>
              Euro Feather performs the agreed services with reasonable care. A university, scholarship
              provider, visa authority or other third party makes its own decisions. No admission,
              funding, appointment, visa or immigration outcome is promised. Euro Feather does not
              limit liability where the law does not permit a limitation, including liability for
              injury to life, body or health, intent or gross negligence.
            </p>
          </LegalSection>

          <LegalSection num="8" title="Personal data and documents">
            <p>
              Our{' '}
              <a className="terms-inline-link" href="/privacy">Privacy Policy</a>{' '}
              explains how Euro Feather handles student documents and communications. At the end of the
              agreed service, Euro Feather deletes application working copies that are no longer
              needed, subject to legal retention duties and the exceptions explained there. Copies
              submitted to universities or application platforms are governed by those organisations'
              own practices.
            </p>
          </LegalSection>

          <LegalSection num="9" title="Complaints and contact">
            <p>
              Students can send questions or complaints to{' '}
              <a className="terms-inline-link" href="mailto:eurofeather.de@gmail.com">eurofeather.de@gmail.com</a>.
            </p>
            <p>
              Euro Feather is willing to take part in dispute-resolution proceedings before a consumer
              arbitration board (Verbraucherschlichtungsstelle). The competent body is the General
              Consumer Arbitration Board of the Center for Conciliation e.V. (Allgemeine
              Verbraucherschlichtungsstelle des Zentrums für Schlichtung e.V.), Straßburger Straße 8,
              77694 Kehl am Rhein, Germany — www.verbraucher-schlichter.de.
            </p>
            <TodoNote>
              Confirm you're comfortable naming this general arbitration board specifically (it's the
              standard default for businesses without a sector-specific one), or provide the name of a
              different board if you've already registered with one.
            </TodoNote>
          </LegalSection>

          <LegalSection num="10" title="Applicable law">
            <p>
              German law applies, without depriving a consumer of mandatory protection that applies
              under the law of their habitual residence. Statutory jurisdiction rules remain unaffected.
            </p>
          </LegalSection>
        </div>
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
              charging without your written agreement first.
            </p>
            <a href="/contact" className="terms-boarding-cta">
              Contact Us <ArrowRight size={16} />
            </a>
            <div className="terms-updated">Last updated: September 2026</div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}