'use client';

import { useState } from 'react';
import Overlay from './Overlay';
import { DONATE_HERO } from '@/lib/images';
import GlassCard from '@/components/ui/GlassCard';
import { Star8, OrnamentDivider } from '@/components/ui/GoldOrnament';
import { BANK_DETAILS } from '@/lib/constants';

export default function DonateScreen() {
  const [copied, setCopied] = useState<string | null>(null);

  function copy(value: string, key: string) {
    if (typeof navigator === 'undefined') return;
    navigator.clipboard.writeText(value).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  const Row = ({ label, value, canCopy, copyKey }: { label: string; value: string; canCopy?: boolean; copyKey?: string }) => (
    <div className="flex items-center justify-between border-b border-line-dark py-3.5 last:border-0">
      <div className="min-w-0">
        <div className="kicker kicker-gold">{label}</div>
        <div className="mt-0.5 font-display text-[15px] font-semibold text-ink-on-dark">{value}</div>
      </div>
      {canCopy && copyKey && (
        <button
          onClick={() => copy(value, copyKey)}
          className="press flex-shrink-0 rounded-pill border border-champagne/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-champagne"
        >
          {copied === copyKey ? '✓ Copied' : 'Copy'}
        </button>
      )}
    </div>
  );

  return (
    <Overlay title="Support Our Masjid">
      <div className="relative mb-5 overflow-hidden arch-shape" style={{ height: 200 }}>
  <img src={DONATE_HERO} alt="" className="absolute inset-0 h-full w-full object-cover" />
  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(3,26,24,0.20) 0%, rgba(6,46,42,0.95) 100%)' }} />
  <div className="absolute inset-x-0 bottom-0 p-5 text-center">
    <div className="font-display text-[22px] font-semibold text-ink-on-dark">Support Our Masjid</div>
    <div className="mt-1 text-[12px] text-ink-soft">Your contribution fuels our community</div>
  </div>
</div>

      <GlassCard variant="gold" padding="p-5">
        <div className="kicker kicker-gold mb-3">Bank Details</div>
        <Row label="Account holder" value={BANK_DETAILS.holder} />
        <Row label="Account number" value={BANK_DETAILS.accountNumber} canCopy copyKey="acc" />
        <Row label="IFSC code" value={BANK_DETAILS.ifsc} canCopy copyKey="ifsc" />
        <Row label="Bank" value={BANK_DETAILS.bank} />
      </GlassCard>

      <button
        onClick={() => copy(`${BANK_DETAILS.holder}\n${BANK_DETAILS.accountNumber}\nIFSC: ${BANK_DETAILS.ifsc}\n${BANK_DETAILS.bank}`, 'all')}
        className="press mt-4 w-full rounded-pill bg-champagne py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-midnight"
      >
        {copied === 'all' ? '✓ Copied' : 'Copy all details'}
      </button>

      <GlassCard variant="dark" padding="p-4" className="mt-5">
        <div className="text-[12.5px] leading-[1.6] text-ink-soft">
          🤲 &ldquo;The example of those who spend their wealth in the way of Allah is like a seed which grows seven spikes; in each spike is a hundred grains.&rdquo; — Qur&apos;an 2:261
        </div>
      </GlassCard>
    </Overlay>
  );
}