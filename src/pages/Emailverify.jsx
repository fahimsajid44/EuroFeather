import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MailCheck, RefreshCw, Info, Plane, LogOut, CheckCircle2 } from 'lucide-react';
import { subscribeToAuthChanges, refreshEmailVerified, resendVerificationEmail, logoutUser } from '../utils/auth';

/* ---------------------------------------------------------------
   EMAIL VERIFY — fallback page for anyone who closes the in-page
   verification modal on the sign-up page (or opens the emailed link
   in a fresh session) before confirming. Auth-only: polls Firebase
   for emailVerified, and redirects to home the moment it's true.
   No database involved.
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

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');

      .verify-root { font-family: 'Inter', sans-serif; background: ${PAPER}; min-height: 100vh; }

      .verify-eyebrow { display: inline-flex; align-items: center; gap: 10px; }
      .verify-eyebrow-dot { width: 7px; height: 7px; border-radius: 50%; background: ${GOLD}; box-shadow: 0 0 0 3px ${GOLD_TINT}; }
      .verify-eyebrow-label {
        font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600;
        letter-spacing: 0.16em; text-transform: uppercase; color: ${GOLD};
      }
      .verify-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; color: ${INK}; letter-spacing: -0.01em; }
      .verify-title .foil {
        background: ${GOLD_GRADIENT}; background-size: 260% 100%;
        -webkit-background-clip: text; background-clip: text; color: transparent;
        animation: verifyFoilSweep 7s ease-in-out infinite;
      }
      @keyframes verifyFoilSweep { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }

      .verify-ticket {
        position: relative; max-width: 460px; margin: 0 auto; text-align: center;
        border-radius: 16px; background: #ffffff; border: 1px solid ${LINE};
        box-shadow: 0 40px 80px -40px rgba(10,15,31,0.28); overflow: hidden;
        padding: 40px 32px 32px;
      }
      .verify-ticket-eyebrow {
        display: flex; align-items: center; justify-content: center; gap: 8px;
        font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 600;
        letter-spacing: 0.12em; text-transform: uppercase; color: ${MUTED}; margin-bottom: 22px;
      }

      .verify-icon-circle {
        width: 64px; height: 64px; border-radius: 50%; margin: 0 auto 20px;
        display: flex; align-items: center; justify-content: center;
        background: ${ROUTE_TINT}; color: ${ROUTE}; border: 1px solid #D6DEF0;
      }
      .verify-icon-circle.is-success { background: #E9F5EC; color: #3E7A4C; border-color: #C9E5D0; }

      .verify-email-chip {
        display: inline-flex; align-items: center; gap: 6px;
        font-family: 'JetBrains Mono', monospace; font-weight: 600; font-size: 13px;
        color: ${ROUTE}; background: ${ROUTE_TINT}; border: 1px solid #D6DEF0;
        padding: 6px 12px; border-radius: 999px; margin: 6px 0 18px;
      }

      .verify-spinner {
        display: inline-block; width: 13px; height: 13px; border-radius: 50%;
        border: 2px solid ${ROUTE_TINT}; border-top-color: ${ROUTE};
        animation: verifySpin 0.8s linear infinite;
      }
      @keyframes verifySpin { to { transform: rotate(360deg); } }

      .verify-status-row {
        display: flex; align-items: center; justify-content: center; gap: 8px;
        font-size: 12.5px; font-weight: 600; color: ${MUTED}; margin-bottom: 24px;
      }

      .verify-resend-btn {
        display: inline-flex; align-items: center; justify-content: center; gap: 8px;
        width: 100%; padding: 13px 20px; border-radius: 10px;
        background: ${ROUTE}; border: 1px solid ${ROUTE};
        color: ${PAPER}; font-size: 14px; font-weight: 700; letter-spacing: 0.01em;
        cursor: pointer;
        transition: background-color .25s ${EASE}, transform .2s ${EASE};
        box-shadow: 0 14px 26px -14px rgba(30,58,120,0.5);
      }
      .verify-resend-btn:hover:not(:disabled) { background: ${ROUTE_DEEP}; border-color: ${ROUTE_DEEP}; transform: translateY(-1px); }
      .verify-resend-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

      .verify-manual-btn {
        display: inline-flex; align-items: center; justify-content: center; gap: 7px;
        width: 100%; margin-top: 12px; padding: 11px 18px; border-radius: 9px;
        border: 1.5px solid ${LINE}; background: #ffffff;
        font-size: 13.5px; font-weight: 700; color: ${ROUTE}; cursor: pointer;
        transition: background-color .2s ${EASE}, border-color .2s ${EASE};
      }
      .verify-manual-btn:hover { background: ${ROUTE_TINT}; border-color: ${ROUTE}; }

      .verify-note {
        display: flex; gap: 10px; align-items: flex-start; text-align: left;
        font-size: 12px; line-height: 1.6; color: ${MUTED};
        border-top: 1px dashed ${LINE}; margin-top: 22px; padding-top: 18px;
      }

      .verify-logout-link {
        display: inline-flex; align-items: center; gap: 6px; margin-top: 18px;
        font-size: 12.5px; font-weight: 600; color: ${MUTED};
        background: none; border: none; cursor: pointer; text-decoration: underline;
        text-underline-offset: 3px;
      }
      .verify-logout-link:hover { color: ${ROUTE}; }
    `}</style>
  );
}

export default function EmailVerify() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [authResolved, setAuthResolved] = useState(false);
  const [verified, setVerified] = useState(false);
  const [checking, setChecking] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendMessage, setResendMessage] = useState('');
  const [error, setError] = useState('');

  const pollRef = useRef(null);
  const cooldownRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Figure out who's signed in. No session at all → back to login.
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((firebaseAppUser) => {
      setUser(firebaseAppUser);
      setAuthResolved(true);
      if (!firebaseAppUser) {
        navigate('/login', { replace: true });
      }
    });
    return unsubscribe;
  }, [navigate]);

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

  // Poll in the background once we know someone is signed in.
  useEffect(() => {
    if (!authResolved || !user || verified) return;
    checkVerification();
    pollRef.current = setInterval(checkVerification, POLL_INTERVAL_MS);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [authResolved, user, verified, checkVerification]);

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

  const handleLogout = async () => {
    if (pollRef.current) clearInterval(pollRef.current);
    await logoutUser();
    navigate('/login', { replace: true });
  };

  return (
    <div className="verify-root">
      <GlobalStyle />
      <Navbar />

      <div style={{ height: 76 }} />

      <section className="max-w-5xl mx-auto px-6 pt-14 pb-10 text-center">
        <span className="verify-eyebrow justify-center flex">
          <span className="verify-eyebrow-dot" />
          <span className="verify-eyebrow-label">One last step</span>
        </span>
        <h1 className="verify-title mt-4 text-3xl md:text-[42px]">
          Verify your <span className="foil">Email</span>
        </h1>
      </section>

      <section className="px-6 pb-16">
        <div className="verify-ticket">
          <div className="verify-ticket-eyebrow">
            <Plane size={12} color={GOLD} style={{ transform: 'rotate(90deg)' }} />
            Euro Feather
          </div>

          <div className={`verify-icon-circle ${verified ? 'is-success' : ''}`}>
            {verified ? <CheckCircle2 size={28} /> : <MailCheck size={28} />}
          </div>

          {verified ? (
            <>
              <p style={{ fontSize: 15, fontWeight: 700, color: INK, marginBottom: 6 }}>
                Email verified!
              </p>
              <p style={{ fontSize: 13, color: MUTED, marginBottom: 4 }}>
                Taking you to the home page…
              </p>
            </>
          ) : (
            <>
              <p style={{ fontSize: 13.5, color: MUTED, lineHeight: 1.6, marginBottom: 4 }}>
                We've sent a verification link to
              </p>
              <div className="verify-email-chip">{user?.email || '…'}</div>
              <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, marginBottom: 24 }}>
                Open that email and click the link — this page will move on to the home
                page automatically once it's confirmed.
              </p>

              <div className="verify-status-row">
                <span className="verify-spinner" />
                {checking ? 'Checking…' : 'Waiting for confirmation'}
              </div>

              {resendMessage && !error && (
                <div className="verify-note" style={{ borderTop: 'none', marginTop: -8, paddingTop: 0, marginBottom: 16, justifyContent: 'center' }}>
                  <Info size={15} style={{ marginTop: 1, flexShrink: 0, color: GOLD }} />
                  <span>{resendMessage}</span>
                </div>
              )}
              {error && (
                <div className="verify-note" style={{ borderTop: 'none', marginTop: -8, paddingTop: 0, marginBottom: 16, color: '#8A3B3B' }}>
                  <Info size={15} style={{ marginTop: 1, flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="button"
                className="verify-resend-btn"
                onClick={handleResend}
                disabled={resendCooldown > 0}
              >
                <RefreshCw size={15} />
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend verification email'}
              </button>

              <button type="button" className="verify-manual-btn" onClick={checkVerification} disabled={checking}>
                <RefreshCw size={14} /> I've verified it — check now
              </button>

              <div className="verify-note">
                <Info size={15} style={{ marginTop: 1, flexShrink: 0, color: GOLD }} />
                <span>
                  Wrong inbox or made a typo? Sign out below and create the account again
                  with the correct email.
                </span>
              </div>

              <button type="button" className="verify-logout-link" onClick={handleLogout}>
                <LogOut size={13} /> Sign out
              </button>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}