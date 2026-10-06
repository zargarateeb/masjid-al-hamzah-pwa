'use client';

import { useState } from 'react';
import Overlay from './Overlay';
import { useAppStore } from '@/lib/store';
import { Star8 } from '@/components/ui/GoldOrnament';
import GlassCard from '@/components/ui/GlassCard';

export default function AdminPinScreen() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const push = useAppStore((s) => s.pushScreen);

  async function submit() {
    if (pin.length < 4) { setError('Enter at least 4 digits'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (data.ok) {
        sessionStorage.setItem('admin_pin', pin);
        push('admin');
      } else { setError('Incorrect PIN'); setPin(''); }
    } catch { setError('Something went wrong'); }
    finally { setLoading(false); }
  }

  return (
    <Overlay title="Admin Access">
      <GlassCard variant="dark-strong" padding="p-6">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full glass-gold">
            <Star8 size={26} />
          </div>
          <div className="mt-4 font-display text-[22px] font-semibold text-ink-on-dark">Enter PIN</div>
          <div className="mt-1 text-[12px] text-ink-faint">Only authorized admins can proceed.</div>
        </div>

        <input
          value={pin}
          onChange={(e) => { setPin(e.target.value.replace(/\D/g, '').slice(0, 8)); setError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          type="password"
          inputMode="numeric"
          autoFocus
          placeholder="••••"
          className="mt-6 w-full rounded-[18px] border border-line-dark bg-white/5 px-4 py-4 text-center font-display text-[26px] tracking-[0.5em] text-ink-on-dark outline-none focus:border-champagne"
        />

        {error && <div className="mt-3 text-center text-[12px] font-medium text-error">{error}</div>}

        <button
          onClick={submit}
          disabled={loading}
          className="press mt-5 w-full rounded-pill bg-champagne py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-midnight disabled:opacity-50"
        >
          {loading ? 'Verifying…' : 'Verify PIN'}
        </button>
      </GlassCard>
    </Overlay>
  );
}