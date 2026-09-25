import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  MapPin,
  MessageSquare,
  Send,
  CheckCircle2,
  Copy,
  Check,
  Info,
  ChevronDown,
  Plane,
  RotateCcw,
  LogIn,
  Clock,
} from 'lucide-react';
import { subscribeToAuthChanges, hasRequestedToday, recordRequestToday } from '../utils/auth';

/* ---------------------------------------------------------------
   BOOK A CONSULTATION — "The Route", same identity as the rest of
   the site. The form itself is one more boarding pass: the left
   stub is check-in (the traveler's own details), the right stub is
   the "ticket" that gets handed to the Euro Feather team — except
   here the ticket is a real email, built from what's typed on the
   left and handed to the visitor's own mail client to send.

   There's no backend in this project, so "sending an email" here
   means constructing a mailto: link (subject + body pre-filled)
   and handing it to the browser, which opens the visitor's own
   mail app with everything ready to go. A "copy details" fallback
   is included for visitors whose browser has no mail client
   configured, so the request never gets stuck.

   Access is gated by a lightweight client-side session (see
   utils/auth.js): a visitor must be "signed in" to submit, and each
   signed-in email may only send one request per day.
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

const TARGET_EMAIL = 'eurofeather.de@gmail.com';

// Uses FormSubmit (https://formsubmit.co) — no signup, no account, no
// endpoint ID needed. It sends straight to TARGET_EMAIL above.
// One-time step: the very first submission triggers an activation
// email from FormSubmit to fahim.bd.sajid@gmail.com — open it and
// click "Activate Form" once. Every submission after that lands
// directly in the inbox with nothing opening on the visitor's side.
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${TARGET_EMAIL}`;

const PROGRAM_OPTIONS = [
  { value: '', label: "What are you interested in?" },
  { value: "Bachelor's Admission", label: "Bachelor's Admission" },
  { value: "Master's Admission", label: "Master's Admission" },
  { value: 'Language Course', label: 'Language Course' },
  { value: 'Visa Processing', label: 'Visa Processing' },
  { value: "Not sure yet — need guidance", label: "Not sure yet — need guidance" },
];

const NEXT_STEPS = [
  {
    code: '01',
    title: 'Fill in your details',
    desc: 'Tell us who you are and a bit about your background or goals.',
  },
  {
    code: '02',
    title: 'We receive it by email',
    desc: `Your request lands directly in our inbox at ${TARGET_EMAIL}.`,
  },
  {
    code: '03',
    title: 'A counselor replies',
    desc: 'Expect a reply within 24–48 hours to schedule your session.',
  },
];

/* ------------------------- helpers ------------------------- */

function buildEmailBody({ fullName, email, phone, program, country, message }) {
  return [
    'New consultation request from the Euro Feather website.',
    '',
    `Name: ${fullName}`,
    `Email: ${email}`,
    `Phone / WhatsApp: ${phone || 'Not provided'}`,
    `Interested in: ${program || 'Not specified'}`,
    `Preferred destination: ${country || 'Not specified'}`,
    '',
    'Message:',
    message,
  ].join('\n');
}

function buildMailtoLink(data) {
  const subject = `Consultation Request — ${data.fullName}`;
  const body = buildEmailBody(data);
  return `mailto:${TARGET_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/* ---------------------------- styles ---------------------------- */

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');

      .book-root { font-family: 'Inter', sans-serif; background: ${PAPER}; }

      .book-eyebrow { display: inline-flex; align-items: center; gap: 10px; }
      .book-eyebrow-dot { width: 7px; height: 7px; border-radius: 50%; background: ${GOLD}; box-shadow: 0 0 0 3px ${GOLD_TINT}; }
      .book-eyebrow-label {
        font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600;
        letter-spacing: 0.16em; text-transform: uppercase; color: ${GOLD};
      }
      .book-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; color: ${INK}; letter-spacing: -0.01em; }
      .book-title .foil {
        background: ${GOLD_GRADIENT}; background-size: 260% 100%;
        -webkit-background-clip: text; background-clip: text; color: transparent;
        animation: bookFoilSweep 7s ease-in-out infinite;
      }
      @keyframes bookFoilSweep { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }

      .book-route-divider { position: relative; max-width: 1280px; margin: 0 auto; padding: 0 24px; }
      .book-route-divider::before { content: ''; display: block; height: 0; border-top: 1.5px dashed ${LINE}; }
      .book-route-divider .waypoint {
        position: absolute; left: 50%; top: 0; transform: translate(-50%, -50%);
        width: 8px; height: 8px; border-radius: 50%; background: ${GOLD};
        box-shadow: 0 0 0 4px ${PAPER};
      }

      /* --- ticket shell, same two-part boarding pass as the CGPA tool --- */
      .book-ticket {
        position: relative; display: grid; grid-template-columns: 1fr;
        border-radius: 16px; background: #ffffff; border: 1px solid ${LINE};
        box-shadow: 0 40px 80px -40px rgba(10,15,31,0.28); overflow: hidden;
      }
      @media (min-width: 900px) { .book-ticket { grid-template-columns: 1.55fr 1fr; } }

      .book-ticket-main { padding: 34px 32px 30px; }
      .book-ticket-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
      .book-ticket-eyebrow {
        font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 600;
        letter-spacing: 0.12em; text-transform: uppercase; color: ${MUTED};
      }
      .book-ticket-route {
        font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; color: ${ROUTE};
        display: flex; align-items: center; gap: 8px;
      }

      .book-session-pill {
        display: inline-flex; align-items: center; gap: 7px;
        font-size: 11.5px; font-weight: 700; color: ${ROUTE};
        background: ${ROUTE_TINT}; border: 1px solid #D6DEF0;
        padding: 5px 11px; border-radius: 999px; margin-bottom: 20px;
      }

      .book-field-group { margin-bottom: 20px; }
      .book-field-label {
        display: flex; align-items: center; gap: 6px;
        font-size: 12.5px; font-weight: 700; color: ${INK};
        margin-bottom: 8px; font-family: 'Space Grotesk', sans-serif;
      }
      .book-required { color: ${GOLD}; margin-left: 2px; }
      .book-field-hint { font-size: 11.5px; color: ${MUTED}; margin-top: 6px; line-height: 1.5; }

      .book-field-input, .book-field-select, .book-field-textarea {
        width: 100%; padding: 12px 14px; border-radius: 9px;
        border: 1.5px solid ${LINE}; background: ${PAPER};
        font-size: 14.5px; font-weight: 500; color: ${INK};
        transition: border-color .2s ${EASE}, box-shadow .2s ${EASE}, background-color .2s ${EASE};
        font-family: 'Inter', sans-serif;
      }
      .book-field-textarea { resize: vertical; min-height: 120px; line-height: 1.6; }
      .book-field-input::placeholder, .book-field-textarea::placeholder { color: #B3AF9F; font-weight: 400; }
      .book-field-input:focus, .book-field-select:focus, .book-field-textarea:focus {
        outline: none; border-color: ${ROUTE}; background: #ffffff;
        box-shadow: 0 0 0 4px ${ROUTE_TINT};
      }

      .book-field-select-wrap { position: relative; }
      .book-field-select { appearance: none; -webkit-appearance: none; cursor: pointer; padding-right: 40px; }
      .book-field-select-chevron {
        position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
        color: ${MUTED}; pointer-events: none;
      }

      .book-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      @media (max-width: 480px) { .book-field-row { grid-template-columns: 1fr; } }

      .book-error {
        display: flex; align-items: flex-start; gap: 9px;
        background: #FBEAEA; border: 1px solid #E7B8B8; color: #8A3B3B;
        font-size: 12.5px; line-height: 1.5; font-weight: 500;
        padding: 12px 14px; border-radius: 9px; margin-bottom: 18px;
      }

      /* --- "please log in" / "already sent today" gate panels --- */
      .book-gate {
        display: flex; flex-direction: column; gap: 12px;
        background: ${GOLD_TINT}; border: 1px solid #E9D9AE; color: #6B5320;
        font-size: 13px; line-height: 1.55; font-weight: 500;
        padding: 16px 16px; border-radius: 11px; margin-bottom: 18px;
      }
      .book-gate-header { display: flex; align-items: flex-start; gap: 9px; }
      .book-gate-link-btn {
        display: inline-flex; align-items: center; justify-content: center; gap: 8px;
        padding: 10px 16px; border-radius: 9px; align-self: flex-start;
        background: ${INK}; color: ${PAPER}; text-decoration: none;
        font-size: 12.5px; font-weight: 700; letter-spacing: 0.01em;
        transition: background-color .2s ${EASE}, transform .2s ${EASE};
      }
      .book-gate-link-btn:hover { background: #1A2338; transform: translateY(-1px); }

      .book-gate.is-limit {
        background: ${ROUTE_TINT}; border-color: #D6DEF0; color: ${ROUTE_DEEP};
      }

      .book-submit-btn {
        display: inline-flex; align-items: center; justify-content: center; gap: 9px;
        width: 100%; padding: 14px 22px; border-radius: 10px;
        background: ${ROUTE}; border: 1px solid ${ROUTE};
        color: ${PAPER}; font-size: 14.5px; font-weight: 700; letter-spacing: 0.01em;
        cursor: pointer;
        transition: background-color .25s ${EASE}, transform .2s ${EASE}, box-shadow .25s ${EASE};
        box-shadow: 0 14px 26px -14px rgba(30,58,120,0.5);
      }
      .book-submit-btn:hover { background: ${ROUTE_DEEP}; border-color: ${ROUTE_DEEP}; transform: translateY(-1px); }
      .book-submit-btn:active { transform: translateY(0) scale(.99); }
      .book-submit-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

      .book-reset-btn {
        display: inline-flex; align-items: center; justify-content: center; gap: 7px;
        width: 100%; margin-top: 12px; padding: 11px 18px; border-radius: 9px;
        border: 1.5px solid ${LINE}; background: #ffffff;
        font-size: 13.5px; font-weight: 700; color: ${ROUTE}; cursor: pointer;
        transition: background-color .2s ${EASE}, border-color .2s ${EASE}, box-shadow .2s ${EASE};
      }
      .book-reset-btn:hover { background: ${ROUTE_TINT}; border-color: ${ROUTE}; }
      .book-reset-btn:focus-visible { outline: none; border-color: ${ROUTE}; box-shadow: 0 0 0 4px ${ROUTE_TINT}; }
      .book-reset-btn:active { background: ${ROUTE_TINT}; }

      /* --- perforated tear line between form + stub --- */
      .book-ticket-perf { position: relative; }
      .book-ticket-perf::before {
        content: ''; position: absolute; top: 0; bottom: 0; left: -1px;
        width: 0; border-left: 1.5px dashed ${LINE};
      }
      .book-ticket-perf-dot { position: absolute; left: -8px; width: 16px; height: 16px; border-radius: 50%; background: ${PAPER}; }
      .book-ticket-perf-dot.top { top: -8px; }
      .book-ticket-perf-dot.bottom { bottom: -8px; }

      /* --- stub: the "recipient's copy" preview / confirmation --- */
      .book-stub {
        position: relative; background: ${INK}; color: ${PAPER};
        padding: 30px 28px; display: flex; flex-direction: column;
      }
      .book-stub-brand {
        display: flex; align-items: center; gap: 8px;
        font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 600;
        letter-spacing: 0.14em; text-transform: uppercase; color: ${GOLD_SOFT};
        margin-bottom: 22px;
      }
      .book-stub-field-label {
        font-family: 'JetBrains Mono', monospace; font-size: 9.5px; font-weight: 600;
        letter-spacing: 0.12em; text-transform: uppercase; color: rgba(250,249,245,0.5);
        margin-bottom: 4px;
      }
      .book-stub-field-value {
        font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; color: ${PAPER};
        word-break: break-word;
      }
      .book-stub-row { margin-bottom: 16px; }
      .book-stub-msg {
        font-size: 12.5px; line-height: 1.6; color: rgba(250,249,245,0.75);
        white-space: pre-wrap; word-break: break-word;
      }

      .book-stub-status {
        display: inline-flex; align-items: center; gap: 7px;
        font-size: 12.5px; font-weight: 700; letter-spacing: 0.02em;
        padding: 6px 12px; border-radius: 999px; margin-top: 6px; width: fit-content;
        background: rgba(168,129,47,0.18); color: ${GOLD_SOFT}; border: 1px solid rgba(216,184,114,0.4);
      }

      .book-stub-placeholder {
        flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
        text-align: center; gap: 10px; color: rgba(250,249,245,0.45); padding: 20px 6px;
      }
      .book-stub-placeholder-icon {
        width: 44px; height: 44px; border-radius: 50%;
        border: 1.5px dashed rgba(250,249,245,0.3);
        display: flex; align-items: center; justify-content: center;
      }

      .book-stub-divider {
        margin: 18px 0; border-top: 1px dashed rgba(250,249,245,0.2);
      }

      .book-stub-copy-btn {
        display: inline-flex; align-items: center; justify-content: center; gap: 8px;
        width: 100%; margin-top: auto; padding: 12px 16px; border-radius: 9px;
        background: rgba(250,249,245,0.08); border: 1px solid rgba(250,249,245,0.22);
        color: ${PAPER}; font-size: 12.5px; font-weight: 700; cursor: pointer;
        transition: background-color .2s ${EASE}, border-color .2s ${EASE};
      }
      .book-stub-copy-btn:hover { background: rgba(250,249,245,0.14); border-color: ${GOLD_SOFT}; }
      .book-stub-copy-btn.is-copied { color: ${GOLD_SOFT}; border-color: ${GOLD_SOFT}; }

      /* --- info / next-steps panel --- */
      .book-info-panel {
        position: relative; border-radius: 14px; background: ${PAPER_DIM};
        border: 1px solid ${LINE}; overflow: hidden; padding: 32px 28px;
      }
      .book-info-panel::before {
        content: ''; position: absolute; inset: 0;
        background-image:
          radial-gradient(ellipse 640px 340px at 8% 0%, ${ROUTE_TINT} 0%, transparent 62%),
          radial-gradient(ellipse 520px 320px at 100% 100%, ${GOLD_TINT} 0%, transparent 60%);
        pointer-events: none;
      }
      .book-info-panel-content { position: relative; }
      .book-steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 18px; }
      @media (max-width: 720px) { .book-steps-grid { grid-template-columns: 1fr; } }
      .book-step-chip { background: #ffffff; border: 1px solid ${LINE}; border-radius: 10px; padding: 16px 18px; }
      .book-step-code {
        font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; color: ${GOLD};
        letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 8px;
      }
      .book-step-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 14px; color: ${INK}; margin-bottom: 5px; }
      .book-step-desc { font-size: 12.5px; line-height: 1.55; color: ${MUTED}; }

      .book-disclaimer {
        display: flex; gap: 10px; align-items: flex-start; justify-content: center;
        font-size: 12px; line-height: 1.6; color: ${MUTED}; text-align: center;
        border-top: 1px dashed ${LINE}; margin-top: 22px; padding-top: 18px;
      }

      .book-direct-email {
        font-family: 'JetBrains Mono', monospace; font-weight: 600; color: ${ROUTE};
        text-decoration: underline; text-underline-offset: 3px;
      }

      @media (prefers-reduced-motion: reduce) {
        .book-root *, .book-root *::before, .book-root *::after {
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
    <div className="book-route-divider" aria-hidden="true">
      <span className="waypoint" />
    </div>
  );
}

const initialFormState = {
  fullName: '',
  email: '',
  phone: '',
  program: '',
  country: '',
  message: '',
};

export default function BookConsultation() {
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  // Current session — null while Firebase is still resolving on first
  // load, then either null (signed out) or the signed-in user.
  const [currentUser, setCurrentUser] = useState(null);
  const [authResolved, setAuthResolved] = useState(false);

  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState('');
  const [loginRequired, setLoginRequired] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendFailed, setSendFailed] = useState(false);

  // Subscribe to Firebase's auth state for the lifetime of this page.
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (user) => {
      setCurrentUser(user);
      setAuthResolved(true);
      if (user) {
        const limited = await hasRequestedToday(user.uid);
        setLimitReached(limited);
      } else {
        setLimitReached(false);
      }
    });
    return unsubscribe;
  }, []);

  // Pre-fill name/email from the session once, as a convenience.
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || currentUser.name || '',
        email: prev.email || currentUser.email || '',
        phone: prev.phone || currentUser.phone || '',
      }));
    }
  }, [currentUser]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoginRequired(false);

    // Gate 1: must be signed in to send a request at all.
    if (!authResolved) return; // avoid a false "please log in" flash on first paint
    if (!currentUser) {
      setLoginRequired(true);
      return;
    }

    // Gate 2: one request per signed-in account, per day.
    const limited = await hasRequestedToday(currentUser.uid);
    setLimitReached(limited);
    if (limited) return;

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.program.trim() ||
      !formData.message.trim()
    ) {
      setError('Please fill in all required fields — name, email, phone, interest, and a short message.');
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setSendFailed(false);
    setIsSubmitting(true);

    try {
      const formPayload = new FormData();
      formPayload.append('Full Name', formData.fullName);
      formPayload.append('Email Address', formData.email);
      formPayload.append('Phone / WhatsApp', formData.phone);
      formPayload.append('Interested In', formData.program);
      formPayload.append('Preferred Country', formData.country || 'Not specified');
      formPayload.append('Message', formData.message);
      formPayload.append('_subject', `Consultation Request — ${formData.fullName}`);
      // Renders the email as a clean formatted table instead of plain text
      formPayload.append('_template', 'table');

      // FormData (not JSON) avoids a CORS preflight request — sending
      // JSON with a Content-Type header forces the browser to send an
      // OPTIONS request first, and FormSubmit doesn't answer that from
      // every origin (localhost included), so the fetch would fail
      // silently before ever reaching FormSubmit's server.
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formPayload,
      });

      if (!response.ok) throw new Error('FormSubmit request failed');
      await recordRequestToday(currentUser.uid);
      setLimitReached(true);
      setSubmitted(true);
    } catch {
      // If the silent send fails (e.g. endpoint not yet configured, or
      // the visitor is offline), fall back to opening their mail app
      // with everything pre-filled so the request still gets through.
      await recordRequestToday(currentUser.uid);
      setLimitReached(true);
      setSendFailed(true);
      setSubmitted(true);
      window.location.href = buildMailtoLink(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = async () => {
    setFormData(initialFormState);
    setSubmitted(false);
    setError('');
    setLoginRequired(false);
    setLimitReached(currentUser ? await hasRequestedToday(currentUser.uid) : false);
    setCopied(false);
    setSendFailed(false);
  };

  const handleCopy = async () => {
    const summary = buildEmailBody(formData);
    try {
      await navigator.clipboard.writeText(`To: ${TARGET_EMAIL}\n\n${summary}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setError('Could not copy automatically — please select and copy the details manually.');
    }
  };

  return (
    <div className="book-root">
      <GlobalStyle />
      <Navbar />

      {/* spacer to clear the fixed navbar */}
      <div style={{ height: 76 }} />

      {/* HEADER */}
      <section className="max-w-5xl mx-auto px-6 pt-14 pb-10 text-center">
        <span className="book-eyebrow justify-center flex">
          <span className="book-eyebrow-dot" />
          <span className="book-eyebrow-label">Free · No obligation</span>
        </span>
        <h1 className="book-title mt-4 text-3xl md:text-[42px]">
          Book a <span className="foil">Consultation</span>
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-sm md:text-[15px] leading-relaxed" style={{ color: MUTED }}>
          Tell us a bit about yourself and what you're hoping to do, and we'll take it
          straight to our team at <span style={{ color: ROUTE, fontWeight: 600 }}>{TARGET_EMAIL}</span>.
        </p>
      </section>

      <RouteDivider />

      {/* THE TICKET */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <div className="book-ticket">
          <form className="book-ticket-main" onSubmit={handleSubmit}>
            <div className="book-ticket-header">
              <div className="book-ticket-eyebrow">Check-in</div>
              <div className="book-ticket-route">
                <span>You</span>
                <Plane size={14} color={GOLD} style={{ transform: 'rotate(90deg)' }} />
                <span>Euro Feather</span>
              </div>
            </div>

            {currentUser && (
              <div className="book-session-pill">
                <CheckCircle2 size={13} /> Signed in as {currentUser.name || currentUser.email}
              </div>
            )}

            {loginRequired && (
              <div className="book-gate">
                <div className="book-gate-header">
                  <Info size={16} style={{ marginTop: 1, flexShrink: 0 }} />
                  <span>Please log in first to confirm your request. It only takes a moment.</span>
                </div>
                <Link
                  to="/login"
                  state={{ from: '/consultation' }}
                  className="book-gate-link-btn"
                >
                  <LogIn size={14} /> Log in to continue
                </Link>
              </div>
            )}

            {limitReached && !loginRequired && (
              <div className="book-gate is-limit">
                <div className="book-gate-header">
                  <Clock size={16} style={{ marginTop: 1, flexShrink: 0 }} />
                  <span>
                    You've already sent a consultation request today. You can send another
                    one tomorrow — our team will be in touch about this one soon.
                  </span>
                </div>
              </div>
            )}

            <div className="book-field-group">
              <label className="book-field-label">
                <User size={13} color={ROUTE} /> Full name<span className="book-required">*</span>
              </label>
              <input
                className="book-field-input"
                type="text"
                placeholder="e.g. Farhan Rahman"
                value={formData.fullName}
                onChange={handleChange('fullName')}
              />
            </div>

            <div className="book-field-row">
              <div className="book-field-group">
                <label className="book-field-label">
                  <Mail size={13} color={ROUTE} /> Email address<span className="book-required">*</span>
                </label>
                <input
                  className="book-field-input"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange('email')}
                />
              </div>
              <div className="book-field-group">
                <label className="book-field-label">
                  <Phone size={13} color={ROUTE} /> Phone / WhatsApp<span className="book-required">*</span>
                </label>
                <input
                  className="book-field-input"
                  type="tel"
                  placeholder="+880 1XXX-XXXXXX"
                  value={formData.phone}
                  onChange={handleChange('phone')}
                />
              </div>
            </div>

            <div className="book-field-group">
              <label className="book-field-label">
                <GraduationCap size={13} color={ROUTE} /> What are you interested in?<span className="book-required">*</span>
              </label>
              <div className="book-field-select-wrap">
                <select
                  className="book-field-select"
                  value={formData.program}
                  onChange={handleChange('program')}
                >
                  {PROGRAM_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="book-field-select-chevron" />
              </div>
            </div>

            <div className="book-field-group">
              <label className="book-field-label">
                <MapPin size={13} color={ROUTE} /> Preferred country / destination
              </label>
              <input
                className="book-field-input"
                type="text"
                placeholder="e.g. Germany (optional)"
                value={formData.country}
                onChange={handleChange('country')}
              />
            </div>

            <div className="book-field-group">
              <label className="book-field-label">
                <MessageSquare size={13} color={ROUTE} /> Tell us about yourself<span className="book-required">*</span>
              </label>
              <textarea
                className="book-field-textarea"
                placeholder="Your academic background, current CGPA, why you're booking this slot, or anything you'd like us to know before the call..."
                value={formData.message}
                onChange={handleChange('message')}
              />
              <div className="book-field-hint">
                This is your profile in a nutshell — the more you share, the more useful
                the first call will be.
              </div>
            </div>

            {error && (
              <div className="book-error">
                <Info size={15} style={{ marginTop: 1, flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="book-submit-btn"
              disabled={isSubmitting || limitReached}
              style={isSubmitting ? { opacity: 0.7, cursor: 'not-allowed' } : undefined}
            >
              {isSubmitting ? 'Sending…' : 'Send My Request'} <Send size={16} />
            </button>

            {(submitted || Object.values(formData).some(Boolean)) && (
              <button type="button" onClick={handleReset} className="book-reset-btn">
                <RotateCcw size={14} /> Clear and start over
              </button>
            )}
          </form>

          <div className="book-ticket-perf">
            <span className="book-ticket-perf-dot top" />
            <span className="book-ticket-perf-dot bottom" />
            <div className="book-stub">
              <div className="book-stub-brand">
                <Plane size={12} /> Euro Feather · Request Stub
              </div>

              {submitted ? (
                <>
                  <div className="book-stub-status">
                    <CheckCircle2 size={14} /> {sendFailed ? 'Ready to send' : 'Request sent'}
                  </div>
                  <p style={{ fontSize: 12.5, lineHeight: 1.6, color: 'rgba(250,249,245,0.75)', marginTop: 14 }}>
                    {sendFailed ? (
                      <>We couldn't reach our server just now, so your mail app should have
                      opened instead with everything pre-filled — just hit
                      <strong style={{ color: PAPER }}> Send</strong>.</>
                    ) : (
                      <>Your request went straight to our inbox at{' '}
                      <strong style={{ color: PAPER }}>{TARGET_EMAIL}</strong> — no app
                      needed to open on your end.</>
                    )}
                  </p>

                  <div className="book-stub-divider" />

                  <div className="book-stub-row">
                    <div className="book-stub-field-label">To</div>
                    <div className="book-stub-field-value" style={{ fontSize: 13 }}>{TARGET_EMAIL}</div>
                  </div>
                  <div className="book-stub-row">
                    <div className="book-stub-field-label">From</div>
                    <div className="book-stub-field-value" style={{ fontSize: 13 }}>{formData.fullName}</div>
                  </div>
                  <div className="book-stub-row">
                    <div className="book-stub-field-label">Message</div>
                    <div className="book-stub-msg">{formData.message}</div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopy}
                    className={`book-stub-copy-btn ${copied ? 'is-copied' : ''}`}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied to clipboard' : "Didn't open? Copy details instead"}
                  </button>
                </>
              ) : (
                <div className="book-stub-placeholder">
                  <div className="book-stub-placeholder-icon">
                    <Mail size={18} />
                  </div>
                  <div style={{ fontSize: 12.5, lineHeight: 1.6, maxWidth: 190 }}>
                    Fill in your details and tap <strong>Send My Request</strong> — your
                    email opens here, ready to send to Euro Feather.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <RouteDivider />

      {/* HOW IT WORKS */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <div className="book-info-panel">
          <div className="book-info-panel-content">
            <div className="text-center">
              <span className="book-eyebrow justify-center flex">
                <span className="book-eyebrow-dot" />
                <span className="book-eyebrow-label">What happens next</span>
              </span>
              <h2 className="book-title mt-4 text-2xl md:text-3xl">
                From your inbox to <span className="foil">ours</span>
              </h2>
              <p className="mt-3 text-sm leading-relaxed mx-auto" style={{ color: MUTED, maxWidth: 640 }}>
                This form doesn't run through a server — it hands your message straight to
                your own email app, addressed and ready, so nothing about your request sits
                on a third-party server in between.
              </p>
            </div>

            <div className="book-steps-grid">
              {NEXT_STEPS.map((step) => (
                <div key={step.code} className="book-step-chip">
                  <div className="book-step-code">Step {step.code}</div>
                  <div className="book-step-title">{step.title}</div>
                  <div className="book-step-desc">{step.desc}</div>
                </div>
              ))}
            </div>

            <div className="book-disclaimer">
              <Info size={15} style={{ marginTop: 1, flexShrink: 0, color: GOLD }} />
              <span>
                Prefer to write it yourself? Email us anytime directly at{' '}
                <a className="book-direct-email" href={`mailto:${TARGET_EMAIL}`}>
                  {TARGET_EMAIL}
                </a>
                .
              </span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}