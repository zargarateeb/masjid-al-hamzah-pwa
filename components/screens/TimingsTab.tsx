"use client";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useAppStore } from "@/lib/store";
import { todayISO, timeToMinutes, formatTime12 } from "@/lib/utils";
import { PRAYER_OFFSETS, PRAYER_NAMES, PRAYER_ARABIC } from "@/lib/constants";

const COMPONENTS = ["sunnat", "fard", "jamaat", "dua"] as const;
type Component = (typeof COMPONENTS)[number];
const POINTS: Record<Component, number> = {
  sunnat: 2,
  fard: 5,
  jamaat: 3,
  dua: 1,
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}
function subtract(t: string, min: number) {
  if (!t || !t.includes(":")) return t;
  const [h, m] = t.split(":").map(Number);
  let tot = h * 60 + m - min;
  tot = ((tot % 1440) + 1440) % 1440;
  return `${pad(Math.floor(tot / 60))}:${pad(tot % 60)}`;
}

function PrayerIcon({ name, size = 20 }: { name: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === "fajr" && (
        <>
          <path d="M17 18a5 5 0 0 0-10 0" />
          <path d="M12 9V3" />
          <path d="M4.22 10.22l1.42 1.42" />
          <path d="M1 18h2" />
          <path d="M21 18h2" />
          <path d="M18.36 11.64l1.42-1.42" />
          <path d="M3 22h18" />
        </>
      )}
      {name === "zuhr" && (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </>
      )}
      {name === "asr" && (
        <>
          <circle cx="12" cy="12" r="3.5" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41" />
        </>
      )}
      {name === "maghrib" && (
        <>
          <path d="M17 18a5 5 0 0 0-10 0" />
          <path d="M12 9V3" />
          <path d="M4.22 10.22l1.42 1.42" />
          <path d="M1 18h2" />
          <path d="M21 18h2" />
          <path d="M18.36 11.64l1.42-1.42" />
          <path d="M2 22h20" />
        </>
      )}
      {name === "isha" && (
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      )}
      {name === "jummah" && (
        <>
          <path d="M4 21V11a8 8 0 0 1 16 0v10" />
          <path d="M4 21h16M12 3v3" />
        </>
      )}
    </svg>
  );
}

function ArchHeader() {
  return (
    <svg
      viewBox="0 0 400 180"
      className="pointer-events-none absolute inset-x-0 top-0 h-[180px] w-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="archLine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9a45d" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#c9a45d" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path
        d="M 30 180 L 30 80 Q 30 30 200 10 Q 370 30 370 80 L 370 180"
        fill="none"
        stroke="url(#archLine)"
        strokeWidth="1.2"
      />
      <path
        d="M 50 180 L 50 85 Q 50 42 200 25 Q 350 42 350 85 L 350 180"
        fill="none"
        stroke="url(#archLine)"
        strokeWidth="0.8"
        opacity="0.7"
      />
      <path
        d="M 70 180 L 70 90 Q 70 54 200 40 Q 330 54 330 90 L 330 180"
        fill="none"
        stroke="url(#archLine)"
        strokeWidth="0.6"
        opacity="0.5"
      />
      <circle cx="200" cy="18" r="2.5" fill="#c9a45d" opacity="0.7" />
      <circle cx="200" cy="10" r="1.5" fill="#c9a45d" opacity="0.5" />
    </svg>
  );
}

function Lantern() {
  return (
    <svg
      width="32"
      height="52"
      viewBox="0 0 32 52"
      className="mx-auto"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="lanternBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8d4a0" />
          <stop offset="50%" stopColor="#c9a45d" />
          <stop offset="100%" stopColor="#8a6b15" />
        </linearGradient>
      </defs>
      <line x1="16" y1="0" x2="16" y2="10" stroke="#8a6b15" strokeWidth="1" />
      <path d="M 11 10 L 21 10 L 20 14 L 12 14 Z" fill="url(#lanternBody)" />
      <path
        d="M 10 14 Q 10 30 16 40 Q 22 30 22 14 Z"
        fill="url(#lanternBody)"
        opacity="0.85"
      />
      <path
        d="M 10 14 Q 10 30 16 40 Q 22 30 22 14 Z"
        fill="none"
        stroke="#8a6b15"
        strokeWidth="0.6"
      />
      <path d="M 12 40 L 20 40 L 21 44 L 11 44 Z" fill="url(#lanternBody)" />
      <ellipse cx="16" cy="27" rx="3" ry="6" fill="#fdf3cc" opacity="0.7" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────
   Prayer journey landscape + sun/moon position
   Sun/moon position is driven by current time relative to
   the actual prayer times of the day.
   ───────────────────────────────────────────────────── */
function PrayerJourneyLandscape({
  sunPos,
  moonPos,
  isDaytime,
}: {
  sunPos: number; // 0-1 along the arc (0 = far left/fajr, 1 = far right/isha)
  moonPos: number; // 0-1
  isDaytime: boolean;
}) {
  // The arc: quadratic bezier from (45,130) through (200,30) to (355,130)
  // Compute point on this arc for a given t (0..1)
  function arcPoint(t: number) {
    const t2 = 1 - t;
    const x = t2 * t2 * 45 + 2 * t2 * t * 200 + t * t * 355;
    const y = t2 * t2 * 130 + 2 * t2 * t * 30 + t * t * 130;
    return { x, y };
  }

  const sunPt = arcPoint(sunPos);
  const moonPt = arcPoint(moonPos);

  return (
    <svg
      viewBox="0 0 400 200"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[200px] w-full"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="mountainFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9a45d" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#c9a45d" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="sunGlow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#e8b077" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#e8b077" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="moonGlow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#c9a45d" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#c9a45d" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Mountain silhouettes */}
      <path
        d="M 0 145 L 60 120 L 90 130 L 140 105 L 190 125 L 240 100 L 290 120 L 340 108 L 400 125 L 400 200 L 0 200 Z"
        fill="url(#mountainFade)"
      />
      <path
        d="M 0 160 L 50 140 L 110 150 L 160 130 L 220 145 L 280 128 L 340 140 L 400 130 L 400 200 L 0 200 Z"
        fill="#c9a45d"
        opacity="0.06"
      />

      {/* Golden arc */}
      <path
        d="M 45 130 Q 200 30 355 130"
        fill="none"
        stroke="#c9a45d"
        strokeWidth="1.2"
        strokeDasharray="3 5"
        opacity="0.65"
      />

      {/* Sun — position driven by time */}
      {isDaytime && (
        <>
          <circle cx={sunPt.x} cy={sunPt.y} r="14" fill="url(#sunGlow)" />
          <circle cx={sunPt.x} cy={sunPt.y} r="5" fill="#e8b077" />
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const x1 = sunPt.x + Math.cos(angle) * 7;
            const y1 = sunPt.y + Math.sin(angle) * 7;
            const x2 = sunPt.x + Math.cos(angle) * 9;
            const y2 = sunPt.y + Math.sin(angle) * 9;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#e8b077"
                strokeWidth="1"
                strokeLinecap="round"
                opacity="0.85"
              />
            );
          })}
        </>
      )}

      {/* Moon — position driven by time */}
      {!isDaytime && (
        <>
          <circle cx={moonPt.x} cy={moonPt.y} r="14" fill="url(#moonGlow)" />
          <circle cx={moonPt.x} cy={moonPt.y} r="5" fill="#e8d4a0" />
          <circle cx={moonPt.x + 2} cy={moonPt.y - 1} r="4.2" fill="#fdf6e3" />
        </>
      )}

      {/* Birds */}
      <path
        d="M 140 65 q 3 -3 6 0 q 3 -3 6 0"
        fill="none"
        stroke="#8a6b15"
        strokeWidth="0.8"
        opacity="0.4"
      />
      <path
        d="M 250 55 q 3 -3 6 0 q 3 -3 6 0"
        fill="none"
        stroke="#8a6b15"
        strokeWidth="0.8"
        opacity="0.35"
      />
    </svg>
  );
}

export function TimingsTab() {
  const { data: session } = useSession();
  const pushScreen = useAppStore((s) => s.pushScreen);
  const [selectedDate, setSelectedDate] = useState<string>(todayISO());
  const [times, setTimes] = useState<Record<string, string> | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(() => new Date());

  const userId = (session?.user as { id?: string } | undefined)?.id || "";
  const isToday = selectedDate === todayISO();

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000); // update every 30s
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setLoading(true);
    setTimes(null);
    fetch(`/api/prayer-times?date=${selectedDate}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setTimes(d?.time || null))
      .catch(() => setTimes(null))
      .finally(() => setLoading(false));
  }, [selectedDate]);

  useEffect(() => {
    if (!userId) return;
    setChecked({});
    fetch(`/api/tracking?userId=${userId}&date=${selectedDate}`, {
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((d) => setChecked(d?.checked || {}))
      .catch(() => {});
  }, [userId, selectedDate]);

  function shiftDate(days: number) {
    const d = new Date(selectedDate + "T12:00:00");
    d.setDate(d.getDate() + days);
    setSelectedDate(
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
    );
  }

  const list = useMemo(() => {
    if (!times) return [];
    const fri = new Date(selectedDate + "T12:00:00").getDay() === 5;
    const out: {
      key: string;
      name: string;
      arabic: string;
      jamaat: string;
      azaan: string;
    }[] = [];
    if (times.fajr)
      out.push({
        key: "fajr",
        name: PRAYER_NAMES.fajr,
        arabic: PRAYER_ARABIC.fajr,
        jamaat: times.fajr,
        azaan: subtract(times.fajr, PRAYER_OFFSETS.fajr),
      });
    if (fri && times.jummah)
      out.push({
        key: "jummah",
        name: PRAYER_NAMES.jummah,
        arabic: PRAYER_ARABIC.jummah,
        jamaat: times.jummah,
        azaan: subtract(times.jummah, 15),
      });
    else if (times.zuhr)
      out.push({
        key: "zuhr",
        name: PRAYER_NAMES.zuhr,
        arabic: PRAYER_ARABIC.zuhr,
        jamaat: times.zuhr,
        azaan: subtract(times.zuhr, PRAYER_OFFSETS.zuhr),
      });
    if (times.asr)
      out.push({
        key: "asr",
        name: PRAYER_NAMES.asr,
        arabic: PRAYER_ARABIC.asr,
        jamaat: times.asr,
        azaan: subtract(times.asr, PRAYER_OFFSETS.asr),
      });
    if (times.maghrib)
      out.push({
        key: "maghrib",
        name: PRAYER_NAMES.maghrib,
        arabic: PRAYER_ARABIC.maghrib,
        jamaat: times.maghrib,
        azaan: subtract(times.maghrib, PRAYER_OFFSETS.maghrib),
      });
    if (times.isha)
      out.push({
        key: "isha",
        name: PRAYER_NAMES.isha,
        arabic: PRAYER_ARABIC.isha,
        jamaat: times.isha,
        azaan: subtract(times.isha, PRAYER_OFFSETS.isha),
      });
    return out;
  }, [times, selectedDate]);

  const nextKey = useMemo(() => {
    if (!isToday || !list.length) return null;
    const cur = now.getHours() * 60 + now.getMinutes();
    for (const p of list) {
      const m = timeToMinutes(p.jamaat);
      if (m !== null && m > cur) return p.key;
    }
    return list[0].key;
  }, [list, isToday, now]);

  /* ── Sun position: interpolate between Fajr and Maghrib ── */
  const sunPos = useMemo(() => {
    if (!list.length) return 0;
    const cur = now.getHours() * 60 + now.getMinutes();
    const fajr = timeToMinutes(times?.fajr || "") ?? 360;
    const maghrib = timeToMinutes(times?.maghrib || "") ?? 1080;

    if (cur < fajr) return 0;
    if (cur > maghrib) return 1;
    // Interpolate between fajr (0) and maghrib (1)
    const frac = (cur - fajr) / (maghrib - fajr);
    return Math.max(0, Math.min(1, frac));
  }, [now, times, list]);

  /* ── Moon position: night after Isha until Fajr ── */
  const moonPos = useMemo(() => {
    const cur = now.getHours() * 60 + now.getMinutes();
    const isha = timeToMinutes(times?.isha || "") ?? 1200;
    const fajr = timeToMinutes(times?.fajr || "") ?? 360;
    const ishaToMidnight = 1440 - isha;
    const totalNight = ishaToMidnight + fajr;

    if (cur >= isha) {
      return Math.min(1, (cur - isha) / totalNight);
    }
    if (cur < fajr) {
      return Math.min(1, (ishaToMidnight + cur) / totalNight);
    }
    return 0; // day
  }, [now, times]);

  /* ── Is it daytime? ── */
  const isDaytime = useMemo(() => {
    const cur = now.getHours() * 60 + now.getMinutes();
    const fajr = timeToMinutes(times?.fajr || "") ?? 360;
    const maghrib = timeToMinutes(times?.maghrib || "") ?? 1080;
    return cur >= fajr && cur < maghrib;
  }, [now, times]);

  const hijri = useMemo(() => {
    try {
      return new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(selectedDate + "T12:00:00"));
    } catch {
      return "";
    }
  }, [selectedDate]);

  const gregorian = useMemo(() => {
    return new Date(selectedDate + "T12:00:00").toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, [selectedDate]);

  async function toggle(pKey: string, c: Component) {
    if (!userId) {
      pushScreen("settings");
      return;
    }
    const key = `${pKey}_${c}`;
    const next = { ...checked, [key]: !checked[key] };
    setChecked(next);
    try {
      const r = await fetch("/api/tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, date: selectedDate, checked: next }),
      });
      const d = await r.json();
      if (d?.checked) setChecked(d.checked);
    } catch {}
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-canvas pb-28">
      <ArchHeader />

      <div className="relative px-4 pt-3">
        <Lantern />

        <div className="mt-1 text-center">
          <h1 className="font-serif text-[34px] font-bold leading-tight text-forest">
            Prayer Timings
          </h1>
          <p className="mt-1 text-[10.5px] font-semibold uppercase tracking-[0.24em] text-ink-muted">
            Buchpora, Srinagar
          </p>
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="h-px w-10 bg-[#c9a45d]/50" />
            <svg width="24" height="8" viewBox="0 0 24 8">
              <path
                d="M 2 4 Q 6 0 12 4 Q 18 8 22 4"
                fill="none"
                stroke="#c9a45d"
                strokeWidth="1"
              />
            </svg>
            <span className="h-px w-10 bg-[#c9a45d]/50" />
          </div>
        </div>

        {/* Date selector */}
        <div className="mx-4 mt-5 flex items-center justify-between gap-2 rounded-full bg-white/70 py-2.5 pl-3 pr-2 ring-1 ring-white/80 shadow-[0_4px_16px_-8px_rgba(28,52,42,0.25)]">
          <button
            type="button"
            onClick={() => shiftDate(-1)}
            aria-label="Previous day"
            className="grid h-8 w-8 place-items-center rounded-full text-forest transition active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="flex flex-1 items-center justify-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1c4a3a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M3 9h18M8 3v4M16 3v4" />
            </svg>
            <div className="text-center">
              <p className="font-serif text-[13px] font-bold text-ink">
                {gregorian}
              </p>
              {hijri && (
                <p className="text-[10.5px] text-ink-muted">{hijri} AH</p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => shiftDate(1)}
            aria-label="Next day"
            className="grid h-8 w-8 place-items-center rounded-full text-forest transition active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="mx-4 mt-6 h-[200px] animate-pulse rounded-[22px] bg-card/40" />
        ) : list.length === 0 ? (
          <div className="mx-4 mt-6 rounded-[22px] bg-card/70 p-6 text-center ring-1 ring-white/70">
            <p className="font-serif text-[15px] font-bold text-ink">
              No schedule for this date
            </p>
          </div>
        ) : (
          <>
            {/* Prayer journey */}
            <div className="relative mt-4 h-[210px] px-2">
              <PrayerJourneyLandscape
                sunPos={sunPos}
                moonPos={moonPos}
                isDaytime={isDaytime}
              />

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-1">
                {list.map((p) => {
                  const isActive = p.key === nextKey;
                  return (
                    <div key={p.key} className="flex flex-1 flex-col items-center">
                      <div
                        className={`grid place-items-center transition-all ${
                          isActive
                            ? "h-[72px] w-[56px] rounded-[14px] bg-forest text-white shadow-[0_12px_24px_-8px_rgba(28,74,58,0.55)]"
                            : "h-[38px] w-[38px] rounded-full bg-white/70 text-forest ring-1 ring-white/80"
                        }`}
                      >
                        <PrayerIcon name={p.key} size={isActive ? 24 : 18} />
                        {isActive && (
                          <span className="mt-0.5 h-1 w-1 rounded-full bg-[#dec680]" />
                        )}
                      </div>
                      <p
                        className={`mt-2 text-[11px] font-serif font-semibold ${
                          isActive ? "text-forest" : "text-ink-muted"
                        }`}
                      >
                        {p.name}
                      </p>
                      <p
                        className={`text-[10px] tabular-nums ${
                          isActive ? "font-bold text-forest" : "text-ink-muted"
                        }`}
                      >
                        {formatTime12(p.jamaat)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Today's Prayer Timings */}
            <div className="mx-4 mt-6">
              <div className="flex items-end justify-between">
                <h3 className="font-serif text-[22px] font-bold text-forest">
                  Today&apos;s Prayer Timings
                </h3>
                <div className="text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                    {gregorian}
                  </p>
                  {hijri && (
                    <p className="text-[9.5px] text-ink-muted">{hijri} AH</p>
                  )}
                </div>
              </div>

              <div className="mt-3 space-y-2.5">
                {list.map((p) => {
                  const isActive = p.key === nextKey;
                  const isExpanded = expanded === p.key;

                  return (
                    <div
                      key={p.key}
                      className={`overflow-hidden rounded-[22px] transition ${
                        isActive
                          ? "bg-[#e6ebdf]"
                          : "bg-white/75 ring-1 ring-white/80"
                      } shadow-[0_3px_12px_-6px_rgba(28,52,42,0.18)]`}
                    >
                      <button
                        type="button"
                        onClick={() => setExpanded(isExpanded ? null : p.key)}
                        className="flex w-full items-center gap-3 p-5 text-left"
                      >
                        {isActive && (
                          <span className="h-16 w-1 rounded-full bg-forest" />
                        )}

                        <div
                          className={`grid h-14 w-14 shrink-0 place-items-center rounded-full ${
                            isActive
                              ? "bg-forest text-white"
                              : "bg-[#e6ebdf] text-forest"
                          }`}
                        >
                          <PrayerIcon name={p.key} size={26} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p
                            className={`font-serif text-[20px] font-bold ${
                              isActive ? "text-forest" : "text-ink"
                            }`}
                          >
                            {p.name}
                          </p>
                          <p dir="rtl" className="text-[14px] text-ink-muted">
                            {p.arabic}
                          </p>
                        </div>

                        {/* Azaan — smaller, muted */}
                        <div className="shrink-0 text-right">
                          <p className="text-[9px] uppercase tracking-[0.12em] text-ink-muted">
                            Azaan
                          </p>
                          <p
                            className={`text-[12px] tabular-nums ${
                              isActive ? "text-forest/70" : "text-ink-muted"
                            }`}
                          >
                            {formatTime12(p.azaan)}
                          </p>
                        </div>

                        {/* Jamaat — bigger, bolder, highlighted */}
                        <div
                          className={`shrink-0 rounded-xl px-3 py-1.5 text-right ${
                            isActive ? "bg-forest/10" : "bg-[#c9a45d]/10"
                          }`}
                        >
                          <p
                            className={`text-[9px] uppercase tracking-[0.12em] ${
                              isActive ? "text-forest/70" : "text-[#8a6b15]"
                            }`}
                          >
                            Jamaat
                          </p>
                          <p
                            className={`text-[17px] font-bold tabular-nums ${
                              isActive ? "text-forest" : "text-[#8a6b15]"
                            }`}
                          >
                            {formatTime12(p.jamaat)}
                          </p>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-divider/50 px-3 pb-3 pt-2">
                          <div className="flex gap-2">
                            {COMPONENTS.map((c) => {
                              const on = checked[`${p.key}_${c}`] === true;
                              return (
                                <button
                                  key={c}
                                  type="button"
                                  onClick={() => toggle(p.key, c)}
                                  className="flex flex-1 flex-col items-center gap-1"
                                >
                                  <div
                                    className={`grid h-12 w-12 place-items-center rounded-full transition ${
                                      on ? "" : "border border-[#c9a45d]/40"
                                    }`}
                                    style={
                                      on
                                        ? {
                                            background:
                                              "linear-gradient(160deg, #e5b437 0%, #c9a227 55%, #8a6b15 100%)",
                                            boxShadow:
                                              "0 4px 10px -2px rgba(201,162,39,0.5)",
                                          }
                                        : { background: "rgba(255,255,255,0.7)" }
                                    }
                                  >
                                    {on ? (
                                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                      </svg>
                                    ) : (
                                      <span className="text-[10px] font-bold text-[#8a6b15]">
                                        +{POINTS[c]}
                                      </span>
                                    )}
                                  </div>
                                  <span
                                    className={`text-[9px] font-bold uppercase tracking-[0.12em] ${
                                      on ? "text-[#8a6b15]" : "text-ink-muted"
                                    }`}
                                  >
                                    {c}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quran verse card */}
            <div className="mx-4 mt-6 mb-2 rounded-[22px] bg-white/70 px-5 py-4 ring-1 ring-white/80 shadow-[0_8px_20px_-10px_rgba(28,52,42,0.25)]">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#e6ebdf] text-forest">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 5.5c3.2-1 6.2-.8 9.5 1.2 3.3-2 6.3-2.2 9.5-1.2v13.5c-3.2-1-6.2-.8-9.5 1.2-3.3-2-6.3-2.2-9.5-1.2zM12 6.7v13" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    dir="rtl"
                    className="text-right font-arabic text-[18px] leading-[1.9] text-forest"
                  >
                    حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَى
                  </p>
                  <p className="mt-2 text-[12.5px] italic leading-relaxed text-[#3a4741]">
                    &ldquo;Maintain the prayers and the middle prayer.&rdquo;
                  </p>
                  <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a6b15]">
                    — Surah Al-Baqarah (2:238)
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}