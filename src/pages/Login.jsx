import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Lock, LogIn, Info, Plane, UserPlus, Eye, EyeOff } from 'lucide-react';
import { loginUser, requestPasswordReset } from '../utils/auth';

/* ---------------------------------------------------------------
   LOGIN — same "boarding pass" identity as the rest of the site.
   There's no backend here, so "logging in" simply opens a session
   for this browser (stored via utils/auth.js) using whatever name
   + email is entered. This is enough to gate the consultation
   form and enforce "one request per day" without standing up a
   real auth server.
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

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');

      .login-root { font-family: 'Inter', sans-serif; background: ${PAPER}; min-height: 100vh; }

      .login-eyebrow { display: inline-flex; align-items: center; gap: 10px; }
      .login-eyebrow-dot { width: 7px; height: 7px; border-radius: 50%; background: ${GOLD}; box-shadow: 0 0 0 3px ${GOLD_TINT}; }
      .login-eyebrow-label {
        font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600;
        letter-spacing: 0.16em; text-transform: uppercase; color: ${GOLD};
      }
      .login-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; color: ${INK}; letter-spacing: -0.01em; }
      .login-title .foil {
        background: ${GOLD_GRADIENT}; background-size: 260% 100%;
        -webkit-background-clip: text; background-clip: text; color: transparent;
        animation: loginFoilSweep 7s ease-in-out infinite;
      }
      @keyframes loginFoilSweep { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }

      .login-ticket {
        position: relative; max-width: 440px; margin: 0 auto;
        border-radius: 16px; background: #ffffff; border: 1px solid ${LINE};
        box-shadow: 0 40px 80px -40px rgba(10,15,31,0.28); overflow: hidden;
        padding: 34px 32px 30px;
      }
      .login-ticket-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
      .login-ticket-eyebrow {
        font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 600;
        letter-spacing: 0.12em; text-transform: uppercase; color: ${MUTED};
      }
      .login-ticket-route {
        font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; color: ${ROUTE};
        display: flex; align-items: center; gap: 8px;
      }

      .login-field-group { margin-bottom: 20px; }
      .login-field-label {
        display: flex; align-items: center; gap: 6px;
        font-size: 12.5px; font-weight: 700; color: ${INK};
        margin-bottom: 8px; font-family: 'Space Grotesk', sans-serif;
      }
      .login-required { color: ${GOLD}; margin-left: 2px; }

      .login-field-input {
        width: 100%; padding: 12px 14px; border-radius: 9px;
        border: 1.5px solid ${LINE}; background: ${PAPER};
        font-size: 14.5px; font-weight: 500; color: ${INK};
        transition: border-color .2s ${EASE}, box-shadow .2s ${EASE}, background-color .2s ${EASE};
        font-family: 'Inter', sans-serif;
      }
      .login-field-input::placeholder { color: #B3AF9F; font-weight: 400; }
      .login-field-input:focus {
        outline: none; border-color: ${ROUTE}; background: #ffffff;
        box-shadow: 0 0 0 4px ${ROUTE_TINT};
      }

      .login-password-wrap { position: relative; }
      .login-password-wrap .login-field-input { padding-right: 42px; }
      .login-password-toggle {
        position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
        background: none; border: none; padding: 4px; cursor: pointer;
        color: ${MUTED}; display: flex; align-items: center; justify-content: center;
        transition: color .2s ${EASE};
      }
      .login-password-toggle:hover { color: ${ROUTE}; }
      .login-password-toggle:focus-visible { outline: none; color: ${ROUTE}; }

      .login-error {
        display: flex; align-items: flex-start; gap: 9px;
        background: #FBEAEA; border: 1px solid #E7B8B8; color: #8A3B3B;
        font-size: 12.5px; line-height: 1.5; font-weight: 500;
        padding: 12px 14px; border-radius: 9px; margin-bottom: 18px;
      }

      .login-submit-btn {
        display: inline-flex; align-items: center; justify-content: center; gap: 9px;
        width: 100%; padding: 14px 22px; border-radius: 10px;
        background: ${ROUTE}; border: 1px solid ${ROUTE};
        color: ${PAPER}; font-size: 14.5px; font-weight: 700; letter-spacing: 0.01em;
        cursor: pointer;
        transition: background-color .25s ${EASE}, transform .2s ${EASE}, box-shadow .25s ${EASE};
        box-shadow: 0 14px 26px -14px rgba(30,58,120,0.5);
      }
      .login-submit-btn:hover { background: ${ROUTE_DEEP}; border-color: ${ROUTE_DEEP}; transform: translateY(-1px); }
      .login-submit-btn:active { transform: translateY(0) scale(.99); }

      .login-forgot-row {
        display: flex; justify-content: flex-end; margin-top: -10px; margin-bottom: 22px;
      }
      .login-forgot-link {
        font-size: 12px; font-weight: 600; color: ${ROUTE};
        text-decoration: underline; text-underline-offset: 3px;
        background: none; border: none; cursor: pointer; padding: 0;
        font-family: 'Inter', sans-serif;
      }

      .login-signup-btn {
        display: inline-flex; align-items: center; justify-content: center; gap: 8px;
        width: 100%; margin-top: 12px; padding: 11px 18px; border-radius: 9px;
        border: 1.5px solid ${LINE}; background: #ffffff;
        font-size: 13.5px; font-weight: 700; color: ${ROUTE}; cursor: pointer;
        text-decoration: none;
        transition: background-color .2s ${EASE}, border-color .2s ${EASE};
      }
      .login-signup-btn:hover { background: ${ROUTE_TINT}; border-color: ${ROUTE}; }

      .login-note {
        display: flex; gap: 10px; align-items: flex-start;
        font-size: 12px; line-height: 1.6; color: ${MUTED};
        border-top: 1px dashed ${LINE}; margin-top: 22px; padding-top: 18px;
      }

      .login-back-link {
        display: block; text-align: center; margin-top: 18px;
        font-size: 12.5px; font-weight: 600; color: ${ROUTE}; text-decoration: underline;
        text-underline-offset: 3px;
      }
    `}</style>
  );
}

const initialFormState = { email: '', password: '' };

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setForgotSent(false);

    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Please fill in your email and password.');
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await loginUser({ email: formData.email.trim(), password: formData.password });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Something went wrong signing in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setForgotSent(false);
    if (!formData.email.trim()) {
      setError('Enter your email address above first, then tap "Forgot password?" again.');
      return;
    }
    try {
      await requestPasswordReset(formData.email.trim());
      setForgotSent(true);
    } catch (err) {
      setError(err.message || 'Could not send the reset email — please try again.');
    }
  };

  return (
    <div className="login-root">
      <GlobalStyle />
      <Navbar />

      <div style={{ height: 76 }} />

      <section className="max-w-5xl mx-auto px-6 pt-14 pb-10 text-center">
        <span className="login-eyebrow justify-center flex">
          <span className="login-eyebrow-dot" />
          <span className="login-eyebrow-label">Sign in</span>
        </span>
        <h1 className="login-title mt-4 text-3xl md:text-[42px]">
          Welcome <span className="foil">Back</span>
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-sm md:text-[15px] leading-relaxed" style={{ color: MUTED }}>
          Sign in to book a consultation and keep track of your request.
        </p>
      </section>

      <section className="px-6 pb-16">
        <form className="login-ticket" onSubmit={handleSubmit}>
          <div className="login-ticket-header">
            <div className="login-ticket-eyebrow">Boarding pass</div>
            <div className="login-ticket-route">
              <Plane size={14} color={GOLD} style={{ transform: 'rotate(90deg)' }} />
              <span>Euro Feather</span>
            </div>
          </div>

          <div className="login-field-group">
            <label className="login-field-label">
              <Mail size={13} color={ROUTE} /> Email address<span className="login-required">*</span>
            </label>
            <input
              className="login-field-input"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange('email')}
            />
          </div>

          <div className="login-field-group">
            <label className="login-field-label">
              <Lock size={13} color={ROUTE} /> Password<span className="login-required">*</span>
            </label>
            <div className="login-password-wrap">
              <input
                className="login-field-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange('password')}
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="login-forgot-row">
            <button type="button" onClick={handleForgotPassword} className="login-forgot-link">
              Forgot password?
            </button>
          </div>

          {forgotSent && !error && (
            <div className="login-note" style={{ borderTop: 'none', marginTop: -8, paddingTop: 0, marginBottom: 18 }}>
              <Info size={15} style={{ marginTop: 1, flexShrink: 0, color: GOLD }} />
              <span>
                If an account exists for that email, a password reset link has been sent.
                Check your inbox (and spam folder).
              </span>
            </div>
          )}

          {error && (
            <div className="login-error">
              <Info size={15} style={{ marginTop: 1, flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="login-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign In'} <LogIn size={16} />
          </button>

          <Link to="/signup" className="login-signup-btn">
            <UserPlus size={14} /> Create an account
          </Link>

          <Link to="/consultation" className="login-back-link">
            ← Back to consultation form
          </Link>
        </form>
      </section>

      <Footer />
    </div>
  );
}