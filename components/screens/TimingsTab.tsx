"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useAppStore } from "@/lib/store";
import { todayISO, timeToMinutes, formatTime12 } from "@/lib/utils";
import { effectivePrayers } from "@/lib/prayer-times/normalize";
import { prayerImage } from "@/lib/images";

/* -------------------------------------------------------------------------- */
/*  Constants & helpers                                                       */
/* -------------------------------------------------------------------------- */

const COMPONENTS = ["sunnat", "fard", "jamaat", "dua"] as const;
type Component = (typeof COMPONENTS)[number];
const POINTS: Record<Component, number> = { sunnat: 2, fard: 5, jamaat: 3, dua: 1 };
const COMPONENT_LABELS: Record<Component, string> = { sunnat: "Sunnat", fard: "Fard", jamaat: "Jamaat", dua: "Dua" };
const TOTAL_POINTS = COMPONENTS.reduce((sum, c) => sum + POINTS[c], 0);
const FARD_PRAYERS = ["fajr", "zuhr", "asr", "maghrib", "isha"] as const;
const DAY_SECONDS = 86_400;

type Prayer = ReturnType<typeof effectivePrayers>[number];

/** Per-prayer tint used by the Jamaat box and the countdown ring. */
const THEMES: Record<string, { box: string; ink: string; ring: string }> = {
  fajr: { box: "#e1ead8", ink: "#1f4a38", ring: "#2f6350" },
  zuhr: { box: "#fbe7c4", ink: "#6e4c0f", ring: "#e3a93f" },
  asr: { box: "#f9d9bd", ink: "#7a3f12", ring: "#e0924a" },
  maghrib: { box: "#f5cfc4", ink: "#7d2e1d", ring: "#c4513a" },
  isha: { box: "#dad9ea", ink: "#262a5c", ring: "#2b2f6e" },
};
function themeFor(key: string) {
  return THEMES[key] ?? THEMES.fajr;
}

// Quran 4:103 (An-Nisa). Verify wording against your preferred mushaf/translation before shipping.
const VERSE = {
  arabic: "إِنَّ ٱلصَّلَوٰةَ كَانَتْ عَلَى ٱلْمُؤْمِنِينَ كِتَٰبًا مَّوْقُوتًا",
  translation: "Prayer has been prescribed for the believers at fixed times.",
  source: "Surah An-Nisa, 4:103",
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}
function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}
function toSeconds(value: string | null | undefined): number | null {
  if (!value) return null;
  const m = timeToMinutes(value);
  return typeof m === "number" ? m * 60 : null;
}
/** First key that holds a parseable HH:mm value. */
function pickTime(times: Record<string, string> | null, keys: string[]): string | null {
  if (!times) return null;
  for (const k of keys) {
    const v = times[k];
    if (v && toSeconds(v) !== null) return v;
  }
  return null;
}
function formatHMS(totalSec: number) {
  const s = Math.max(0, Math.floor(totalSec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0 ? `${h}h ${pad(m)}m ${pad(sec)}s` : `${m}m ${pad(sec)}s`;
}
function formatHM(totalSec: number) {
  const mins = Math.ceil(Math.max(0, totalSec) / 60);
  const h = Math.floor(mins / 60);
  return h > 0 ? `${h}h ${mins % 60}m` : `${mins}m`;
}
function spokenDuration(totalSec: number) {
  const mins = Math.ceil(Math.max(0, totalSec) / 60);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const parts: string[] = [];
  if (h > 0) parts.push(`${h} ${h === 1 ? "hour" : "hours"}`);
  if (m > 0 || h === 0) parts.push(`${m} ${m === 1 ? "minute" : "minutes"}`);
  return parts.join(" and ");
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/* -------------------------------------------------------------------------- */
/*  Hero arc geometry (viewBox 0 0 400 470)                                   */
/* -------------------------------------------------------------------------- */

const ARC_CX = 200;
const ARC_CY = 288;
const ARC_R = 126;
const ARC_PATH = `M ${ARC_CX - ARC_R} ${ARC_CY} A ${ARC_R} ${ARC_R} 0 0 1 ${ARC_CX + ARC_R} ${ARC_CY}`;
/** Pointed arch, 340 x 300, drawn at x=30 in the hero viewBox. */
const ARCH_D =
  "M0 300 V150 C0 90 70 66 112 40 C138 24 158 12 170 0 C182 12 202 24 228 40 C270 66 340 90 340 150 V300";

function arcPoint(t: number, radius: number = ARC_R) {
  const a = Math.PI * clamp01(t);
  return { x: ARC_CX - radius * Math.cos(a), y: ARC_CY - radius * Math.sin(a) };
}

/* -------------------------------------------------------------------------- */
/*  Small presentational pieces                                               */
/* -------------------------------------------------------------------------- */

function PrayerIcon({ name, size = 20 }: { name: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {name === "fajr" && (<><path d="M17 18a5 5 0 0 0-10 0" /><path d="M12 9V2" /><path d="M4.22 10.22l1.42 1.42" /><path d="M1 18h2" /><path d="M21 18h2" /><path d="M18.36 11.64l1.42-1.42" /><path d="M3 22h18" /></>)}
      {name === "zuhr" && (<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></>)}
      {name === "asr" && (<><circle cx="12" cy="12" r="3.5" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41" /></>)}
      {name === "maghrib" && (<><path d="M17 18a5 5 0 0 0-10 0" /><path d="M12 9V2" /><path d="M4.22 10.22l1.42 1.42" /><path d="M1 18h2" /><path d="M21 18h2" /><path d="M18.36 11.64l1.42-1.42" /><path d="M2 22h20" /></>)}
      {name === "isha" && (<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />)}
    </svg>
  );
}

function SunGlyph({ pulse }: { pulse: boolean }) {
  return (
    <g>
      <circle r="26" fill="url(#tt-sun-glow)">
        {pulse && <animate attributeName="r" values="24;29;24" dur="3s" repeatCount="indefinite" />}
      </circle>
      <g stroke="#f3a23a" strokeWidth="3" strokeLinecap="round">
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * Math.PI) / 4;
          return <line key={i} x1={Math.cos(a) * 17} y1={Math.sin(a) * 17} x2={Math.cos(a) * 23} y2={Math.sin(a) * 23} />;
        })}
      </g>
      <circle r="12" fill="#f6b13c" stroke="#fff4d6" strokeWidth="2" />
    </g>
  );
}

function MoonGlyph() {
  return (
    <g>
      <circle r="24" fill="url(#tt-moon-glow)" />
      <path d="M4 -11.3 A12 12 0 1 0 11.3 4 A9.5 9.5 0 0 1 4 -11.3 Z" fill="#e8d4a0" stroke="#fff4d6" strokeWidth="1.5" />
    </g>
  );
}

/* Blurred botanical leaves, drawn inline so no image assets are needed. */
type LeafSpec = [x: number, y: number, rotation: number, scale: number, tone: number];
const LEAF_TONES = ["#5b7a3a", "#7a9558", "#46683a", "#93a869"];
const LEAF_PATH = "M0 0 C 8 -11 28 -12 44 0 C 28 12 8 11 0 0 Z";
const LEAF_VEIN = "M3 0 L 38 0";
const LEAVES_BACK: LeafSpec[] = [
  [-10, 60, 50, 2.6, 0], [22, 150, 70, 2.4, 2], [-14, 236, 80, 2.2, 1], [60, -10, 70, 2.8, 3], [40, 90, 40, 2.2, 1],
];
const LEAVES_FRONT: LeafSpec[] = [
  [-4, 18, 55, 1.5, 0], [14, 42, 25, 1.4, 1], [34, 30, 80, 1.6, 2], [8, 92, 50, 1.5, 3], [30, 118, 15, 1.3, 0],
  [44, 104, 75, 1.4, 1], [12, 170, 60, 1.4, 2], [36, 192, 20, 1.2, 3], [22, 236, 70, 1.3, 0], [52, 250, 25, 1.0, 1],
  [60, 60, 100, 1.2, 2],
];
const LEAVES_SIDE: LeafSpec[] = [
  [-6, 14, 40, 1.4, 0], [10, 44, 15, 1.3, 2], [-4, 80, 55, 1.5, 1], [14, 112, 25, 1.2, 3], [-2, 150, 60, 1.3, 0],
];

function Leaves({ leaves }: { leaves: LeafSpec[] }) {
  return (
    <>
      {leaves.map(([x, y, r, s, t], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
          <path d={LEAF_PATH} fill={LEAF_TONES[t % LEAF_TONES.length]} />
          <path d={LEAF_VEIN} stroke="#ffffff" strokeOpacity="0.25" strokeWidth="0.8" fill="none" />
        </g>
      ))}
    </>
  );
}

function Foliage() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <svg viewBox="0 0 400 520" preserveAspectRatio="xMidYMin slice" className="absolute inset-x-0 top-0 h-[520px] w-full">
        <defs>
          <filter id="tt-blur-soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3.5" /></filter>
          <filter id="tt-blur-light" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.1" /></filter>
        </defs>
        <g filter="url(#tt-blur-soft)" opacity="0.55">
          <Leaves leaves={LEAVES_BACK} />
          <g transform="translate(400 0) scale(-1 1)"><Leaves leaves={LEAVES_BACK} /></g>
        </g>
        <g filter="url(#tt-blur-light)" opacity="0.85">
          <Leaves leaves={LEAVES_FRONT} />
          <g transform="translate(400 0) scale(-1 1)"><Leaves leaves={LEAVES_FRONT} /></g>
        </g>
      </svg>
      <svg viewBox="0 0 80 200" className="absolute left-0 top-[46%] h-44 w-16 opacity-50 blur-[2px]">
        <Leaves leaves={LEAVES_SIDE} />
      </svg>
      <svg viewBox="0 0 80 200" className="absolute right-0 top-[72%] h-44 w-16 -scale-x-100 opacity-45 blur-[2px]">
        <Leaves leaves={LEAVES_SIDE} />
      </svg>
    </div>
  );
}

type StatusState = "prayed" | "countdown" | "unmarked";

function StatusIndicator({
  state, progress, color, label, reduced,
}: { state: StatusState; progress: number; color: string; label: string; reduced: boolean }) {
  const circumference = 2 * Math.PI * 18;
  return (
    <span className="flex w-[52px] flex-col items-center gap-1 min-[380px]:w-[60px]">
      <span className="relative grid h-10 w-10 place-items-center min-[380px]:h-11 min-[380px]:w-11">
        {state === "prayed" ? (
          <span className="grid h-full w-full place-items-center rounded-full bg-forest text-white shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="5 12.5 10 17.5 19 7.5" />
            </svg>
          </span>
        ) : (
          <svg viewBox="0 0 44 44" className="h-full w-full -rotate-90" aria-hidden="true">
            <circle
              cx="22" cy="22" r="18" fill="none" stroke={color} strokeWidth="4.5"
              strokeOpacity={state === "unmarked" ? 0.35 : 0.28}
              strokeDasharray={state === "unmarked" ? "3 4.5" : undefined}
            />
            {state === "countdown" && progress > 0 && (
              <circle
                cx="22" cy="22" r="18" fill="none" stroke={color} strokeWidth="4.5" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - clamp01(progress))}
                style={{ transition: reduced ? "none" : "stroke-dashoffset 1s linear" }}
              />
            )}
          </svg>
        )}
      </span>
      <span className="text-center text-[10px] font-medium leading-tight text-ink-muted">{label}</span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */

export function TimingsTab() {
  const { data: session } = useSession();
  const pushScreen = useAppStore((s) => s.pushScreen);
  const reducedMotion = usePrefersReducedMotion();

  const [selectedDate, setSelectedDate] = useState<string>(todayISO());
  const [times, setTimes] = useState<Record<string, string> | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(() => new Date());
  const [fadeKey, setFadeKey] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const userId = (session?.user as { id?: string } | undefined)?.id || "";
  const isToday = selectedDate === todayISO();
  const fadeStyle = reducedMotion ? undefined : { animation: "dateFade 400ms ease-out" };

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setTimes(null);
    setFadeKey((k) => k + 1);
    setSelectedKey(null);
    setExpanded(null);
    fetch(`/api/prayer-times?date=${selectedDate}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setTimes(d?.time || null); })
      .catch(() => { if (!cancelled) setTimes(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [selectedDate]);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    setChecked({});
    fetch(`/api/tracking?userId=${userId}&date=${selectedDate}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setChecked(d?.checked || {}); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [userId, selectedDate]);

  function shiftDate(days: number) {
    if (days > 0 && isToday) return;
    const d = new Date(selectedDate + "T12:00:00");
    d.setDate(d.getDate() + days);
    setSelectedDate(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
  }

  /* ----------------------------- prayer data ------------------------------ */

  const list = useMemo(() => {
    if (!times) return [];
    const fri = new Date(selectedDate + "T12:00:00").getDay() === 5;
    return effectivePrayers(times, fri);
  }, [times, selectedDate]);

  const hasData = !loading && list.length > 0;
  const nowSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  /** Jamaat time of each prayer, in seconds since midnight (null when unparseable). */
  const jamaatSecs = useMemo(() => list.map((p) => toSeconds(p.jamaat)), [list]);

  /**
   * The next prayer and the interval it closes: previous Jamaat -> next Jamaat.
   * Before Fajr the interval starts at yesterday's Isha; after Isha it runs to Fajr tomorrow.
   */
  const nextInfo = useMemo(() => {
    if (!isToday) return null;
    const entries = jamaatSecs.flatMap((s, i) => (s === null ? [] : [{ i, s }]));
    if (entries.length === 0) return null;
    const upcoming = entries.findIndex((e) => e.s > nowSec);
    if (upcoming === -1) {
      const first = entries[0];
      const last = entries[entries.length - 1];
      return { index: first.i, start: last.s, target: first.s + DAY_SECONDS };
    }
    const prev = entries[upcoming - 1];
    const nextEntry = entries[upcoming];
    const start = prev ? prev.s : entries[entries.length - 1].s - DAY_SECONDS;
    return { index: nextEntry.i, start, target: nextEntry.s };
  }, [isToday, jamaatSecs, nowSec]);

  const nextPrayer: Prayer | undefined = nextInfo ? list[nextInfo.index] : undefined;
  const nextKey = nextPrayer ? nextPrayer.key : null;
  const remaining = nextInfo ? nextInfo.target - nowSec : 0;
  const intervalProgress = nextInfo ? clamp01((nowSec - nextInfo.start) / (nextInfo.target - nextInfo.start)) : 0;

  const selected: Prayer | undefined = useMemo(
    () => list.find((p) => p.key === selectedKey) ?? (nextKey ? list.find((p) => p.key === nextKey) : undefined) ?? list[0],
    [list, selectedKey, nextKey],
  );
  const selectedIndex = selected ? list.indexOf(selected) : -1;
  const selectedSec = selectedIndex >= 0 ? jamaatSecs[selectedIndex] : null;
  const selectedTheme = themeFor(selected?.key ?? "fajr");

  /* ------------------------------ hero arc -------------------------------- */

  const arcData = useMemo(() => {
    const valid = jamaatSecs.filter((s): s is number => s !== null);
    if (valid.length < 2) return null;
    const start = Math.min(...valid);
    const end = Math.max(...valid);
    if (end <= start) return null;
    const marks = list.flatMap((p, i) => {
      const s = jamaatSecs[i];
      return s === null ? [] : [{ key: p.key, arabic: p.arabic as string, t: (s - start) / (end - start) }];
    });
    return { start, end, marks };
  }, [list, jamaatSecs]);

  let dayT = 0;
  if (arcData) {
    if (isToday) dayT = (nowSec - arcData.start) / (arcData.end - arcData.start);
    else dayT = arcData.marks.find((m) => m.key === selected?.key)?.t ?? 0;
  }
  const sunT = clamp01(dayT);
  const outsideWindow = isToday && (dayT < 0 || dayT > 1);

  /* ---------------------------- sunrise/sunset ---------------------------- */

  const dayline = useMemo(() => {
    if (!times) return null;
    const sunrise = pickTime(times, ["sunrise", "shuruq", "sunRise", "sun_rise", "ishraq"]);
    const sunset = pickTime(times, ["sunset", "sunSet", "sun_set"]);
    const startTime = sunrise ?? pickTime(times, ["fajr"]);
    const endTime = sunset ?? pickTime(times, ["maghrib"]);
    const startSec = toSeconds(startTime);
    const endSec = toSeconds(endTime);
    if (!startTime || !endTime || startSec === null || endSec === null || endSec <= startSec) return null;
    return {
      startLabel: sunrise ? "Sunrise" : "Fajr",
      startTime,
      endLabel: sunset ? "Sunset" : "Maghrib",
      endTime,
      startSec,
      endSec,
    };
  }, [times]);

  const noon = list.find((p) => p.key === "zuhr");
  const dayPct = dayline
    ? clamp01(((isToday ? nowSec : selectedSec ?? dayline.startSec) - dayline.startSec) / (dayline.endSec - dayline.startSec))
    : 0;

  /* ------------------------------- dates ---------------------------------- */

  const hijri = useMemo(() => {
    try {
      const fmt = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", { day: "numeric", month: "short", year: "numeric" });
      const parts = fmt.formatToParts(new Date(selectedDate + "T12:00:00"));
      const day = parts.find((p) => p.type === "day")?.value ?? "";
      const month = parts.find((p) => p.type === "month")?.value ?? "";
      const year = parts.find((p) => p.type === "year")?.value ?? "";
      return `${day} ${month}, ${year.replace(/\D/g, "")} AH`;
    } catch { return ""; }
  }, [selectedDate]);

  const gregorian = useMemo(
    () => new Date(selectedDate + "T12:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    [selectedDate],
  );

  /* ------------------------------ tracking -------------------------------- */

  async function toggle(pKey: string, c: Component) {
    if (!userId) { pushScreen("settings"); return; }
    const key = `${pKey}_${c}`;
    const next = { ...checked, [key]: !checked[key] };
    setChecked(next);
    try {
      const r = await fetch("/api/tracking", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, date: selectedDate, checked: next }),
      });
      const d = await r.json();
      if (d?.checked) setChecked(d.checked);
    } catch {}
  }

  const fardsDone = FARD_PRAYERS.filter((p) => checked[`${p}_fard`]).length;

  /* ----------------------------- announcement ----------------------------- */

  function announce() {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || !selected) return;
    const synth = window.speechSynthesis;
    if (speaking) { synth.cancel(); setSpeaking(false); return; }
    const text =
      isToday && nextPrayer && nextInfo
        ? `Next prayer is ${nextPrayer.name}. Jamaat at ${formatTime12(nextPrayer.jamaat)}, in ${spokenDuration(nextInfo.target - nowSec)}.`
        : `${selected.name}. ${selected.priorLabel || "Azaan"} at ${formatTime12(selected.prior)}. Jamaat at ${formatTime12(selected.jamaat)}.`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    synth.cancel();
    synth.speak(utterance);
  }

  /* -------------------------------- render -------------------------------- */

  const heroImage = selected && !brokenImages[`hero_${selected.key}`] ? prayerImage(selected.key) : null;
  const transitionStyle = (css: string) => (reducedMotion ? "none" : css);

  return (
    <div className="relative min-h-dvh overflow-x-clip bg-[linear-gradient(180deg,#f6eedb_0%,#faf6ea_30%,#fbf9f4_100%)] pb-[calc(8rem+env(safe-area-inset-bottom))] pt-[env(safe-area-inset-top)]">
      <Foliage />

      {/* clip path for the arch-shaped hero image */}
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="tt-arch" clipPathUnits="objectBoundingBox">
            <path d={`${ARCH_D} Z`} transform="scale(0.0029412 0.0033333)" />
          </clipPath>
        </defs>
      </svg>

      <div className="relative z-10 mx-auto w-full max-w-[520px]">
        {/* ------------------------------ HERO ------------------------------ */}
        <section aria-label="Selected prayer" className="relative aspect-[400/470] w-full">
          {/* arch image */}
          <div
            className="absolute left-[7.5%] top-0 h-[63.8%] w-[85%]"
            style={{
              clipPath: "url(#tt-arch)",
              WebkitClipPath: "url(#tt-arch)",
              WebkitMaskImage: "linear-gradient(to bottom, #000 62%, transparent 100%)",
              maskImage: "linear-gradient(to bottom, #000 62%, transparent 100%)",
            }}
          >
            <div className="absolute inset-0 bg-[#efe6cf]" />
            {heroImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={selected?.key}
                src={heroImage}
                alt=""
                decoding="async"
                onError={() => selected && setBrokenImages((b) => ({ ...b, [`hero_${selected.key}`]: true }))}
                className="absolute inset-0 h-full w-full object-cover opacity-90"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-[#fbf8ef] via-[#fbf8ef]/55 to-transparent" />
          </div>

          {/* arc, markers, labels, sun */}
          <svg viewBox="0 0 400 470" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <defs>
              <radialGradient id="tt-sun-glow"><stop offset="0%" stopColor="#ffd37a" stopOpacity="0.85" /><stop offset="100%" stopColor="#ffd37a" stopOpacity="0" /></radialGradient>
              <radialGradient id="tt-moon-glow"><stop offset="0%" stopColor="#e8d4a0" stopOpacity="0.6" /><stop offset="100%" stopColor="#e8d4a0" stopOpacity="0" /></radialGradient>
            </defs>
            <g transform="translate(30 0)">
              <path d={ARCH_D} fill="none" stroke="#e4d3a0" strokeWidth="2" strokeOpacity="0.9" />
            </g>
            {hasData && arcData && selected && (
              <>
                <path d={ARC_PATH} fill="none" stroke="#fffdf6" strokeWidth="22" strokeLinecap="round" />
                <path d={ARC_PATH} fill="none" stroke="#d8d2bf" strokeWidth="13" strokeLinecap="round" />
                <path
                  d={ARC_PATH} pathLength={100} fill="none" stroke="#1c4a3a" strokeWidth="13" strokeLinecap="round"
                  strokeDasharray={`${sunT * 100} 100`}
                  style={{ transition: transitionStyle("stroke-dasharray 800ms ease-out") }}
                />
                {arcData.marks.map((m) => {
                  const pt = arcPoint(m.t);
                  const isSel = m.key === selected.key;
                  const passed = m.t <= sunT + 0.0001 && !(isToday && dayT < 0);
                  const lp = arcPoint(m.t, ARC_R + 24);
                  const ux = -Math.cos(Math.PI * m.t);
                  const anchor = ux > 0.35 ? "start" : ux < -0.35 ? "end" : "middle";
                  return (
                    <g key={m.key}>
                      <circle
                        cx={pt.x} cy={pt.y} r={isSel ? 9 : 7}
                        fill={passed ? "#1c4a3a" : "#6a7d66"}
                        stroke={isSel ? "#c9a45d" : "#fffdf6"} strokeWidth={isSel ? 3 : 2.5}
                      />
                      <text
                        x={lp.x} y={lp.y} textAnchor={anchor} dominantBaseline="central" fontSize="19"
                        fill={isSel ? "#1c4a3a" : "#3d4a42"} fontWeight={isSel ? 700 : 500}
                      >
                        {m.arabic}
                      </text>
                    </g>
                  );
                })}
                {(() => {
                  const pos = arcPoint(sunT);
                  return (
                    <g style={{ transform: `translate(${pos.x}px, ${pos.y}px)`, transition: transitionStyle("transform 800ms ease-out") }}>
                      {outsideWindow ? <MoonGlyph /> : <SunGlyph pulse={!reducedMotion} />}
                    </g>
                  );
                })()}
              </>
            )}
          </svg>

          {/* title + date */}
          <div className="absolute inset-x-0 top-[2.5%] px-16 text-center">
            <h1 className="font-serif text-[38px] font-bold leading-none text-forest">
              {hasData && selected ? selected.name : "Prayer Timings"}
            </h1>
            <p className="mt-2 font-serif text-[15px] leading-tight text-ink">{gregorian}</p>
            {hijri && <p className="font-serif text-[13px] leading-tight text-ink-muted">{hijri}</p>}
          </div>

          {/* date navigation */}
          <button
            type="button" onClick={() => shiftDate(-1)} aria-label="Previous day"
            className="absolute left-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-forest shadow-[0_4px_14px_-6px_rgba(28,52,42,0.35)] transition active:scale-95 motion-reduce:transition-none"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <button
            type="button" onClick={() => shiftDate(1)} disabled={isToday} aria-label="Next day"
            className={`absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-white/90 shadow-[0_4px_14px_-6px_rgba(28,52,42,0.35)] transition motion-reduce:transition-none ${isToday ? "text-ink-muted/30" : "text-forest active:scale-95"}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
          </button>

          {/* announcement control */}
          {hasData && (
            <button
              type="button" onClick={announce} aria-pressed={speaking}
              aria-label={speaking ? "Stop announcement" : "Announce prayer time"}
              className={`absolute right-[4%] top-[17%] grid h-11 w-11 place-items-center rounded-full shadow-[0_4px_14px_-6px_rgba(28,52,42,0.35)] transition active:scale-95 motion-reduce:transition-none ${speaking ? "bg-forest text-white" : "bg-white/90 text-forest"}`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                <path d="M11 5 6 9H3v6h3l5 4V5z" />
                <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" fill="none" />
              </svg>
            </button>
          )}

          {/* countdown / state */}
          <div key={fadeKey} className="absolute inset-x-0 top-[50%] px-6 text-center" style={fadeStyle}>
            {loading ? (
              <div className="mx-auto mt-3 space-y-3" aria-busy="true" aria-label="Loading prayer times">
                <div className="mx-auto h-4 w-28 animate-pulse rounded-full bg-forest/10 motion-reduce:animate-none" />
                <div className="mx-auto h-10 w-48 animate-pulse rounded-full bg-forest/10 motion-reduce:animate-none" />
              </div>
            ) : !hasData || !selected ? (
              <div className="mx-auto mt-3 max-w-[260px]">
                <p className="font-serif text-[18px] font-bold text-ink">No schedule for this date</p>
                <p className="mt-1 text-[12px] text-ink-muted">Try another day using the arrows.</p>
              </div>
            ) : isToday && nextPrayer && nextInfo ? (
              <>
                <p className="font-serif text-[15px] leading-tight text-ink">Next prayer in</p>
                <p role="timer" className="mt-1 font-serif text-[40px] font-bold leading-none tabular-nums text-ink">{formatHMS(remaining)}</p>
                <p className="mt-2 font-serif text-[22px] font-semibold leading-tight text-ink">{nextPrayer.name}</p>
              </>
            ) : (
              <>
                <p className="font-serif text-[15px] leading-tight text-ink">{selected.name} Jamaat</p>
                <p className="mt-1 font-serif text-[40px] font-bold leading-none tabular-nums text-ink">{formatTime12(selected.jamaat)}</p>
                <p className="mt-2 font-serif text-[18px] leading-tight text-ink-muted">{selected.priorLabel || "Azaan"} {formatTime12(selected.prior)}</p>
              </>
            )}
          </div>
        </section>

        {hasData && selected && (
          <div key={`body-${fadeKey}`} style={fadeStyle}>
            {/* ------------------------ SUNRISE TO SUNSET ------------------------ */}
            {dayline && (
              <section aria-label={`${dayline.startLabel} to ${dayline.endLabel}`} className="mx-5 -mt-35">
                <div className="relative h-[60px]">
                  <span className="absolute left-3 top-[16px] text-[#f09a2e]"><PrayerIcon name="fajr" size={30} /></span>
                  <span className="absolute right-3 top-[16px] text-[#e0523a]"><PrayerIcon name="maghrib" size={30} /></span>
                  <div className="absolute left-[64px] right-[64px] top-[36px] h-[3px] rounded-full bg-[#d8d2bf]">
                    <div className="h-full rounded-full bg-forest/70" style={{ width: `${dayPct * 100}%`, transition: transitionStyle("width 800ms ease-out") }} />
                    <div className="absolute top-1/2" style={{ left: `${dayPct * 100}%`, transform: "translate(-50%, -50%)", transition: transitionStyle("left 800ms ease-out") }}>
                      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[#f09a2e]"><PrayerIcon name="zuhr" size={28} /></span>
                      <span className="block h-3.5 w-3.5 rounded-full bg-forest ring-2 ring-[#fbf8ef]" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 text-center font-serif leading-tight text-ink">
                  <div><p className="text-[13px]">{dayline.startLabel}</p><p className="text-[13px] tabular-nums">{formatTime12(dayline.startTime)}</p></div>
                  <div>{noon && (<><p className="text-[13px] font-semibold">{noon.name}</p><p className="text-[13px] font-semibold tabular-nums">{formatTime12(noon.prior)}</p></>)}</div>
                  <div><p className="text-[13px]">{dayline.endLabel}</p><p className="text-[13px] tabular-nums">{formatTime12(dayline.endTime)}</p></div>
                </div>
              </section>
            )}

            {/* ------------------------- SELECTED DETAILS ------------------------ */}
            <section
              aria-label={`${selected.name} details`}
              className="mx-4 mt-0 rounded-[26px] bg-[#fffdf8]/95 p-4 ring-1 ring-[#e9e2cf] shadow-[0_10px_28px_-16px_rgba(28,52,42,0.35)]"
            >
              <div className="flex items-center gap-4">
                <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full" style={{ backgroundColor: selectedTheme.box, color: selectedTheme.ring }}>
                  <PrayerIcon name={selected.key} size={38} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-[13px] text-ink-muted">{selected.name} Details</p>
                  <p className="truncate font-serif text-[30px] font-bold leading-tight text-ink">{selected.name}</p>
                </div>
                <p dir="rtl" lang="ar" className="shrink-0 text-[24px] text-forest">{selected.arabic}</p>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#f4efe2] px-3 py-2.5 text-center">
                  <p className="font-serif text-[13px] text-ink-muted">{selected.priorLabel || "Azaan"} Time</p>
                  <p className="font-serif text-[24px] font-bold leading-tight tabular-nums text-ink">{formatTime12(selected.prior)}</p>
                </div>
                <div className="rounded-2xl bg-forest px-3 py-2.5 text-center text-white shadow-[0_10px_20px_-10px_rgba(28,74,58,0.7)]">
                  <p className="font-serif text-[13px] text-white/75">Jamaat Time</p>
                  <p className="font-serif text-[24px] font-bold leading-tight tabular-nums">{formatTime12(selected.jamaat)}</p>
                </div>
              </div>
            </section>

            {/* --------------------------- PRAYER LIST --------------------------- */}
            <section aria-label="Prayer list" className="mx-4 mt-6">
              <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                  <h2 className="font-serif text-[22px] font-bold leading-tight text-forest">{isToday ? "Today's Prayers" : "Prayers"}</h2>
                  <p className="mt-0.5 text-[11px] text-ink-muted">Buchpora, Srinagar</p>
                </div>
                <p
                  className="shrink-0 rounded-full bg-forest/10 px-3 py-1 text-[11px] font-semibold tabular-nums text-forest"
                  aria-label={`${fardsDone} of 5 fards prayed`}
                >
                  {fardsDone === 5 ? "All fards complete ✓" : `${fardsDone}/5 fards`}
                </p>
              </div>

              <ul className="space-y-3">
                {list.map((p, i) => {
                  const theme = themeFor(p.key);
                  const isSelected = selected.key === p.key;
                  const isNext = isToday && p.key === nextKey;
                  const isExpanded = expanded === p.key;
                  const prayed = !!checked[`${p.key}_fard`];
                  const jSec = jamaatSecs[i];
                  const secsLeft = isToday && jSec !== null ? jSec - nowSec : null;
                  const upcoming = secsLeft !== null && secsLeft > 0;
                  const status: StatusState = prayed ? "prayed" : upcoming ? "countdown" : "unmarked";
                  const statusLabel = prayed ? "Prayed" : upcoming && secsLeft !== null ? formatHM(secsLeft) : "Not marked";
                  const earned = COMPONENTS.reduce((sum, c) => sum + (checked[`${p.key}_${c}`] ? POINTS[c] : 0), 0);
                  const imgBroken = brokenImages[p.key];
                  const panelId = `track-${p.key}`;

                  return (
                    <li key={p.key}>
                      <div
                        className={`overflow-hidden rounded-[26px] bg-[#fffdf8]/95 transition-shadow motion-reduce:transition-none ${
                          isSelected
                            ? "ring-2 ring-forest shadow-[0_14px_30px_-14px_rgba(28,74,58,0.5)]"
                            : "ring-1 ring-[#e9e2cf] shadow-[0_6px_16px_-12px_rgba(28,52,42,0.3)]"
                        }`}
                      >
                        <div className="flex items-stretch">
                          <button
                            type="button"
                            onClick={() => setSelectedKey(p.key)}
                            aria-pressed={isSelected}
                            className="flex min-w-0 flex-1 items-center gap-2.5 py-5 pl-3 text-left active:bg-forest/[0.03] min-[380px]:gap-3"
                          >
                            <span
                              className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl min-[380px]:h-16 min-[380px]:w-16"
                              style={{ backgroundColor: theme.box, color: theme.ring }}
                            >
                              {imgBroken ? (
                                <PrayerIcon name={p.key} size={24} />
                              ) : (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={prayerImage(p.key)} alt="" loading="lazy" decoding="async"
                                  onError={() => setBrokenImages((b) => ({ ...b, [p.key]: true }))}
                                  className="absolute inset-0 h-full w-full object-cover"
                                />
                              )}
                            </span>

                            <span className="min-w-0 flex-1">
                              <span className="flex items-center gap-1.5">
                                <span className={`font-serif text-[17px] font-bold leading-tight ${isSelected ? "text-forest" : "text-ink"}`}>{p.name}</span>
                                {isNext && <span className="rounded-full bg-[#c9a45d]/20 px-1.5 py-px text-[9px] font-bold text-[#8a6b15]">Next</span>}
                              </span>
                              <span dir="rtl" lang="ar" className="block text-[13px] leading-snug text-ink-muted">{p.arabic}</span>
                              <span className="mt-0.5 flex items-baseline gap-1 whitespace-nowrap">
                                <span className="text-[10.5px] text-ink-muted">{p.priorLabel || "Azaan"}</span>
                                <span className="text-[13px] font-semibold tabular-nums text-ink">{formatTime12(p.prior)}</span>
                              </span>
                            </span>

                            <span
                              className="shrink-0 rounded-2xl px-2.5 py-2 text-center min-[380px]:px-3"
                              style={{ backgroundColor: theme.box, color: theme.ink }}
                            >
                              <span className="block text-[10.5px] font-medium opacity-75">Jamaat</span>
                              <span className="block whitespace-nowrap text-[15px] font-bold leading-tight tabular-nums min-[380px]:text-[17px]">{formatTime12(p.jamaat)}</span>
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setExpanded(isExpanded ? null : p.key)}
                            aria-expanded={isExpanded}
                            aria-controls={panelId}
                            aria-label={`${isExpanded ? "Hide" : "Show"} tracking for ${p.name}. ${statusLabel}`}
                            className="flex shrink-0 items-center gap-0.5 py-3 pl-1 pr-2.5 active:bg-forest/[0.03]"
                          >
                            <StatusIndicator
                              state={status}
                              progress={isNext ? intervalProgress : 0}
                              color={theme.ring}
                              label={statusLabel}
                              reduced={reducedMotion}
                            />
                            <svg
                              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"
                              strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                              className={`text-ink-muted transition-transform motion-reduce:transition-none ${isExpanded ? "rotate-90" : ""}`}
                            >
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          </button>
                        </div>

                        {isExpanded && (
                          <div id={panelId} role="group" aria-label={`${p.name} tracking`} className="border-t border-[#ece5d2] bg-[#fbf8ef] px-3 pb-3 pt-2.5">
                            <div className="mb-2 flex items-center justify-between">
                              <p className="text-[11px] font-semibold text-ink-muted">Track {p.name}</p>
                              <p className="text-[11px] font-semibold tabular-nums text-[#8a6b15]">{earned}/{TOTAL_POINTS} pts</p>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                              {COMPONENTS.map((c) => {
                                const on = !!checked[`${p.key}_${c}`];
                                return (
                                  <button
                                    key={c}
                                    type="button"
                                    onClick={() => toggle(p.key, c)}
                                    aria-pressed={on}
                                    aria-label={`${COMPONENT_LABELS[c]} for ${p.name}, ${POINTS[c]} points`}
                                    className={`flex min-h-[56px] flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-2 text-center transition active:scale-95 motion-reduce:transition-none ${
                                      on ? "bg-forest text-white shadow-md" : "bg-white text-ink ring-1 ring-[#e9e2cf]"
                                    }`}
                                  >
                                    <span className="text-[12px] font-semibold">{on ? "✓ " : ""}{COMPONENT_LABELS[c]}</span>
                                    <span className={`text-[10px] tabular-nums ${on ? "text-white/80" : "text-ink-muted"}`}>+{POINTS[c]}</span>
                                  </button>
                                );
                              })}
                            </div>
                            {!userId && <p className="mt-2 text-center text-[11px] text-ink-muted">Sign in to save your progress.</p>}
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* ---------------------------- QURAN VERSE --------------------------- */}
            <figure className="mx-4 mt-6 rounded-[26px] bg-[#fffdf8]/95 px-5 py-6 text-center ring-1 ring-[#e9e2cf] shadow-[0_8px_22px_-14px_rgba(28,52,42,0.3)]">
              <svg width="44" height="10" viewBox="0 0 44 10" className="mx-auto mb-3 text-[#c9a45d]" aria-hidden="true">
                <path d="M0 5h16M28 5h16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M22 0.8 26 5 22 9.2 18 5z" fill="currentColor" />
              </svg>
              <blockquote>
                <p dir="rtl" lang="ar" className="font-serif text-[24px] leading-[2] text-forest">{VERSE.arabic}</p>
                <p className="mt-2 font-serif text-[15px] leading-relaxed text-ink">{VERSE.translation}</p>
              </blockquote>
              <figcaption className="mt-3 text-[12px] text-ink-muted">{VERSE.source}</figcaption>
            </figure>
          </div>
        )}
      </div>
    </div>
  );
}