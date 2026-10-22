"use client";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useAppStore } from "@/lib/store";
import { todayISO, timeToMinutes, formatTime12 } from "@/lib/utils";
import { effectivePrayers } from "@/lib/prayer-times/normalize";
import { prayerImage } from "@/lib/images";

const COMPONENTS = ["sunnat", "fard", "jamaat", "dua"] as const;
type Component = (typeof COMPONENTS)[number];
const POINTS: Record<Component, number> = { sunnat: 2, fard: 5, jamaat: 3, dua: 1 };

function pad(n: number) {
  return String(n).padStart(2, "0");
}

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

function PrayerJourney({ sunPos, moonPos, isDaytime }: { sunPos: number; moonPos: number; isDaytime: boolean }) {
  function arcPoint(t: number) {
    const t2 = 1 - t;
    const x = t2 * t2 * 30 + 2 * t2 * t * 200 + t * t * 370;
    const y = t2 * t2 * 130 + 2 * t2 * t * 20 + t * t * 130;
    return { x, y };
  }
  const sunPt = arcPoint(sunPos);
  const moonPt = arcPoint(moonPos);

  return (
    <svg viewBox="0 0 400 160" className="pointer-events-none absolute inset-x-0 bottom-0 h-[160px] w-full" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="mountGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9a45d" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#c9a45d" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="sunG"><stop offset="0%" stopColor="#f0a860" stopOpacity="0.9" /><stop offset="100%" stopColor="#f0a860" stopOpacity="0" /></radialGradient>
        <radialGradient id="moonG"><stop offset="0%" stopColor="#e8d4a0" stopOpacity="0.7" /><stop offset="100%" stopColor="#e8d4a0" stopOpacity="0" /></radialGradient>
      </defs>
      <path d="M 0 120 L 50 90 L 100 105 L 140 75 L 200 100 L 250 80 L 300 100 L 350 85 L 400 105 L 400 160 L 0 160 Z" fill="url(#mountGrad)" />
      <path d="M 0 135 L 60 115 L 120 130 L 180 105 L 240 125 L 300 110 L 360 125 L 400 115 L 400 160 L 0 160 Z" fill="#c9a45d" opacity="0.07" />
      <path d="M 30 130 Q 200 20 370 130" fill="none" stroke="#c9a45d" strokeWidth="1.5" strokeDasharray="3 6" opacity="0.7" />
      {isDaytime && (
        <g style={{ transition: "transform 800ms ease-out" }}>
          <circle cx={sunPt.x} cy={sunPt.y} r="16" fill="url(#sunG)"><animate attributeName="r" values="14;18;14" dur="2s" repeatCount="indefinite" /></circle>
          <circle cx={sunPt.x} cy={sunPt.y} r="5" fill="#f0a860" />
        </g>
      )}
      {!isDaytime && (
        <g style={{ transition: "transform 800ms ease-out" }}>
          <circle cx={moonPt.x} cy={moonPt.y} r="16" fill="url(#moonG)"><animate attributeName="r" values="14;18;14" dur="3s" repeatCount="indefinite" /></circle>
          <circle cx={moonPt.x} cy={moonPt.y} r="5" fill="#e8d4a0" />
          <circle cx={moonPt.x + 2} cy={moonPt.y - 1.5} r="4.2" fill="#fdf6e3" />
        </g>
      )}
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
  const [fadeKey, setFadeKey] = useState(0);

  const userId = (session?.user as { id?: string } | undefined)?.id || "";
  const isToday = selectedDate === todayISO();

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setLoading(true);
    setTimes(null);
    setFadeKey((k) => k + 1);
    fetch(`/api/prayer-times?date=${selectedDate}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setTimes(d?.time || null))
      .catch(() => setTimes(null))
      .finally(() => setLoading(false));
  }, [selectedDate]);

  useEffect(() => {
    if (!userId) return;
    setChecked({});
    fetch(`/api/tracking?userId=${userId}&date=${selectedDate}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setChecked(d?.checked || {}))
      .catch(() => {});
  }, [userId, selectedDate]);

  function shiftDate(days: number) {
    if (days > 0 && isToday) return;
    const d = new Date(selectedDate + "T12:00:00");
    d.setDate(d.getDate() + days);
    setSelectedDate(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
  }

  const list = useMemo(() => {
    if (!times) return [];
    const fri = new Date(selectedDate + "T12:00:00").getDay() === 5;
    return effectivePrayers(times, fri);
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

  const countdown = useMemo(() => {
    if (!isToday || !nextKey) return null;
    const next = list.find((p) => p.key === nextKey);
    if (!next) return null;
    const [h, m] = next.jamaat.split(":").map(Number);
    const target = new Date(now);
    target.setHours(h, m, 0, 0);
    if (target.getTime() <= now.getTime()) target.setDate(target.getDate() + 1);
    const diff = target.getTime() - now.getTime();
    const hrs = Math.floor(diff / 3_600_000);
    const mins = Math.floor((diff % 3_600_000) / 60_000);
    const secs = Math.floor((diff % 60_000) / 1000);
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }, [isToday, nextKey, list, now]);

  const sunPos = useMemo(() => {
    if (!times) return 0;
    const cur = now.getHours() * 60 + now.getMinutes();
    const fajr = timeToMinutes(times.fajr || "") ?? 360;
    const maghrib = timeToMinutes(times.maghrib || "") ?? 1080;
    if (cur < fajr) return 0;
    if (cur > maghrib) return 1;
    return Math.max(0, Math.min(1, (cur - fajr) / (maghrib - fajr)));
  }, [now, times]);

  const moonPos = useMemo(() => {
    if (!times) return 1;
    const cur = now.getHours() * 60 + now.getMinutes();
    const isha = timeToMinutes(times.isha || "") ?? 1200;
    const fajr = timeToMinutes(times.fajr || "") ?? 360;
    const ishaToMidnight = 1440 - isha;
    const totalNight = ishaToMidnight + fajr;
    if (cur >= isha) return Math.min(1, (cur - isha) / totalNight);
    if (cur < fajr) return Math.min(1, (ishaToMidnight + cur) / totalNight);
    return 1;
  }, [now, times]);

  const isDaytime = useMemo(() => {
    if (!times) return true;
    const cur = now.getHours() * 60 + now.getMinutes();
    const fajr = timeToMinutes(times.fajr || "") ?? 360;
    const maghrib = timeToMinutes(times.maghrib || "") ?? 1080;
    return cur >= fajr && cur < maghrib;
  }, [now, times]);

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

  const gregorian = useMemo(() => new Date(selectedDate + "T12:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }), [selectedDate]);

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

  const fardsDone = ["fajr", "zuhr", "asr", "maghrib", "isha"].filter((p) => checked[`${p}_fard`]).length;

  return (
    <div className="relative min-h-dvh pb-32">
      <div className="relative px-4 pt-6">
        <h1 className="font-serif text-[30px] font-bold leading-tight text-forest text-center">Prayer Timings</h1>
        <p className="mt-1 text-[10.5px] font-semibold uppercase tracking-[0.24em] text-ink-muted text-center">Buchpora, Srinagar</p>

        <div className="mx-4 mt-5 flex items-center justify-between gap-2 rounded-full bg-white/70 py-2.5 pl-3 pr-2 ring-1 ring-white/80 shadow-[0_4px_16px_-8px_rgba(28,52,42,0.25)]">
          <button type="button" onClick={() => shiftDate(-1)} className="grid h-8 w-8 place-items-center rounded-full text-forest transition hover:bg-forest/5 active:scale-95">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <div key={fadeKey} className="flex flex-1 items-center justify-center gap-2 transition-all duration-300" style={{ animation: "dateFade 400ms ease-out" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1c4a3a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></svg>
            <div className="text-center">
              <p className="font-serif text-[13px] font-bold text-ink">{gregorian}</p>
              {hijri && <p className="text-[10.5px] text-ink-muted">{hijri}</p>}
            </div>
          </div>
          <button type="button" onClick={() => shiftDate(1)} disabled={isToday} className={`grid h-8 w-8 place-items-center rounded-full transition ${isToday ? "text-ink-muted/30" : "text-forest hover:bg-forest/5 active:scale-95"}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>

        {loading ? (
          <div className="mx-4 mt-6 h-[180px] animate-pulse rounded-[22px] bg-card/40" />
        ) : list.length === 0 ? (
          <div className="mx-4 mt-6 rounded-[22px] bg-card/70 p-6 text-center ring-1 ring-white/70">
            <p className="font-serif text-[15px] font-bold text-ink">No schedule for this date</p>
          </div>
        ) : (
          <div key={fadeKey} style={{ animation: "dateFade 400ms ease-out" }}>
            <div className="relative mt-4 h-[200px]">
              <PrayerJourney sunPos={sunPos} moonPos={moonPos} isDaytime={isDaytime} />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-2">
                {list.map((p) => {
                  const isActive = p.key === nextKey;
                  return (
                    <div key={p.key} className="flex flex-1 flex-col items-center">
                      <div className={`relative grid place-items-center transition-all duration-500 ease-out ${isActive ? "h-[60px] w-[60px] rounded-[16px] bg-forest text-white shadow-[0_12px_24px_-8px_rgba(28,74,58,0.55)] scale-110" : "h-[38px] w-[38px] rounded-full bg-white/70 text-forest ring-1 ring-white/80"}`}>
                        {isActive && <span className="absolute inset-0 rounded-[16px] bg-forest/20 animate-ping" />}
                        <PrayerIcon name={p.key} size={isActive ? 26 : 18} />
                      </div>
                      <p className={`mt-2 text-[11px] font-serif font-semibold transition-colors ${isActive ? "text-forest" : "text-ink-muted"}`}>{p.name}</p>
                      <p className={`text-[10px] tabular-nums transition-colors ${isActive ? "font-bold text-forest" : "text-ink-muted"}`}>{formatTime12(p.jamaat)}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {isToday && nextKey && countdown && (
              <div className="mx-4 mt-5 rounded-[20px] bg-gradient-to-r from-forest to-[#0a2a1f] p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/70">Next Prayer</p>
                    <p className="mt-1 font-serif text-[22px] font-bold text-white">{list.find((p) => p.key === nextKey)?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#dec680]">Starts in</p>
                    <p className="mt-1 font-serif text-[22px] font-bold text-[#dec680] tabular-nums">{countdown}</p>
                  </div>
                </div>
                <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-[#dec680] transition-all duration-1000" style={{ width: `${sunPos * 100}%` }} />
                </div>
              </div>
            )}

            <div className="mx-4 mt-5 rounded-[20px] bg-white/70 p-4 ring-1 ring-white/80 shadow-[0_3px_12px_-6px_rgba(28,52,42,0.18)] flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0">
                <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-divider/40" strokeWidth="3" />
                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-[#c9a45d]" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 16}`} strokeDashoffset={`${2 * Math.PI * 16 * (1 - fardsDone / 5)}`} style={{ transition: "stroke-dashoffset 800ms cubic-bezier(0.34, 1.56, 0.64, 1)" }} />
                </svg>
                <div className="absolute inset-0 grid place-items-center">
                  <span className="font-serif text-[16px] font-bold text-ink">{fardsDone}<span className="text-[10px] text-ink-muted">/5</span></span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-ink-muted">Today's Progress</p>
                <p className="font-serif text-[14px] font-bold text-forest mt-0.5">{fardsDone === 5 ? "All fards complete ✓" : `${5 - fardsDone} fards remaining`}</p>
              </div>
            </div>

            <div className="mx-4 mt-6">
              <div className="flex items-end justify-between mb-3">
                <h3 className="font-serif text-[22px] font-bold text-forest">Today's Prayer Timings</h3>
              </div>
              <div className="space-y-3">
                {list.map((p) => {
                  const isActive = p.key === nextKey;
                  const isExpanded = expanded === p.key;
                  const img = prayerImage(p.key === "zuhr" && isActive ? "zuhr" : p.key);
                  
                  return (
                    <div key={p.key} className={`relative overflow-hidden rounded-[22px] transition-all duration-300 h-[110px] ${isActive ? "ring-2 ring-[#2f6350] shadow-[0_12px_30px_-10px_rgba(28,74,58,0.4)]" : "ring-1 ring-white/80 shadow-[0_4px_14px_-8px_rgba(28,52,42,0.2)]"}`}>
                      
                      {/* Photo Background for each card */}
                      <div className="absolute inset-y-0 right-0 w-[55%]">
                        <img src={img} alt="" className={`h-full w-full object-cover ${isActive ? "opacity-100" : "opacity-70"}`} />
                        {/* Fade from cream card into the image */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#fbf9f4] via-[#fbf9f4]/80 to-transparent" />
                        {isActive && <div className="absolute inset-0 bg-[#2f6350]/10 mix-blend-multiply" />}
                      </div>

                      <button type="button" onClick={() => setExpanded(isExpanded ? null : p.key)} className="relative flex h-full w-full items-center gap-3 p-4 pr-[45%] text-left active:scale-[0.99] transition-transform">
                        {isActive && <span className="h-16 w-1.5 rounded-full bg-forest shadow-sm" />}
                        
                        <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-full transition-all duration-300 ${isActive ? "bg-forest text-white shadow-md" : "bg-[#e6ebdf]/90 text-forest backdrop-blur-sm"}`}>
                          <PrayerIcon name={p.key} size={26} />
                        </div>
                        
                        <div className="min-w-0 flex-1">
                          <p className={`font-serif text-[18px] font-bold ${isActive ? "text-forest" : "text-ink"}`}>{p.name}</p>
                          <p dir="rtl" className="text-[14px] text-ink-muted">{p.arabic}</p>
                        </div>
                        
                        <div className="shrink-0 text-right">
                          <p className="text-[9px] uppercase tracking-[0.12em] text-ink-muted">{p.priorLabel}</p>
                          <p className={`text-[13px] tabular-nums ${isActive ? "text-forest/70" : "text-ink-muted"}`}>{formatTime12(p.prior)}</p>
                        </div>
                        
                        <div className={`shrink-0 rounded-xl px-3 py-1.5 text-right transition ${isActive ? "bg-forest text-white shadow-md" : "bg-[#c9a45d]/15"}`}>
                          <p className={`text-[9px] uppercase tracking-[0.12em] ${isActive ? "text-white/70" : "text-[#8a6b15]"}`}>Jamaat</p>
                          <p className={`text-[16px] font-bold tabular-nums ${isActive ? "text-white" : "text-[#8a6b15]"}`}>{formatTime12(p.jamaat)}</p>
                        </div>
                      </button>

                      <div className={`absolute bottom-0 left-0 right-0 bg-[#fbf9f4]/95 backdrop-blur border-t border-divider/50 px-3 pt-2 pb-3 transition-all duration-300 ease-out ${isExpanded ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>
                        <div className="flex gap-2">
                          {COMPONENTS.map((c) => {
                            const on = checked[`${p.key}_${c}`] === true;
                            return (
                              <button key={c} type="button" onClick={() => toggle(p.key, c)} className="flex flex-1 flex-col items-center gap-1 active:scale-95 transition-transform">
                                <div className={`grid h-12 w-12 place-items-center rounded-full transition-all duration-300 ${on ? "scale-110" : "border border-[#c9a45d]/40"}`} style={on ? { background: "linear-gradient(160deg, #e5b437 0%, #c9a227 55%, #8a6b15 100%)", boxShadow: "0 4px 10px -2px rgba(201,162,39,0.5)" } : { background: "rgba(255,255,255,0.7)" }}>
                                  {on ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> : <span className="text-[10px] font-bold text-[#8a6b15]">+{POINTS[c]}</span>}
                                </div>
                                <span className={`text-[9px] font-bold uppercase tracking-[0.12em] ${on ? "text-[#8a6b15]" : "text-ink-muted"}`}>{c}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mx-4 mt-6 mb-2 rounded-[22px] bg-white/70 px-5 py-4 ring-1 ring-white/80 shadow-[0_8px_20px_-10px_rgba(28,52,42,0.25)]">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#e6ebdf] text-forest">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 5.5c3.2-1 6.2-.8 9.5 1.2 3.3-2 6.3-2.2 9.5-1.2v13.5c-3.2-1-6.2-.8-9.5 1.2-3.3-2-6.3-2.2-9.5-1.2zM12 6.7v13" /></svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p dir="rtl" className="text-right font-arabic text-[18px] leading-[1.9] text-forest">حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَى</p>
                  <p className="mt-2 text-[12.5px] italic leading-relaxed text-[#3a4741]">&ldquo;Maintain the prayers and the middle prayer.&rdquo;</p>
                  <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a6b15]">— Surah Al-Baqarah (2:238)</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes dateFade {
          0% { opacity: 0; transform: translateY(4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
