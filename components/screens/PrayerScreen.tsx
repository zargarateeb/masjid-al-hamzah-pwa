'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useAppStore } from '@/lib/store';
import { todayISO, timeToMinutes, formatTime12 } from '@/lib/utils';
import { PRAYER_OFFSETS, PRAYER_NAMES, PRAYER_ARABIC } from '@/lib/constants';
import { PRAYER_HERO, prayerImage } from '@/lib/images';
import GlassCard from '@/components/ui/GlassCard';
import AmbientGlow from '@/components/ui/AmbientGlow';
import { OrnamentDivider } from '@/components/ui/GoldOrnament';

const COMPONENTS = ['sunnat', 'fard', 'jamaat', 'dua'] as const;
type Component = typeof COMPONENTS[number];
const POINTS: Record<Component, number> = { sunnat: 2, fard: 5, jamaat: 3, dua: 1 };

function pad(n: number) { return String(n).padStart(2, '0'); }
function subtract(t: string, min: number) {
  if (!t || !t.includes(':')) return t;
  const [h, m] = t.split(':').map(Number);
  let tot = h * 60 + m - min;
  tot = ((tot % 1440) + 1440) % 1440;
  return `${pad(Math.floor(tot / 60))}:${pad(tot % 60)}`;
}
function isoFor(d: Date) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function buildStrip(): Date[] {
  const days: Date[] = [];
  for (let i = 0; i < 14; i++) { const d = new Date(); d.setDate(d.getDate() - i); days.push(d); }
  return days;
}

export default function PrayerScreen() {
  const { data: session } = useSession();
  const pushScreen = useAppStore((s) => s.pushScreen);
  const strip = useMemo(buildStrip, []);
  const [selectedDate, setSelectedDate] = useState<string>(todayISO());
  const [times, setTimes] = useState<any>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [dayProgress, setDayProgress] = useState<Record<string, number>>({});

  const userId = (session?.user as any)?.id || '';
  const isToday = selectedDate === todayISO();

  useEffect(() => {
    setTimes(null);
    fetch(`/api/prayer-times?date=${selectedDate}`).then((r) => r.json()).then((d) => setTimes(d?.time || null)).catch(() => {});
  }, [selectedDate]);

  useEffect(() => {
    if (!userId) return;
    setChecked({});
    fetch(`/api/tracking?userId=${userId}&date=${selectedDate}`).then((r) => r.json()).then((d) => setChecked(d?.checked || {})).catch(() => {});
  }, [userId, selectedDate]);

  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      const entries: Record<string, number> = {};
      await Promise.all(strip.map(async (d) => {
        const iso = isoFor(d);
        try {
          const r = await fetch(`/api/tracking?userId=${userId}&date=${iso}`);
          const data = await r.json();
          const c = data?.checked || {};
          let fards = 0;
          for (const p of ['fajr', 'zuhr', 'asr', 'maghrib', 'isha']) if (c[`${p}_fard`]) fards++;
          entries[iso] = fards;
        } catch { entries[iso] = 0; }
      }));
      setDayProgress(entries);
    };
    load();
  }, [userId, strip, checked]);

  const list = useMemo(() => {
    if (!times) return [];
    const fri = new Date(selectedDate + 'T12:00:00').getDay() === 5;
    const out: any[] = [];
    out.push({ key: 'fajr', name: PRAYER_NAMES.fajr, arabic: PRAYER_ARABIC.fajr, jamaat: times.fajr, azaan: subtract(times.fajr, PRAYER_OFFSETS.fajr) });
    if (fri && times.jummah) {
      out.push({ key: 'jummah', name: PRAYER_NAMES.jummah, arabic: PRAYER_ARABIC.jummah, jamaat: times.jummah, azaan: subtract(times.jummah, 15) });
    } else {
      out.push({ key: 'zuhr', name: PRAYER_NAMES.zuhr, arabic: PRAYER_ARABIC.zuhr, jamaat: times.zuhr, azaan: subtract(times.zuhr, PRAYER_OFFSETS.zuhr) });
    }
    out.push({ key: 'asr', name: PRAYER_NAMES.asr, arabic: PRAYER_ARABIC.asr, jamaat: times.asr, azaan: subtract(times.asr, PRAYER_OFFSETS.asr) });
    out.push({ key: 'maghrib', name: PRAYER_NAMES.maghrib, arabic: PRAYER_ARABIC.maghrib, jamaat: times.maghrib, azaan: subtract(times.maghrib, PRAYER_OFFSETS.maghrib) });
    out.push({ key: 'isha', name: PRAYER_NAMES.isha, arabic: PRAYER_ARABIC.isha, jamaat: times.isha, azaan: subtract(times.isha, PRAYER_OFFSETS.isha) });
    return out;
  }, [times, selectedDate]);

  const nextKey = useMemo(() => {
    if (!isToday || !list.length) return null;
    const now = new Date();
    const cur = now.getHours() * 60 + now.getMinutes();
    for (const p of list) {
      const m = timeToMinutes(p.jamaat);
      if (m !== null && m > cur) return p.key;
    }
    return list[0].key;
  }, [list, isToday]);

  useEffect(() => { if (isToday && nextKey && expanded === null) setExpanded(nextKey); }, [nextKey, expanded, isToday]);

  async function toggle(pKey: string, c: Component) {
    if (!userId) { pushScreen('settings'); return; }
    const key = `${pKey}_${c}`;
    const next = { ...checked, [key]: !checked[key] };
    setChecked(next);
    try {
      const r = await fetch('/api/tracking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, date: selectedDate, checked: next }) });
      const d = await r.json();
      if (d?.checked) setChecked(d.checked);
    } catch {}
  }

  function countChecked(pKey: string) { return COMPONENTS.filter((c) => checked[`${pKey}_${c}`]).length; }

  const fardsDone = ['fajr', 'zuhr', 'asr', 'maghrib', 'isha'].filter((p) => checked[`${p}_fard`]).length;
  const dateLabel = new Date(selectedDate + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="relative min-h-dvh pb-36">
      <div className="relative h-[200px] overflow-hidden">
        <img src={PRAYER_HERO} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(3,26,24,0.35) 0%, rgba(3,26,24,0.65) 55%, rgba(3,26,24,1) 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="kicker kicker-gold">{isToday ? 'Today' : 'History'}</div>
          <h1 className="mt-1 font-display text-[36px] font-semibold leading-none text-ink-on-dark text-glow-white">Prayer</h1>
        </div>
      </div>

      <div className="relative px-5 pt-5">
        {!isToday && (
          <div className="mb-3 flex items-center justify-between">
            <div className="font-display text-[14px] text-ink-soft">{dateLabel}</div>
            <button onClick={() => setSelectedDate(todayISO())} className="glass-gold press rounded-pill px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-champagne">Back to today</button>
          </div>
        )}

        <div className="mb-5 -mx-5 overflow-x-auto px-5 no-scrollbar">
          <div className="flex gap-2">
            {strip.map((d) => {
              const iso = isoFor(d);
              const active = iso === selectedDate;
              const progress = dayProgress[iso] || 0;
              const isTod = iso === todayISO();
              return (
                <button key={iso} onClick={() => setSelectedDate(iso)} className={'glass-dark press relative flex h-[68px] w-[52px] flex-shrink-0 flex-col items-center justify-center gap-0.5 rounded-[16px] transition ' + (active ? '!border-champagne/60' : '')} style={active ? { background: 'linear-gradient(160deg, rgba(214,180,106,0.25) 0%, rgba(6,46,42,0.85) 100%)' } : undefined}>
                  <div className={'text-[9px] font-bold uppercase tracking-[0.14em] ' + (active ? 'text-champagne' : 'text-ink-faint')}>{d.toLocaleDateString(undefined, { weekday: 'short' })}</div>
                  <div className="font-display text-[18px] font-semibold leading-none text-ink-on-dark">{d.getDate()}</div>
                  <div className="flex gap-0.5">{[0, 1, 2, 3, 4].map((i) => (<span key={i} className={'h-1 w-1 rounded-full ' + (i < progress ? 'bg-champagne' : 'bg-ink-faint/30')} />))}</div>
                  {isTod && <span className={'absolute -bottom-0.5 h-0.5 w-6 rounded-full ' + (active ? 'bg-champagne' : 'bg-muted-green')} />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative mb-5">
          <AmbientGlow color="gold" size={260} style={{ top: -40, right: -80, opacity: 0.4 }} />
          <GlassCard variant="dark-strong" padding="p-5">
            <div className="flex items-center justify-between">
              <div className="kicker kicker-gold">{isToday ? "Today's progress" : 'Progress'}</div>
              <div className="rounded-pill bg-champagne/15 px-3 py-1 text-[10px] font-bold tracking-wide text-champagne">Fard</div>
            </div>
            <div className="mt-3 flex items-end gap-2">
              <div className="font-display text-[44px] font-semibold leading-none text-ink-on-dark text-glow-white">{fardsDone}</div>
              <div className="pb-2 font-display text-[16px] font-medium text-ink-faint">/ 5</div>
              {fardsDone === 5 && <div className="ml-auto mb-2 rounded-pill bg-champagne/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-champagne">✓ Complete</div>}
            </div>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-ink-faint/15">
              <div className="h-full rounded-full bg-gradient-to-r from-champagne to-gold transition-all" style={{ width: `${(fardsDone / 5) * 100}%` }} />
            </div>
          </GlassCard>
        </div>

        <div className="mb-4 text-[12px] text-ink-faint">Tap a prayer to expand — then check each part.</div>

        {!times ? (
          <GlassCard padding="p-8"><div className="text-center text-[13px] text-ink-faint">{isToday ? 'Awaiting prayer times…' : 'Loading…'}</div></GlassCard>
        ) : (
          <div className="space-y-3">
            {list.map((p) => {
              const isExp = expanded === p.key;
              const cnt = countChecked(p.key);
              const all = cnt === COMPONENTS.length;
              const isNext = p.key === nextKey;
              const img = prayerImage(p.key === 'jummah' ? 'zuhr' : p.key);
              return (
                <GlassCard key={p.key} variant={all ? 'gold' : 'dark'} padding="p-0" className={isNext && !all ? '!border-champagne/50' : ''}>
                  <div className="relative overflow-hidden rounded-[22px]">
                    <div className="pointer-events-none absolute inset-0">
                      <img
                        src={img}
                        alt=""
                        className="absolute right-0 top-0 h-full w-[60%] object-cover"
                        style={{
                          maskImage: 'linear-gradient(90deg, transparent 0%, black 60%)',
                          WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 60%)',
                          opacity: 0.75,
                        }}
                      />
                    </div>

                    <button onClick={() => setExpanded(isExp ? null : p.key)} className="relative flex w-full items-center gap-3 p-4 text-left">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <div className={'font-display text-[18px] font-semibold ' + (all ? 'text-champagne' : 'text-ink-on-dark')}>{p.name}</div>
                          {isNext && !all && (
                            <span className="rounded-pill bg-champagne px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-midnight">Next</span>
                          )}
                        </div>
                        <div className="mt-0.5 font-arabic text-[12.5px] text-ink-faint">{p.arabic}</div>
                        <div className="mt-3 flex items-baseline gap-3">
  <span className="font-display text-[24px] font-semibold text-champagne">
    {formatTime12(p.jamaat)}
  </span>
  <span className="text-[10.5px] text-ink-faint">
    Azān {formatTime12(p.azaan)}
  </span>
</div>
                      </div>
                      <div className="ml-2 flex flex-col items-center gap-0.5">
                        <div className={'rounded-pill px-2 py-0.5 text-[9px] font-bold tracking-wide ' + (all ? 'bg-midnight text-champagne' : 'bg-champagne/15 text-champagne')}>{cnt}/4</div>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className={'text-ink-faint transition-transform ' + (isExp ? 'rotate-180' : '')}><polyline points="6 9 12 15 18 9" /></svg>
                      </div>
                    </button>

                    {isExp && (
                      <div className="relative border-t border-line-dark px-4 pb-4 pt-3">
                        <div className="flex gap-2">
                          {COMPONENTS.map((c) => {
                            const on = checked[`${p.key}_${c}`] === true;
                            return (
                              <button key={c} onClick={() => toggle(p.key, c)} className="flex flex-1 flex-col items-center gap-1.5">
                                <div className={'flex h-12 w-12 items-center justify-center rounded-full transition ' + (on ? '' : 'border border-champagne/30')} style={on ? { background: 'linear-gradient(160deg, #E5B437 0%, #C9A227 55%, #8A6B15 100%)', boxShadow: '0 6px 14px -4px rgba(201,162,39,0.55), 0 0 20px rgba(201,162,39,0.35)' } : { background: 'rgba(245,240,230,0.04)' }}>
                                  {on ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#031A18" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> : <span className="text-[10px] font-bold tracking-wide text-champagne">+{POINTS[c]}</span>}
                                </div>
                                <span className={'text-[9px] font-bold uppercase tracking-[0.14em] ' + (on ? 'text-champagne' : 'text-ink-faint')}>{c}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}

        <div className="mt-6"><OrnamentDivider /><div className="mt-4 text-center text-[11px] text-ink-faint">Fard +5 · Jamaat +3 · Sunnat +2 · Dua +1 · All-five bonus +10</div></div>
      </div>
    </div>
  );
}