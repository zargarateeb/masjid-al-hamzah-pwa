'use client';

import { useEffect, useState } from 'react';
import Overlay from './Overlay';
import GlassCard from '@/components/ui/GlassCard';
import { Star8, OrnamentDivider } from '@/components/ui/GoldOrnament';
import CommentDialog, { Comment } from '@/components/ui/CommentDialog';
import { ANNOUNCEMENT_HERO, MOSQUE_INTERIOR, MOSQUE_ARCHES } from '@/lib/images';

interface Ann {
  _id: string;
  title: string;
  content: string;
  isUrgent: boolean;
  comments: Comment[];
  createdAt: string;
}

export default function AnnouncementsScreen() {
  const [items, setItems] = useState<Ann[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  async function load() {
    try {
      const r = await fetch('/api/announcements');
      const d = await r.json();
      setItems(d.items || []);
    } catch {}
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAdmin(!!sessionStorage.getItem('admin_pin'));
    }
    load().finally(() => setLoading(false));
  }, []);

  const open = items.find((i) => i._id === openId) || null;

  async function submitComment(payload: {
    authorName: string;
    authorEmail?: string;
    message: string;
  }) {
    if (!open) return false;
    const r = await fetch('/api/announcements', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: open._id,
        authorName: payload.authorName,
        authorEmail: payload.authorEmail,
        message: payload.message,
      }),
    });
    const d = await r.json();
    if (d.ok) { await load(); return true; }
    return false;
  }

  async function deleteComment(commentId: string) {
    if (!open) return false;
    const pin = sessionStorage.getItem('admin_pin') || '';
    const r = await fetch('/api/announcements', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: open._id,
        commentId,
        email: '',
        pin,
      }),
    });
    const d = await r.json();
    if (d.ok) { await load(); return true; }
    return false;
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
            const replyCount = item.comments?.length || 0;
            return (
              <GlassCard
                key={item._id}
                variant={item.isUrgent ? 'gold' : 'dark'}
                padding="p-0"
                className="overflow-hidden"
                onClick={() => setOpenId(item._id)}
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
                      {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
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
        <CommentDialog
          title={open.title}
          subtitle={new Date(open.createdAt).toLocaleDateString(undefined, {
            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
          })}
          content={open.content}
          comments={open.comments || []}
          accentColor="#D6B46A"
          isAdmin={isAdmin}
          onSubmit={submitComment}
          onDelete={deleteComment}
          onClose={() => setOpenId(null)}
        />
      )}
    </Overlay>
  );
}