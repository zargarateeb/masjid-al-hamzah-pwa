'use client';

import { useMemo, useState } from 'react';
import Overlay from './Overlay';
import { DUAS, DUA_CATEGORIES } from '@/lib/data/duas';
import { Star8, OrnamentDivider } from '@/components/ui/GoldOrnament';
import { duaCategoryImage } from '@/lib/images';
import Tilt3D from '@/components/ui/Tilt3D';

const CATEGORY_COLORS: Record<string, string> = {
  'Morning & Evening': '#D6B46A',
  'Eating & Drinking': '#789B8A',
  'Sleeping & Waking': '#4B7A9C',
  Travel: '#B87333',
  'Home & Masjid': '#6F9B7F',
  Protection: '#9B7AC8',
  Forgiveness: '#B4637A',
  'Parents & Family': '#A8855C',
  'Anxiety & Sadness': '#5C7AA0',
  General: '#789B8A',
};

export default function DuasScreen() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  // Count duas per category
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    DUAS.forEach((d) => { c[d.category] = (c[d.category] || 0) + 1; });
    return c;
  }, []);

  const categoryDuas = useMemo(
    () => (openCategory ? DUAS.filter((d) => d.category === openCategory) : []),
    [openCategory]
  );

  // ═══════════════════════════════════════════════════════
  //  LEVEL 2 — Reading view (category open)
  // ═══════════════════════════════════════════════════════
  if (openCategory) {
    const color = CATEGORY_COLORS[openCategory] || '#789B8A';

    return (
      <Overlay title={openCategory}>
        {/* Back to categories */}
        <button
          onClick={() => setOpenCategory(null)}
          className="glass-gold press mb-5 inline-flex items-center gap-2 rounded-pill px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-champagne"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          All Categories
        </button>

        <div className="mb-4 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: color }} />
          <div className="kicker kicker-gold">{categoryDuas.length} supplications</div>
        </div>

        <div className="space-y-5">
          {categoryDuas.map((d, idx) => (
            <div
              key={d.id}
              className="animate-lift-in glass-dark relative overflow-hidden rounded-[24px]"
              style={{ animationDelay: `${Math.min(idx * 40, 300)}ms` }}
            >
              {/* Left accent strip */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1.5"
                style={{ background: `linear-gradient(180deg, ${color}, ${color}77)` }}
              />

              <div className="p-6 pl-7">
                {/* Number + title */}
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className="flex h-8 min-w-8 items-center justify-center rounded-lg px-2 font-display text-[13px] font-bold text-midnight"
                    style={{ background: color }}
                  >
                    {d.id}
                  </span>
                  <div className="font-display text-[16px] font-semibold leading-tight text-ink-on-dark">
                    {d.title}
                  </div>
                </div>

                {/* Arabic — big, centered */}
                <div
                  dir="rtl"
                  className="mb-5 font-arabic leading-[2.1] text-right text-ink-on-dark"
                  style={{ fontSize: 26 }}
                >
                  {d.arabic}
                </div>

                {/* Divider */}
                <div
                  className="mb-4 h-px w-full"
                  style={{ background: `linear-gradient(90deg, transparent, ${color}66, transparent)` }}
                />

                {/* Transliteration */}
                <div className="mb-3 text-[13px] italic leading-[1.6] text-ink-faint">
                  {d.transliteration}
                </div>

                {/* English */}
                <div className="text-[14px] leading-[1.65] text-ink-soft">
                  {d.english}
                </div>

                {/* Reference */}
                {d.reference && (
                  <div className="mt-4 flex items-center gap-2">
                    <Star8 size={10} color={color} />
                    <span
                      className="text-[10.5px] font-bold uppercase tracking-[0.12em]"
                      style={{ color }}
                    >
                      {d.reference}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6"><OrnamentDivider /></div>
      </Overlay>
    );
  }

  // ═══════════════════════════════════════════════════════
  //  LEVEL 1 — Category grid
  // ═══════════════════════════════════════════════════════
  return (
    <Overlay title="Supplications">
      <div className="mb-5 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full glass-gold">
          <Star8 size={20} />
        </div>
        <div className="mt-3 font-display text-[20px] font-semibold text-ink-on-dark">
          {DUAS.length} Duas · {DUA_CATEGORIES.length} Categories
        </div>
        <div className="mt-1 text-[12px] text-ink-faint">
          Tap a category to open its supplications
        </div>
        <div className="mt-4"><OrnamentDivider /></div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {DUA_CATEGORIES.map((cat) => {
          const img = duaCategoryImage(cat);
          const count = counts[cat] || 0;
          const color = CATEGORY_COLORS[cat] || '#789B8A';

          return (
            <Tilt3D key={cat} intensity={5}>
              <button
                onClick={() => setOpenCategory(cat)}
                className="press relative w-full overflow-hidden rounded-[22px] text-left"
                style={{
                  aspectRatio: '1 / 1',
                  background: '#0A4139',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.08) inset, 0 -2px 6px rgba(0,0,0,0.30) inset, 0 16px 32px -12px rgba(0,0,0,0.35)',
                }}
              >
                {/* Background image */}
                <img
                  src={img}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ opacity: 0.55 }}
                />
                {/* Dark gradient */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(3,26,24,0.10) 0%, rgba(6,46,42,0.55) 55%, rgba(3,26,24,0.95) 100%)',
                  }}
                />
                {/* Color wash */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(circle at 100% 0%, ${color}55 0%, transparent 60%)`,
                  }}
                />

                <div className="relative flex h-full flex-col justify-between p-4">
                  <div
                    className="inline-flex w-fit items-center gap-1.5 rounded-pill px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-midnight"
                    style={{ background: color }}
                  >
                    {count} {count === 1 ? 'Dua' : 'Duas'}
                  </div>

                  <div>
                    <div className="font-display text-[15px] font-semibold leading-tight text-white drop-shadow-lg">
                      {cat}
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/70">
                      Read
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>
            </Tilt3D>
          );
        })}
      </div>

      <div className="mt-6"><OrnamentDivider /></div>
    </Overlay>
  );
}