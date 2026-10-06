'use client';

import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { GoldStar } from '@/components/ui/Ornament';

export default function Overlay({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const pop = useAppStore((s) => s.popScreen);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      className="fixed inset-0 z-50 mx-auto w-full max-w-[480px] overflow-hidden bg-midnight"
    >
      <div
        className="ambient-emerald"
        style={{ width: 400, height: 400, top: -150, right: -120, opacity: 0.45, position: 'absolute', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }}
      />

      <div
        className="relative px-5 pb-4 pt-5"
        style={{ background: 'linear-gradient(180deg, rgba(6,46,42,0.85) 0%, transparent 100%)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(214,180,106,0.15)' }}
      >
        <div className="flex items-center gap-3">
          <button onClick={pop} className="glass-dark press flex h-10 w-10 items-center justify-center rounded-full" aria-label="Back">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-on-dark)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className="flex-1">
            <div className="font-display text-[17px] font-semibold leading-tight text-ink-on-dark">{title}</div>
          </div>
          <GoldStar size={16} />
        </div>
      </div>

      <div className="relative max-h-[calc(100vh-80px)] overflow-y-auto p-5">{children}</div>
    </motion.div>
  );
}