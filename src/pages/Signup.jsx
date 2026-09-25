import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  User,
  Mail,
  Phone,
  Lock,
  UserPlus,
  Info,
  Plane,
  Check,
  X,
  Eye,
  EyeOff,
  MailCheck,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { registerUser, refreshEmailVerified, resendVerificationEmail, logoutUser } from '../utils/auth';

/* ---------------------------------------------------------------
   SIGN UP — same "boarding pass" identity as Login. Firebase
   Authentication only (no database): registerUser() creates the
   account, sets the display name, and sends the verification email.

   Right after that succeeds, an in-page modal ("mini tab" — no new
   browser tab, no page navigation) opens and polls Firebase Auth for
   emailVerified. The moment that flips to true, the modal redirects
   to the home page. Authentication is considered complete exactly
   at that point — nothing else needs to happen.

   /verify-email still exists as a fallback for anyone who closes the
   modal before finishing — it polls the same way.
------------------------------------------------------------------*/
const INK = '#0A0F1F';
const PAPER = '#FAF9F5';
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

const POLL_INTERVAL_MS = 4000;
const RESEND_COOLDOWN_S = 45;

/* ------------------------- validation regex ------------------------- */

// Standard, reasonably strict email shape: local@domain.tld
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Bangladeshi mobile numbers: optional +880 / 880 / 0 prefix, then a
// second digit of 3-9 (valid operator series), then 8 more digits.
// Matches, e.g.: 01712345678, +8801812345678, 8801912345678
const BD_PHONE_REGEX = /^(?:\+?880|0)1[3-9]\d{8}$/;

// At least 8 characters, one uppercase, one lowercase, one digit,
// and one special character.
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

/* ---------------------------- styles ---------------------------- */

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');

      .signup-root { font-family: 'Inter', sans-serif; background: ${PAPER}; min-height: 100vh; }

      .signup-eyebrow { display: inline-flex; align-items: center; gap: 10px; }
      .signup-eyebrow-dot { width: 7px; height: 7px; border-radius: 50%; background: ${GOLD}; box-shadow: 0 0 0 3px ${GOLD_TINT}; }
      .signup-eyebrow-label {
        font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600;
        letter-spacing: 0.16em; text-transform: uppercase; color: ${GOLD};
      }
      .signup-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; color: ${INK}; letter-spacing: -0.01em; }
      .signup-title .foil {
        background: ${GOLD_GRADIENT}; background-size: 260% 100%;
        -webkit-background-clip: text; background-clip: text; color: transparent;
        animation: signupFoilSweep 7s ease-in-out infinite;
      }
      @keyframes signupFoilSweep { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }

      .signup-ticket {
        position: relative; max-width: 460px; margin: 0 auto;
        border-radius: 16px; background: #ffffff; border: 1px solid ${LINE};
        box-shadow: 0 40px 80px -40px rgba(10,15,31,0.28); overflow: hidden;
        padding: 34px 32px 30px;
      }
      .signup-ticket-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
      .signup-ticket-eyebrow {
        font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 600;
        letter-spacing: 0.12em; text-transform: uppercase; color: ${MUTED};
      }
      .signup-ticket-route {
        font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; color: ${ROUTE};
        display: flex; align-items: center; gap: 8px;
      }

      .signup-field-group { margin-bottom: 18px; }
      .signup-field-label {
        display: flex; align-items: center; gap: 6px;
        font-size: 12.5px; font-weight: 700; color: ${INK};
        margin-bottom: 8px; font-family: 'Space Grotesk', sans-serif;
      }
      .signup-required { color: ${GOLD}; margin-left: 2px; }

      .signup-field-input {
        width: 100%; padding: 12px 14px; border-radius: 9px;
        border: 1.5px solid ${LINE}; background: ${PAPER};
        font-size: 14.5px; font-weight: 500; color: ${INK};
        transition: border-color .2s ${EASE}, box-shadow .2s ${EASE}, background-color .2s ${EASE};
        font-family: 'Inter', sans-serif;
      }
      .signup-field-input::placeholder { color: #B3AF9F; font-weight: 400; }
      .signup-field-input:focus {
        outline: none; border-color: ${ROUTE}; background: #ffffff;
        box-shadow: 0 0 0 4px ${ROUTE_TINT};
      }
      .signup-field-input.has-error { border-color: #D98C8C; }
      .signup-field-input.has-error:focus { box-shadow: 0 0 0 4px #FBEAEA; }

      .signup-password-wrap { position: relative; }
      .signup-password-wrap .signup-field-input { padding-right: 42px; }
      .signup-password-toggle {
        position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
        background: none; border: none; padding: 4px; cursor: pointer;
        color: ${MUTED}; display: flex; align-items: center; justify-content: center;
        transition: color .2s ${EASE};
      }
      .signup-password-toggle:hover { color: ${ROUTE}; }
      .signup-password-toggle:focus-visible { outline: none; color: ${ROUTE}; }

      .signup-field-msg {
        display: flex; align-items: center; gap: 6px;
        font-size: 11.5px; margin-top: 6px; line-height: 1.5;
      }
      .signup-field-msg.is-error { color: #B04545; }
      .signup-field-msg.is-ok { color: #3E7A4C; }
      .signup-field-hint { font-size: 11.5px; color: ${MUTED}; margin-top: 6px; line-height: 1.5; }

      .signup-error {
        display: flex; align-items: flex-start; gap: 9px;
        background: #FBEAEA; border: 1px solid #E7B8B8; color: #8A3B3B;
        font-size: 12.5px; line-height: 1.5; font-weight: 500;
        padding: 12px 14px; border-radius: 9px; margin-bottom: 18px;
      }

      .signup-submit-btn {
        display: inline-flex; align-items: center; justify-content: center; gap: 9px;
        width: 100%; padding: 14px 22px; border-radius: 10px;
        background: ${ROUTE}; border: 1px solid ${ROUTE};
        color: ${PAPER}; font-size: 14.5px; font-weight: 700; letter-spacing: 0.01em;
        cursor: pointer;
        transition: background-color .25s ${EASE}, transform .2s ${EASE}, box-shadow .25s ${EASE};
        box-shadow: 0 14px 26px -14px rgba(30,58,120,0.5);
      }
      .signup-submit-btn:hover { background: ${ROUTE_DEEP}; border-color: ${ROUTE_DEEP}; transform: translateY(-1px); }
      .signup-submit-btn:active { transform: translateY(0) scale(.99); }
      .signup-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

      .signup-login-link {
        display: block; text-align: center; margin-top: 18px;
        font-size: 12.5px; font-weight: 600; color: ${ROUTE}; text-decoration: underline;
        text-underline-offset: 3px;
      }

      .signup-note {
        display: flex; gap: 10px; align-items: flex-start;
        font-size: 12px; line-height: 1.6; color: ${MUTED};
        border-top: 1px dashed ${LINE}; margin-top: 22px; padding-top: 18px;
      }

      /* --- verification modal ("mini tab") --- */
      .sv-modal-overlay {
        position: fixed; inset: 0; z-index: 1000;
        background: rgba(10,15,31,0.55);
        display: flex; align-items: center; justify-content: center; padding: 20px;
      }
      .sv-modal-card {
        background: #ffffff; border-radius: 16px; max-width: 380px; width: 100%;
        padding: 32px 26px 26px; text-align: center;
        box-shadow: 0 40px 80px -30px rgba(10,15,31,0.4);
      }
      .sv-modal-eyebrow {
        display: flex; align-items: center; justify-content: center; gap: 8px;
        font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 600;
        letter-spacing: 0.12em; text-transform: uppercase; color: ${MUTED}; margin-bottom: 18px;
      }
      .sv-modal-icon {
        width: 56px; height: 56px; border-radius: 50%; margin: 0 auto 16px;
        display: flex; align-items: center; justify-content: center;
        background: ${ROUTE_TINT}; color: ${ROUTE}; border: 1px solid #D6DEF0;
      }
      .sv-modal-icon.is-success { background: #E9F5EC; color: #3E7A4C; border-color: #C9E5D0; }
      .sv-modal-email-chip {
        display: inline-flex; align-items: center; gap: 6px;
        font-family: 'JetBrains Mono', monospace; font-weight: 600;
        font-size: 12.5px; color: ${ROUTE}; background: ${ROUTE_TINT}; border: 1px solid #D6DEF0;
        padding: 5px 12px; border-radius: 999px; margin: 4px 0 16px;
      }
      .sv-modal-status {
        display: flex; align-items: center; justify-content: center; gap: 8px;
        font-size: 12.5px; font-weight: 600; color: ${MUTED}; margin-bottom: 20px;
      }
      .sv-modal-spinner {
        display: inline-block; width: 12px; height: 12px; border-radius: 50%;
        border: 2px solid ${ROUTE_TINT}; border-top-color: ${ROUTE};
        animation: svModalSpin 0.8s linear infinite;
      }
      @keyframes svModalSpin { to { transform: rotate(360deg); } }
      .sv-modal-note {
        font-size: 11.5px; line-height: 1.55; color: ${MUTED};
        background: ${GOLD_TINT}; border: 1px solid #E9D9AE;
        border-radius: 8px; padding: 9px 11px; margin-bottom: 14px;
      }
      .sv-modal-note.is-error { color: #8A3B3B; background: #FBEAEA; border-color: #E7B8B8; }
      .sv-modal-btn {
        display: inline-flex; align-items: center; justify-content: center; gap: 7px;
        width: 100%; padding: 12px; border-radius: 9px;
        background: ${ROUTE}; color: ${PAPER}; border: none;
        font-size: 13.5px; font-weight: 700; cursor: pointer;
        transition: background-color .2s ${EASE};
      }
      .sv-modal-btn:hover:not(:disabled) { background: ${ROUTE_DEEP}; }
      .sv-modal-btn:disabled { opacity: 0.55; cursor: not-allowed; }
      .sv-modal-btn-ghost {
        display: inline-flex; align-items: center; justify-content: center; gap: 6px;
        width: 100%; margin-top: 10px; padding: 10px; border-radius: 9px;
        background: #ffffff; border: 1.5px solid ${LINE}; color: ${ROUTE};
        font-size: 12.5px; font-weight: 700; cursor: pointer;
        transition: background-color .2s ${EASE}, border-color .2s ${EASE};
      }
      .sv-modal-btn-ghost:hover { background: ${ROUTE_TINT}; border-color: ${ROUTE}; }
      .sv-modal-cancel {
        display: block; margin: 16px auto 0; background: none; border: none;
        text-decoration: underline; text-underline-offset: 3px;
        font-size: 11.5px; color: ${MUTED}; cursor: pointer;
      }
      .sv-modal-cancel:hover { color: ${ROUTE}; }
    `}</style>
  );
}

/* ---------------------- verification modal ---------------------- */

function VerifyModal({ email, onClose }) {
  const navigate = useNavigate();

  const [verified, setVerified] = useState(false);
  const [checking, setChecking] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendMessage, setResendMessage] = useState('');
  const [error, setError] = useState('');

  const pollRef = useRef(null);
  const cooldownRef = useRef(null);

  const checkVerification = useCallback(async () => {
    setChecking(true);
    try {
      const isVerified = await refreshEmailVerified();
      if (isVerified) {
        setVerified(true);
        if (pollRef.current) clearInterval(pollRef.current);
        // Auth-only flow: verification IS completion. Nothing else to
        // wait on — redirect straight to home.
        setTimeout(() => navigate('/', { replace: true }), 1200);
      }
    } catch {
      // Transient hiccups here are fine — the next poll tick (or the
      // manual button) will try again.
    } finally {
      setChecking(false);
    }
  }, [navigate]);

  // Poll as soon as the modal mounts.
  useEffect(() => {
    checkVerification();
    pollRef.current = setInterval(checkVerification, POLL_INTERVAL_MS);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [checkVerification]);

  // Resend cooldown ticker.
  useEffect(() => {
    if (resendCooldown <= 0) {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
      return;
    }
    cooldownRef.current = setInterval(() => {
      setResendCooldown((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(cooldownRef.current);
  }, [resendCooldown > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleResend = async () => {
    setError('');
    setResendMessage('');
    try {
      await resendVerificationEmail();
      setResendMessage('Verification email sent again — check your inbox and spam folder.');
      setResendCooldown(RESEND_COOLDOWN_S);
    } catch (err) {
      setError(err.message || 'Could not resend the email — please try again in a moment.');
    }
  };

  const handleCancel = async () => {
    if (pollRef.current) clearInterval(pollRef.current);
    try {
      await logoutUser();
    } finally {
      onClose();
    }
  };

  return (
    <div className="sv-modal-overlay" role="dialog" aria-modal="true" aria-label="Verify your email">
      <div className="sv-modal-card">
        <div className="sv-modal-eyebrow">
          <Plane size={12} color={GOLD} style={{ transform: 'rotate(90deg)' }} />
          Euro Feather
        </div>

        <div className={`sv-modal-icon ${verified ? 'is-success' : ''}`}>
          {verified ? <CheckCircle2 size={26} /> : <MailCheck size={26} />}
        </div>

        {verified ? (
          <>
            <p style={{ fontWeight: 700, color: INK, marginBottom: 6 }}>Email verified!</p>
            <p style={{ fontSize: 13, color: MUTED }}>Taking you to the home page…</p>
          </>
        ) : (
          <>
            <p style={{ fontSize: 13.5, color: MUTED, marginBottom: 4 }}>
              We've sent a verification link to
            </p>
            <div className="sv-modal-email-chip">{email}</div>
            <p style={{ fontSize: 13, color: MUTED, marginBottom: 4 }}>
              Click the link in that email — this closes on its own once it's confirmed.
            </p>

            <div className="sv-modal-status" style={{ marginTop: 16 }}>
              <span className="sv-modal-spinner" />
              {checking ? 'Checking…' : 'Waiting for confirmation'}
            </div>

            {resendMessage && !error && <div className="sv-modal-note">{resendMessage}</div>}
            {error && <div className="sv-modal-note is-error">{error}</div>}

            <button type="button" className="sv-modal-btn" onClick={handleResend} disabled={resendCooldown > 0}>
              <RefreshCw size={14} />
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend verification email'}
            </button>
            <button type="button" className="sv-modal-btn-ghost" onClick={checkVerification} disabled={checking}>
              <RefreshCw size={13} /> I've verified it — check now
            </button>
            <button type="button" className="sv-modal-cancel" onClick={handleCancel}>
              Wrong email? Cancel and start over
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------------------- page ---------------------------- */

const initialFormState = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
};

export default function Signup() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Verification modal ("mini tab") state.
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };
  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const emailValid = formData.email.trim() === '' ? null : EMAIL_REGEX.test(formData.email.trim());
  const phoneValid = formData.phone.trim() === '' ? null : BD_PHONE_REGEX.test(formData.phone.trim());
  const passwordValid = formData.password === '' ? null : PASSWORD_REGEX.test(formData.password);
  const confirmValid =
    formData.confirmPassword === ''
      ? null
      : formData.confirmPassword === formData.password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ fullName: true, email: true, phone: true, password: true, confirmPassword: true });

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError('Please fill in every field to create your account.');
      return;
    }
    if (!EMAIL_REGEX.test(formData.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!BD_PHONE_REGEX.test(formData.phone.trim())) {
      setError('Please enter a valid Bangladeshi phone number, e.g. 01712345678 or +8801712345678.');
      return;
    }
    if (!PASSWORD_REGEX.test(formData.password)) {
      setError('Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      const newUser = await registerUser({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      setPendingEmail(newUser.email);
      setShowVerifyModal(true); // open the mini tab — no navigation yet
    } catch (err) {
      setError(err.message || 'Something went wrong creating your account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowVerifyModal(false);
    setPendingEmail('');
  };

  return (
    <div className="signup-root">
      <GlobalStyle />
      <Navbar />

      <div style={{ height: 76 }} />

      <section className="max-w-5xl mx-auto px-6 pt-14 pb-10 text-center">
        <span className="signup-eyebrow justify-center flex">
          <span className="signup-eyebrow-dot" />
          <span className="signup-eyebrow-label">Create account</span>
        </span>
        <h1 className="signup-title mt-4 text-3xl md:text-[42px]">
          Join <span className="foil">Euro Feather</span>
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-sm md:text-[15px] leading-relaxed" style={{ color: MUTED }}>
          Create an account to book consultations and keep track of your requests.
        </p>
      </section>

      <section className="px-6 pb-16">
        <form className="signup-ticket" onSubmit={handleSubmit} noValidate>
          <div className="signup-ticket-header">
            <div className="signup-ticket-eyebrow">New passenger</div>
            <div className="signup-ticket-route">
              <Plane size={14} color={GOLD} style={{ transform: 'rotate(90deg)' }} />
              <span>Euro Feather</span>
            </div>
          </div>

          <div className="signup-field-group">
            <label className="signup-field-label">
              <User size={13} color={ROUTE} /> Full name<span className="signup-required">*</span>
            </label>
            <input
              className="signup-field-input"
              type="text"
              placeholder="e.g. Farhan Rahman"
              value={formData.fullName}
              onChange={handleChange('fullName')}
              onBlur={handleBlur('fullName')}
            />
          </div>

          <div className="signup-field-group">
            <label className="signup-field-label">
              <Mail size={13} color={ROUTE} /> Email address<span className="signup-required">*</span>
            </label>
            <input
              className={`signup-field-input ${touched.email && emailValid === false ? 'has-error' : ''}`}
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange('email')}
              onBlur={handleBlur('email')}
            />
            {touched.email && emailValid === false && (
              <div className="signup-field-msg is-error"><X size={12} /> Enter a valid email address.</div>
            )}
            {touched.email && emailValid === true && (
              <div className="signup-field-msg is-ok"><Check size={12} /> Looks good.</div>
            )}
          </div>

          <div className="signup-field-group">
            <label className="signup-field-label">
              <Phone size={13} color={ROUTE} /> Phone number<span className="signup-required">*</span>
            </label>
            <input
              className={`signup-field-input ${touched.phone && phoneValid === false ? 'has-error' : ''}`}
              type="tel"
              placeholder="01712345678"
              value={formData.phone}
              onChange={handleChange('phone')}
              onBlur={handleBlur('phone')}
            />
            {touched.phone && phoneValid === false && (
              <div className="signup-field-msg is-error"><X size={12} /> Use a valid Bangladeshi number, e.g. 01712345678 or +8801712345678.</div>
            )}
            {touched.phone && phoneValid === true && (
              <div className="signup-field-msg is-ok"><Check size={12} /> Looks good.</div>
            )}
          </div>

          <div className="signup-field-group">
            <label className="signup-field-label">
              <Lock size={13} color={ROUTE} /> Password<span className="signup-required">*</span>
            </label>
            <div className="signup-password-wrap">
              <input
                className={`signup-field-input ${touched.password && passwordValid === false ? 'has-error' : ''}`}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange('password')}
                onBlur={handleBlur('password')}
              />
              <button
                type="button"
                className="signup-password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {touched.password && passwordValid === false && (
              <div className="signup-field-msg is-error">
                <X size={12} /> Min 8 characters, with uppercase, lowercase, a number, and a special character.
              </div>
            )}
            {touched.password && passwordValid === true && (
              <div className="signup-field-msg is-ok"><Check size={12} /> Strong enough.</div>
            )}
            {!touched.password && (
              <div className="signup-field-hint">
                e.g. Feather@2026 — 8+ characters, mixing case, a number, and a symbol.
              </div>
            )}
          </div>

          <div className="signup-field-group">
            <label className="signup-field-label">
              <Lock size={13} color={ROUTE} /> Confirm password<span className="signup-required">*</span>
            </label>
            <div className="signup-password-wrap">
              <input
                className={`signup-field-input ${touched.confirmPassword && confirmValid === false ? 'has-error' : ''}`}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
              />
              <button
                type="button"
                className="signup-password-toggle"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {touched.confirmPassword && confirmValid === false && (
              <div className="signup-field-msg is-error"><X size={12} /> Passwords don't match.</div>
            )}
            {touched.confirmPassword && confirmValid === true && (
              <div className="signup-field-msg is-ok"><Check size={12} /> Matches.</div>
            )}
          </div>

          {error && (
            <div className="signup-error">
              <Info size={15} style={{ marginTop: 1, flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="signup-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account…' : 'Create Account'} <UserPlus size={16} />
          </button>

          <Link to="/login" className="signup-login-link">
            Already have an account? Log in
          </Link>

          <div className="signup-note">
            <Info size={15} style={{ marginTop: 1, flexShrink: 0, color: GOLD }} />
            <span>
              Your account is created with Firebase Authentication, so it works from any
              device. We'll send a verification link to your email right after — click it
              to finish signing up.
            </span>
          </div>
        </form>
      </section>

      <Footer />

      {showVerifyModal && (
        <VerifyModal email={pendingEmail} onClose={handleCloseModal} />
      )}
    </div>
  );
}