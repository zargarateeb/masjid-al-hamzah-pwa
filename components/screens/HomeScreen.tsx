'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import { formatDateShort, todayISO, timeToMinutes, formatTime12 } from '@/lib/utils';
import { PRAYER_NAMES, PRAYER_ARABIC, PRAYERS, PrayerKey, PRAYER_OFFSETS } from '@/lib/constants';
import { useAppStore } from '@/lib/store';
import { HOME_BACKGROUND, MASJID_LOGO, prayerImage } from '@/lib/images';
import GlassCard from '@/components/ui/GlassCard';
import AmbientGlow from '@/components/ui/AmbientGlow';
import { Star8, OrnamentDivider } from '@/components/ui/GoldOrnament';

const QUOTES = [
  { arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا', english: 'Verily, with hardship comes ease.', ref: "Qur'an 94:6" },
  { arabic: 'وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ', english: 'Seek help through patience and prayer.', ref: "Qur'an 2:45" },
  { arabic: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ', english: 'Indeed, Allah is with the patient.', ref: "Qur'an 2:153" },
];

function pad(n: number) { return String(n).padStart(2, '0'); }
function fmtCountdown(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return `${pad(h)}:${pad(m)}:${pad(ss)}`;
}
function subtract(t: string, min: number) {
  if (!t || !t.includes(':')) return t;
  const [h, m] = t.split(':').map(Number);
  let tot = h * 60 + m - min;
  tot = ((tot % 1440) + 1440) % 1440;
  return `${pad(Math.floor(tot / 60))}:${pad(tot % 60)}`;
}

const ICONS: Record<string, string> = {
  fajr: 'M12 3v3M5 8l2 2M19 8l-2 2M2 14h20M4 18h16',
  zuhr: 'M12 2v2M12 20v2M4 12H2M22 12h-2',
  asr: 'M17 18a5 5 0 0 0-10 0M12 9V2',
  maghrib: 'M17 18a5 5 0 0 0-10 0M12 9V2M23 22H1',
  isha: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
};

export default function HomeScreen() {
  const { data: session } = useSession();
  const pushScreen = useAppStore((s) => s.pushScreen);
  const setTab = useAppStore((s) => s.setTab);
  const [times, setTimes] = useState<any>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [, setTick] = useState(0);

  const userId = (session?.user as any)?.id || '';
  const fullName = session?.user?.name || 'Guest';
  const parts = fullName.split(' ');
  const name = parts[0].length > 3 ? parts[0] : fullName;

  useEffect(() => {
    fetch(`/api/prayer-times?date=${todayISO()}`).then((r) => r.json()).then((d) => setTimes(d?.time || null)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/tracking?userId=${userId}&date=${todayISO()}`).then((r) => r.json()).then((d) => setChecked(d?.checked || {})).catch(() => {});
  }, [userId]);

  useEffect(() => { const t = setInterval(() => setTick((n) => n + 1), 1000); return () => clearInterval(t); }, []);
  useEffect(() => { const q = setInterval(() => setQuoteIdx((i) => (i + 1) % QUOTES.length), 20000); return () => clearInterval(q); }, []);

  const quote = QUOTES[quoteIdx];

  const next = useMemo(() => {
    if (!times) return null;
    const now = new Date();
    const cur = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    const fri = now.getDay() === 5;
    const list: { key: string; jamaat: string; azaan: string }[] = [];
    for (const p of PRAYERS) {
      if (p === 'zuhr' && fri) continue;
      const jamaat = times[p] || '';
      if (!jamaat) continue;
      const offset = PRAYER_OFFSETS[p as keyof typeof PRAYER_OFFSETS];
      list.push({ key: p, jamaat, azaan: subtract(jamaat, offset) });
    }
    if (fri && times.jummah) {
      const offset = PRAYER_OFFSETS.jummah || 15;
      list.splice(1, 0, { key: 'jummah', jamaat: times.jummah, azaan: subtract(times.jummah, offset) });
    }
    for (const p of list) {
      const m = timeToMinutes(p.jamaat);
      if (m !== null && m > cur) {
        return { key: p.key, name: PRAYER_NAMES[p.key as PrayerKey] || p.key, arabic: PRAYER_ARABIC[p.key as PrayerKey] || '', time: formatTime12(p.jamaat), countdown: fmtCountdown(Math.round((m - cur) * 60)), azaan: formatTime12(p.azaan) };
      }
    }
    const f = list[0];
    const m = timeToMinutes(f.jamaat);
    if (m !== null) return { key: f.key, name: PRAYER_NAMES[f.key as PrayerKey] || f.key, arabic: PRAYER_ARABIC[f.key as PrayerKey] || '', time: formatTime12(f.jamaat), countdown: fmtCountdown(Math.round((1440 - cur + m) * 60)), azaan: formatTime12(f.azaan) };
    return null;
  }, [times]);

  const prayerList = useMemo(() => {
    if (!times) return [];
    const fri = new Date().getDay() === 5;
    const out: { key: string; name: string; jamaat: string }[] = [];
    for (const p of PRAYERS) {
      if (p === 'zuhr' && fri) continue;
      if (!times[p]) continue;
      out.push({ key: p, name: PRAYER_NAMES[p] || p, jamaat: formatTime12(times[p]) });
    }
    return out;
  }, [times]);

  return (
    <div className="relative min-h-dvh pb-32">
      <div className="relative">
        <div className="relative h-[300px] overflow-hidden">
          <img src={HOME_BACKGROUND} alt="Masjid Al-Hamzah" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(3,26,24,0.35) 0%, rgba(3,26,24,0.55) 55%, rgba(3,26,24,1) 100%)' }} />
        </div>

        <div className="absolute left-0 right-0 top-0 flex items-start justify-between p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl" style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(214,180,106,0.35)', backdropFilter: 'blur(12px)' }}>
              <img src={MASJID_LOGO} alt="Masjid Al-Hamzah" className="h-full w-full object-contain" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-champagne">Masjid Al-Hamzah</div>
              <div className="text-[11px] text-ink-faint">Buchpora, Srinagar</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => pushScreen('announcements')} className="glass-dark press relative flex h-11 w-11 items-center justify-center rounded-full">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-on-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-champagne animate-soft-pulse" />
            </button>
            <button onClick={() => pushScreen('profile')} className="glass-dark press flex h-11 w-11 items-center justify-center rounded-full">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-on-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="text-[23px] text-ink-soft">السَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللهِ</div>
          <div className="font-display text-[32px] font-semibold leading-tight text-ink-on-dark text-glow-white">{name}</div>
          <div className="mt-1 text-[11.5px] text-ink-faint">{formatDateShort(new Date())}</div>
        </div>
      </div>

      <div className="relative px-5 pt-5">
        {next && (
          <div className="relative">
            <AmbientGlow color="gold" size={280} style={{ top: -40, right: -100, opacity: 0.5 }} />
            <div className="glass-dark-strong animate-lift-in relative overflow-hidden rounded-[22px]">
              <div className="pointer-events-none absolute inset-0">
                <img
                  src={prayerImage(next.key === 'jummah' ? 'zuhr' : next.key)}
                  alt=""
                  className="absolute right-0 top-0 h-full w-[65%] object-cover"
                  style={{
                    maskImage: 'linear-gradient(90deg, transparent 0%, black 55%)',
                    WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 55%)',
                    opacity: 0.7,
                  }}
                />
              </div>

              <div className="relative p-6">
                <div className="flex items-start justify-between">
                  <div className="kicker kicker-gold">Next Jamaat</div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-champagne animate-soft-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-champagne">Live</span>
                  </div>
                </div>
                <div className="mt-4 flex items-end justify-between gap-4">
                  <div>
                    <div className="font-display text-[40px] font-semibold leading-none text-ink-on-dark text-glow-white">{next.name}</div>
                    <div className="mt-1 font-arabic text-[16px] text-champagne">{next.arabic}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-[26px] font-semibold leading-none text-ink-on-dark">{next.time}</div>
                    <div className="mt-1 text-[10px] text-ink-faint">Azān {next.azaan}</div>
                  </div>
                </div>
                <div className="mt-5"><OrnamentDivider /></div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-faint">Time Remaining</div>
                    <div className="mt-1 font-display text-[28px] font-semibold tabular-nums leading-none text-champagne text-glow-gold">{next.countdown}</div>
                  </div>
                  <button onClick={() => setTab('prayer')} className="press flex h-12 w-12 items-center justify-center rounded-full" style={{ background: 'linear-gradient(160deg, #E5B437 0%, #C9A227 55%, #8A6B15 100%)', boxShadow: '0 1px 0 rgba(255,255,255,0.35) inset, 0 -2px 6px rgba(0,0,0,0.35) inset, 0 10px 20px -6px rgba(201,162,39,0.55)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#031A18" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-4 gap-2.5">
          {[
            { key: 'prayer', label: 'Prayers', action: () => setTab('prayer') },
            { key: 'tasbeeh', label: 'Tasbeeh', action: () => setTab('tasbeeh') },
            { key: 'qibla', label: 'Qibla', action: () => pushScreen('qibla') },
            { key: 'events', label: 'Events', action: () => pushScreen('announcements') },
          ].map((a) => (
            <button key={a.key} onClick={a.action} className="glass-dark press flex flex-col items-center gap-2 rounded-[18px] py-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(160deg, rgba(214,180,106,0.20) 0%, rgba(184,149,80,0.08) 100%)', border: '1px solid rgba(214,180,106,0.24)' }}>
                {a.key === 'prayer' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-champagne)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21V11a8 8 0 0 1 16 0v10" /><path d="M4 21h16M12 3v3" /></svg>}
                {a.key === 'tasbeeh' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-champagne)" strokeWidth="2"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" /></svg>}
                {a.key === 'qibla' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-champagne)" strokeWidth="2"><circle cx="12" cy="12" r="9" /><polygon points="12 4 15 12 12 20 9 12" /></svg>}
                {a.key === 'events' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-champagne)" strokeWidth="2"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></svg>}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-soft">{a.label}</span>
            </button>
          ))}
        </div>

        {userId && prayerList.length > 0 && (
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <div className="kicker kicker-gold">Today&apos;s Worship</div>
              <button onClick={() => setTab('prayer')} className="text-[10px] font-bold uppercase tracking-[0.16em] text-champagne">Track →</button>
            </div>
            <GlassCard padding="p-4">
              <div className="space-y-1">
                {prayerList.map((p) => (
                  <div key={p.key} className="flex items-center justify-between gap-3 border-b border-line-dark py-2.5 last:border-0">
                    <div className="flex min-w-0 flex-1 items-center gap-2.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><path d={ICONS[p.key] || ICONS.fajr} /></svg>
                      <div className="min-w-0">
                        <div className="font-display text-[14.5px] font-semibold text-ink-on-dark">{p.name}</div>
                        <div className="text-[10.5px] text-ink-faint">{p.jamaat}</div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {['sunnat', 'fard', 'jamaat', 'dua'].map((c) => {
                        const on = checked[`${p.key}_${c}`];
                        return (
                          <div key={c} className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: on ? 'linear-gradient(160deg, #2E7A56 0%, #1B5E3F 100%)' : 'rgba(245,240,230,0.08)', border: on ? '1px solid rgba(214,180,106,0.5)' : '1px solid rgba(245,240,230,0.12)', boxShadow: on ? '0 0 12px rgba(46,122,86,0.5)' : 'none' }}>
                            {on && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        <div className="mt-6">
          <div className="mb-3 kicker kicker-gold">Daily Reminder</div>
          <div className="relative">
            <AmbientGlow color="emerald" size={240} style={{ top: -60, left: -80, opacity: 0.4 }} />
            <GlassCard variant="gold" padding="p-6">
              <div className="text-center">
                <div className="font-arabic text-[26px] leading-[1.8] text-champagne text-glow-gold">{quote.arabic}</div>
                <div className="mt-4"><OrnamentDivider width="120px" className="mx-auto" /></div>
                <div className="mt-3 text-[13.5px] italic leading-[1.6] text-ink-soft">&ldquo;{quote.english}&rdquo;</div>
                <div className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-champagne">— {quote.ref}</div>
              </div>
            </GlassCard>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="kicker kicker-gold">Masjid Updates</div>
            <button onClick={() => pushScreen('announcements')} className="text-[10px] font-bold uppercase tracking-[0.16em] text-champagne">View all →</button>
          </div>
          <button onClick={() => pushScreen('announcements')} className="glass-dark press w-full rounded-[20px] p-4 text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full" style={{ background: 'linear-gradient(160deg, rgba(214,180,106,0.30) 0%, rgba(184,149,80,0.14) 100%)', border: '1px solid rgba(214,180,106,0.40)', boxShadow: '0 0 20px rgba(214,180,106,0.35)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-champagne)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11v2a1 1 0 0 0 1 1h2l4 4V6L6 10H4a1 1 0 0 0-1 1z" /><path d="M16 8a5 5 0 0 1 0 8" /></svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-display text-[15px] font-semibold text-ink-on-dark">Latest from the Masjid</div>
                <div className="mt-0.5 truncate text-[11.5px] text-ink-faint">Tap to read announcements</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-champagne)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><polyline points="9 18 15 12 9 6" /></svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}