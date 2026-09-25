import { Mail } from 'lucide-react';
import logo from '../assets/Euro_Feather_Logo_No_BG.png';

/* ---------------------------------------------------------------
   FOOTER — same compact layout as before, recoloured to match the
   rest of the site exactly: the sapphire "route" blue and gilt gold
   from Navbar / Hero / Home, closing the page in the same palette
   it opened in rather than a one-off accent color.
------------------------------------------------------------------*/
const INK = '#0A0F1F';
const ROUTE = '#1E3A78';
const ROUTE_DEEP = '#0B1B44';
const PAPER = '#FAF9F5';
const MUTED = 'rgba(250,249,245,0.55)';
const FAINT = 'rgba(250,249,245,0.32)';
const GOLD = '#A8812F';
const GOLD_SOFT = '#D8B872';
const LINE = 'rgba(216,184,114,0.18)';

const GOLD_GRADIENT = `linear-gradient(115deg, ${GOLD} 0%, ${GOLD_SOFT} 45%, ${GOLD} 70%, ${GOLD_SOFT} 100%)`;
const EASE = 'cubic-bezier(.16,1,.3,1)';

function FacebookIcon({ size = 15, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YoutubeIcon({ size = 15, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  );
}

/* Correct WhatsApp glyph — single clean fill of the standard
   speech-bubble-and-handset mark, legible at small sizes. */
function WhatsAppIcon({ size = 15, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M16.02 3C9.4 3 4 8.4 4 15.02c0 2.23.6 4.34 1.73 6.2L3 29l7.94-2.66a11.94 11.94 0 0 0 5.08 1.14h.01c6.62 0 12.02-5.4 12.02-12.02C28.05 8.4 22.65 3 16.02 3zm0 21.78h-.01a9.7 9.7 0 0 1-4.95-1.36l-.35-.21-4.7 1.57 1.58-4.58-.23-.37a9.72 9.72 0 0 1-1.5-5.21c0-5.38 4.38-9.76 9.77-9.76 2.61 0 5.06 1.02 6.9 2.86a9.68 9.68 0 0 1 2.86 6.9c0 5.39-4.39 9.76-9.77 9.76zm5.35-7.32c-.29-.15-1.73-.85-2-.95-.27-.1-.46-.15-.66.15-.2.29-.76.95-.93 1.14-.17.2-.34.22-.63.07-.29-.15-1.24-.46-2.36-1.46-.87-.78-1.46-1.73-1.63-2.02-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.19-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.66-1.58-.9-2.17-.24-.57-.48-.49-.66-.5h-.56c-.2 0-.51.07-.78.37-.27.29-1.02 1-1.02 2.44s1.05 2.83 1.2 3.02c.15.2 2.06 3.15 5 4.41.7.3 1.24.48 1.67.62.7.22 1.34.19 1.84.11.56-.08 1.73-.71 1.98-1.39.24-.68.24-1.27.17-1.39-.07-.13-.26-.2-.55-.35z" />
    </svg>
  );
}

function IconLink({ href, label, children, external = true }) {
  return (
    <a
      href={href}
      title={label}
      aria-label={label}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="foot-icon"
    >
      {children}
    </a>
  );
}

function FooterColumn({ heading, children }) {
  return (
    <div>
      <span className="foot-heading">{heading}</span>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');

        .foot-shell {
          position: relative;
          background: linear-gradient(180deg, ${ROUTE_DEEP} 0%, ${INK} 100%);
          overflow: hidden;
        }
        .foot-shell::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse 760px 340px at 8% 0%, rgba(216,184,114,0.1) 0%, transparent 60%);
          pointer-events: none;
        }

        .foot-wordmark {
          background: ${GOLD_GRADIENT}; background-size: 260% 100%;
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }

        .foot-heading {
          font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase; color: ${GOLD_SOFT};
          margin-bottom: 14px; display: block;
        }

        .foot-link {
          position: relative; display: inline-block; width: fit-content;
          font-size: 13.5px; color: ${MUTED};
          transition: color .25s ${EASE};
        }
        .foot-link::after {
          content: ''; position: absolute; left: 0; bottom: -2px; height: 1px; width: 0;
          background: ${GOLD_GRADIENT};
          transition: width .3s ${EASE};
        }
        .foot-link:hover { color: ${PAPER}; }
        .foot-link:hover::after { width: 100%; }

        .foot-icon {
          width: 34px; height: 34px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: ${MUTED};
          border: 1px solid ${LINE};
          transition: color .25s ${EASE}, border-color .25s ${EASE}, background-color .25s ${EASE}, transform .25s ${EASE};
        }
        .foot-icon:hover { color: ${PAPER}; border-color: ${GOLD}; background: ${ROUTE}; transform: translateY(-2px); }

        .foot-seal {
          position: relative; width: 34px; height: 34px; flex-shrink: 0; border-radius: 50%;
          padding: 1px; background: ${GOLD_GRADIENT};
        }
        .foot-seal img { width: 100%; height: 100%; object-fit: contain; background: ${PAPER}; border-radius: 50%; padding: 3px; }

        .foot-divider { border-top: 1px solid ${LINE}; }
        .foot-bottom-link { color: ${FAINT}; transition: color .25s ${EASE}; }
        .foot-bottom-link:hover { color: ${GOLD_SOFT}; }
      `}</style>

      <div className="foot-shell">
        <div className="max-w-7xl mx-auto px-6 pt-14 pb-10 grid sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="foot-seal">
                <img src={logo} alt="Euro Feather emblem" />
              </div>
              <span className="text-lg font-bold foot-wordmark" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Euro Feather
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: MUTED }}>
              A clear route from application to arrival — one counselor,
              one plan, every step of the way.
            </p>
            <div className="flex items-center gap-2.5 mt-5">
              <IconLink href="mailto:eurofeather.de@gmail.com" label="Email us" external={false}>
                <Mail size={14} />
              </IconLink>
              <IconLink href="https://wa.me/4915737419397" label="Message us on WhatsApp">
                <WhatsAppIcon size={14} />
              </IconLink>
              <IconLink href="https://facebook.com" label="Facebook">
                <FacebookIcon size={14} />
              </IconLink>
              <IconLink href="https://www.youtube.com/@eurofeather" label="YouTube">
                <YoutubeIcon size={14} />
              </IconLink>
            </div>
          </div>

          <FooterColumn heading="Explore">
            <a href="/" className="foot-link">Home</a>
            <a href="/about" className="foot-link">About Us</a>
            <a href="/services/admission-support" className="foot-link">Services</a>
            <a href="/destinations" className="foot-link">Destinations</a>
          </FooterColumn>

          <FooterColumn heading="Resources">
            <a href="/course" className="foot-link">Course</a>
            <a href="/resources/cgpa-converter" className="foot-link">CGPA Converter</a>
            <a href="/resources/recognized-universities" className="foot-link">University Recognition</a>
          </FooterColumn>

          <FooterColumn heading="Company">
            <a href="/contact" className="foot-link">Contact Us</a>
            <a href="/privacy" className="foot-link">Privacy Policy</a>
            <a href="/terms" className="foot-link">Terms &amp; Conditions</a>
          </FooterColumn>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="foot-divider" />
        </div>

        <div
          className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{ color: FAINT, fontFamily: "'JetBrains Mono', monospace" }}
        >
          <span>© 2024 Euro Feather. All rights reserved.</span>
          <div className="flex items-center gap-5">
            <a href="/privacy" className="foot-bottom-link">Privacy</a>
            <a href="/terms" className="foot-bottom-link">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}