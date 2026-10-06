'use client';

import { useAppStore } from '@/lib/store';
import { Star8, OrnamentDivider } from '@/components/ui/GoldOrnament';
import AmbientGlow from '@/components/ui/AmbientGlow';
import Tilt3D from '@/components/ui/Tilt3D';
import { TILE_IMAGES } from '@/lib/images';

export default function MoreScreen() {
  const push = useAppStore((s) => s.pushScreen);

  const items = [
    { key: 'names-of-allah', label: '99 Names of Allah', sub: 'Asmā ul-Husnā', gradient: 'linear-gradient(160deg, #2E7A56 0%, #1B5E3F 55%, #0F3D28 100%)', icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" /></svg>) },
    { key: 'names-of-prophet', label: 'Names of Prophet ﷺ', sub: 'Asmā un-Nabi', gradient: 'linear-gradient(160deg, #D08B45 0%, #B87333 55%, #8A5525 100%)', icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 3c-1 2-3 3-3 5 0 1 .5 2 1.5 2.5C9 11 8 12.5 8 14v7h8v-7c0-1.5-1-3-2.5-3.5C14.5 10 15 9 15 8c0-2-2-3-3-5z" /></svg>) },
    { key: 'duas', label: 'Supplications', sub: '100+ Duas', gradient: 'linear-gradient(160deg, #8C4BB8 0%, #7C3AED 55%, #5C2A9E 100%)', icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 21s-6-4-6-10a6 6 0 0 1 12 0c0 6-6 10-6 10z" /></svg>) },
    { key: 'qibla', label: 'Qibla', sub: 'Live direction', gradient: 'linear-gradient(160deg, #2C5F8A 0%, #1A3E5C 55%, #0D2538 100%)', icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="9" /><polygon points="12 4 15 12 12 20 9 12" fill="white" /></svg>) },
    { key: 'our-masjid', label: 'Our Masjid', sub: 'Committee & info', gradient: 'linear-gradient(160deg, #2E7A56 0%, #1B5E3F 55%, #0F3D28 100%)', icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M4 21V11a8 8 0 0 1 16 0v10" /><path d="M4 21h16M12 3v3M9 21v-4h6v4" /></svg>) },
    { key: 'announcements', label: 'Announcements', sub: 'Latest updates', gradient: 'linear-gradient(160deg, #2E7A56 0%, #1B5E3F 55%, #0F3D28 100%)', icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M3 11v2a1 1 0 0 0 1 1h2l4 4V6L6 10H4a1 1 0 0 0-1 1z" /><path d="M16 8a5 5 0 0 1 0 8" /></svg>) },
    { key: 'debate', label: 'Debate', sub: 'Community discussions', gradient: 'linear-gradient(160deg, #8C4BB8 0%, #7C3AED 55%, #5C2A9E 100%)', icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) },
    { key: 'donate', label: 'Donate', sub: 'Support the masjid', gradient: 'linear-gradient(160deg, #D08B45 0%, #B87333 55%, #8A5525 100%)', icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>) },
    { key: 'settings', label: 'Settings', sub: 'Account & admin', gradient: 'linear-gradient(160deg, #2C5F8A 0%, #1A3E5C 55%, #0D2538 100%)', icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>) },
  ] as const;

  return (
    <div className="relative min-h-dvh px-5 pt-6 pb-36">
      <AmbientGlow color="emerald" size={380} style={{ top: -100, right: -120, opacity: 0.4 }} />

      <div className="relative mb-6">
        <div className="kicker kicker-gold">Menu</div>
        <h1 className="mt-1 font-display text-[40px] font-semibold leading-none text-ink-on-dark">More</h1>
      </div>

      <div className="relative grid grid-cols-2 gap-3">
        {items.map((item) => {
          const img = TILE_IMAGES[item.key];
          return (
            <Tilt3D key={item.key} intensity={5}>
              <button onClick={() => push(item.key as any)} className="press relative w-full overflow-hidden rounded-[22px] p-4 text-left" style={{ background: item.gradient, boxShadow: '0 1px 0 rgba(255,255,255,0.15) inset, 0 -2px 6px rgba(0,0,0,0.30) inset, 0 16px 32px -12px rgba(0,0,0,0.35)' }}>
                {img && (
                  <div className="pointer-events-none absolute inset-0">
                    <img
                      src={img}
                      alt=""
                      className="absolute right-0 top-0 h-full w-[70%] object-cover"
                      style={{
                        maskImage: 'linear-gradient(90deg, transparent 0%, black 65%)',
                        WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 65%)',
                        opacity: 0.55,
                        mixBlendMode: 'luminosity',
                      }}
                    />
                  </div>
                )}
                <div className="relative">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">{item.icon}</div>
                  <div className="mt-4 font-display text-[14.5px] font-semibold leading-tight text-white">{item.label}</div>
                  <div className="mt-1 text-[10.5px] font-medium uppercase tracking-[0.12em] text-white/70">{item.sub}</div>
                </div>
              </button>
            </Tilt3D>
          );
        })}
      </div>

      <div className="relative mt-8"><OrnamentDivider /></div>

      <div className="relative mt-6 text-center">
        <div className="mb-2 flex justify-center"><Star8 size={12} /></div>
        <div className="kicker kicker-gold">Developed by Ateeb</div>
        <div className="mt-2 flex items-center justify-center gap-4 text-[12px] text-ink-soft">
          <a href="https://linkedin.com/in/zargarateeb" target="_blank" rel="noopener noreferrer" className="hover:text-champagne">LinkedIn</a>
          <span className="text-ink-faint">·</span>
          <a href="https://github.com/zargarateeb" target="_blank" rel="noopener noreferrer" className="hover:text-champagne">GitHub</a>
          <span className="text-ink-faint">·</span>
          <a href="mailto:zargarateeb4@gmail.com" className="hover:text-champagne">Email</a>
        </div>
      </div>
    </div>
  );
}