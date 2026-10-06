'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Overlay from './Overlay';
import GlassCard from '@/components/ui/GlassCard';
import { Star8, OrnamentDivider } from '@/components/ui/GoldOrnament';
import { ANNOUNCEMENT_HERO, MOSQUE_INTERIOR, MOSQUE_ARCHES } from '@/lib/images';

interface Comment {
  authorName: string;
  authorEmail?: string;
  message: string;
  createdAt: string;
}

interface Ann {
  _id: string;
  title: string;
  content: string;
  isUrgent: boolean;
  comments: Comment[];
  createdAt: string;
}

export default function AnnouncementsScreen() {
  const { data: session } = useSession();
  const [items, setItems] = useState<Ann[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<Ann | null>(null);

  useEffect(() => {
    fetch('/api/announcements')
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function reload() {
    try {
      const r = await fetch('/api/announcements');
      const d = await r.json();
      setItems(d.items || []);
      if (open) {
        const updated = (d.items || []).find((x: Ann) => x._id === open._id);
        if (updated) setOpen(updated);
      }
    } catch {}
  }

  return (
    <Overlay title="Announcements">
      {loading ? (
        <div className="py-20 text-center text-[13px] text-ink-faint">Loading…</div>
      ) : items.length === 0 ? (
        <GlassCard variant="dark" padding="p-8" className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full glass-gold"><Star8 size={22} /></div>
          <div className="mt-4 font-display text-[16px] font-semibold text-ink-on-dark">No announcements yet</div>
          <div className="mt-1 text-[12px] text-ink-faint">Check back later for updates.</div>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => {
            const img = item.isUrgent ? MOSQUE_ARCHES : i % 2 === 0 ? ANNOUNCEMENT_HERO : MOSQUE_INTERIOR;
            return (
              <GlassCard
                key={item._id}
                variant={item.isUrgent ? 'gold' : 'dark'}
                padding="p-0"
                className="overflow-hidden"
                onClick={() => setOpen(item)}
              >
                <div className="relative h-[120px] overflow-hidden rounded-t-[22px]">
                  <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(3,26,24,0.10) 0%, rgba(6,46,42,0.95) 100%)' }} />
                  {item.isUrgent && (
                    <span className="absolute left-4 top-4 rounded-pill bg-champagne px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-midnight">Urgent</span>
                  )}
                </div>
                <div className="p-5">
                  <div className="font-display text-[17px] font-semibold text-ink-on-dark">{item.title}</div>
                  <div className="my-3"><OrnamentDivider width="80px" /></div>
                  <div className="line-clamp-2 text-[13.5px] leading-[1.55] text-ink-soft">{item.content}</div>
                  <div className="mt-3 flex items-center justify-between border-t border-line-dark pt-3">
                    <div className="text-[11px] text-ink-faint">
                      {new Date(item.createdAt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-champagne">
                      {item.comments?.length || 0} {item.comments?.length === 1 ? 'reply' : 'replies'}
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {open && (
        <AnnouncementDetail
          ann={open}
          session={session}
          onClose={() => setOpen(null)}
          onComment={() => reload()}
        />
      )}
    </Overlay>
  );
}

function AnnouncementDetail({
  ann,
  session,
  onClose,
  onComment,
}: {
  ann: Ann;
  session: any;
  onClose: () => void;
  onComment: () => void;
}) {
  const [name, setName] = useState(session?.user?.name || '');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit() {
    if (!name || !message) { setError('Name and message required'); return; }
    setBusy(true); setError('');
    try {
      const r = await fetch('/api/announcements', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: ann._id,
          authorName: name,
          authorEmail: session?.user?.email,
          message,
        }),
      });
      const d = await r.json();
      if (d.ok) { setMessage(''); onComment(); }
      else setError(d.error || 'Failed');
    } catch { setError('Failed'); }
    finally { setBusy(false); }
  }

  return (
    <div className="fixed inset-0 z-[65] flex items-end justify-center bg-midnight/85 px-3 pb-3 backdrop-blur-md">
      <div className="glass-dark-strong max-h-[90vh] w-full max-w-[440px] overflow-y-auto rounded-[28px] p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {ann.isUrgent && (
              <div className="mb-2 inline-block rounded-pill bg-champagne px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-midnight">
                Urgent
              </div>
            )}
            <div className="font-display text-[20px] font-semibold leading-tight text-ink-on-dark">
              {ann.title}
            </div>
            <div className="mt-1 text-[11.5px] text-ink-faint">
              {new Date(ann.createdAt).toLocaleDateString(undefined, {
                weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
              })}
            </div>
          </div>
          <button onClick={onClose} className="text-[22px] leading-none text-ink-faint">×</button>
        </div>

        <OrnamentDivider width="100%" className="my-4" />

        <div className="whitespace-pre-wrap text-[14px] leading-[1.7] text-ink-soft">
          {ann.content}
        </div>

        <OrnamentDivider width="100%" className="my-5" />

        {/* Comments */}
        <div className="kicker kicker-gold mb-3">
          Responses ({ann.comments?.length || 0})
        </div>

        {(ann.comments?.length || 0) > 0 ? (
          <div className="mb-4 space-y-3">
            {(ann.comments || []).map((c: any, i: number) => (
              <div key={i} className="rounded-[16px] border border-line-dark bg-white/[0.03] p-3">
                <div className="flex items-center justify-between">
                  <div className="font-display text-[13.5px] font-semibold text-ink-on-dark">
                    {c.authorName}
                  </div>
                  <div className="text-[10px] text-ink-faint">
                    {new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                  </div>
                </div>
                <div className="mt-1.5 text-[13px] leading-[1.55] text-ink-soft">{c.message}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-4 rounded-[16px] border border-dashed border-line-dark p-4 text-center text-[12px] text-ink-faint">
            No responses yet — be the first
          </div>
        )}

        {/* New comment */}
        <div className="kicker kicker-gold mb-1">Your response</div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full rounded-[12px] border border-line-dark bg-white/5 px-3 py-3 text-[14px] text-ink-on-dark outline-none focus:border-champagne"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder="Write a respectful response…"
          className="mt-2 w-full rounded-[12px] border border-line-dark bg-white/5 px-3 py-3 text-[14px] text-ink-on-dark outline-none focus:border-champagne"
        />

        {error && <div className="mt-3 rounded-[12px] bg-error-soft p-3 text-center text-[12px] text-error">{error}</div>}

        <button
          onClick={submit}
          disabled={busy}
          className="press mt-4 w-full rounded-pill bg-champagne py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-midnight disabled:opacity-50"
        >
          {busy ? 'Sending…' : 'Send response'}
        </button>
      </div>
    </div>
  );
}