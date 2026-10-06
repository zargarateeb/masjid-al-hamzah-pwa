'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Overlay from './Overlay';
import GlassCard from '@/components/ui/GlassCard';
import { Star8, OrnamentDivider } from '@/components/ui/GoldOrnament';
import { DEBATE_HERO } from '@/lib/images';

interface Response {
  responderName: string;
  type: 'accept' | 'counter';
  message: string;
  counterTime?: string;
  counterTopic?: string;
  counterVenue?: string;
  createdAt: string;
}

interface Debate {
  _id: string;
  proposerName: string;
  proposerContact: string;
  topic: string;
  proposedTime: string;
  venue: string;
  description: string;
  status: 'open' | 'negotiating' | 'confirmed' | 'closed';
  responses: Response[];
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
      const r = await fetch(`/api/debates?id=${id}&pin=${encodeURIComponent(pin)}`, { method: 'DELETE' });
      const d = await r.json();
      if (d.ok) setItems((prev) => prev.filter((x) => x._id !== id));
      else alert(d.error || 'Failed to delete');
    } catch { alert('Failed to delete'); }
    setBusy(false);
    setConfirming(null);
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
            return (
              <GlassCard key={d._id} variant="dark" padding="p-0" className="overflow-hidden">
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
                    <div className="mt-2 text-[12px] text-ink-soft">{d.proposerName} · {d.proposedTime}</div>
                    {d.venue && <div className="mt-0.5 text-[12px] text-ink-faint">📍 {d.venue}</div>}
                    {d.responses.length > 0 && (
                      <div className="mt-3 flex items-center justify-between border-t border-line-dark pt-3">
                        <div className="text-[12px] text-ink-faint">
                          {d.responses.length} response{d.responses.length === 1 ? '' : 's'}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-champagne">
                          Open
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </button>

                {isAdmin && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setConfirming(d._id); }}
                    className="press absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full"
                    style={{ background: 'rgba(168,70,70,0.85)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
                    </svg>
                  </button>
                )}
              </GlassCard>
            );
          })}
        </div>
      )}

      {respondTo && (
        <RespondSheet
          debate={respondTo}
          session={session}
          onClose={() => setRespondTo(null)}
          onDone={() => { setRespondTo(null); load(); }}
        />
      )}

      {confirming && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-midnight/85 px-5 backdrop-blur-md">
          <div className="glass-dark-strong w-full max-w-[360px] rounded-[26px] p-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full" style={{ background: 'rgba(168,70,70,0.20)', border: '1px solid rgba(168,70,70,0.4)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E8A8A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
              </svg>
            </div>
            <div className="mt-4 font-display text-[17px] font-semibold text-ink-on-dark">Delete this debate?</div>
            <div className="mt-2 text-[12px] text-ink-soft">This action cannot be undone.</div>
            <div className="mt-5 flex gap-2">
              <button onClick={() => setConfirming(null)} disabled={busy} className="glass-dark press flex-1 rounded-pill py-3 text-[10.5px] font-bold uppercase tracking-[0.16em] text-ink-soft">Cancel</button>
              <button onClick={() => remove(confirming)} disabled={busy} className="press flex-1 rounded-pill py-3 text-[10.5px] font-bold uppercase tracking-[0.16em] text-white disabled:opacity-50" style={{ background: 'linear-gradient(160deg, #C25B5B 0%, #A84646 55%, #7A2C2C 100%)' }}>
                {busy ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showGuidelines && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-midnight/85 px-5 backdrop-blur-md">
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

      {showForm && <ProposeForm onClose={() => setShowForm(false)} onCreated={() => { setShowForm(false); load(); }} />}
    </Overlay>
  );
}

// ─── Respond sheet ─────────────────────────────────────
function RespondSheet({
  debate,
  session,
  onClose,
  onDone,
}: {
  debate: Debate;
  session: any;
  onClose: () => void;
  onDone: () => void;
}) {
  const [name, setName] = useState(session?.user?.name || '');
  const [contact, setContact] = useState('');
  const [type, setType] = useState<'accept' | 'counter'>('accept');
  const [message, setMessage] = useState('');
  const [counterTime, setCounterTime] = useState('');
  const [counterTopic, setCounterTopic] = useState('');
  const [counterVenue, setCounterVenue] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit() {
    if (!name || !message) { setError('Name and message required'); return; }
    setBusy(true); setError('');
    try {
      const r = await fetch('/api/debates', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: debate._id,
          responderName: name,
          responderContact: contact,
          type,
          message,
          counterTime: type === 'counter' ? counterTime : undefined,
          counterTopic: type === 'counter' ? counterTopic : undefined,
          counterVenue: type === 'counter' ? counterVenue : undefined,
        }),
      });
      const d = await r.json();
      if (d.ok) onDone(); else setError(d.error || 'Failed');
    } catch { setError('Failed'); }
    finally { setBusy(false); }
  }

  const inp = (value: string, setter: (v: string) => void, label: string, placeholder = '', required = false) => (
    <div className="mt-3">
      <div className="kicker kicker-gold mb-1">{label}{required && ' *'}</div>
      <input
        value={value}
        onChange={(e) => setter(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[12px] border border-line-dark bg-white/5 px-3 py-3 text-[14px] text-ink-on-dark outline-none focus:border-champagne"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-[65] flex items-end justify-center bg-midnight/85 px-3 pb-3 backdrop-blur-md">
      <div className="glass-dark-strong max-h-[90vh] w-full max-w-[440px] overflow-y-auto rounded-[28px] p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="kicker kicker-gold">Debate</div>
            <div className="mt-1 font-display text-[18px] font-semibold leading-tight text-ink-on-dark">
              {debate.topic}
            </div>
            <div className="mt-1 text-[12px] text-ink-soft">
              by {debate.proposerName} · {debate.proposedTime}
            </div>
          </div>
          <button onClick={onClose} className="text-[22px] leading-none text-ink-faint">×</button>
        </div>

        {/* Prior responses */}
        {debate.responses.length > 0 && (
          <div className="mt-4 max-h-[140px] overflow-y-auto rounded-[16px] border border-line-dark bg-white/[0.03] p-3">
            <div className="kicker kicker-gold mb-2">Responses ({debate.responses.length})</div>
            <div className="space-y-2">
              {debate.responses.map((r, i) => (
                <div key={i} className="text-[12.5px] leading-[1.5] text-ink-soft">
                  <span className="font-semibold text-champagne">{r.responderName}</span>{' '}
                  <span className="text-ink-faint">
                    {r.type === 'accept' ? 'accepted' : 'counter-proposed'}
                  </span>
                  <div className="mt-0.5">{r.message}</div>
                  {r.counterTime && (
                    <div className="mt-0.5 text-[11.5px] italic text-ink-faint">
                      🕐 {r.counterTime}
                      {r.counterVenue && ` · ${r.counterVenue}`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <OrnamentDivider width="100%" className="my-4" />

        {/* Mode toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setType('accept')}
            className={
              'flex-1 rounded-pill py-3 text-[11px] font-bold uppercase tracking-[0.16em] transition ' +
              (type === 'accept' ? 'bg-champagne text-midnight' : 'glass-dark text-ink-soft')
            }
          >
            ✓ Accept
          </button>
          <button
            onClick={() => setType('counter')}
            className={
              'flex-1 rounded-pill py-3 text-[11px] font-bold uppercase tracking-[0.16em] transition ' +
              (type === 'counter' ? 'bg-champagne text-midnight' : 'glass-dark text-ink-soft')
            }
          >
            🔄 Counter-propose
          </button>
        </div>

        {inp(name, setName, 'Your name', '', true)}
        {inp(contact, setContact, 'Contact (optional)')}

        {type === 'counter' && (
          <>
            {inp(counterTime, setCounterTime, 'Proposed time', 'e.g. Friday 3 PM')}
            {inp(counterTopic, setCounterTopic, 'Suggested topic (optional)')}
            {inp(counterVenue, setCounterVenue, 'Suggested venue (optional)')}
          </>
        )}

        <div className="mt-3">
          <div className="kicker kicker-gold mb-1">Message *</div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder={type === 'accept' ? 'I accept this proposal...' : 'I would like to suggest some changes...'}
            className="w-full rounded-[12px] border border-line-dark bg-white/5 px-3 py-3 text-[14px] text-ink-on-dark outline-none focus:border-champagne"
          />
        </div>

        {error && <div className="mt-3 rounded-[12px] bg-error-soft p-3 text-center text-[12px] text-error">{error}</div>}

        <button
          onClick={submit}
          disabled={busy}
          className="press mt-5 w-full rounded-pill bg-champagne py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-midnight disabled:opacity-50"
        >
          {busy ? 'Sending…' : type === 'accept' ? 'Accept debate' : 'Send counter-proposal'}
        </button>
      </div>
    </div>
  );
}

// ─── Propose form ──────────────────────────────────────
function ProposeForm({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [topic, setTopic] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('Masjid Al-Hamzah');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit() {
    if (!name || !contact || !topic || !time) { setError('Fill all required fields'); return; }
    setBusy(true); setError('');
    try {
      const r = await fetch('/api/debates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, contact, topic, time, venue, description }) });
      const d = await r.json();
      if (d.ok) onCreated(); else setError(d.error || 'Failed');
    } catch { setError('Failed'); }
    finally { setBusy(false); }
  }

  const inp = (value: string, setter: (v: string) => void, label: string, required = false, textarea = false) => (
    <div className="mt-3">
      <div className="kicker kicker-gold mb-1">{label}{required && ' *'}</div>
      {textarea ? (
        <textarea value={value} onChange={(e) => setter(e.target.value)} rows={3} className="w-full rounded-[12px] border border-line-dark bg-white/5 px-3 py-3 text-[14px] text-ink-on-dark outline-none focus:border-champagne" />
      ) : (
        <input value={value} onChange={(e) => setter(e.target.value)} className="w-full rounded-[12px] border border-line-dark bg-white/5 px-3 py-3 text-[14px] text-ink-on-dark outline-none focus:border-champagne" />
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
        {inp(name, setName, 'Your name', true)}
        {inp(contact, setContact, 'Contact number', true)}
        {inp(topic, setTopic, 'Topic', true)}
        {inp(time, setTime, 'Proposed time', true)}
        {inp(venue, setVenue, 'Venue')}
        {inp(description, setDescription, 'Description', false, true)}
        {error && <div className="mt-3 rounded-[12px] bg-error-soft p-3 text-center text-[12px] text-error">{error}</div>}
        <button onClick={submit} disabled={busy} className="press mt-5 w-full rounded-pill bg-champagne py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-midnight disabled:opacity-50">
          {busy ? 'Posting…' : 'Submit proposal'}
        </button>
      </div>
    </div>
  );
}