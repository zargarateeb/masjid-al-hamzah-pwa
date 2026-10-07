'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Overlay from './Overlay';
import GlassCard from '@/components/ui/GlassCard';
import AmbientGlow from '@/components/ui/AmbientGlow';
import { Star8, OrnamentDivider } from '@/components/ui/GoldOrnament';

interface UserRow {
  _id: string;
  email: string;
  name: string;
  image?: string;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  createdAt: string;
}

export default function SuperAdminScreen() {
  const { data: session } = useSession();
  const email = session?.user?.email || '';

  const [users, setUsers] = useState<UserRow[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'overview' | 'users' | 'content'>('overview');

  useEffect(() => {
    if (!email) return;
    loadAll();
  }, [email]);

  async function loadAll() {
    setLoading(true);
    try {
      const [sRes, uRes] = await Promise.all([
        fetch(`/api/super/stats?email=${encodeURIComponent(email)}`),
        fetch(`/api/super/users?email=${encodeURIComponent(email)}`),
      ]);
      const s = await sRes.json();
      const u = await uRes.json();
      setStats(s.stats);
      setUsers(u.users || []);
    } catch {}
    setLoading(false);
  }

  if (!session || !email) {
    return (
      <Overlay title="Super Admin">
        <GlassCard variant="dark-strong" padding="p-8" className="text-center">
          <div className="font-display text-[16px] text-ink-on-dark">
            Sign in required
          </div>
        </GlassCard>
      </Overlay>
    );
  }

  return (
    <Overlay title="Super Admin">
      <AmbientGlow color="gold" size={300} style={{ top: -100, right: -100, opacity: 0.4 }} />

      {/* Header */}
      <div className="relative mb-5 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full glass-gold">
          <Star8 size={26} />
        </div>
        <div className="mt-3 font-display text-[20px] font-semibold text-ink-on-dark">
          Super Admin
        </div>
        <div className="mt-1 text-[11.5px] text-ink-faint">{email}</div>
        <div className="mt-4"><OrnamentDivider /></div>
      </div>

      {/* Tabs */}
      <div className="relative mb-4 flex gap-2">
        {(['overview', 'users', 'content'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              'flex-1 rounded-pill py-2.5 text-[10.5px] font-bold uppercase tracking-[0.14em] transition ' +
              (tab === t ? 'bg-champagne text-midnight' : 'glass-dark text-ink-soft')
            }
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-[13px] text-ink-faint">Loading…</div>
      ) : (
        <div className="relative">
          {tab === 'overview' && stats && (
            <div className="grid grid-cols-2 gap-3">
              {[
                { v: stats.totalUsers, l: 'Total Users' },
                { v: stats.totalPrayerLogs, l: 'Prayer Logs' },
                { v: stats.totalTasbeeh, l: 'Tasbeeh Count' },
                { v: stats.totalDebates, l: 'Debates' },
                { v: stats.totalAnnouncements, l: 'Announcements' },
                { v: stats.totalTasbeehLogs, l: 'Dhikr Sessions' },
              ].map((s) => (
                <GlassCard key={s.l} variant="dark" padding="p-4" className="text-center">
                  <div className="font-display text-[26px] font-semibold leading-none text-champagne">
                    {s.v}
                  </div>
                  <div className="mt-2 kicker kicker-gold">{s.l}</div>
                </GlassCard>
              ))}
            </div>
          )}

          {tab === 'users' && (
            <div className="space-y-2">
              <div className="mb-3 text-[12px] text-ink-faint">
                {users.length} signed-in user{users.length === 1 ? '' : 's'}
              </div>
              {users.map((u) => (
                <GlassCard key={u._id} variant="dark" padding="p-3.5">
                  <div className="flex items-center gap-3">
                    {u.image ? (
                      <img src={u.image} alt="" className="h-10 w-10 flex-shrink-0 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-champagne font-display text-[14px] font-semibold text-midnight">
                        {u.name?.[0]?.toUpperCase() || '·'}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="truncate font-display text-[13.5px] font-semibold text-ink-on-dark">
                          {u.name}
                        </div>
                        {u.isSuperAdmin && (
                          <span className="rounded-pill bg-champagne px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-midnight">
                            Super
                          </span>
                        )}
                        {u.isAdmin && !u.isSuperAdmin && (
                          <span className="rounded-pill bg-champagne/20 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-champagne">
                            Admin
                          </span>
                        )}
                      </div>
                      <div className="truncate text-[11px] text-ink-faint">{u.email}</div>
                    </div>
                    <div className="text-[10px] text-ink-faint">
                      {new Date(u.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}

          {tab === 'content' && (
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="glass-dark press w-full rounded-[18px] p-4 text-left"
              >
                <div className="font-display text-[14.5px] font-semibold text-ink-on-dark">
                  🔄 Refresh data
                </div>
                <div className="mt-0.5 text-[11.5px] text-ink-faint">
                  Pull latest from the server
                </div>
              </button>

              <button
                onClick={() => { const s = useAppStore.getState(); s.pushScreen('announcements'); }}
                className="glass-dark press w-full rounded-[18px] p-4 text-left"
              >
                <div className="font-display text-[14.5px] font-semibold text-ink-on-dark">
                  📢 Open Announcements
                </div>
                <div className="mt-0.5 text-[11.5px] text-ink-faint">
                  Review and manage
                </div>
              </button>

              <button
                onClick={() => { const s = useAppStore.getState(); s.pushScreen('debate'); }}
                className="glass-dark press w-full rounded-[18px] p-4 text-left"
              >
                <div className="font-display text-[14.5px] font-semibold text-ink-on-dark">
                  💬 Open Debates
                </div>
                <div className="mt-0.5 text-[11.5px] text-ink-faint">
                  Moderate discussions
                </div>
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-6"><OrnamentDivider /></div>
    </Overlay>
  );
}

// Import at bottom to avoid circular deps
import { useAppStore } from '@/lib/store';