'use client';

import { useEffect, useState } from 'react';
import Overlay from './Overlay';
import { MASJID_HERO } from '@/lib/images';
import GlassCard from '@/components/ui/GlassCard';
import { Star8, GoldDivider, GeometryBg } from '@/components/ui/GoldOrnament';
import Tilt3D from '@/components/ui/Tilt3D';

interface Member { role: string; name: string; phone?: string; email?: string; }

export default function OurMasjidScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/committee')
      .then((r) => r.json())
      .then((d) => setData(d?.committee))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Overlay title="Our Masjid">
        <div className="py-20 text-center text-[13px] text-ink-faint">Loading…</div>
      </Overlay>
    );
  }

  return (
    <Overlay title="Our Masjid">
      {/* Hero */}
      {/* Hero with masjid photo */}
<div className="relative mb-6">
  <div className="arch-shape relative overflow-hidden" style={{ height: 260 }}>
    <img src={MASJID_HERO} alt="Masjid Al-Hamzah" className="absolute inset-0 h-full w-full object-cover" />
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(3,26,24,0.15) 0%, rgba(3,26,24,0.55) 55%, rgba(6,46,42,0.98) 100%)' }} />
    <div className="absolute inset-x-0 bottom-0 p-6">
      <div className="mb-3 flex items-center gap-2">
        <Star8 size={14} />
        <span className="kicker kicker-gold">The House of Allah</span>
      </div>
      <div className="font-display font-semibold leading-tight text-ink-on-dark" style={{ fontSize: 28, textShadow: '0 2px 10px rgba(0,0,0,0.4)' }}>
        {data?.masjidName || 'Masjid Al-Hamzah'}
      </div>
      <div className="mt-2 text-[13px] text-white/85">
        {data?.location || 'HajiBagh, Buchpora, Srinagar'}
      </div>
    </div>
  </div>
  <div className="pointer-events-none absolute arch-shape" style={{ inset: -8, border: '1px solid rgba(214,180,106,0.20)' }} />
</div>

      <div className="mb-3 flex items-center gap-2">
        <Star8 size={12} />
        <div className="kicker kicker-gold">Committee</div>
      </div>

      <div className="mb-6 space-y-3">
        {(data?.committee || []).map((m: Member, i: number) => (
          <Tilt3D key={i} intensity={3}>
            <GlassCard variant="dark" padding="p-4">
              <div className="flex items-center gap-3.5">
                <div
                  className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full font-display text-[20px] font-semibold text-midnight"
                  style={{
                    background: 'linear-gradient(160deg, #E5B437 0%, #C9A227 55%, #8A6B15 100%)',
                    boxShadow: '0 1px 0 rgba(255,255,255,0.35) inset, 0 6px 14px -4px rgba(201,162,39,0.5)',
                  }}
                >
                  {m.name?.[0]?.toUpperCase() || '·'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="kicker kicker-gold">{m.role}</div>
                  <div className="mt-0.5 truncate font-display text-[17px] font-semibold text-ink-on-dark">
                    {m.name || 'To be appointed'}
                  </div>
                  {m.phone && <a href={`tel:${m.phone}`} className="mt-0.5 block truncate text-[12px] text-ink-soft">{m.phone}</a>}
                </div>
              </div>
            </GlassCard>
          </Tilt3D>
        ))}
      </div>

      {(data?.members || []).length > 0 && (
        <>
          <div className="mb-3 flex items-center gap-2">
            <Star8 size={12} />
            <div className="kicker kicker-gold">Members</div>
          </div>
          <div className="space-y-2">
            {(data?.members || []).map((m: Member, i: number) => (
              <GlassCard key={i} variant="dark" padding="p-3.5">
                <div className="font-display text-[14.5px] font-semibold text-ink-on-dark">{m.name}</div>
                {m.role && <div className="text-[11px] text-ink-faint">{m.role}</div>}
              </GlassCard>
            ))}
          </div>
        </>
      )}

      {data?.about && (
        <GlassCard variant="dark" padding="p-4" className="mt-6">
          <div className="text-[12.5px] leading-[1.6] text-ink-soft">{data.about}</div>
        </GlassCard>
      )}
    </Overlay>
  );
}