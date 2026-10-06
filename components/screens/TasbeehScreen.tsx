'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { todayISO } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { TASBEEH_BG } from '@/lib/images';
import AmbientGlow from '@/components/ui/AmbientGlow';

const PRESETS = [
  { key: 'subhanallah', label: 'SubhanAllah', arabic: 'سُبْحَانَ اللَّهِ', target: 33, color: '#1B5E3F' },
  { key: 'alhamdulillah', label: 'Alhamdulillah', arabic: 'الْحَمْدُ لِلَّهِ', target: 33, color: '#0F3D28' },
  { key: 'allahuakbar', label: 'Allahu Akbar', arabic: 'اللَّهُ أَكْبَر', target: 34, color: '#B87333' },
  { key: 'lailaha', label: 'La ilaha illallah', arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ', target: 100, color: '#1A3E5C' },
  { key: 'astaghfirullah', label: 'Astaghfirullah', arabic: 'أَسْتَغْفِرُ اللَّهَ', target: 100, color: '#3A5A8C' },
  { key: 'salawat', label: 'Salawat', arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّد', target: 100, color: '#7C3AED' },
  { key: 'lahawla', label: 'La hawla wa la quwwata', arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', target: 100, color: '#8B6E3A' },
  { key: 'subhanallah-wa-bihamdihi', label: 'SubhanAllahi wa bihamdihi', arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', target: 100, color: '#2E8B57' },
  { key: 'subhanallahil-azeem', label: 'SubhanAllahil Azeem', arabic: 'سُبْحَانَ اللَّهِ الْعَظِيمِ', target: 100, color: '#0F3D28' },
  { key: 'hasbunallah', label: "HasbunAllah wa ni'mal wakeel", arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', target: 100, color: '#8A5C3A' },
  { key: 'rabbana-atina', label: 'Rabbana atina fid-dunya', arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً', target: 100, color: '#1B5E3F' },
  { key: 'ya-hayyu', label: 'Ya Hayyu Ya Qayyum', arabic: 'يَا حَيُّ يَا قَيُّومُ', target: 100, color: '#0F3D28' },
] as const;

type PresetKey = typeof PRESETS[number]['key'];

export default function TasbeehScreen() {
  const { data: session } = useSession();
  const pushScreen = useAppStore((s) => s.pushScreen);
  const [preset, setPreset] = useState<PresetKey>('subhanallah');
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [pressAnim, setPressAnim] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [completed, setCompleted] = useState(false);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  const userId = (session?.user as any)?.id || '';
  const currentPreset = PRESETS.find((p) => p.key === preset)!;
  const currentCount = counts[preset] || 0;
  const target = currentPreset.target;

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/tasbeeh?userId=${userId}&date=${todayISO()}`).then((r) => r.json()).then((d) => setCounts(d?.counts || {})).catch(() => {});
  }, [userId]);

  const scheduleSave = useCallback((newCounts: Record<string, number>) => {
    if (!userId) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      fetch('/api/tasbeeh', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, date: todayISO(), counts: newCounts }) }).catch(() => {});
    }, 800);
  }, [userId]);

  function tap(e: React.MouseEvent | React.TouchEvent) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) { try { navigator.vibrate(15); } catch {} }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const id = Date.now() + Math.random();
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 700);
    setPressAnim(true);
    setTimeout(() => setPressAnim(false), 120);
    const next = currentCount + 1;
    const newCounts = { ...counts, [preset]: next };
    setCounts(newCounts);
    if (next === target) {
      setCompleted(true);
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) { try { navigator.vibrate([30, 50, 30]); } catch {} }
      setTimeout(() => setCompleted(false), 2000);
    }
    scheduleSave(newCounts);
  }

  function reset() {
    const newCounts = { ...counts, [preset]: 0 };
    setCounts(newCounts);
    scheduleSave(newCounts);
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) { try { navigator.vibrate(20); } catch {} }
  }

  const totalToday = Object.values(counts).reduce((a, b) => a + b, 0);
  const pointsToday = Object.values(counts).reduce((a, b) => a + Math.floor(b / 33), 0);

  return (
    <div className="relative min-h-dvh px-5 pt-6 pb-36">
      <div className="pointer-events-none fixed inset-0 -z-10 mx-auto max-w-[480px]">
        <img src={TASBEEH_BG} alt="" className="h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 40%, transparent 0%, rgba(3,26,24,0.92) 70%)' }} />
      </div>

      <AmbientGlow color="emerald" size={400} style={{ top: -120, left: -80, opacity: 0.45 }} />
      <AmbientGlow color="gold" size={320} style={{ bottom: 100, right: -120, opacity: 0.35 }} />

      <div className="relative mb-5">
        <div className="kicker kicker-gold">Dhikr</div>
        <h1 className="mt-1 font-display text-[36px] font-semibold leading-none text-ink-on-dark">Tasbeeh</h1>
      </div>

      <div className="relative mb-6 grid grid-cols-3 gap-2">
        <div className="glass-dark rounded-[18px] p-3 text-center">
          <div className="font-display text-[20px] font-semibold text-champagne">{totalToday}</div>
          <div className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-ink-faint">Today</div>
        </div>
        <div className="glass-dark rounded-[18px] p-3 text-center">
          <div className="font-display text-[20px] font-semibold text-champagne">{currentCount}</div>
          <div className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-ink-faint">Current</div>
        </div>
        <div className="glass-dark rounded-[18px] p-3 text-center">
          <div className="font-display text-[20px] font-semibold text-champagne">+{pointsToday}</div>
          <div className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-ink-faint">Points</div>
        </div>
      </div>

      <div className="relative mb-6 flex justify-center">
        <div className="relative" style={{ perspective: '800px' }}>
          <div className="relative transition-transform" style={{ transform: pressAnim ? 'translateZ(-40px) scale(0.96)' : 'translateZ(0) scale(1)', transitionDuration: '120ms', transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)', filter: pressAnim ? 'drop-shadow(0 4px 10px rgba(0,0,0,0.45))' : 'drop-shadow(0 20px 30px rgba(0,0,0,0.55))' }}>
            <BeadRing count={currentCount} target={target} color={currentPreset.color} />
          </div>

          <button onMouseDown={tap} onTouchStart={tap} className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-full" aria-label="Tap to count">
            {ripples.map((r) => (
              <span key={r.id} className="pointer-events-none absolute rounded-full" style={{ left: r.x, top: r.y, width: 20, height: 20, marginLeft: -10, marginTop: -10, background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)', animation: 'ripple 700ms ease-out forwards' }} />
            ))}
            <div className="font-display text-[72px] font-semibold leading-none text-white transition-transform" style={{ transform: pressAnim ? 'scale(0.92)' : 'scale(1)', transitionDuration: '120ms', textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>{currentCount}</div>
            <div className="mt-2 text-[11px] font-bold uppercase tracking-[0.24em] text-white/70">of {target}</div>
            <div className="absolute bottom-14 font-arabic text-[22px] text-white/90">{currentPreset.arabic}</div>
          </button>

          {completed && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="rounded-full bg-white/20 px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur" style={{ animation: 'fadeUp 600ms ease-out forwards', boxShadow: '0 10px 30px rgba(255,255,255,0.3)' }}>✦ Complete</div>
            </div>
          )}
        </div>
      </div>

      <div className="relative mb-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {PRESETS.map((p) => {
          const active = p.key === preset;
          const c = counts[p.key] || 0;
          return (
            <button key={p.key} onClick={() => setPreset(p.key)} className={'glass-dark press relative overflow-hidden rounded-[16px] px-3 py-3 text-left transition ' + (active ? '!border-champagne/60' : '')} style={active ? { background: 'linear-gradient(160deg, rgba(214,180,106,0.25) 0%, rgba(6,46,42,0.9) 100%)' } : undefined}>
              <div className="font-display text-[12.5px] font-semibold leading-[1.15] text-ink-on-dark">{p.label}</div>
              <div className={'mt-1 text-[10px] font-bold uppercase tracking-[0.14em] ' + (active ? 'text-champagne' : 'text-ink-faint')}>{c} / {p.target}</div>
            </button>
          );
        })}
      </div>

      <button onClick={reset} className="glass-dark press w-full rounded-pill py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-soft">Reset {currentPreset.label}</button>

      <style jsx>{`
        @keyframes ripple { from { opacity: 1; transform: scale(0); } to { opacity: 0; transform: scale(14); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  );
}

function BeadRing({ count, target, color }: { count: number; target: number; color: string }) {
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.42;
  const beads = Math.min(target, 60);
  const lit = Math.round((count / target) * beads);
  const beadsArr = [];
  for (let i = 0; i < beads; i++) {
    const angle = -Math.PI / 2 + (i / beads) * Math.PI * 2;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    const isLit = i < lit;
    beadsArr.push(<circle key={i} cx={x} cy={y} r={isLit ? 6.5 : 5} fill={isLit ? color : 'rgba(255,255,255,0.15)'} stroke={isLit ? color : 'rgba(255,255,255,0.25)'} strokeWidth={1.5} style={{ filter: isLit ? 'drop-shadow(0 0 6px rgba(255,255,255,0.6))' : 'none', transition: 'all 200ms ease-out' }} />);
  }
  return (
    <div className="relative flex items-center justify-center rounded-full" style={{ width: size, height: size, background: `radial-gradient(circle at 30% 25%, ${lighten(color, 30)} 0%, ${color} 55%, ${darken(color, 30)} 100%)`, boxShadow: 'inset 0 -8px 20px rgba(0,0,0,0.25), inset 0 8px 20px rgba(255,255,255,0.15)' }}>
      <svg width={size} height={size} className="absolute inset-0 pointer-events-none"><circle cx={cx} cy={cy} r={radius} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth={1.5} /></svg>
      <svg width={size} height={size} className="absolute inset-0 pointer-events-none">{beadsArr}</svg>
      <div className="pointer-events-none absolute rounded-full" style={{ width: size * 0.65, height: size * 0.65, background: 'radial-gradient(circle at 40% 30%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 60%)' }} />
    </div>
  );
}

function lighten(hex: string, amt: number) { return shade(hex, amt); }
function darken(hex: string, amt: number) { return shade(hex, -amt); }
function shade(hex: string, amt: number) {
  const h = hex.replace('#', '');
  const r = Math.min(255, Math.max(0, parseInt(h.slice(0, 2), 16) + amt));
  const g = Math.min(255, Math.max(0, parseInt(h.slice(2, 4), 16) + amt));
  const b = Math.min(255, Math.max(0, parseInt(h.slice(4, 6), 16) + amt));
  return `rgb(${r}, ${g}, ${b})`;
}