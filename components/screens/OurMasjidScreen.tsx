'use client';

import Overlay from './Overlay';
import { MASJID_HERO } from '@/lib/images';
import GlassCard from '@/components/ui/GlassCard';
import { Star8 } from '@/components/ui/GoldOrnament';
import Tilt3D from '@/components/ui/Tilt3D';

interface Member {
  role: string;
  name: string;
  nameUr?: string;
  phone?: string;
  email?: string;
}

const IMAM = {
  name: 'Hazrat Zafarullah Sahab',
  nameUr: 'حضرت ظفر اللہ صاحب',
};

const COMMITTEE: Member[] = [
  {
    role: 'President',
    name: 'Mohtaram Ghulam Qadir Lankar Sahab',
    nameUr: 'محترم غلام قادر لنکر صاحب',
  },
  {
    role: 'Vice President',
    name: 'Mohtaram Riyaz Ahmad Dar Sahab',
    nameUr: 'محترم ریاض احمد دار صاحب',
  },
  {
    role: 'Secretary',
    name: 'To be appointed',
    nameUr: 'تقرری باقی ہے',
  },
  {
    role: 'Treasurer',
    name: 'To be appointed',
    nameUr: 'تقرری باقی ہے',
  },
];

const MEMBERS: Member[] = [];

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <Star8 size={12} />
      <div className="kicker kicker-gold">{label}</div>
    </div>
  );
}

function isVacant(name: string) {
  return name === 'To be appointed';
}

export default function OurMasjidScreen() {
  return (
    <Overlay title="Our Masjid">
      {/* Hero */}
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
              Masjid Al-Hamzah
            </div>
            <div className="mt-2 text-[13px] text-white/85">
              HajiBagh, Buchpora, Srinagar
            </div>
            <div className="mt-1 text-[12px] text-white/75">
              Imam: {IMAM.name}
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute arch-shape" style={{ inset: -8, border: '1px solid rgba(214,180,106,0.20)' }} />
      </div>

      {/* Committee */}
      <SectionHeader label="Committee" />
      <div className="mb-6 space-y-3">
        {COMMITTEE.map((m) => {
          const vacant = isVacant(m.name);
          return (
            <Tilt3D key={m.role} intensity={3}>
              <GlassCard variant="dark" padding="p-4">
                <div className="flex items-center gap-3.5">
                  <div
                    aria-hidden
                    className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full font-display text-[20px] font-semibold text-midnight"
                    style={{
                      background: 'linear-gradient(160deg, #E5B437 0%, #C9A227 55%, #8A6B15 100%)',
                      boxShadow: '0 1px 0 rgba(255,255,255,0.35) inset, 0 6px 14px -4px rgba(201,162,39,0.5)',
                    }}
                  >
                    {vacant ? '·' : m.name[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="kicker kicker-gold">{m.role}</div>

                    <div className={`mt-0.5 font-display text-[17px] font-semibold ${vacant ? 'text-ink-faint italic' : 'text-ink-on-dark'}`}>
                      {m.name}
                    </div>

                    {m.nameUr && (
                      <div
                        dir="rtl"
                        className={`urdu mt-0.5 text-[15px] leading-[1.9] ${vacant ? 'text-ink-faint' : 'text-ink-soft'}`}
                      >
                        {m.nameUr}
                      </div>
                    )}

                    {m.phone && (
                      <a href={`tel:${m.phone}`} aria-label={`Call ${m.name}`} className="mt-1 block truncate text-[12px] text-ink-soft">
                        {m.phone}
                      </a>
                    )}
                    {m.email && (
                      <a href={`mailto:${m.email}`} aria-label={`Email ${m.name}`} className="block truncate text-[12px] text-ink-soft">
                        {m.email}
                      </a>
                    )}
                  </div>
                </div>
              </GlassCard>
            </Tilt3D>
          );
        })}
      </div>

      {/* Members */}
      {MEMBERS.length > 0 && (
        <>
          <SectionHeader label="Members" />
          <div className="space-y-2">
            {MEMBERS.map((m) => (
              <GlassCard key={m.name} variant="dark" padding="p-3.5">
                <div className="font-display text-[14.5px] font-semibold text-ink-on-dark">{m.name}</div>
                {m.nameUr && (
                  <div dir="rtl" className="urdu text-[14px] leading-[1.9] text-ink-soft">
                    {m.nameUr}
                  </div>
                )}
                {m.role && <div className="text-[11px] text-ink-faint">{m.role}</div>}
              </GlassCard>
            ))}
          </div>
        </>
      )}

      {/* About */}
      <GlassCard variant="dark" padding="p-4" className="mt-6">
        <div className="text-[12.5px] leading-[1.6] text-ink-soft">
          Serving the HajiBagh community — daily prayers, Jumu&apos;ah, madrasah classes, and janazah services.
        </div>
      </GlassCard>
    </Overlay>
  );
}
