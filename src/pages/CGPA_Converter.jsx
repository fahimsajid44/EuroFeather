import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Calculator,
  ArrowRight,
  Info,
  CheckCircle2,
  XCircle,
  Plane,
  ChevronDown,
  GraduationCap,
} from 'lucide-react';

/* ---------------------------------------------------------------
   "THE ROUTE" — same identity as Navbar / Hero / Home. This page's
   signature is the CGPA itself becoming a boarding pass: you check
   in your Bangladeshi academic record, and what prints out the
   other side is a German-grade boarding stub — grade, class and
   pass/fail sitting where a gate, seat and flight number would.
   Tokens and structural patterns (pass-perf, stub-panel, route
   dividers, foil title) are reused verbatim from Navbar.jsx /
   Home.jsx so the page slots in as one more leg of the same trip.

   Bachelor's applicants in Bangladesh only complete 12 years of
   schooling (SSC + HSC), which Germany doesn't count as direct
   university entrance on its own — admissions offices weigh HSC
   alongside CGPA. Master's applicants are judged on CGPA alone.
   So: Master's asks for CGPA only; Bachelor's asks for HSC result
   too, and the final German grade is the average of both, each
   converted with the same modified Bavarian formula.

   Grades are shown to two decimal places throughout (1.78 stays
   1.78, never rounds up to 1.8), matching how the actual German
   grade would appear on a converted transcript.
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

const HSC_MAX = 5.0; // Bangladeshi HSC/SSC results are always graded out of 5.00

/* ------------------------- grade scale reference ------------------------- */
const GRADE_SCALE = [
  { min: 1.0, max: 1.5, range: '1.0 – 1.5', label: 'Very Good', labelDe: 'sehr gut' },
  { min: 1.51, max: 2.5, range: '1.6 – 2.5', label: 'Good', labelDe: 'gut' },
  { min: 2.51, max: 3.5, range: '2.6 – 3.5', label: 'Satisfactory', labelDe: 'befriedigend' },
  { min: 3.51, max: 4.0, range: '3.6 – 4.0', label: 'Sufficient', labelDe: 'ausreichend' },
];

function bandForGrade(grade) {
  const g = Number(grade);
  return GRADE_SCALE.find((b) => g >= b.min && g <= b.max) || GRADE_SCALE[GRADE_SCALE.length - 1];
}

/* JavaScript's native Number.prototype.toFixed has a well-known
   floating-point rounding bug: 1.005.toFixed(2) wrongly gives "1.00"
   instead of "1.01", and 1.505.toFixed(2) gives "1.50" instead of
   "1.51", because those decimals can't be represented exactly in
   binary. Routing through the exponential-notation trick below
   forces correct decimal rounding before formatting, so the grade
   shown always matches standard rounding rules — verified against
   1.005 → 1.01, 1.505 → 1.51, 2.675 → 2.68. */
function preciseRound(value, decimals = 2) {
  return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
}

function formatGrade(value) {
  return preciseRound(value, 2).toFixed(2);
}

/* ------------------------- conversion logic -------------------------
   Modified Bavarian formula — the standard method German universities
   and uni-assist use to convert a foreign grade onto the German 1.0
   (best) – 4.0 (pass) scale:

     German grade = 1 + 3 × (Nmax − Nd) / (Nmax − Nmin)

   Nmax = best possible grade on the home scale
   Nmin = minimum grade needed to pass
   Nd   = the grade actually obtained

   For Master's applicants, this is applied once to the CGPA.
   For Bachelor's applicants, Bangladeshi HSC (12 years of schooling)
   isn't enough on its own for German university entrance, so the
   formula is applied separately to HSC result and to CGPA, and the
   two resulting German grades are averaged into one final grade.

   Grades are kept to their full precision (2 decimal places) rather
   than rounded to 1 decimal, so 1.78 is reported as 1.78, not 1.8.
----------------------------------------------------------------------*/
function bavarianGrade(nMax, nMin, nD) {
  const raw = 1 + (3 * (nMax - nD)) / (nMax - nMin);
  return Math.min(4.0, Math.max(1.0, raw));
}

function gradeLabel(grade) {
  // Band is derived from the same rounded value that gets displayed,
  // so the label (e.g. "Good") always matches the number shown next
  // to it — no edge case where a raw, unrounded value falls in one
  // band while the rounded number printed on screen falls in another.
  const band = bandForGrade(preciseRound(grade, 2));
  return { label: band.label, labelDe: band.labelDe };
}

function convertToGermanGrade({ degreeType, cgpaScale, minPass, cgpa, hsc }) {
  const nMin = parseFloat(minPass);
  const cgpaMax = parseFloat(cgpaScale);
  const cgpaVal = parseFloat(cgpa);

  if ([nMin, cgpaMax, cgpaVal].some((n) => Number.isNaN(n))) {
    return { error: 'Please fill in all fields with valid numbers.' };
  }
  if (cgpaMax <= nMin) {
    return { error: 'The maximum CGPA must be greater than the minimum passing grade.' };
  }
  if (cgpaVal > cgpaMax) {
    return { error: `Your CGPA can't be higher than the scale's maximum (${cgpaMax}).` };
  }
  if (cgpaVal < 0) {
    return { error: 'CGPA cannot be negative.' };
  }

  const cgpaGrade = bavarianGrade(cgpaMax, nMin, cgpaVal);

  if (degreeType === 'masters') {
    const passed = cgpaVal >= nMin;
    return {
      grade: formatGrade(cgpaGrade),
      passed,
      ...gradeLabel(cgpaGrade),
      breakdown: null,
    };
  }

  // Bachelor's: also validate and convert the HSC result
  const hscVal = parseFloat(hsc);
  if (Number.isNaN(hscVal)) {
    return { error: 'Please enter your HSC result as a valid number.' };
  }
  if (HSC_MAX <= nMin) {
    return { error: 'The minimum passing grade must be lower than 5.00 for the HSC scale.' };
  }
  if (hscVal > HSC_MAX) {
    return { error: "Your HSC result can't be higher than 5.00." };
  }
  if (hscVal < 0) {
    return { error: 'HSC result cannot be negative.' };
  }

  const hscGrade = bavarianGrade(HSC_MAX, nMin, hscVal);
  // Average the full-precision component grades first, then round
  // only the final result — rounding each half early and averaging
  // the rounded numbers would compound error and could shift the
  // final grade by a hundredth versus the mathematically correct
  // answer.
  const finalGrade = (hscGrade + cgpaGrade) / 2;
  const passed = hscVal >= nMin && cgpaVal >= nMin;

  return {
    grade: formatGrade(finalGrade),
    passed,
    ...gradeLabel(finalGrade),
    breakdown: {
      hsc: formatGrade(hscGrade),
      cgpa: formatGrade(cgpaGrade),
    },
  };
}

/* ---------------------------- styles ---------------------------- */

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');

      .cgpa-root { font-family: 'Inter', sans-serif; background: ${PAPER}; }

      .cgpa-eyebrow { display: inline-flex; align-items: center; gap: 10px; }
      .cgpa-eyebrow-dot { width: 7px; height: 7px; border-radius: 50%; background: ${GOLD}; box-shadow: 0 0 0 3px ${GOLD_TINT}; }
      .cgpa-eyebrow-label {
        font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600;
        letter-spacing: 0.16em; text-transform: uppercase; color: ${GOLD};
      }
      .cgpa-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; color: ${INK}; letter-spacing: -0.01em; }
      .cgpa-title .foil {
        background: ${GOLD_GRADIENT}; background-size: 260% 100%;
        -webkit-background-clip: text; background-clip: text; color: transparent;
        animation: cgpaFoilSweep 7s ease-in-out infinite;
      }
      @keyframes cgpaFoilSweep { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }

      .cgpa-route-divider { position: relative; max-width: 1280px; margin: 0 auto; padding: 0 24px; }
      .cgpa-route-divider::before { content: ''; display: block; height: 0; border-top: 1.5px dashed ${LINE}; }
      .cgpa-route-divider .waypoint {
        position: absolute; left: 50%; top: 0; transform: translate(-50%, -50%);
        width: 8px; height: 8px; border-radius: 50%; background: ${GOLD};
        box-shadow: 0 0 0 4px ${PAPER};
      }

      /* --- the boarding pass itself: a two-part ticket, the "check-in"
             form on the left (large stub) and a perforated tear line
             leading to the "grade" stub on the right, exactly like a
             real airline boarding pass split into ticket + stub --- */
      .ticket {
        position: relative;
        display: grid;
        grid-template-columns: 1fr;
        border-radius: 16px;
        background: #ffffff;
        border: 1px solid ${LINE};
        box-shadow: 0 40px 80px -40px rgba(10,15,31,0.28);
        overflow: hidden;
      }
      @media (min-width: 900px) {
        .ticket { grid-template-columns: 1.55fr 1fr; }
      }

      .ticket-main { padding: 34px 32px 30px; }
      .ticket-header {
        display: flex; align-items: center; justify-content: space-between;
        margin-bottom: 24px;
      }
      .ticket-eyebrow {
        font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 600;
        letter-spacing: 0.12em; text-transform: uppercase; color: ${MUTED};
      }
      .ticket-route {
        font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; color: ${ROUTE};
        display: flex; align-items: center; gap: 8px;
      }

      .field-group { margin-bottom: 20px; }
      .field-label {
        display: flex; align-items: center; gap: 6px;
        font-size: 12.5px; font-weight: 700; color: ${INK};
        margin-bottom: 8px;
        font-family: 'Space Grotesk', sans-serif;
      }
      .field-hint { font-size: 11.5px; color: ${MUTED}; margin-top: 6px; line-height: 1.5; }

      .field-input, .field-select {
        width: 100%;
        padding: 12px 14px;
        border-radius: 9px;
        border: 1.5px solid ${LINE};
        background: ${PAPER};
        font-size: 14.5px; font-weight: 500; color: ${INK};
        transition: border-color .2s ${EASE}, box-shadow .2s ${EASE}, background-color .2s ${EASE};
        font-family: 'Inter', sans-serif;
      }
      .field-input::placeholder { color: #B3AF9F; font-weight: 400; }
      .field-input:focus, .field-select:focus {
        outline: none; border-color: ${ROUTE}; background: #ffffff;
        box-shadow: 0 0 0 4px ${ROUTE_TINT};
      }

      .field-select-wrap { position: relative; }
      .field-select {
        appearance: none; -webkit-appearance: none; cursor: pointer;
        padding-right: 40px;
      }
      .field-select-chevron {
        position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
        color: ${MUTED}; pointer-events: none;
      }

      .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      @media (max-width: 480px) { .field-row { grid-template-columns: 1fr; } }

      /* --- degree-type toggle: two boarding-class tabs rather than a
             plain dropdown, since it's the first, most consequential
             choice on the ticket --- */
      .degree-toggle {
        display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
        margin-bottom: 22px;
      }
      .degree-tab {
        display: flex; align-items: center; justify-content: center; gap: 8px;
        padding: 12px 14px; border-radius: 9px;
        border: 1.5px solid ${LINE}; background: ${PAPER};
        font-size: 13px; font-weight: 700; color: ${MUTED};
        cursor: pointer;
        transition: border-color .2s ${EASE}, background-color .2s ${EASE}, color .2s ${EASE};
      }
      .degree-tab.is-active {
        border-color: ${ROUTE}; background: ${ROUTE_TINT}; color: ${ROUTE};
      }
      .degree-tab svg { flex-shrink: 0; }

      .cgpa-error {
        display: flex; align-items: flex-start; gap: 9px;
        background: #FBEAEA; border: 1px solid #E7B8B8; color: #8A3B3B;
        font-size: 12.5px; line-height: 1.5; font-weight: 500;
        padding: 12px 14px; border-radius: 9px; margin-bottom: 18px;
      }

      .calc-btn {
        display: inline-flex; align-items: center; justify-content: center; gap: 9px;
        width: 100%;
        padding: 14px 22px; border-radius: 10px;
        background: ${ROUTE};
        border: 1px solid ${ROUTE};
        color: ${PAPER}; font-size: 14.5px; font-weight: 700; letter-spacing: 0.01em;
        cursor: pointer;
        transition: background-color .25s ${EASE}, transform .2s ${EASE}, box-shadow .25s ${EASE};
        box-shadow: 0 14px 26px -14px rgba(30,58,120,0.5);
      }
      .calc-btn:hover { background: ${ROUTE_DEEP}; border-color: ${ROUTE_DEEP}; transform: translateY(-1px); }
      .calc-btn:active { transform: translateY(0) scale(.99); }

      /* --- reset button: a real, clearly-bordered control instead of
             a faint text link, with a visible focus ring so keyboard
             users can see exactly where they are --- */
      .reset-btn {
        display: inline-flex; align-items: center; justify-content: center;
        width: 100%;
        margin-top: 12px;
        padding: 11px 18px; border-radius: 9px;
        border: 1.5px solid ${LINE};
        background: #ffffff;
        font-size: 13.5px; font-weight: 700; color: ${ROUTE};
        cursor: pointer;
        transition: background-color .2s ${EASE}, border-color .2s ${EASE}, box-shadow .2s ${EASE};
      }
      .reset-btn:hover { background: ${ROUTE_TINT}; border-color: ${ROUTE}; }
      .reset-btn:focus-visible {
        outline: none;
        border-color: ${ROUTE};
        box-shadow: 0 0 0 4px ${ROUTE_TINT};
      }
      .reset-btn:active { background: ${ROUTE_TINT}; }

      /* --- perforated tear line between ticket + stub --- */
      .ticket-perf { position: relative; }
      .ticket-perf::before {
        content: '';
        position: absolute; top: 0; bottom: 0; left: -1px;
        width: 0; border-left: 1.5px dashed ${LINE};
      }
      .ticket-perf-dot {
        position: absolute; left: -8px; width: 16px; height: 16px; border-radius: 50%;
        background: ${PAPER};
      }
      .ticket-perf-dot.top { top: -8px; }
      .ticket-perf-dot.bottom { bottom: -8px; }

      /* --- stub: the "grade boarding pass" result panel --- */
      .stub {
        position: relative;
        background: ${INK};
        color: ${PAPER};
        padding: 30px 28px;
        display: flex; flex-direction: column;
      }
      .stub-brand {
        display: flex; align-items: center; gap: 8px;
        font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 600;
        letter-spacing: 0.14em; text-transform: uppercase; color: ${GOLD_SOFT};
        margin-bottom: 22px;
      }
      .stub-row { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 18px; gap: 12px; }
      .stub-field-label {
        font-family: 'JetBrains Mono', monospace; font-size: 9.5px; font-weight: 600;
        letter-spacing: 0.12em; text-transform: uppercase; color: rgba(250,249,245,0.5);
        margin-bottom: 4px;
      }
      .stub-field-value { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; color: ${PAPER}; }
      .stub-grade-big {
        font-family: 'Space Grotesk', sans-serif; font-weight: 700;
        font-size: 48px; line-height: 1; color: ${PAPER};
        margin: 6px 0 2px;
        white-space: nowrap;
      }
      .stub-grade-big .unit { font-size: 18px; color: rgba(250,249,245,0.55); font-weight: 600; margin-left: 4px; }
      .stub-status {
        display: inline-flex; align-items: center; gap: 7px;
        font-size: 12.5px; font-weight: 700; letter-spacing: 0.02em;
        padding: 6px 12px; border-radius: 999px;
        margin-top: 14px; width: fit-content;
      }
      .stub-status.pass { background: rgba(168,129,47,0.18); color: ${GOLD_SOFT}; border: 1px solid rgba(216,184,114,0.4); }
      .stub-status.fail { background: rgba(220,90,90,0.16); color: #E89999; border: 1px solid rgba(220,90,90,0.35); }

      .stub-breakdown {
        margin-top: 16px; padding-top: 16px;
        border-top: 1px dashed rgba(250,249,245,0.2);
        display: flex; flex-direction: column; gap: 8px;
      }
      .stub-breakdown-row {
        display: flex; justify-content: space-between; align-items: center;
        font-size: 12px;
      }
      .stub-breakdown-row .k { color: rgba(250,249,245,0.55); }
      .stub-breakdown-row .v { font-family: 'JetBrains Mono', monospace; font-weight: 600; color: ${PAPER}; }

      .stub-barcode {
        margin-top: auto; padding-top: 22px;
        display: flex; align-items: flex-end; gap: 2px; height: 30px;
      }
      .stub-barcode span { display: block; width: 2px; background: rgba(250,249,245,0.35); }
      .stub-placeholder {
        flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
        text-align: center; gap: 10px; color: rgba(250,249,245,0.45);
        padding: 20px 6px;
      }
      .stub-placeholder-icon {
        width: 44px; height: 44px; border-radius: 50%;
        border: 1.5px dashed rgba(250,249,245,0.3);
        display: flex; align-items: center; justify-content: center;
      }

      /* --- formula / info panel --- */
      .info-panel {
        position: relative; border-radius: 14px; background: ${PAPER_DIM};
        border: 1px solid ${LINE}; overflow: hidden; padding: 32px 28px;
      }
      .info-panel::before {
        content: ''; position: absolute; inset: 0;
        background-image:
          radial-gradient(ellipse 640px 340px at 8% 0%, ${ROUTE_TINT} 0%, transparent 62%),
          radial-gradient(ellipse 520px 320px at 100% 100%, ${GOLD_TINT} 0%, transparent 60%);
        pointer-events: none;
      }
      .info-panel-content { position: relative; }
      .formula-box {
        font-family: 'JetBrains Mono', monospace; font-size: 13.5px; font-weight: 600; color: ${ROUTE};
        background: #ffffff; border: 1px solid ${LINE}; border-radius: 10px;
        padding: 16px 18px; margin: 14px auto 18px; overflow-x: auto; white-space: nowrap;
        text-align: center;
      }
      .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
      @media (max-width: 720px) { .info-grid { grid-template-columns: 1fr; } }
      .info-chip {
        background: #ffffff; border: 1px solid ${LINE}; border-radius: 10px; padding: 14px 16px;
        text-align: center;
      }
      .info-chip-label {
        font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; color: ${GOLD};
        letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 5px;
      }
      .info-chip-desc { font-size: 12.5px; line-height: 1.55; color: ${MUTED}; }

      .disclaimer {
        display: flex; gap: 10px; align-items: flex-start; justify-content: center;
        font-size: 12px; line-height: 1.6; color: ${MUTED}; text-align: center;
        border-top: 1px dashed ${LINE}; margin-top: 22px; padding-top: 18px;
      }

      /* --- grade scale reference table: styled like a printed
             departures board — mono figures, hairline rules, and the
             row matching the traveler's own result lit up in gold --- */
      .scale-card {
        border-radius: 14px; background: #ffffff; border: 1px solid ${LINE};
        overflow: hidden;
      }
      .scale-table { width: 100%; border-collapse: collapse; }
      .scale-table thead th {
        text-align: left; padding: 14px 20px;
        font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 700;
        letter-spacing: 0.1em; text-transform: uppercase; color: ${MUTED};
        background: ${PAPER_DIM}; border-bottom: 1px solid ${LINE};
      }
      .scale-table tbody td {
        padding: 15px 20px; font-size: 13.5px; color: ${INK};
        border-bottom: 1px solid ${LINE};
        vertical-align: middle;
      }
      .scale-table tbody tr:last-child td { border-bottom: none; }
      .scale-table tbody tr:nth-child(even) td { background: ${PAPER_DIM}; }
      .scale-table tbody tr.is-current td { background: ${GOLD_TINT}; }
      .scale-range {
        font-family: 'JetBrains Mono', monospace; font-weight: 700; color: ${ROUTE};
        white-space: nowrap;
      }
      .scale-detail-de { color: ${MUTED}; font-style: italic; }
      .scale-current-tag {
        display: inline-flex; align-items: center; gap: 5px;
        font-family: 'JetBrains Mono', monospace; font-size: 9.5px; font-weight: 700;
        letter-spacing: 0.08em; text-transform: uppercase; color: ${ROUTE};
        background: #ffffff; border: 1px solid ${ROUTE}; border-radius: 999px;
        padding: 3px 9px; margin-left: 10px;
      }

      @media (prefers-reduced-motion: reduce) {
        .cgpa-root *, .cgpa-root *::before, .cgpa-root *::after {
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
    <div className="cgpa-route-divider" aria-hidden="true">
      <span className="waypoint" />
    </div>
  );
}

function Barcode() {
  // deterministic pseudo-random bar widths so it doesn't reshuffle on re-render
  const widths = [2, 4, 2, 6, 2, 2, 4, 2, 6, 4, 2, 2, 4, 6, 2, 4, 2, 2, 6, 4, 2, 4, 2, 6];
  return (
    <div className="stub-barcode" aria-hidden="true">
      {widths.map((w, i) => (
        <span key={i} style={{ width: 2, height: 12 + w * 3 }} />
      ))}
    </div>
  );
}

function GradeScaleTable({ currentGrade }) {
  const currentBand = currentGrade ? bandForGrade(currentGrade) : null;
  return (
    <div className="scale-card">
      <table className="scale-table">
        <thead>
          <tr>
            <th style={{ width: '38%' }}>German Grade</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {GRADE_SCALE.map((band) => {
            const isCurrent = currentBand && band.range === currentBand.range;
            return (
              <tr key={band.range} className={isCurrent ? 'is-current' : ''}>
                <td className="scale-range">{band.range}</td>
                <td>
                  {band.label} <span className="scale-detail-de">({band.labelDe})</span>
                  {isCurrent && (
                    <span className="scale-current-tag">
                      <Plane size={10} /> Your grade
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function CgpaConverter() {
  const [degreeType, setDegreeType] = useState('masters'); // 'masters' | 'bachelors'
  const [cgpaScale, setCgpaScale] = useState('4.00');
  const [minPass, setMinPass] = useState('2.00');
  const [cgpa, setCgpa] = useState('');
  const [hsc, setHsc] = useState('');
  const [result, setResult] = useState(null);

  const handleCalculate = (e) => {
    e.preventDefault();
    const outcome = convertToGermanGrade({ degreeType, cgpaScale, minPass, cgpa, hsc });
    setResult(outcome);
  };

  const handleReset = () => {
    setCgpa('');
    setHsc('');
    setResult(null);
  };

  const handleDegreeChange = (type) => {
    setDegreeType(type);
    setResult(null);
  };

  return (
    <div className="cgpa-root">
      <GlobalStyle />
      <Navbar />

      {/* spacer to clear the fixed navbar, matches Navbar's own spacer height */}
      <div style={{ height: 76 }} />

      {/* HEADER */}
      <section className="max-w-5xl mx-auto px-6 pt-14 pb-10 text-center">
        <span className="cgpa-eyebrow justify-center flex">
          <span className="cgpa-eyebrow-dot" />
          <span className="cgpa-eyebrow-label">Free tool · Resources</span>
        </span>
        <h1 className="cgpa-title mt-4 text-3xl md:text-[42px]">
          CGPA <span className="foil">Converter</span>
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-sm md:text-[15px] leading-relaxed" style={{ color: MUTED }}>
          Check in your Bangladeshi academic record and get the equivalent German grade —
          the same modified Bavarian formula German universities and uni-assist use to read
          your transcript.
        </p>
      </section>

      <RouteDivider />

      {/* THE TICKET */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <div className="ticket">
          <form className="ticket-main" onSubmit={handleCalculate}>
            <div className="ticket-header">
              <div className="ticket-eyebrow">Check-in</div>
              <div className="ticket-route">
                <span>BD</span>
                <Plane size={14} color={GOLD} style={{ transform: 'rotate(90deg)' }} />
                <span>DE</span>
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Type of degree</label>
              <div className="degree-toggle">
                <button
                  type="button"
                  className={`degree-tab ${degreeType === 'bachelors' ? 'is-active' : ''}`}
                  onClick={() => handleDegreeChange('bachelors')}
                >
                  <GraduationCap size={15} /> Bachelor's
                </button>
                <button
                  type="button"
                  className={`degree-tab ${degreeType === 'masters' ? 'is-active' : ''}`}
                  onClick={() => handleDegreeChange('masters')}
                >
                  <GraduationCap size={15} /> Master's
                </button>
              </div>
            </div>

            {degreeType === 'bachelors' && (
              <div className="field-group">
                <label className="field-label">
                  <Calculator size={13} color={ROUTE} /> HSC result (out of 5.00)
                </label>
                <input
                  className="field-input"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="e.g. 4.50"
                  value={hsc}
                  onChange={(ev) => setHsc(ev.target.value)}
                />
                <div className="field-hint">
                  Bangladeshi HSC results are always graded out of 5.00, exactly as shown on
                  your certificate.
                </div>
              </div>
            )}

            <div className="field-row">
              <div className="field-group">
                <label className="field-label">Your CGPA scale</label>
                <div className="field-select-wrap">
                  <select
                    className="field-select"
                    value={cgpaScale}
                    onChange={(ev) => setCgpaScale(ev.target.value)}
                  >
                    <option value="4.00">Out of 4.00</option>
                    <option value="5.00">Out of 5.00</option>
                  </select>
                  <ChevronDown size={16} className="field-select-chevron" />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Minimum passing grade</label>
                <input
                  className="field-input"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="e.g. 2.00"
                  value={minPass}
                  onChange={(ev) => setMinPass(ev.target.value)}
                />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">
                <Calculator size={13} color={ROUTE} /> Your current CGPA
              </label>
              <input
                className="field-input"
                type="number"
                step="0.01"
                inputMode="decimal"
                placeholder="e.g. 3.65"
                value={cgpa}
                onChange={(ev) => setCgpa(ev.target.value)}
              />
              <div className="field-hint">
                Use your final or latest CGPA exactly as it appears on your transcript.
              </div>
            </div>

            {result?.error && (
              <div className="cgpa-error">
                <Info size={15} style={{ marginTop: 1, flexShrink: 0 }} />
                <span>{result.error}</span>
              </div>
            )}

            <div className="flex gap-3">
              <button type="submit" className="calc-btn">
                Print My Grade <ArrowRight size={16} />
              </button>
            </div>
            {(cgpa || hsc || result) && (
              <button type="button" onClick={handleReset} className="reset-btn">
                Clear and start over
              </button>
            )}
          </form>

          <div className="ticket-perf">
            <span className="ticket-perf-dot top" />
            <span className="ticket-perf-dot bottom" />
            <div className="stub">
              <div className="stub-brand">
                <Plane size={12} /> Euro Feather · Boarding Stub
              </div>

              {result && !result.error ? (
                <>
                  <div className="stub-row">
                    <div>
                      <div className="stub-field-label">Class</div>
                      <div className="stub-field-value">
                        {degreeType === 'bachelors' ? "Bachelor's" : "Master's"}
                      </div>
                    </div>
                    <div>
                      <div className="stub-field-label">CGPA</div>
                      <div className="stub-field-value">{parseFloat(cgpa).toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="stub-field-label">German grade</div>
                  <div className="stub-grade-big">
                    {result.grade}<span className="unit">/ 4.00</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(250,249,245,0.75)', fontWeight: 600 }}>
                    {result.label} <span style={{ color: 'rgba(250,249,245,0.45)' }}>· {result.labelDe}</span>
                  </div>

                  <div className={`stub-status ${result.passed ? 'pass' : 'fail'}`}>
                    {result.passed ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    {result.passed ? 'Boarding confirmed' : 'Below passing grade'}
                  </div>

                  {result.breakdown && (
                    <div className="stub-breakdown">
                      <div className="stub-breakdown-row">
                        <span className="k">HSC converted</span>
                        <span className="v">{result.breakdown.hsc}</span>
                      </div>
                      <div className="stub-breakdown-row">
                        <span className="k">CGPA converted</span>
                        <span className="v">{result.breakdown.cgpa}</span>
                      </div>
                    </div>
                  )}

                  <Barcode />
                </>
              ) : (
                <div className="stub-placeholder">
                  <div className="stub-placeholder-icon">
                    <Calculator size={18} />
                  </div>
                  <div style={{ fontSize: 12.5, lineHeight: 1.6, maxWidth: 190 }}>
                    Fill in your {degreeType === 'bachelors' ? 'HSC result and CGPA' : 'CGPA'} and
                    tap <strong>Print My Grade</strong> — your German grade stub prints here.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <RouteDivider />

      {/* GRADE SCALE REFERENCE */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <div className="flex flex-col items-center text-center mb-8">
          <span className="cgpa-eyebrow">
            <span className="cgpa-eyebrow-dot" />
            <span className="cgpa-eyebrow-label">Reference</span>
          </span>
          <h2 className="cgpa-title mt-4 text-2xl md:text-3xl">
            German grade <span className="foil">scale</span>
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed" style={{ color: MUTED }}>
            Once you have your number, here's what it actually means on a German transcript.
            {result && !result.error && ' Your own result is highlighted below.'}
          </p>
        </div>
        <GradeScaleTable currentGrade={result && !result.error ? result.grade : null} />
      </section>

      <RouteDivider />

      {/* HOW IT WORKS */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <div className="info-panel">
          <div className="info-panel-content text-center">
            <span className="cgpa-eyebrow justify-center flex">
              <span className="cgpa-eyebrow-dot" />
              <span className="cgpa-eyebrow-label">How it's calculated</span>
            </span>
            <h2 className="cgpa-title mt-4 text-2xl md:text-3xl">
              The modified <span className="foil">Bavarian formula</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed mx-auto" style={{ color: MUTED, maxWidth: 640 }}>
              This is the standard method German universities and uni-assist use to translate
              a foreign grade onto their 1.0 (best) – 4.0 (pass) scale, so the number you get
              here is the same one an admissions officer would calculate.
            </p>

            <div className="formula-box" style={{ maxWidth: 'fit-content' }}>
              German grade = 1 + 3 × (Nmax − Nd) / (Nmax − Nmin)
            </div>

            <div className="info-grid">
              <div className="info-chip">
                <div className="info-chip-label">Nmax</div>
                <div className="info-chip-desc">The top of the scale — 5.00 for HSC, or 4.00/5.00 for CGPA.</div>
              </div>
              <div className="info-chip">
                <div className="info-chip-label">Nmin</div>
                <div className="info-chip-desc">The minimum grade your institution counts as a pass.</div>
              </div>
              <div className="info-chip">
                <div className="info-chip-label">Nd</div>
                <div className="info-chip-desc">Your own result, exactly as printed on your certificate or transcript.</div>
              </div>
            </div>

            <p className="mt-5 text-sm leading-relaxed mx-auto" style={{ color: MUTED, maxWidth: 640 }}>
              <strong style={{ color: INK }}>Master's</strong> applicants are judged on CGPA
              alone, so only that result is converted. <strong style={{ color: INK }}>Bachelor's</strong> applicants
              come to Germany with just 12 years of schooling, which isn't enough for direct
              entry on its own — so HSC and CGPA are each converted with the formula above,
              and the two are averaged into one final German grade.
            </p>

            <div className="disclaimer">
              <Info size={15} style={{ marginTop: 1, flexShrink: 0, color: GOLD }} />
              <span>
                This tool gives a close, widely-used estimate for planning purposes. The
                exact minimum passing grade varies by university, and the final conversion
                for your application is always confirmed by uni-assist or the university
                itself — talk to one of our counselors before you submit anything.
              </span>
            </div>
          </div>
        </div>
      </section>

      <RouteDivider />

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <span className="cgpa-eyebrow justify-center flex">
          <span className="cgpa-eyebrow-dot" />
          <span className="cgpa-eyebrow-label">Next step</span>
        </span>
        <h2 className="cgpa-title mt-4 text-2xl md:text-3xl">
          Not sure what your number means for admission?
        </h2>
        <p className="mt-3 text-sm leading-relaxed max-w-lg mx-auto" style={{ color: MUTED }}>
          Bring your grade to a free consultation and we'll match it against real, recognized
          German universities you can actually get into.
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