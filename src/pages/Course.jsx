import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Play,
  ArrowRight,
  Info,
  CheckCircle2,
  PlaneTakeoff,
  PlaneLanding,
  Plane,
  Rocket,
  CloudSun,
  Gauge,
  Sparkles,
} from 'lucide-react';

/* ---------------------------------------------------------------
   "THE ROUTE" — same identity as Navbar / Hero / Home / CGPA
   Converter / Recognized Universities. This page maps the six
   CEFR levels (A1 → C2) onto the site's flight motif: language
   learning as a climb, from taxiing on the runway at A1 to
   cruising above the clouds at C2.

   SIGNATURE MOTION: a single gilt plane travels up the dashed
   route line as the person scrolls through the level list — the
   same "you are here" idea as a real flight tracker — instead of
   scattered per-element effects. Cards rise into place as they
   enter view, and the quick-jump pill for whichever level is
   currently in the reading position lights up, the way a boarding
   board highlights the active gate.
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

// Must match `.climb-row { scroll-margin-top: ... }` below. This is the
// fixed horizontal line (in px from the top of the viewport) we use to
// decide which level is "current" while scrolling — kept as one shared
// constant so the CSS and the JS measurement can never drift apart.
const SCROLL_DETECTION_LINE = 130;

/* -----------------------------------------------------------------
   COURSE DATA
   Replace each `videoId` with the real YouTube video ID for that
   level's playlist/intro (the part after "v=" in a YouTube URL).
   The poster image is pulled automatically from YouTube's own
   thumbnail CDN, so you don't need to upload separate images —
   but you can override any single one by setting `poster` to a
   custom image URL instead.
------------------------------------------------------------------*/
const LEVELS = [
  {
    code: 'A1',
    phase: 'Ready for boarding',
    icon: PlaneTakeoff,
    title: 'Absolute Beginner',
    desc: 'Start from zero — the alphabet, greetings, numbers, and the handful of everyday sentences you need to introduce yourself.',
    topics: ['Alphabet & pronunciation', 'Greetings & introductions', 'Numbers & basic questions'],
    videoId: 'REPLACE_WITH_A1_VIDEO_ID',
    lessons: '20 lessons',
  },
  {
    code: 'A2',
    phase: 'Taxiing',
    icon: Gauge,
    title: 'Elementary',
    desc: 'Build on the basics — everyday topics like shopping, directions, and simple past-tense conversation.',
    topics: ['Everyday routines', 'Shopping & directions', 'Simple past tense'],
    videoId: 'REPLACE_WITH_A2_VIDEO_ID',
    lessons: '22 lessons',
  },
  {
    code: 'B1',
    phase: 'Takeoff',
    icon: Rocket,
    title: 'Intermediate',
    desc: 'Hold your own in real conversation — work, travel, and opinions, plus the grammar that ties longer sentences together.',
    topics: ['Work & study topics', 'Expressing opinions', 'Connected sentences'],
    videoId: 'REPLACE_WITH_B1_VIDEO_ID',
    lessons: '24 lessons',
  },
  {
    code: 'B2',
    phase: 'Climbing',
    icon: CloudSun,
    title: 'Upper Intermediate',
    desc: 'This is the level most German universities require — confident, detailed conversation on abstract and technical subjects.',
    topics: ['Abstract & technical topics', 'Detailed argumentation', 'University-ready German'],
    videoId: 'REPLACE_WITH_B2_VIDEO_ID',
    lessons: '26 lessons',
  },
  {
    code: 'C1',
    phase: 'Cruising altitude',
    icon: Sparkles,
    title: 'Advanced',
    desc: 'Near-fluent, flexible German for academic and professional settings — nuance, structure, and precision.',
    topics: ['Academic & professional German', 'Nuance & idiom', 'Structured writing'],
    videoId: 'REPLACE_WITH_C1_VIDEO_ID',
    lessons: '18 lessons',
  },
  {
    code: 'C2',
    phase: 'Above the clouds',
    icon: PlaneLanding,
    title: 'Proficiency',
    desc: 'Mastery-level German — the final stretch before you sound, read, and write like a native speaker.',
    topics: ['Native-level fluency', 'Literature & media', 'Effortless expression'],
    videoId: 'REPLACE_WITH_C2_VIDEO_ID',
    lessons: '16 lessons',
  },
];

function youtubeThumb(videoId) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
function youtubeUrl(videoId) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

/* ---------------------------- styles ---------------------------- */

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');

      html { scroll-behavior: smooth; }
      .cr-root { font-family: 'Inter', sans-serif; background: ${PAPER}; }

      /* --- hero entrance: quiet staggered rise, same vocabulary as
             the mobile menu's row-in animation elsewhere on the site --- */
      .cr-hero-in {
        opacity: 0; transform: translateY(14px);
        animation: crRiseIn .7s ${EASE} forwards;
      }
      .cr-hero-in:nth-child(1) { animation-delay: .02s; }
      .cr-hero-in:nth-child(2) { animation-delay: .10s; }
      .cr-hero-in:nth-child(3) { animation-delay: .18s; }
      .cr-hero-in:nth-child(4) { animation-delay: .26s; }
      @keyframes crRiseIn { to { opacity: 1; transform: translateY(0); } }

      .cr-eyebrow { display: inline-flex; align-items: center; gap: 10px; }
      .cr-eyebrow-dot { width: 7px; height: 7px; border-radius: 50%; background: ${GOLD}; box-shadow: 0 0 0 3px ${GOLD_TINT}; }
      .cr-eyebrow-label {
        font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600;
        letter-spacing: 0.16em; text-transform: uppercase; color: ${GOLD};
      }
      .cr-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; color: ${INK}; letter-spacing: -0.01em; }
      .cr-title .foil {
        background: ${GOLD_GRADIENT}; background-size: 260% 100%;
        -webkit-background-clip: text; background-clip: text; color: transparent;
        animation: crFoilSweep 7s ease-in-out infinite;
      }
      @keyframes crFoilSweep { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }

      .cr-route-divider { position: relative; max-width: 1280px; margin: 0 auto; padding: 0 24px; }
      .cr-route-divider::before { content: ''; display: block; height: 0; border-top: 1.5px dashed ${LINE}; }
      .cr-route-divider .waypoint {
        position: absolute; left: 50%; top: 0; transform: translate(-50%, -50%);
        width: 8px; height: 8px; border-radius: 50%; background: ${GOLD};
        box-shadow: 0 0 0 4px ${PAPER};
      }

      /* --- quick-jump level strip — the active pill tracks scroll
             position, like a boarding board lighting the current gate --- */
      .level-nav { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
      .level-pill {
        position: relative;
        display: inline-flex; align-items: center; gap: 7px;
        font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700;
        color: ${ROUTE}; background: ${ROUTE_TINT}; border: 1px solid rgba(30,58,120,0.14);
        padding: 8px 14px; border-radius: 999px;
        transition: background-color .3s ${EASE}, color .3s ${EASE}, transform .25s ${EASE}, border-color .3s ${EASE};
      }
      .level-pill:hover { background: ${ROUTE}; color: ${PAPER}; transform: translateY(-1px); }
      .level-pill.is-active {
        background: ${ROUTE}; color: ${PAPER}; border-color: ${ROUTE};
        transform: translateY(-1px);
        box-shadow: 0 10px 20px -10px rgba(30,58,120,0.55);
      }
      .level-pill.is-active::after {
        content: ''; width: 5px; height: 5px; border-radius: 50%;
        background: ${GOLD_SOFT};
        box-shadow: 0 0 0 3px rgba(216,184,114,0.28);
      }

      /* --- climb list: dashed route line + a traveling plane marker
             that tracks scroll progress through the level list --- */
      .climb-list { position: relative; }
      .climb-line {
        position: absolute; left: 27px; top: 14px; bottom: 14px; width: 0;
        border-left: 1.5px dashed ${LINE}; z-index: 0;
      }
      .climb-line-fill {
        position: absolute; left: 27px; top: 14px; width: 0;
        border-left: 1.5px solid ${GOLD};
        z-index: 0; transition: height .45s ${EASE};
        opacity: 0.9;
      }
      @media (max-width: 720px) { .climb-line, .climb-line-fill { left: 21px; } }

      .climb-plane {
        position: absolute; left: 27px; top: 14px;
        width: 30px; height: 30px; margin-left: -15px; margin-top: -15px;
        border-radius: 50%;
        background: ${ROUTE};
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 0 0 5px ${PAPER}, 0 8px 18px -6px rgba(30,58,120,0.6);
        z-index: 2;
        transition: top .45s ${EASE}, opacity .3s ${EASE};
        opacity: 0;
      }
      .climb-plane.is-visible { opacity: 1; }
      .climb-plane svg { transform: rotate(-45deg); }
      @media (max-width: 720px) { .climb-plane { left: 21px; width: 26px; height: 26px; margin-left: -13px; margin-top: -13px; } }


      .climb-row {
        position: relative; display: flex; gap: 22px; z-index: 1;
        scroll-margin-top: 130px;
        opacity: 0; transform: translateY(30px);
        transition: opacity .65s ${EASE}, transform .65s ${EASE};
      }
      .climb-row.is-revealed { opacity: 1; transform: translateY(0); }
      .climb-row + .climb-row { margin-top: 28px; }

      .climb-marker {
        flex-shrink: 0; width: 56px; height: 56px; border-radius: 50%;
        background: ${PAPER}; border: 1.5px solid ${GOLD}; color: ${ROUTE};
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 0 0 6px ${PAPER};
        transition: transform .3s ${EASE}, background-color .3s ${EASE}, color .3s ${EASE}, border-color .3s ${EASE};
      }
      @media (max-width: 720px) { .climb-marker { width: 42px; height: 42px; } }
      .course-card:hover .climb-marker { transform: scale(1.06); background: ${ROUTE}; color: ${PAPER}; }
      .climb-row.is-active-level .climb-marker { border-color: ${ROUTE}; box-shadow: 0 0 0 6px ${PAPER}, 0 0 0 8px rgba(30,58,120,0.12); }

      .course-card {
        flex: 1; min-width: 0;
        display: grid; grid-template-columns: 300px 1fr; gap: 22px;
        border-radius: 16px; background: ${PAPER_DIM}; border: 1px solid ${LINE};
        padding: 18px; overflow: hidden;
        transition: border-color .25s ${EASE}, box-shadow .25s ${EASE}, transform .25s ${EASE};
      }
      .course-card:hover { border-color: rgba(168,129,47,0.4); box-shadow: 0 26px 50px -30px rgba(10,15,31,0.28); transform: translateY(-2px); }
      @media (max-width: 820px) { .course-card { grid-template-columns: 1fr; } }

      /* poster / thumbnail */
      .poster-link {
        position: relative; display: block; border-radius: 12px; overflow: hidden;
        aspect-ratio: 16 / 9; background: ${INK};
      }
      .poster-img {
        width: 100%; height: 100%; object-fit: cover; display: block;
        transition: transform .5s ${EASE}, filter .4s ${EASE};
      }
      .poster-link:hover .poster-img { transform: scale(1.06); filter: brightness(0.75); }
      .poster-overlay {
        position: absolute; inset: 0;
        background: linear-gradient(180deg, rgba(10,15,31,0.05) 0%, rgba(10,15,31,0.55) 100%);
        display: flex; align-items: center; justify-content: center;
      }
      .poster-play {
        width: 54px; height: 54px; border-radius: 50%;
        background: rgba(250,249,245,0.92);
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 12px 26px -10px rgba(10,15,31,0.6);
        transition: transform .3s ${EASE}, background-color .3s ${EASE};
      }
      .poster-link:hover .poster-play { transform: scale(1.14); background: ${GOLD_SOFT}; }
      .poster-badge {
        position: absolute; top: 10px; left: 10px;
        display: inline-flex; align-items: center; gap: 6px;
        font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700;
        letter-spacing: 0.06em; text-transform: uppercase;
        color: ${PAPER}; background: rgba(10,15,31,0.55);
        padding: 5px 9px; border-radius: 999px; backdrop-filter: blur(4px);
      }
      .poster-lessons {
        position: absolute; bottom: 10px; right: 10px;
        font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700;
        color: ${PAPER}; background: rgba(10,15,31,0.55);
        padding: 5px 9px; border-radius: 999px; backdrop-filter: blur(4px);
      }

      /* course text side */
      .course-body { display: flex; flex-direction: column; min-width: 0; }
      .course-code-row { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
      .course-code {
        font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 26px; color: ${INK};
      }
      .course-phase {
        font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 700;
        letter-spacing: 0.1em; text-transform: uppercase; color: ${GOLD};
      }
      .course-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 16px; color: ${INK}; margin-top: 2px; }
      .course-desc { font-size: 13px; line-height: 1.6; color: ${MUTED}; margin-top: 8px; max-width: 480px; }

      .topic-list { display: flex; flex-direction: column; gap: 6px; margin-top: 14px; }
      .topic-item {
        display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: ${INK};
        opacity: 0; transform: translateX(-6px);
        transition: opacity .4s ${EASE}, transform .4s ${EASE};
      }
      .climb-row.is-revealed .topic-item:nth-child(1) { transition-delay: .1s; }
      .climb-row.is-revealed .topic-item:nth-child(2) { transition-delay: .18s; }
      .climb-row.is-revealed .topic-item:nth-child(3) { transition-delay: .26s; }
      .climb-row.is-revealed .topic-item { opacity: 1; transform: translateX(0); }

      .watch-btn {
        display: inline-flex; align-items: center; gap: 8px;
        margin-top: 16px; align-self: flex-start;
        padding: 10px 18px; border-radius: 9px;
        background: ${ROUTE}; color: ${PAPER};
        font-size: 13px; font-weight: 700; letter-spacing: 0.01em;
        transition: background-color .25s ${EASE}, transform .2s ${EASE};
        box-shadow: 0 12px 22px -12px rgba(30,58,120,0.5);
      }
      .watch-btn:hover { background: ${ROUTE_DEEP}; transform: translateY(-1px); }

      /* --- info / disclaimer panel --- */
      .info-panel {
        position: relative; border-radius: 14px; background: ${PAPER_DIM};
        border: 1px solid ${LINE}; overflow: hidden; padding: 28px;
        display: flex; gap: 14px; align-items: flex-start;
      }
      .info-panel::before {
        content: ''; position: absolute; inset: 0;
        background-image:
          radial-gradient(ellipse 620px 320px at 8% 0%, ${ROUTE_TINT} 0%, transparent 62%),
          radial-gradient(ellipse 480px 300px at 100% 100%, ${GOLD_TINT} 0%, transparent 60%);
        pointer-events: none;
      }
      .info-panel-text { position: relative; font-size: 12.5px; line-height: 1.65; color: ${MUTED}; }

      @media (prefers-reduced-motion: reduce) {
        .cr-root *, .cr-root *::before, .cr-root *::after {
          transition-duration: 0.001ms !important;
          animation-duration: 0.001ms !important;
        }
        .cr-hero-in { opacity: 1; transform: none; animation: none; }
        .climb-row { opacity: 1; transform: none; }
        .topic-item { opacity: 1; transform: none; }
        .climb-plane { display: none; }
      }
    `}</style>
  );
}

/* ---------------------------- pieces ---------------------------- */

function RouteDivider() {
  return (
    <div className="cr-route-divider" aria-hidden="true">
      <span className="waypoint" />
    </div>
  );
}

function CourseCard({ level, isRevealed, isActive, registerRef }) {
  const Icon = level.icon;
  const thumb = level.poster || youtubeThumb(level.videoId);
  const href = youtubeUrl(level.videoId);

  return (
    <div
      className={`climb-row ${isRevealed ? 'is-revealed' : ''} ${isActive ? 'is-active-level' : ''}`}
      id={level.code}
      ref={registerRef}
      data-code={level.code}
    >
      <div className="climb-marker" aria-hidden="true">
        <Icon size={20} strokeWidth={1.75} />
      </div>
      <div className="course-card">
        <a
          className="poster-link"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Watch the ${level.code} course intro on YouTube`}
        >
          <img className="poster-img" src={thumb} alt={`${level.code} — ${level.title} course poster`} loading="lazy" />
          <div className="poster-overlay">
            <span className="poster-play">
              <Play size={20} color={ROUTE} fill={ROUTE} style={{ marginLeft: 2 }} />
            </span>
          </div>
          <span className="poster-badge"><Play size={11} fill="currentColor" /> Watch on YouTube</span>
          <span className="poster-lessons">{level.lessons}</span>
        </a>

        <div className="course-body">
          <div className="course-code-row">
            <span className="course-code">{level.code}</span>
            <span className="course-phase">{level.phase}</span>
          </div>
          <div className="course-title">{level.title}</div>
          <p className="course-desc">{level.desc}</p>

          <div className="topic-list">
            {level.topics.map((t) => (
              <span className="topic-item" key={t}>
                <CheckCircle2 size={14} color={GOLD} /> {t}
              </span>
            ))}
          </div>

          <a href={href} target="_blank" rel="noopener noreferrer" className="watch-btn">
            Watch {level.code} Intro <Play size={13} fill={PAPER} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Course() {
  const listRef = useRef(null);
  const rowRefs = useRef({});
  const [revealed, setRevealed] = useState({});
  const [activeCode, setActiveCode] = useState(LEVELS[0].code);
  const [planeTop, setPlaneTop] = useState(14);
  const [planeVisible, setPlaneVisible] = useState(false);
  const [lineFillHeight, setLineFillHeight] = useState(0);

  const setRowRef = (code) => (el) => {
    if (el) rowRefs.current[code] = el;
  };

  // Always land at the top of the page on load/refresh — don't let the
  // browser restore a mid-scroll position or jump to a #A2/#B1 hash.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  // Reveal each card as it scrolls into view, once — a one-way "arrival".
  useEffect(() => {
    const nodes = Object.values(rowRefs.current);
    if (!nodes.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const code = entry.target.getAttribute('data-code');
            setRevealed((prev) => (prev[code] ? prev : { ...prev, [code]: true }));
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  // --- Scroll-spy (rewritten) -------------------------------------
  // The previous version used an IntersectionObserver with a thin
  // rootMargin band ('-40% 0px -50% 0px'). That band's real screen
  // position depends on viewport height, while each card's real
  // height depends on its content — so for taller/shorter cards the
  // band could end up sitting over the *next* card by the time it
  // fired, which is why clicking A1 would light up A2, B1 would
  // light up B2, and so on. It was never reading "which card are we
  // actually on", only "what happens to overlap this arbitrary slice
  // right now".
  //
  // Fixed approach: on every scroll/resize we directly measure each
  // row's position relative to the viewport with getBoundingClientRect
  // and pick whichever row's top has most recently crossed a single,
  // fixed detection line near the top of the screen (matching the
  // .climb-row scroll-margin-top offset, so clicking a quick-jump pill
  // and scrolling both agree on the same row). This can never
  // "overshoot" onto a neighboring card, regardless of card height,
  // viewport size, or animation state.
  useEffect(() => {
    let rafId = null;

    const computeActive = () => {
      const entries = Object.entries(rowRefs.current);
      if (!entries.length) return;

      let currentCode = entries[0][0];

      for (const [code, node] of entries) {
        if (!node) continue;
        const top = node.getBoundingClientRect().top;
        // A row "counts" once its top has scrolled up past the
        // detection line. We keep advancing currentCode through every
        // row that qualifies, so we always end on the last (i.e.
        // lowest/most recent) one that has crossed the line.
        if (top <= SCROLL_DETECTION_LINE) {
          currentCode = code;
        }
      }

      // Special-case the very bottom of the page: if the user has
      // scrolled to (or very near) the bottom, force the last level
      // active even if its top hasn't technically crossed the line
      // (e.g. on short pages / large viewports).
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (scrolledToBottom) {
        const lastCode = entries[entries.length - 1][0];
        currentCode = lastCode;
      }

      setActiveCode((prev) => (prev === currentCode ? prev : currentCode));
    };

    const onScrollOrResize = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        computeActive();
      });
    };

    // Initial measurement (after layout/fonts have a chance to settle).
    computeActive();
    const settleTimer = setTimeout(computeActive, 700);

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    window.addEventListener('load', computeActive);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      clearTimeout(settleTimer);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('load', computeActive);
    };
  }, []);

  // Traveling plane marker: snap it directly onto the marker circle of
  // whichever level is currently active (same `activeCode` used above
  // for the quick-jump pill), so the two can never disagree.
  //
  // Important: we measure with offsetTop, not getBoundingClientRect().
  // getBoundingClientRect() reports the element's *visually rendered*
  // position, which includes the CSS `transform` used for each card's
  // scroll-reveal animation — so measuring mid-animation (or before it
  // settles) was catching the row at its pre-animation offset and
  // landing the plane too low, out of sync with the actual marker.
  // offsetTop is a pure layout measurement and ignores transforms
  // entirely, so it's correct regardless of animation state.
  useEffect(() => {
    const syncPlane = () => {
      const row = rowRefs.current[activeCode];
      if (!row) return;
      const markerEl = row.querySelector('.climb-marker');
      if (!markerEl) return;

      const centerY = row.offsetTop + markerEl.offsetTop + markerEl.offsetHeight / 2;
      setPlaneTop(centerY);
      setLineFillHeight(centerY);
    };

    // Sync now, then again after paint/animation settle and after any
    // late web-font swap (fonts loading late can reflow row heights).
    syncPlane();
    const raf = requestAnimationFrame(syncPlane);
    const settleTimer = setTimeout(syncPlane, 700);

    window.addEventListener('resize', syncPlane);
    window.addEventListener('load', syncPlane);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(settleTimer);
      window.removeEventListener('resize', syncPlane);
      window.removeEventListener('load', syncPlane);
    };
  }, [activeCode]);

  // Show the plane only while the level list is actually on screen.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setPlaneVisible(entry.isIntersecting),
      { threshold: 0 }
    );

    observer.observe(list);
    return () => observer.disconnect();
  }, []);


  return (
    <div className="cr-root">
      <GlobalStyle />
      <Navbar />

      <div style={{ height: 76 }} />

      {/* HEADER */}
      <section className="max-w-5xl mx-auto px-6 pt-14 pb-10 text-center">
        <span className="cr-eyebrow justify-center flex cr-hero-in">
          <span className="cr-eyebrow-dot" />
          <span className="cr-eyebrow-label">Free resource · German language</span>
        </span>
        <h1 className="cr-title mt-4 text-3xl md:text-[42px] cr-hero-in">
          German Language <span className="foil">Courses</span>
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-sm md:text-[15px] leading-relaxed cr-hero-in" style={{ color: MUTED }}>
          Six levels, one climb — from your very first "Guten Tag" at A1 to fluent,
          native-level German at C2. Every level links to a free video lesson to get you
          started.
        </p>

        <div className="level-nav mt-8 cr-hero-in">
          {LEVELS.map((l) => (
            <a
              key={l.code}
              href={`#${l.code}`}
              className={`level-pill ${activeCode === l.code ? 'is-active' : ''}`}
            >
              {l.code}
            </a>
          ))}
        </div>
      </section>

      <RouteDivider />

      {/* COURSE LIST */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <div className="climb-list" ref={listRef}>
          <div className="climb-line" aria-hidden="true" />
          <div className="climb-line-fill" style={{ height: lineFillHeight }} aria-hidden="true" />
          <div
            className={`climb-plane ${planeVisible ? 'is-visible' : ''}`}
            style={{ top: planeTop }}
            aria-hidden="true"
          >
            <Plane size={14} color={PAPER} fill={PAPER} />
          </div>

          {LEVELS.map((level) => (
            <CourseCard
              key={level.code}
              level={level}
              isRevealed={!!revealed[level.code]}
              isActive={activeCode === level.code}
              registerRef={setRowRef(level.code)}
            />
          ))}
        </div>
      </section>

      <RouteDivider />

      {/* INFO PANEL */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <div className="info-panel">
          <Info size={16} style={{ marginTop: 2, flexShrink: 0, color: GOLD }} />
          <p className="info-panel-text">
            These videos are a starting point, not a substitute for a structured course —
            most German universities and visa applications require a certified level (usually
            B1 or B2), which means a recognized language exam like the Goethe-Zertifikat or
            telc, not just self-study. Not sure which level you need for your target
            university? Bring it up at your consultation and we'll map out the right path.
          </p>
        </div>
      </section>

      <RouteDivider />

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <span className="cr-eyebrow justify-center flex">
          <span className="cr-eyebrow-dot" />
          <span className="cr-eyebrow-label">Next step</span>
        </span>
        <h2 className="cr-title mt-4 text-2xl md:text-3xl">
          Not sure which level to start at?
        </h2>
        <p className="mt-3 text-sm leading-relaxed max-w-lg mx-auto" style={{ color: MUTED }}>
          Book a free consultation and we'll help you figure out your starting level and the
          fastest realistic path to the certificate your university needs.
        </p>
        <a
          href="/consultation"
          className="inline-flex items-center gap-2 mt-7 px-7 py-3.5 rounded-lg font-bold text-sm"
          style={{ background: ROUTE, color: PAPER, boxShadow: '0 14px 26px -14px rgba(30,58,120,0.5)' }}
        >
          Book a Free Consultation <ArrowRight size={16} />
        </a>
      </section>

      <Footer />
    </div>
  );
}