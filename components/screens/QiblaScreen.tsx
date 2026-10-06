'use client';

import { useEffect, useState } from 'react';
import { QIBLA_BG } from '@/lib/images';
import Overlay from './Overlay';
import { Star8 } from '@/components/ui/GoldOrnament';
import GlassCard from '@/components/ui/GlassCard';

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

const toRad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

function qiblaBearing(lat: number, lng: number): number {
  const φ1 = toRad(lat);
  const φ2 = toRad(KAABA_LAT);
  const Δλ = toRad(KAABA_LNG - lng);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

function haversine(lat1: number, lng1: number): number {
  const R = 6371;
  const φ1 = toRad(lat1);
  const φ2 = toRad(KAABA_LAT);
  const Δφ = toRad(KAABA_LAT - lat1);
  const Δλ = toRad(KAABA_LNG - lng1);
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(a)));
}

export default function QiblaScreen() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState('');
  const [heading, setHeading] = useState<number | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) { setError('Location not supported'); return; }
    navigator.geolocation.getCurrentPosition(
      (p) => setCoords({ lat: p.coords.latitude, lng: p.coords.longitude }),
      (e) => setError(e.message || 'Location permission denied'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    const h = (e: any) => {
      const v = e.webkitCompassHeading ?? e.alpha;
      if (v != null) setHeading(v);
    };
    window.addEventListener('deviceorientationabsolute' as any, h, true);
    window.addEventListener('deviceorientation', h, true);
    return () => {
      window.removeEventListener('deviceorientationabsolute' as any, h, true);
      window.removeEventListener('deviceorientation', h, true);
    };
  }, []);

  const qibla = coords ? qiblaBearing(coords.lat, coords.lng) : null;
  const distance = coords ? haversine(coords.lat, coords.lng) : null;
  const rotation = heading != null && qibla != null ? qibla - heading : qibla ?? 0;

  return (
  <Overlay title="Qibla">
    {/* Full-bleed background */}
    <div className="pointer-events-none fixed inset-0 -z-10">
      <img src={QIBLA_BG} alt="" className="h-full w-full object-cover opacity-30" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 40%, transparent 0%, rgba(3,26,24,0.85) 70%)' }} />
    </div>

    {error && (
      <GlassCard variant="dark" padding="p-4">
        <div className="text-center text-[12.5px] font-medium text-error">{error}</div>
      </GlassCard>
    )}

    {!coords && !error && (
      <div className="py-24 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full glass-gold animate-pulse">
          <Star8 size={20} />
        </div>
        <div className="mt-4 text-[13px] text-ink-faint">Finding your location…</div>
      </div>
    )}

    {coords && (
        <>
          <div className="relative mx-auto mb-8" style={{ width: 300, height: 300 }}>
            <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(214,180,106,0.18) 0%, transparent 65%)' }} />

            <div
              className="absolute inset-4 rounded-full"
              style={{
                background: 'linear-gradient(160deg, #0E5449 0%, #0A4139 45%, #031A18 100%)',
                border: '1px solid rgba(214,180,106,0.25)',
                boxShadow: '0 1px 0 rgba(255,255,255,0.06) inset, 0 -4px 12px rgba(0,0,0,0.5) inset, 0 30px 60px -20px rgba(0,0,0,0.7), 0 10px 30px -10px rgba(0,0,0,0.4)',
                transform: `rotate(${-1 * (heading ?? 0)}deg)`,
                transition: 'transform 200ms ease-out',
              }}
            >
              {Array.from({ length: 72 }).map((_, i) => {
                const big = i % 9 === 0;
                return (
                  <div key={i} className="absolute left-1/2 top-0 origin-bottom" style={{ height: 132, transform: `translateX(-50%) rotate(${i * 5}deg)` }}>
                    <div className="mx-auto w-px" style={{ height: big ? 14 : 6, background: big ? 'rgba(214,180,106,0.85)' : 'rgba(245,240,230,0.28)' }} />
                  </div>
                );
              })}
              <span className="absolute left-1/2 top-5 -translate-x-1/2 font-display text-[14px] font-bold text-champagne">N</span>
              <span className="absolute right-5 top-1/2 -translate-y-1/2 font-display text-[12px] font-bold text-ink-faint">E</span>
              <span className="absolute bottom-5 left-1/2 -translate-x-1/2 font-display text-[12px] font-bold text-ink-faint">S</span>
              <span className="absolute left-5 top-1/2 -translate-y-1/2 font-display text-[12px] font-bold text-ink-faint">W</span>
            </div>

            <div className="absolute inset-4 flex items-start justify-center" style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 300ms cubic-bezier(0.23, 1, 0.32, 1)' }}>
              <div className="mt-4 flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{
                  background: 'linear-gradient(180deg, #E5B437 0%, #C9A227 55%, #8A6B15 100%)',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.4) inset, 0 -3px 8px rgba(0,0,0,0.35) inset, 0 12px 24px -6px rgba(201,162,39,0.6), 0 0 30px rgba(201,162,39,0.45)',
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#031A18">
                    <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
                  </svg>
                </div>
                <div className="mt-1 w-1 rounded-b-full" style={{ height: 100, background: 'linear-gradient(180deg, rgba(214,180,106,0.9), rgba(214,180,106,0))' }} />
              </div>
            </div>

            <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: 'linear-gradient(180deg, #E5B437, #8A6B15)', boxShadow: '0 0 12px rgba(201,162,39,0.6)' }} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <GlassCard variant="dark" padding="p-5" className="text-center">
              <div className="font-display text-[30px] font-semibold leading-none text-champagne">{qibla?.toFixed(1)}°</div>
              <div className="mt-2 kicker kicker-gold">Qibla bearing</div>
            </GlassCard>
            <GlassCard variant="dark" padding="p-5" className="text-center">
              <div className="font-display text-[30px] font-semibold leading-none text-champagne">
                {distance}<span className="ml-1 text-[14px] font-normal text-ink-faint">km</span>
              </div>
              <div className="mt-2 kicker kicker-gold">To Makkah</div>
            </GlassCard>
          </div>

          {heading == null && (
            <GlassCard variant="gold" padding="p-4" className="mt-4">
              <div className="text-center text-[12px] leading-[1.55] text-ink-soft">
                <b className="text-champagne">Note:</b> The needle points toward Qibla. On desktop, rotate the number from North to find the direction.
              </div>
            </GlassCard>
          )}
        </>
      )}
    </Overlay>
  );
}