import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  ChevronDown,
  Menu,
  X,
  Globe2,
  FileText,
  Headphones,

  RefreshCw,
  Landmark,
  ArrowUpRight,
  Plane,
  LogIn,
  LogOut,
} from 'lucide-react';
import logo from '../assets/Euro_Feather_Logo_No_BG.png';
import { subscribeToAuthChanges, logoutUser } from '../utils/auth';

/* ---------------------------------------------------------------
   DESIGN TOKENS — "The Route", refined
   A calm paper-white field, a deep sapphire for direction and
   intent, and a restrained antique gold used sparingly as the
   signature accent (arrival, distinction, the one gilt line on an
   otherwise quiet passport). The flight-path motif is now a live
   runway ring around the seal: dashed light flowing along the
   track and a single gilt waypoint orbiting it on its own path,
   like a plane easing onto final approach — the one moving,
   memorable element on an otherwise disciplined, formal header.
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

const EASE = 'cubic-bezier(.16,1,.3,1)';

const services = [
  { icon: GraduationCap, title: 'Admission Support', desc: "Bachelor's, Master's & language programs", code: 'G01', href: '/services/admission-support' },
  { icon: Globe2, title: 'Visa Processing', desc: 'Complete guidance & documentation', code: 'G02', href: '/services/visa-processing' },
  { icon: FileText, title: 'Course & University Guidance', desc: 'Personalized course matching', code: 'G03', href: '/services/course-guidance' },
  { icon: Headphones, title: 'Pre-Departure Support', desc: 'A smooth journey to your dream', code: 'G04', href: '/services/pre-departure-support' },
];

const resources = [
  
  { icon: RefreshCw, title: 'CGPA Converter', desc: 'Bangladeshi CGPA to German grade', href: '/resources/cgpa-converter' },
  { icon: Landmark, title: 'Recognized Universities', desc: 'H+, H- and H+/- listed universities', href: '/resources/recognized-universities' },
];

/* ------------------------- active-path helpers ------------------------- */

/* A path is "active" if it's an exact match, or — for non-root paths —
   if the current path is nested under it (e.g. /services/visa-processing
   should keep the "Services" dropdown lit, and a sub-page under /course
   should keep "Course" lit too). "/" only matches the root itself,
   otherwise every page would light up Home. */
function pathMatches(currentPath, href) {
  if (href === '/') return currentPath === '/';
  return currentPath === href || currentPath.startsWith(href + '/');
}

/* ---------------------------- styles ---------------------------- */

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');

      .route-root { font-family: 'Inter', sans-serif; }

      /* --- underline that draws itself in as a route line --- */
      .route-link { position: relative; display: inline-block; padding-bottom: 6px; }
      .route-link::after {
        content: '';
        position: absolute; left: 0; bottom: 0;
        height: 2px; width: 0; border-radius: 2px;
        background: ${GOLD};
        transition: width .3s ${EASE};
      }
      .route-link:hover::after,
      .route-link:focus-visible::after,
      .route-link.is-active::after { width: 100%; }

      /* --------------------------------------------------------------
         LOGO MARK — "The Route", signature animation
         The ring itself never spins (that read as generic). Instead
         it behaves like a runway at night: a faint static track, a
         short dashed segment that flows continuously along it like
         landing lights guiding an approach, and a single gilt
         waypoint dot that orbits the seal on its own flight path,
         trailing a soft comet glow. On hover the route brightens to
         gold and the waypoint accelerates, like a plane on final
         approach.
      --------------------------------------------------------------- */
      .route-mark { position: relative; width: 44px; height: 44px; flex-shrink: 0; }
      .route-mark svg { position: absolute; inset: 0; display: block; }
      .ring-track { stroke: ${LINE}; }
      .ring-path {
        stroke: ${ROUTE};
        stroke-dasharray: 3 9;
        stroke-linecap: round;
        animation: route-flow 3.6s linear infinite;
        transition: stroke .4s ${EASE}, filter .4s ${EASE};
      }
      @keyframes route-flow { to { stroke-dashoffset: -24; } }
      .route-wrap:hover .ring-path {
        stroke: ${GOLD};
        filter: drop-shadow(0 0 4px rgba(168,129,47,0.55));
        animation-duration: 1s;
      }

      .route-waypoint {
        position: absolute;
        inset: 0;
        width: 5px; height: 5px;
        margin: auto;
        border-radius: 50%;
        background: ${GOLD};
        box-shadow: 0 0 0 2px ${PAPER}, 0 0 7px 1px rgba(168,129,47,0.65);
        offset-path: circle(20px at center);
        offset-rotate: 0deg;
        animation: route-orbit 7s linear infinite;
        transition: background-color .3s ${EASE}, box-shadow .3s ${EASE};
      }
      @keyframes route-orbit { to { offset-distance: 100%; } }
      .route-wrap:hover .route-waypoint {
        animation-duration: 1.7s;
        background: ${ROUTE};
        box-shadow: 0 0 0 2px ${PAPER}, 0 0 10px 2px rgba(30,58,120,0.6);
      }

      .route-mark img {
        position: absolute; inset: 5px;
        width: calc(100% - 10px); height: calc(100% - 10px);
        object-fit: contain;
        border-radius: 50%;
        background: ${PAPER};
        padding: 3px;
        transition: transform .4s ${EASE};
      }
      .route-wrap:hover .route-mark img { transform: scale(1.05); }
      .route-wrap { display: flex; align-items: center; gap: 12px; }

      @media (prefers-reduced-motion: reduce) {
        .route-waypoint { animation: none; offset-distance: 0%; }
        .ring-path { animation: none; }
      }

      /* --- header shell: floating, glassy, docks tighter on scroll --- */
      .route-shell {
        position: fixed; top: 0; left: 0; right: 0; z-index: 50;
        display: flex; justify-content: center;
      }
      .route-bar {
        width: 100%;
        background: rgba(250,249,245,0.82);
        backdrop-filter: blur(18px) saturate(160%);
        -webkit-backdrop-filter: blur(18px) saturate(160%);
        border-bottom: 1px solid ${LINE};
        transition: box-shadow .35s ${EASE}, border-color .35s ${EASE};
      }

      /* scroll progress / "runway" line */
      .route-progress {
        position: absolute; left: 0; bottom: -1px; height: 2px;
        background: linear-gradient(90deg, ${ROUTE}, ${GOLD});
        transition: width .12s linear;
      }

      /* --- boarding-pass dropdown panel --- */
      .pass-card {
        border-radius: 14px;
        background: ${PAPER};
        border: 1px solid ${LINE};
        box-shadow: 0 30px 60px -26px rgba(10,15,31,0.30);
        overflow: hidden;
      }
      .pass-header {
        display: flex; align-items: center; justify-content: space-between;
        padding: 16px 20px;
        background: ${INK};
      }
      .pass-label {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 14px; font-weight: 600;
        color: ${PAPER};
        letter-spacing: 0.01em;
      }
      .pass-tag {
        font-family: 'JetBrains Mono', monospace;
        font-size: 9.5px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
        color: ${GOLD_SOFT};
      }
      .pass-perf {
        position: relative;
        height: 0;
        border-top: 1.5px dashed ${LINE};
      }
      .pass-perf::before, .pass-perf::after {
        content: '';
        position: absolute; top: -7px;
        width: 14px; height: 14px; border-radius: 50%;
        background: ${PAPER_DIM};
      }
      .pass-perf::before { left: -7px; }
      .pass-perf::after { right: -7px; }
      .pass-item {
        display: flex; align-items: center; gap: 13px;
        padding: 13px 20px;
        border-left: 2px solid transparent;
        transition: border-color .2s ${EASE}, background-color .2s ${EASE};
      }
      .pass-item:hover { border-left-color: ${GOLD}; background: ${GOLD_TINT}; }
      .pass-item:hover .pass-icon { background: ${ROUTE}; }
      .pass-item:hover .pass-icon svg { color: ${PAPER}; }
      .pass-item.is-active { border-left-color: ${ROUTE}; background: ${ROUTE_TINT}; }
      .pass-item.is-active .pass-icon { background: ${ROUTE}; }
      .pass-item.is-active .pass-icon svg { color: ${PAPER}; }
      .pass-icon {
        width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
        background: ${ROUTE_TINT};
        display: flex; align-items: center; justify-content: center;
        transition: background-color .25s ${EASE};
      }
      .pass-icon svg { transition: color .25s ${EASE}; }
      .pass-title { font-size: 13.5px; font-weight: 700; color: ${INK}; line-height: 1.2; }
      .pass-desc { font-size: 11.5px; color: ${MUTED}; margin-top: 1px; }
      .pass-code {
        margin-left: auto; flex-shrink: 0;
        font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 600;
        color: ${ROUTE};
        background: ${ROUTE_TINT};
        padding: 3px 7px; border-radius: 5px;
      }

      /* --- account link: "Log In" / "Log Out", desktop only (mobile has
         its own icon button in the slide-out header). Styled as a quiet
         pill so it reads as its own control rather than floating loose
         between the nav links and the primary CTA. --- */
      .route-account-link {
        display: none;
        align-items: center; gap: 6px;
        font-size: 13px; font-weight: 600; color: ${ROUTE};
        background: ${ROUTE_TINT}; border: 1px solid transparent; border-radius: 999px;
        padding: 8px 14px; cursor: pointer;
        white-space: nowrap;
        transition: color .2s ${EASE}, background-color .2s ${EASE}, border-color .2s ${EASE};
      }
      @media (min-width: 1024px) {
        .route-account-link { display: inline-flex; }
      }
      .route-account-link:hover { background: ${ROUTE}; color: ${PAPER}; }
      .route-account-link:disabled { opacity: 0.5; cursor: default; }

      /* thin divider that separates the account pill from the primary CTA */
      .route-header-divider {
        display: none;
        width: 1px; height: 22px;
        background: ${LINE};
        margin: 0 1px;
      }
      @media (min-width: 1024px) {
        .route-header-divider { display: block; }
      }

      /* --- mobile: compact account icon button, lives in the slide-out
         menu header next to the close button, same shape as .mob-close
         so the two read as a matched pair --- */
      .mob-account-btn {
        position: relative;
        -webkit-tap-highlight-color: transparent;
      }
      .mob-account-btn.is-logged-in::after {
        content: '';
        position: absolute; top: 7px; right: 7px;
        width: 7px; height: 7px; border-radius: 50%;
        background: ${GOLD};
        box-shadow: 0 0 0 2px ${PAPER};
      }

      /* --- CTA: deep sapphire, arrow turns gold and lifts off on hover ---
         Hidden by default and only revealed at desktop widths via this
         media query (not Tailwind's "hidden" class) — this component's
         own <style> block loads after Tailwind's utilities, so relying
         on the "hidden" class here was losing the cascade and the
         button stayed visible on mobile no matter what. */
      .route-cta {
        display: none;
        align-items: center; gap: 9px;
        padding: 11px 20px; border-radius: 10px;
        background: ${ROUTE};
        border: 1px solid ${ROUTE};
        color: ${PAPER}; font-size: 13.5px; font-weight: 600; letter-spacing: 0.01em;
        transition: background-color .3s ${EASE}, border-color .3s ${EASE}, transform .25s ${EASE}, box-shadow .3s ${EASE};
        box-shadow: 0 10px 22px -12px rgba(30,58,120,0.5);
      }
      @media (min-width: 1024px) {
        .route-cta { display: inline-flex; }
      }
      .route-cta:hover { background: ${ROUTE_DEEP}; border-color: ${ROUTE_DEEP}; transform: translateY(-1px); box-shadow: 0 14px 26px -12px rgba(11,27,68,0.55); }
      .route-cta svg { transition: transform .25s ${EASE}, color .25s ${EASE}; }
      .route-cta:hover svg { transform: translate(3px,-3px); color: ${GOLD_SOFT}; }

      .mob-tag {
        margin-left: auto;
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px; font-weight: 600; color: ${ROUTE};
        background: ${ROUTE_TINT};
        padding: 2px 6px; border-radius: 5px;
      }

      /* --------------------------------------------------------------
         MOBILE MENU — refined "boarding pass" panel
         A quiet paper field, a gilt perforation rule under the header,
         staggered entrance for each row, and the "Book a Consultation"
         action living here as a full-width CTA inside the panel.
      --------------------------------------------------------------- */
      .mob-panel {
        background: ${PAPER};
        background-image:
          radial-gradient(ellipse 620px 320px at 100% 0%, ${ROUTE_TINT} 0%, transparent 60%),
          radial-gradient(ellipse 420px 260px at 0% 100%, ${GOLD_TINT} 0%, transparent 55%);
      }

      .mob-header {
        background: ${PAPER};
        border-bottom: 1px solid ${LINE};
      }
      .mob-header-perf {
        position: relative;
        height: 0;
        border-top: 1.5px dashed ${LINE};
      }
      .mob-header-perf::before, .mob-header-perf::after {
        content: '';
        position: absolute; top: -6px;
        width: 12px; height: 12px; border-radius: 50%;
        background: ${PAPER_DIM};
      }
      .mob-header-perf::before { left: -6px; }
      .mob-header-perf::after { right: -6px; }

      .mob-close {
        width: 40px; height: 40px; border-radius: 10px;
        display: flex; align-items: center; justify-content: center;
        background: ${PAPER_DIM};
        border: 1px solid ${LINE};
        transition: background-color .2s ${EASE}, transform .2s ${EASE}, border-color .2s ${EASE};
      }
      .mob-close:active { transform: scale(0.94); }
      .mob-close:hover { background: ${ROUTE_TINT}; border-color: ${ROUTE}; }

      .mob-row {
        opacity: 0;
        transform: translateY(10px);
      }
      .mob-menu-open .mob-row {
        animation: mob-row-in .5s ${EASE} forwards;
      }
      .mob-menu-open .mob-row:nth-child(1)  { animation-delay: .04s; }
      .mob-menu-open .mob-row:nth-child(2)  { animation-delay: .08s; }
      .mob-menu-open .mob-row:nth-child(3)  { animation-delay: .12s; }
      .mob-menu-open .mob-row:nth-child(4)  { animation-delay: .16s; }
      .mob-menu-open .mob-row:nth-child(5)  { animation-delay: .20s; }
      .mob-menu-open .mob-row:nth-child(6)  { animation-delay: .24s; }
      .mob-menu-open .mob-row:nth-child(7)  { animation-delay: .28s; }
      @keyframes mob-row-in { to { opacity: 1; transform: translateY(0); } }

      .mob-link {
        display: flex; align-items: center; justify-content: space-between;
        padding: 16px 4px;
        font-size: 15.5px; font-weight: 700;
        color: ${INK};
        border-bottom: 1px solid ${LINE};
        -webkit-tap-highlight-color: transparent;
      }
      .mob-link.is-active { color: ${ROUTE}; }
      .mob-link:active { color: ${ROUTE}; }
      .mob-link-arrow {
        color: ${MUTED};
        transition: transform .2s ${EASE}, color .2s ${EASE};
      }
      .mob-link.is-active .mob-link-arrow { color: ${GOLD}; }
      .mob-link:active .mob-link-arrow { transform: translateX(2px); color: ${GOLD}; }

      /* mobile Log In / Log Out row — same shape as mob-link but it's a
         <button> for logout, so reset the native button styles */
      .mob-auth-btn {
        width: 100%; background: none; border: none; text-align: left;
        -webkit-tap-highlight-color: transparent;
      }

      .mob-accordion-btn {
        width: 100%; display: flex; align-items: center; justify-content: space-between;
        padding: 16px 4px; text-align: left;
        font-size: 15.5px; font-weight: 700; color: ${INK};
        -webkit-tap-highlight-color: transparent;
      }
      .mob-accordion-btn.is-active { color: ${ROUTE}; }
      .mob-accordion-icon {
        width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center;
        background: ${ROUTE_TINT};
        transition: transform .25s ${EASE}, background-color .25s ${EASE};
      }
      .mob-menu-open .mob-accordion-icon.is-open { background: ${ROUTE}; transform: rotate(180deg); }
      .mob-accordion-icon.is-open svg { color: ${PAPER}; }

      .mob-sub-item {
        display: flex; align-items: center; gap: 12px;
        padding: 10px 4px 10px 8px;
        border-radius: 10px;
        transition: background-color .2s ${EASE};
      }
      .mob-sub-item:active { background: ${GOLD_TINT}; }
      .mob-sub-item.is-active { background: ${ROUTE_TINT}; }

      /* --- "Book a Consultation" CTA, full-width, lives inside the mobile slide-out menu --- */
      .route-cta-menu {
        display: flex; align-items: center; justify-content: center; gap: 9px;
        width: 100%;
        padding: 15px 20px; border-radius: 12px;
        background: ${ROUTE};
        color: ${PAPER}; font-size: 14.5px; font-weight: 700; letter-spacing: 0.01em;
        box-shadow: 0 14px 26px -14px rgba(30,58,120,0.55);
        transition: background-color .25s ${EASE}, transform .15s ${EASE}, box-shadow .25s ${EASE};
        -webkit-tap-highlight-color: transparent;
      }
      .route-cta-menu:active { transform: scale(0.98); background: ${ROUTE_DEEP}; }
      .route-cta-menu svg:last-child { transition: transform .25s ${EASE}, color .25s ${EASE}; color: ${GOLD_SOFT}; }
      .route-cta-menu:active svg:last-child { transform: translate(2px,-2px); }

      /* footer mark at the base of the mobile menu — a quiet signature flourish */
      .mob-footer {
        display: flex; align-items: center; gap: 10px;
        justify-content: center;
        padding-top: 14px;
      }
      .mob-footer-text {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase;
        color: ${MUTED};
      }

      /* small phones: tighten paddings a touch */
      @media (max-width: 380px) {
        .mob-link, .mob-accordion-btn { padding-top: 13px; padding-bottom: 13px; font-size: 14.5px; }
      }

      @media (prefers-reduced-motion: reduce) {
        .route-root *, .route-root *::before, .route-root *::after {
          transition-duration: 0.001ms !important;
          animation-duration: 0.001ms !important;
        }
        .mob-row { opacity: 1; transform: none; animation: none !important; }
      }
    `}</style>
  );
}

/* ---------------------------- pieces ---------------------------- */

function RouteMark() {
  return (
    <div className="route-mark">
      <svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
        <circle className="ring-track" cx="22" cy="22" r="20" fill="none" strokeWidth="1.2" />
        <circle className="ring-path" cx="22" cy="22" r="20" fill="none" strokeWidth="1.5" transform="rotate(-90 22 22)" />
      </svg>
      <img src={logo} alt="Euro Feather emblem" />
      <span className="route-waypoint" aria-hidden="true" />
    </div>
  );
}

function NavLink({ label, href, active }) {
  return (
    <a href={href} className="text-sm font-semibold" style={{ color: active ? ROUTE : INK }}>
      <span className={`route-link ${active ? 'is-active' : ''}`}>{label}</span>
    </a>
  );
}

function Dropdown({ label, tag, items, isOpen, active, onEnter, onLeave, showCodes, currentPath }) {
  const lit = isOpen || active;
  return (
    <div className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <button className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: lit ? ROUTE : INK }}>
        <span className={`route-link ${lit ? 'is-active' : ''}`}>{label}</span>
        <ChevronDown
          size={15}
          style={{ transition: `transform .25s ${EASE}`, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      <div
        className="absolute left-1/2 top-full pt-4"
        style={{
          width: 360,
          transform: `translateX(-50%) translateY(${isOpen ? '0' : '-6px'}) scale(${isOpen ? 1 : 0.98})`,
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden',
          transition: `opacity .22s ${EASE}, transform .22s ${EASE}, visibility .22s`,
        }}
      >
        <div className="pass-card">
          <div className="pass-header">
            <span className="pass-label">{label}</span>
            <span className="pass-tag">{tag}</span>
          </div>
          <div className="pass-perf" />
          <div className="py-1">
            {items.map((item, i) => {
              const itemActive = currentPath ? pathMatches(currentPath, item.href) : false;
              return (
                <a key={i} href={item.href} className={`pass-item ${itemActive ? 'is-active' : ''}`}>
                  <div className="pass-icon">
                    <item.icon size={15} color={ROUTE} />
                  </div>
                  <div className="min-w-0">
                    <div className="pass-title">{item.title}</div>
                    <div className="pass-desc">{item.desc}</div>
                  </div>
                  {showCodes && <span className="pass-code">{item.code}</span>}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileLink({ label, href, onClick, active }) {
  return (
    <a href={href} onClick={onClick} className={`mob-row mob-link ${active ? 'is-active' : ''}`}>
      {label}
      <ArrowUpRight size={16} className="mob-link-arrow" />
    </a>
  );
}

function MobileAccordion({ label, tag, items, isOpen, toggle, showCodes, currentPath, active }) {
  return (
    <div className="mob-row" style={{ borderBottom: `1px solid ${LINE}` }}>
      <button onClick={toggle} className={`mob-accordion-btn ${active ? 'is-active' : ''}`}>
        <span className="flex items-center gap-2">
          {label}
          {tag && (
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: MUTED,
              }}
            >
              {tag}
            </span>
          )}
        </span>
        <span className={`mob-accordion-icon ${isOpen ? 'is-open' : ''}`}>
          <ChevronDown size={15} color={ROUTE} />
        </span>
      </button>
      <div
        className="overflow-hidden"
        style={{ maxHeight: isOpen ? 320 : 0, paddingBottom: isOpen ? 10 : 0, transition: `max-height .3s ${EASE}, padding-bottom .3s ${EASE}` }}
      >
        {items.map((item, i) => {
          const itemActive = currentPath ? pathMatches(currentPath, item.href) : false;
          return (
            <a key={i} href={item.href} className={`mob-sub-item ${itemActive ? 'is-active' : ''}`}>
              <div className="pass-icon" style={{ width: 30, height: 30 }}>
                <item.icon size={14} color={ROUTE} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold" style={{ color: INK }}>{item.title}</div>
                <div className="text-xs" style={{ color: MUTED }}>{item.desc}</div>
              </div>
              {showCodes && <span className="mob-tag">{item.code}</span>}
            </a>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------- navbar ---------------------------- */

export default function Navbar() {
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobServices, setMobServices] = useState(false);
  const [mobResources, setMobResources] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');

  // Auth state — drives the Log In / Log Out item below.
  const [currentUser, setCurrentUser] = useState(null);
  const [authResolved, setAuthResolved] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setCurrentUser(user);
      setAuthResolved(true);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Track which page we're actually on, so the right nav item lights up
  // instead of "Home" always winning. Reads the real URL on mount, and
  // stays in sync with back/forward navigation (popstate) and with any
  // client-side route changes that push new history entries.
  useEffect(() => {
    const syncPath = () => setCurrentPath(window.location.pathname);
    syncPath();
    window.addEventListener('popstate', syncPath);
    return () => window.removeEventListener('popstate', syncPath);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutUser();
      closeMobile();
      navigate('/');
    } finally {
      setLoggingOut(false);
    }
  };

  const servicesActive = services.some((s) => pathMatches(currentPath, s.href));
  const resourcesActive = resources.some((r) => pathMatches(currentPath, r.href));

  return (
    <div className="route-root">
      <GlobalStyle />

      {/* NAVBAR */}
      <div className="route-shell">
        <header
          className="route-bar"
          style={{
            boxShadow: scrolled ? '0 18px 40px -26px rgba(10,15,31,0.28)' : 'none',
            borderColor: scrolled ? LINE : 'transparent',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
            <div
              className="flex items-center justify-between"
              style={{ height: scrolled ? 64 : 76, transition: `height .3s ${EASE}` }}
            >
              {/* Logo */}
              <a href="/" className="route-wrap group min-w-0">
                <RouteMark />
                <div className="flex flex-col leading-tight min-w-0">
                  <span
                    className="truncate"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: '-0.01em', color: INK }}
                  >
                    Euro Feather
                  </span>
                  <span
                    className="hidden xs:block truncate"
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: MUTED, marginTop: 3 }}
                  >
                    Overseas Education Services
                  </span>
                </div>
              </a>

              {/* Desktop nav */}
              <nav className="hidden lg:flex items-center gap-8">
                <NavLink label="Home" href="/" active={pathMatches(currentPath, '/')} />
                <NavLink label="About Us" href="/about" active={pathMatches(currentPath, '/about')} />
                <Dropdown
                  label="Services"
                  tag="4 stages"
                  items={services}
                  showCodes
                  isOpen={openDropdown === 'services'}
                  active={servicesActive}
                  currentPath={currentPath}
                  onEnter={() => setOpenDropdown('services')}
                  onLeave={() => setOpenDropdown(null)}
                />
                <NavLink label="Destinations" href="/destinations" active={pathMatches(currentPath, '/destinations')} />
                <NavLink label="Course" href="/course" active={pathMatches(currentPath, '/course')} />
                <Dropdown
                  label="Resources"
                  tag="Free tools"
                  items={resources}
                  isOpen={openDropdown === 'resources'}
                  active={resourcesActive}
                  currentPath={currentPath}
                  onEnter={() => setOpenDropdown('resources')}
                  onLeave={() => setOpenDropdown(null)}
                />
                <NavLink label="Contact Us" href="/contact" active={pathMatches(currentPath, '/contact')} />
              </nav>

              {/* Desktop CTA + account link + mobile toggle — "Book a
                  Consultation" and "Log In"/"Log Out" only show here on
                  desktop; on mobile both live inside the hamburger menu. */}
              <div className="flex items-center gap-3">
                {authResolved && (
                  currentUser ? (
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="route-account-link"
                      title={currentUser.email}
                    >
                      <LogOut size={14} />
                      {loggingOut ? 'Signing out…' : 'Log Out'}
                    </button>
                  ) : (
                    <a href="/login" className="route-account-link">
                      <LogIn size={14} />
                      Log In
                    </a>
                  )
                )}

                {authResolved && <span className="route-header-divider" aria-hidden="true" />}

                <a href="/consultation" className="route-cta">
                  Book a Consultation <ArrowUpRight size={16} />
                </a>
                <button
                  className="lg:hidden flex items-center justify-center rounded-lg"
                  style={{ width: 40, height: 40, color: INK, background: PAPER_DIM, border: `1px solid ${LINE}`, flexShrink: 0 }}
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open menu"
                >
                  <Menu size={22} />
                </button>
              </div>
            </div>
            <div className="route-progress" style={{ width: `${progress}%` }} />
          </div>
        </header>
      </div>

      {/* spacer so page content isn't hidden under the fixed header */}
      <div style={{ height: scrolled ? 64 : 76, transition: `height .3s ${EASE}` }} />

      {/* MOBILE MENU — "Book a Consultation" lives here as a full-width CTA */}
      <div
        className={`lg:hidden fixed inset-0 z-50 flex flex-col mob-panel ${mobileOpen ? 'mob-menu-open' : ''}`}
        style={{
          transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: `transform .38s ${EASE}`,
          visibility: mobileOpen ? 'visible' : 'hidden',
        }}
        aria-hidden={!mobileOpen}
      >
        <div className="mob-header">
          <div className="flex items-center justify-between px-5 pt-[max(18px,env(safe-area-inset-top))] pb-4">
            <div className="route-wrap min-w-0">
              <RouteMark />
              <div className="flex flex-col leading-tight min-w-0">
                <span className="truncate" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 17, color: INK }}>
                  Euro Feather
                </span>
                <span
                  className="truncate"
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTED, marginTop: 2 }}
                >
                  Boarding Menu
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {authResolved && (
                currentUser ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="mob-close mob-account-btn is-logged-in"
                    aria-label="Log out"
                    title={currentUser.email}
                  >
                    <LogOut size={18} color={INK} />
                  </button>
                ) : (
                  <a href="/login" className="mob-close mob-account-btn" aria-label="Log in">
                    <LogIn size={18} color={INK} />
                  </a>
                )
              )}
              <button className="mob-close" onClick={closeMobile} aria-label="Close menu">
                <X size={20} color={INK} />
              </button>
            </div>
          </div>
          <div className="mob-header-perf mx-5" />
        </div>

        <div className="flex-1 overflow-y-auto px-5 pt-2 pb-[max(20px,env(safe-area-inset-bottom))] flex flex-col">
          <div className="flex-1">
            <MobileLink label="Home" href="/" onClick={closeMobile} active={pathMatches(currentPath, '/')} />
            <MobileLink label="About Us" href="/about" onClick={closeMobile} active={pathMatches(currentPath, '/about')} />
            <MobileAccordion
              label="Services"
              tag="4 stages"
              items={services}
              showCodes
              isOpen={mobServices}
              active={servicesActive}
              currentPath={currentPath}
              toggle={() => setMobServices((o) => !o)}
            />
            <MobileLink label="Destinations" href="/destinations" onClick={closeMobile} active={pathMatches(currentPath, '/destinations')} />
            <MobileLink label="Course" href="/course" onClick={closeMobile} active={pathMatches(currentPath, '/course')} />
            <MobileAccordion
              label="Resources"
              tag="Free tools"
              items={resources}
              isOpen={mobResources}
              active={resourcesActive}
              currentPath={currentPath}
              toggle={() => setMobResources((o) => !o)}
            />
            <MobileLink label="Contact Us" href="/contact" onClick={closeMobile} active={pathMatches(currentPath, '/contact')} />
          </div>

          {/* Book a Consultation — moved here from the top bar, full-width inside the menu */}
          <a
            href="/consultation"
            onClick={closeMobile}
            className="mob-row route-cta-menu mt-6"
            style={{ animationDelay: '.32s' }}
          >
            <Plane size={16} />
            Book a Consultation
            <ArrowUpRight size={16} />
          </a>

          <div className="mob-row mob-footer mt-4 mb-2" style={{ animationDelay: '.36s' }}>
            <span className="mob-footer-text">Charting your route since day one</span>
          </div>
        </div>
      </div>
    </div>
  );
}