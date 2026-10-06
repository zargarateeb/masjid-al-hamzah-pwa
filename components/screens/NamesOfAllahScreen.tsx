'use client';

import { useEffect, useRef, useState } from 'react';
import Overlay from './Overlay';
import { NAMES_OF_ALLAH } from '@/lib/data/namesOfAllah';
import { Star8, CornerFlourish, OrnamentDivider, GeometryBg } from '@/components/ui/GoldOrnament';
import Tilt3D from '@/components/ui/Tilt3D';

export default function NamesOfAllahScreen() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState<'next' | 'prev'>('next');
  const [animKey, setAnimKey] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const n = NAMES_OF_ALLAH[i];
  const total = NAMES_OF_ALLAH.length;

  const go = (delta: number) => {
    setDir(delta > 0 ? 'next' : 'prev');
    setI((v) => (v + delta + total) % total);
    setAnimKey((k) => k + 1);
  };

  const random = () => {
    setI(Math.floor(Math.random() * total));
    setAnimKey((k) => k + 1);
  };

  // Keyboard nav
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  });

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    touchStartX.current = null;
  };

  return (
    <Overlay title="Asmā ul-Husnā">
      {/* Progress header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-[26px] font-semibold leading-none text-navy">
            {i + 1}
          </span>
          <span className="text-[12px] text-inkFaint">/ {total}</span>
        </div>
        <button
          onClick={random}
          className="pill-3d rounded-pill px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-navy"
        >
          ✦ Surprise me
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-5 h-1 w-full overflow-hidden rounded-full bg-line">
        <div
          className="h-full bg-gradient-to-r from-[#C9A227] to-[#1B5E3F] transition-all duration-300"
          style={{ width: `${((i + 1) / total) * 100}%` }}
        />
      </div>

      {/* Card */}
      <div
        key={animKey}
        className="animate-lift-in"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Tilt3D intensity={6}>
          <div
  className="arch-shape relative overflow-hidden"
  style={{
    background: 'linear-gradient(160deg, #0E5449 0%, #0A4139 45%, #062E2A 100%)',
    border: '1px solid rgba(214,180,106,0.22)',
    boxShadow: '0 1px 0 rgba(255,255,255,0.06) inset, 0 -2px 8px rgba(0,0,0,0.4) inset, 0 30px 60px -20px rgba(0,0,0,0.65)',
  }}
>
            {/* Geometric pattern bg */}
            <GeometryBg color="#C9A227" opacity={0.07} />

            {/* Corner ornaments */}
            <CornerFlourish className="ornament-corner left-3 top-3" size={36} />
            <CornerFlourish className="ornament-corner right-3 top-3 -scale-x-100" size={36} />
            <CornerFlourish className="ornament-corner left-3 bottom-3 -scale-y-100" size={36} />
            <CornerFlourish className="ornament-corner right-3 bottom-3 -scale-100" size={36} />

            {/* Giant faded number in background */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-bold leading-none"
              style={{
                fontSize: 280,
                color: 'rgba(201,162,39,0.05)',
                fontWeight: 700,
              }}
            >
              {n.id}
            </div>

            {/* Content */}
            <div className="relative px-8 py-14 text-center">
              {/* Star ornament */}
              <div className="mb-6 flex justify-center">
                <Star8 size={20} color="#C9A227" className="animate-soft-pulse" />
              </div>

              {/* Arabic */}
              <div
                dir="rtl"
                className="font-arabic text-white text-glow-gold leading-none"
                style={{
                  fontSize: 68,
                  fontWeight: 400,
                  letterSpacing: '-0.01em',
                }}
              >
                {n.arabic}
              </div>

              {/* Gold hairline */}
              <div className="my-6 flex justify-center">
                <div
                  className="h-px"
                  style={{
                    width: 120,
                    background:
                      'linear-gradient(90deg, transparent, rgba(201,162,39,0.8), transparent)',
                  }}
                />
              </div>

              {/* Transliteration */}
              <div
                className="font-display font-semibold tracking-[0.04em] text-white"
                style={{ fontSize: 26, textShadow: '0 2px 10px rgba(0,0,0,0.4)' }}
              >
                {n.transliteration}
              </div>

              {/* English */}
              <div
                className="mt-3 text-[14.5px] font-medium"
                style={{ color: 'rgba(255,255,255,0.72)' }}
              >
                {n.english}
              </div>

              {/* Urdu */}
              <div
                dir="rtl"
                className="mt-4 font-arabic leading-relaxed"
                style={{ fontSize: 20, color: 'rgba(212,155,42,0.95)' }}
              >
                {n.urdu}
              </div>

              {/* Bottom star */}
              <div className="mt-6 flex justify-center">
                <Star8 size={14} color="#C9A227" />
              </div>
            </div>
          </div>
        </Tilt3D>
      </div>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={() => go(-1)}
          aria-label="Previous"
          className="pill-3d-dark flex h-14 w-14 items-center justify-center rounded-full"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-inkFaint">
          Swipe or tap
        </div>
        <button
          onClick={() => go(1)}
          aria-label="Next"
          className="pill-3d-dark flex h-14 w-14 items-center justify-center rounded-full"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Jump to */}
      <div className="mt-6">
        <OrnamentDivider />
        <div className="mt-4 grid grid-cols-10 gap-1.5">
          {Array.from({ length: 10 }).map((_, ci) => {
            const start = ci * 10;
            const end = Math.min(start + 10, total);
            const active = i >= start && i < end;
            return (
              <button
                key={ci}
                onClick={() => {
                  setI(start);
                  setAnimKey((k) => k + 1);
                }}
                className={
                  'rounded-md py-1.5 text-[9px] font-bold transition ' +
                  (active ? 'bg-[#C9A227] text-navy' : 'bg-line text-inkFaint')
                }
              >
                {start + 1}
              </button>
            );
          })}
        </div>
      </div>
    </Overlay>
  );
}