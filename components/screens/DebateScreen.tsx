'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Overlay from './Overlay';
import GlassCard from '@/components/ui/GlassCard';
import { Star8, OrnamentDivider } from '@/components/ui/GoldOrnament';
import CommentDialog, { Comment } from '@/components/ui/CommentDialog';
import { DEBATE_HERO } from '@/lib/images';

interface Debate {
  _id: string;
  proposerName: string;
  proposerContact: string;
  proposerUserId?: string;
  proposerEmail?: string;
  topic: string;
  proposedTime: string;
  venue: string;
  description: string;
  status: 'open' | 'negotiating' | 'confirmed' | 'closed';
  responses: Comment[];
  createdAt: string;
}

const GUIDELINES_KEY = 'hasSeenDebateGuidelines';

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  open: { bg: 'rgba(120,155,138,0.20)', color: '#A3B8A8' },
  negotiating: { bg: 'rgba(214,180,106,0.20)', color: '#D6B46A' },
  confirmed: { bg: 'rgba(120,155,138,0.28)', color: '#B5D5B8' },
  closed: { bg: 'rgba(245,240,230,0.10)', color: 'rgba(245,240,230,0.5)' },
};

export default function DebateScreen() {
  const { data: session } = useSession();
  const [items, setItems] = useState<Debate[]>([]);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [respondTo, setRespondTo] = useState<Debate | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const userId = (session?.user as any)?.id || '';
  const userEmail = session?.user?.email || '';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const seen = localStorage.getItem(GUIDELINES_KEY);
      if (!seen) setShowGuidelines(true);
      setIsAdmin(!!sessionStorage.getItem('admin_pin'));
    }
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch('/api/debates');
      const d = await r.json();
      setItems(d.items || []);
    } catch {}
    setLoading(false);
  }

  async function remove(id: string) {
    setBusy(true);
    const pin = sessionStorage.getItem('admin_pin') || '';
    try {
      const r = await fetch(
        `/api/debates?id=${id}&pin=${encodeURIComponent(pin)}&userId=${encodeURIComponent(userId)}`,
        { method: 'DELETE' }
      );
      const d = await r.json();
      if (d.ok) {
        setItems((prev) => prev.filter((x) => x._id !== id));
      } else {
        alert(d.error || 'Failed to delete');
      }
    } catch {
      alert('Failed to delete');
    }
    setBusy(false);
    setConfirming(null);
  }

  function canDelete(d: Debate) {
    if (isAdmin) return true;
    if (userId && d.proposerUserId === userId) return true;
    return false;
  }

  async function submitResponse(payload: {
    authorName: string;
    authorEmail?: string;
    message: string;
  }) {
    if (!respondTo) return false;
    const r = await fetch('/api/debates', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: respondTo._id,
        responderName: payload.authorName,
        responderEmail: payload.authorEmail,
        responderUserId: userId,
        type: 'accept',
        message: payload.message,
      }),
    });
    const d = await r.json();
    if (d.ok) { await load(); return true; }
    return false;
  }

  return (
    <Overlay title="Debate & Discussions">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[12px] text-ink-faint">
          {items.length} proposal{items.length === 1 ? '' : 's'}
        </div>
        <button onClick={() => setShowForm(true)} className="press rounded-pill bg-champagne px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-midnight">
          + Propose
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-[13px] text-ink-faint">Loading…</div>
      ) : items.length === 0 ? (
        <GlassCard variant="dark" padding="p-8" className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full glass-gold">
            <Star8 size={22} />
          </div>
          <div className="mt-4 font-display text-[16px] font-semibold text-ink-on-dark">No debates yet</div>
          <div className="mt-1 text-[12px] text-ink-faint">Be the first to propose one.</div>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {items.map((d) => {
            const s = STATUS_STYLE[d.status] || STATUS_STYLE.open;
            const replyCount = d.responses?.length || 0;
            const owned = canDelete(d);

            return (
              <div key={d._id} className="relative">
                <GlassCard variant="dark" padding="p-0" className="overflow-hidden">
                  <button onClick={() => setRespondTo(d)} className="press relative block w-full text-left">
                    <div className="relative h-[100px] overflow-hidden rounded-t-[22px]">
                      <img src={DEBATE_HERO} alt="" className="absolute inset-0 h-full w-full object-cover" />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(3,26,24,0.10) 0%, rgba(6,46,42,0.95) 100%)' }} />
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="font-display text-[17px] font-semibold leading-tight text-ink-on-dark">{d.topic}</div>
                        <span className="rounded-pill px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]" style={{ background: s.bg, color: s.color }}>
                          {d.status}
                        </span>
                      </div>
                      <div className="mt-2 text-[12px] text-ink-soft">
                        {d.proposerName} · {d.proposedTime}
                        {userId && d.proposerUserId === userId && (
                          <span className="ml-2 rounded-pill bg-champagne/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-champagne">
                            Yours
                          </span>
                        )}
                      </div>
                      {d.venue && <div className="mt-0.5 text-[12px] text-ink-faint">📍 {d.venue}</div>}
                      <div className="mt-3 flex items-center justify-between border-t border-line-dark pt-3">
                        <div className="text-[12px] text-ink-faint">
                          {replyCount} response{replyCount === 1 ? '' : 's'}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-champagne">
                          Open
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </button>
                </GlassCard>

                {owned && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setConfirming(d._id); }}
                    className="press absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full"
                    style={{
                      background: 'rgba(168,70,70,0.85)',
                      border: '1px solid rgba(255,255,255,0.25)',
                      backdropFilter: 'blur(8px)',
                    }}
                    aria-label="Delete"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {respondTo && (
        <CommentDialog
          title={respondTo.topic}
          subtitle={`by ${respondTo.proposerName} · ${respondTo.proposedTime}${respondTo.venue ? ` · ${respondTo.venue}` : ''}`}
          content={respondTo.description}
          image={DEBATE_HERO}
          comments={(respondTo.responses || []).map((r: any) => ({
            _id: r._id,
            authorName: r.responderName,
            authorEmail: r.responderEmail,
            message: r.message,
            createdAt: r.createdAt,
            type: r.type,
            counterTime: r.counterTime,
            counterVenue: r.counterVenue,
          }))}
          accentColor="#9B7AC8"
          isAdmin={isAdmin}
          onSubmit={submitResponse}
          onDelete={async (responseId: string) => {
            const pin = sessionStorage.getItem('admin_pin') || '';
            const r = await fetch('/api/debates', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: respondTo._id,
                responseId,
                email: userEmail,
                pin,
              }),
            });
            const d = await r.json();
            if (d.ok) { await load(); return true; }
            return false;
          }}
          onClose={() => { setRespondTo(null); load(); }}
        />
      )}

      {confirming && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-midnight/90 px-5 backdrop-blur-md">
          <div className="glass-dark-strong w-full max-w-[360px] rounded-[26px] p-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full" style={{ background: 'rgba(168,70,70,0.20)', border: '1px solid rgba(168,70,70,0.4)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E8A8A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
              </svg>
            </div>
            <div className="mt-4 font-display text-[17px] font-semibold text-ink-on-dark">Delete this debate?</div>
            <div className="mt-2 text-[12px] text-ink-soft">
              All responses will also be deleted. This cannot be undone.
            </div>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setConfirming(null)}
                disabled={busy}
                className="glass-dark press flex-1 rounded-pill py-3 text-[10.5px] font-bold uppercase tracking-[0.16em] text-ink-soft"
              >
                Cancel
              </button>
              <button
                onClick={() => remove(confirming)}
                disabled={busy}
                className="press flex-1 rounded-pill py-3 text-[10.5px] font-bold uppercase tracking-[0.16em] text-white disabled:opacity-50"
                style={{ background: 'linear-gradient(160deg, #C25B5B 0%, #A84646 55%, #7A2C2C 100%)' }}
              >
                {busy ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showGuidelines && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-midnight/85 px-5 backdrop-blur-md">
          <div className="glass-dark-strong w-full max-w-[400px] rounded-[28px] p-6">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full glass-gold">
                <Star8 size={22} />
              </div>
              <div className="mt-4 font-display text-[20px] font-semibold text-ink-on-dark">Debate Guidelines</div>
            </div>
            <div className="mt-5 space-y-3 text-[13.5px] leading-[1.55] text-ink-soft">
              <p><b className="text-champagne">Be Respectful.</b> Speak with kindness even when you disagree.</p>
              <p><b className="text-champagne">Stick to Facts.</b> Base your arguments on knowledge and authentic sources.</p>
              <p><b className="text-champagne">Stay Peaceful.</b> The goal is understanding, not winning.</p>
              <p><b className="text-champagne">Honor Islamic Values.</b> Keep within the bounds of Shariah.</p>
              <p><b className="text-champagne">Make Dua.</b> Ask Allah for clarity and sincerity.</p>
            </div>
            <button onClick={() => { localStorage.setItem(GUIDELINES_KEY, '1'); setShowGuidelines(false); }} className="press mt-6 w-full rounded-pill bg-champagne py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-midnight">
              I agree — continue
            </button>
          </div>
        </div>
      )}

      {showForm && <ProposeForm session={session} onClose={() => setShowForm(false)} onCreated={() => { setShowForm(false); load(); }} />}
    </Overlay>
  );
}

function ProposeForm({
  session,
  onClose,
  onCreated,
}: {
  session: any;
  onClose: () => void;
  onCreated: () => void;
}) {
  const isSignedIn = !!session?.user?.email;
  const [contact, setContact] = useState('');
  const [topic, setTopic] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('Masjid Al-Hamzah');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit() {
    if (!isSignedIn) return;
    if (!contact || !topic || !time) { setError('Fill all required fields'); return; }
    setBusy(true); setError('');
    try {
      const r = await fetch('/api/debates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: session.user.name,
          contact,
          topic,
          time,
          venue,
          description,
          proposerUserId: (session.user as any).id,
          proposerEmail: session.user.email,
        }),
      });
      const d = await r.json();
      if (d.ok) onCreated(); else setError(d.error || 'Failed');
    } catch { setError('Failed'); }
    finally { setBusy(false); }
  }

  const inp = (value: string, setter: (v: string) => void, label: string, required = false, textarea = false, placeholder = '') => (
    <div className="mt-3">
      <div className="kicker kicker-gold mb-1">{label}{required && ' *'}</div>
      {textarea ? (
        <textarea value={value} onChange={(e) => setter(e.target.value)} rows={3} placeholder={placeholder} className="w-full rounded-[12px] border border-line-dark bg-white/5 px-3 py-3 text-[14px] text-ink-on-dark outline-none focus:border-champagne" />
      ) : (
        <input value={value} onChange={(e) => setter(e.target.value)} placeholder={placeholder} className="w-full rounded-[12px] border border-line-dark bg-white/5 px-3 py-3 text-[14px] text-ink-on-dark outline-none focus:border-champagne" />
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-midnight/85 px-3 pb-3 backdrop-blur-md">
      <div className="glass-dark-strong max-h-[90vh] w-full max-w-[440px] overflow-y-auto rounded-[28px] p-5">
        <div className="flex items-center justify-between">
          <div className="font-display text-[18px] font-semibold text-ink-on-dark">Propose a debate</div>
          <button onClick={onClose} className="text-[22px] leading-none text-ink-faint">×</button>
        </div>

        {!isSignedIn ? (
          <div className="mt-5 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full glass-gold">
              <Star8 size={22} />
            </div>
            <div className="mt-4 font-display text-[16px] font-semibold text-ink-on-dark">
              Sign in to propose a debate
            </div>
            <div className="mt-2 text-[12.5px] text-ink-soft">
              Only signed-in members can propose debates.
            </div>
            <button onClick={() => signIn('google')} className="press mt-5 w-full rounded-pill bg-champagne py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-midnight">
              Sign in with Google
            </button>
          </div>
        ) : (
          <>
            <div className="mt-4 rounded-[16px] border border-line-dark bg-white/[0.03] p-3">
              <div className="kicker kicker-gold mb-1">Proposing as</div>
              <div className="font-display text-[14.5px] font-semibold text-ink-on-dark">{session.user.name}</div>
              <div className="text-[11.5px] text-ink-faint">{session.user.email}</div>
            </div>
            {inp(contact, setContact, 'Contact number', true, false, '+91 ...')}
            {inp(topic, setTopic, 'Topic', true)}
            {inp(time, setTime, 'Proposed time', true, false, 'e.g. Friday after Maghrib')}
            {inp(venue, setVenue, 'Venue', false, false, 'Masjid Al-Hamzah')}
            {inp(description, setDescription, 'Description', false, true, 'Add context to your proposal')}
            {error && <div className="mt-3 rounded-[12px] bg-error-soft p-3 text-center text-[12px] text-error">{error}</div>}
            <button onClick={submit} disabled={busy} className="press mt-5 w-full rounded-pill bg-champagne py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-midnight disabled:opacity-50">
              {busy ? 'Posting…' : 'Submit proposal'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}