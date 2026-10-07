'use client';

import { useEffect, useState } from 'react';
import Overlay from './Overlay';
import { useAppStore } from '@/lib/store';
import { useSession, signIn, signOut } from 'next-auth/react';
import GlassCard from '@/components/ui/GlassCard';
import { Star8, OrnamentDivider } from '@/components/ui/GoldOrnament';
import Tilt3D from '@/components/ui/Tilt3D';

export default function SettingsScreen() {
  const push = useAppStore((s) => s.pushScreen);
  const { data: session } = useSession();
  const [busy, setBusy] = useState(false);
  const [isSuper, setIsSuper] = useState(false);
  const [checking, setChecking] = useState(true);

  const email = session?.user?.email || '';

  useEffect(() => {
    if (!email) { setChecking(false); return; }
    fetch(`/api/super/check?email=${encodeURIComponent(email)}`)
      .then((r) => r.json())
      .then((d) => setIsSuper(!!d.isSuperAdmin))
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [email]);

  async function enableNotifications() {
    setBusy(true);
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) { alert('Push not supported'); return; }
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') { alert('Permission denied'); return; }
      const reg = await navigator.serviceWorker.getRegistration();
      if (!reg) { alert('No SW'); return; }
      await navigator.serviceWorker.ready;
      const vapid = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapid) { alert('VAPID missing'); return; }
      const padding = '='.repeat((4 - (vapid.length % 4)) % 4);
      const base64 = (vapid + padding).replace(/-/g, '+').replace(/_/g, '/');
      const raw = atob(base64);
      const arr = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
      const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: arr });
      await fetch('/api/push/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subscription: sub.toJSON(), userId: (session?.user as any)?.id }) });
      alert('✓ Notifications enabled');
    } catch (e: any) { alert('Error: ' + (e?.message || 'Unknown')); }
    finally { setBusy(false); }
  }

  return (
    <Overlay title="Settings">
      <div className="space-y-4">
        <Tilt3D intensity={3}>
          <GlassCard variant="dark-strong" padding="p-5">
            <div className="flex items-center justify-between">
              <div className="kicker kicker-gold">{session ? 'Signed in' : 'Guest'}</div>
              <Star8 size={12} />
            </div>
            {session ? (
              <>
                <div className="mt-4 flex items-center gap-3">
                  {session.user?.image ? (
                    <img src={session.user.image} alt="" className="h-12 w-12 rounded-full object-cover ring-2 ring-champagne/40" />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-champagne font-display text-[18px] font-semibold text-midnight">
                      {session.user?.name?.[0]?.toUpperCase() || '·'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-display text-[16px] font-semibold text-ink-on-dark">
                      {session.user?.name}
                    </div>
                    <div className="truncate text-[12px] text-ink-faint">{session.user?.email}</div>
                  </div>
                </div>
                <button onClick={() => signOut()} className="press mt-4 w-full rounded-pill border border-line-dark py-3 text-[10.5px] font-bold uppercase tracking-[0.18em] text-ink-soft">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <div className="mt-3 font-display text-[16px] font-semibold text-ink-on-dark">
                  Sign in to save progress
                </div>
                <div className="mt-1 text-[12px] text-ink-faint">
                  Track prayers, Quran, and deeds across devices.
                </div>
                <button onClick={() => signIn('google')} className="press mt-4 w-full rounded-pill bg-champagne py-3 text-[10.5px] font-bold uppercase tracking-[0.18em] text-midnight">
                  Sign in with Google
                </button>
              </>
            )}
          </GlassCard>
        </Tilt3D>

        {isSuper && !checking && (
          <Tilt3D intensity={3}>
            <GlassCard variant="gold" padding="p-5" onClick={() => push('super-admin')}>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl" style={{ background: 'linear-gradient(160deg, #E5B437 0%, #C9A227 55%, #8A6B15 100%)', boxShadow: '0 6px 14px -4px rgba(201,162,39,0.5)' }}>
                  <Star8 size={20} color="#031A18" />
                </div>
                <div className="flex-1">
                  <div className="font-display text-[15.5px] font-semibold text-ink-on-dark">
                    ⭐ Super Admin
                  </div>
                  <div className="mt-0.5 text-[12px] text-ink-faint">
                    Full system access
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-champagne)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </GlassCard>
          </Tilt3D>
        )}

        <Tilt3D intensity={3}>
          <GlassCard variant="gold" padding="p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl" style={{ background: 'linear-gradient(160deg, #E5B437 0%, #C9A227 55%, #8A6B15 100%)', boxShadow: '0 6px 14px -4px rgba(201,162,39,0.5)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#031A18" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-display text-[15.5px] font-semibold text-ink-on-dark">Prayer Reminders</div>
                <div className="mt-0.5 text-[12px] text-ink-faint">Notified before every Azān & Jamā&apos;ah</div>
              </div>
            </div>
            <button onClick={enableNotifications} disabled={busy} className="press mt-4 w-full rounded-pill bg-champagne py-3 text-[10.5px] font-bold uppercase tracking-[0.18em] text-midnight disabled:opacity-60">
              {busy ? 'Setting up…' : 'Enable notifications'}
            </button>
            <button onClick={async () => { await fetch('/api/push/test', { method: 'POST' }); alert('Test sent'); }} className="press mt-2 w-full rounded-pill border border-line-dark py-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft">
              Send test notification
            </button>
          </GlassCard>
        </Tilt3D>

        <Tilt3D intensity={3}>
          <GlassCard variant="dark" padding="p-5" onClick={() => push('admin-pin')}>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: 'linear-gradient(160deg, rgba(214,180,106,0.28) 0%, rgba(184,149,80,0.12) 100%)', border: '1px solid rgba(214,180,106,0.35)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-champagne)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-display text-[15.5px] font-semibold text-ink-on-dark">Admin Panel</div>
                <div className="mt-0.5 text-[12px] text-ink-faint">Requires PIN</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-faint)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </GlassCard>
        </Tilt3D>

        <div className="mt-4"><OrnamentDivider /></div>

        <div className="text-center">
          <div className="kicker kicker-gold">Developed by Ateeb</div>
          <div className="mt-2 flex items-center justify-center gap-4 text-[12px] text-ink-soft">
            <a href="https://www.linkedin.com/in/ateeb-zargar-890022386?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" className="hover:text-champagne">LinkedIn</a>
            <span className="text-ink-faint">·</span>
            <a href="https://github.com/zargarateeb" target="_blank" rel="noopener noreferrer" className="hover:text-champagne">GitHub</a>
            <span className="text-ink-faint">·</span>
            <a href="mailto:zargarateeb4@gmail.com" className="hover:text-champagne">Email</a>
          </div>
        </div>
      </div>
    </Overlay>
  );
}