'use client';

import { useEffect, useRef, useState } from 'react';
import Overlay from './Overlay';
import { NAMES_OF_PROPHET } from '@/lib/data/namesOfProphet';
import { Star8, CornerFlourish, OrnamentDivider, GeometryBg } from '@/components/ui/GoldOrnament';
import Tilt3D from '@/components/ui/Tilt3D';

export default function NamesOfProphetScreen() {
  const [i, setI] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const n = NAMES_OF_PROPHET[i];
  const total = NAMES_OF_PROPHET.length;

  const go = (delta: number) => {
    setI((v) => (v + delta + total) % total);
    setAnimKey((k) => k + 1);
  };

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
    <Overlay title="Names of the Prophet ﷺ">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-[26px] font-semibold leading-none text-navy">
            {i + 1}
          </span>
          <span className="text-[12px] text-inkFaint">/ {total}</span>
        </div>
        <button
          onClick={() => {
            setI(Math.floor(Math.random() * total));
            setAnimKey((k) => k + 1);
          }}
          className="pill-3d rounded-pill px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-navy"
        >
          ✦ Surprise me
        </button>
      </div>

      <div className="mb-5 h-1 w-full overflow-hidden rounded-full bg-line">
        <div
          className="h-full bg-gradient-to-r from-[#D08B45] to-[#8A5525] transition-all duration-300"
          style={{ width: `${((i + 1) / total) * 100}%` }}
        />
      </div>

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
            <GeometryBg color="#F5EDDA" opacity={0.10} />

            {/* Corner ornaments */}
            <CornerFlourish color="#F5EDDA" className="ornament-corner left-3 top-3" size={36} />
            <CornerFlourish color="#F5EDDA" className="ornament-corner right-3 top-3 -scale-x-100" size={36} />
            <CornerFlourish color="#F5EDDA" className="ornament-corner left-3 bottom-3 -scale-y-100" size={36} />
            <CornerFlourish color="#F5EDDA" className="ornament-corner right-3 bottom-3 -scale-100" size={36} />

            {/* Giant faded number */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-bold leading-none"
              style={{
                fontSize: 280,
                color: 'rgba(245,237,218,0.06)',
              }}
            >
              {n.id}
            </div>

            <div className="relative px-8 py-14 text-center">
              <div className="mb-6 flex justify-center">
                <Star8 size={20} color="#F5EDDA" className="animate-soft-pulse" />
              </div>

              {/* Arched frame around Arabic */}
              <div className="relative mx-auto" style={{ maxWidth: 220 }}>
                <svg
                  viewBox="0 0 200 120"
                  className="absolute -inset-x-6 -top-4 h-[calc(100%+2rem)] w-[calc(100%+3rem)]"
                  fill="none"
                  stroke="#F5EDDA"
                  strokeWidth="1"
                  opacity="0.4"
                  preserveAspectRatio="none"
                >
                  <path d="M10 60 Q10 5 100 5 Q190 5 190 60 L190 105 Q190 115 180 115 L20 115 Q10 115 10 105 Z" />
                </svg>
                <div
                  dir="rtl"
                  className="font-arabic relative text-white leading-none"
                  style={{
                    fontSize: 64,
                    textShadow: '0 0 24px rgba(245,237,218,0.4), 0 2px 8px rgba(0,0,0,0.55)',
                  }}
                >
                  {n.arabic}
                </div>
              </div>

              <div className="my-6 flex justify-center">
                <div
                  className="h-px"
                  style={{
                    width: 120,
                    background:
                      'linear-gradient(90deg, transparent, rgba(245,237,218,0.9), transparent)',
                  }}
                />
              </div>

              <div
                className="font-display font-semibold tracking-[0.04em] text-white"
                style={{ fontSize: 26, textShadow: '0 2px 10px rgba(0,0,0,0.4)' }}
              >
                {n.transliteration}
              </div>

              <div
                className="mt-3 text-[14.5px] font-medium"
                style={{ color: 'rgba(255,255,255,0.78)' }}
              >
                {n.english}
              </div>

              <div
                dir="rtl"
                className="mt-4 font-arabic leading-relaxed text-white/90"
                style={{ fontSize: 20 }}
              >
                {n.urdu}
              </div>

              <div className="mt-6 flex justify-center">
                <Star8 size={14} color="#F5EDDA" />
              </div>
            </div>
          </div>
        </Tilt3D>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={() => go(-1)}
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
          className="pill-3d-dark flex h-14 w-14 items-center justify-center rounded-full"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </Overlay>
  );
}