'use client';

import { useEffect, useState } from 'react';
import Overlay from './Overlay';
import GlassCard from '@/components/ui/GlassCard';
import { OrnamentDivider } from '@/components/ui/GoldOrnament';
import AnalogTimePicker from '@/components/ui/AnalogTimePicker';
import { todayISO } from '@/lib/utils';

type PrayerKey = 'fajr' | 'zuhr' | 'asr' | 'maghrib' | 'isha' | 'jummah';
type Times = Record<PrayerKey, string>;
const EMPTY: Times = { fajr: '', zuhr: '', asr: '', maghrib: '', isha: '', jummah: '' };

const OFFSETS: Record<PrayerKey, number> = {
  fajr: 40, zuhr: 15, asr: 15, maghrib: 6, isha: 15, jummah: 15,
};

interface Ann {
  _id: string;
  title: string;
  content: string;
  isUrgent: boolean;
  createdAt: string;
}

export default function AdminScreen() {
  const [date, setDate] = useState(todayISO());
  const [times, setTimes] = useState<Times>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [picking, setPicking] = useState<PrayerKey | null>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [urgent, setUrgent] = useState(false);
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);

  const [annList, setAnnList] = useState<Ann[]>([]);
  const [annLoading, setAnnLoading] = useState(true);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/prayer-times?date=${date}`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.time) {
          setTimes({
            fajr: d.time.fajr || '', zuhr: d.time.zuhr || '', asr: d.time.asr || '',
            maghrib: d.time.maghrib || '', isha: d.time.isha || '', jummah: d.time.jummah || '',
          });
          setLastUpdated(d.time.date);
        } else {
          setTimes(EMPTY);
          setLastUpdated(null);
        }
      })
      .catch(() => {});
  }, [date]);

  useEffect(() => { loadAnnouncements(); }, []);

  async function loadAnnouncements() {
    setAnnLoading(true);
    try {
      const r = await fetch('/api/announcements');
      const d = await r.json();
      setAnnList(d.items || []);
    } catch {}
    setAnnLoading(false);
  }

  function applyTime(key: PrayerKey, value: string) {
    setTimes((prev) => ({ ...prev, [key]: value }));
  }

  async function saveTimes() {
    setSaving(true); setError('');
    const pin = sessionStorage.getItem('admin_pin') || '';
    try {
      const res = await fetch('/api/prayer-times', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, pin, ...times }),
      });
      const data = await res.json();
      if (data.ok) { setSavedAt(Date.now()); setLastUpdated(date); setTimeout(() => setSavedAt(null), 2500); }
      else setError(data.error || 'Failed');
    } catch { setError('Failed'); }
    finally { setSaving(false); }
  }

  async function postAnnouncement() {
    if (!title || !content) { setError('Title and content required'); return; }
    setPosting(true); setError('');
    const pin = sessionStorage.getItem('admin_pin') || '';
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, isUrgent: urgent, pin }),
      });
      const data = await res.json();
      if (data.ok) {
        setTitle(''); setContent(''); setUrgent(false);
        setPosted(true); setTimeout(() => setPosted(false), 2500);
        loadAnnouncements();
      } else setError(data.error || 'Failed');
    } catch { setError('Failed'); }
    finally { setPosting(false); }
  }

  async function deleteAnnouncement(id: string) {
    setDeleting(true);
    const pin = sessionStorage.getItem('admin_pin') || '';
    try {
      const r = await fetch(`/api/announcements?id=${id}&pin=${encodeURIComponent(pin)}`, { method: 'DELETE' });
      const d = await r.json();
      if (d.ok) setAnnList((prev) => prev.filter((x) => x._id !== id));
      else setError(d.error || 'Failed to delete');
    } catch { setError('Failed to delete'); }
    setDeleting(false);
    setConfirming(null);
  }

  function subtract(time: string, min: number): string {
    if (!time || !time.includes(':')) return '--:--';
    const [h, m] = time.split(':').map(Number);
    let tot = h * 60 + m - min;
    tot = ((tot % 1440) + 1440) % 1440;
    return `${String(Math.floor(tot / 60)).padStart(2, '0')}:${String(tot % 60).padStart(2, '0')}`;
  }

  const field = (label: string, key: PrayerKey) => (
    <button
      type="button"
      onClick={() => setPicking(key)}
      className="flex w-full items-center justify-between gap-4 border-b border-line-dark py-3 text-left last:border-0"
    >
      <div>
        <div className="font-display text-[15px] font-semibold text-ink-on-dark">{label}</div>
        <div className="mt-0.5 text-[10.5px] text-ink-faint">
          Azaan will show at {times[key] ? `${subtract(times[key], OFFSETS[key])}` : '--:--'}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={'font-display text-[17px] tabular-nums ' + (times[key] ? 'text-champagne' : 'text-ink-faint')}>
          {times[key] || '--:--'}
        </span>
        <div className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: 'linear-gradient(160deg, rgba(214,180,106,0.25) 0%, rgba(184,149,80,0.10) 100%)', border: '1px solid rgba(214,180,106,0.30)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-champagne)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <polyline points="12 7 12 12 15 14" />
          </svg>
        </div>
      </div>
    </button>
  );

  return (
    <Overlay title="Admin Panel">
      <div className="space-y-5">
        {/* Prayer Times */}
        <GlassCard variant="dark" padding="p-5">
          <div className="kicker kicker-gold mb-1">Set Jamaat Times</div>
          <div className="mb-3 text-[11px] text-ink-faint">Enter the Jamaat time — Azaan will be calculated automatically</div>
          {lastUpdated && (
            <div className="mb-3 text-[11px] text-ink-faint">
              Currently using times from <b className="text-champagne">{lastUpdated}</b>
            </div>
          )}
          <div className="mb-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-[12px] border border-line-dark bg-white/5 px-3 py-2 text-[13px] text-ink-on-dark outline-none focus:border-champagne"
            />
          </div>
          {field('Fajr', 'fajr')}
          {field('Dhuhr', 'zuhr')}
          {field('Asr', 'asr')}
          {field('Maghrib', 'maghrib')}
          {field('Isha', 'isha')}
          {field('Jumu‘ah', 'jummah')}
          <button
            onClick={saveTimes}
            disabled={saving}
            className="press mt-5 w-full rounded-pill bg-champagne py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-midnight disabled:opacity-50"
          >
            {saving ? 'Saving…' : savedAt ? '✓ Saved' : 'Save prayer times'}
          </button>
        </GlassCard>

        {/* Post Announcement */}
        <GlassCard variant="gold" padding="p-5">
          <div className="kicker kicker-gold mb-3">Post Announcement</div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full rounded-[12px] border border-line-dark bg-white/5 px-3 py-3 text-[14px] text-ink-on-dark outline-none focus:border-champagne"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            rows={4}
            className="mt-3 w-full rounded-[12px] border border-line-dark bg-white/5 px-3 py-3 text-[14px] text-ink-on-dark outline-none focus:border-champagne"
          />
          <label className="mt-3 flex items-center gap-2 text-[13px] text-ink-soft">
            <input type="checkbox" checked={urgent} onChange={(e) => setUrgent(e.target.checked)} className="h-4 w-4" />
            Mark as urgent
          </label>
          <button
            onClick={postAnnouncement}
            disabled={posting}
            className="press mt-4 w-full rounded-pill bg-champagne py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-midnight disabled:opacity-50"
          >
            {posting ? 'Posting…' : posted ? '✓ Posted' : 'Post announcement'}
          </button>
        </GlassCard>

        {/* Manage Announcements */}
        <GlassCard variant="dark" padding="p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="kicker kicker-gold">Manage Announcements</div>
            <div className="rounded-pill bg-champagne/15 px-2.5 py-0.5 text-[10px] font-bold text-champagne">
              {annList.length}
            </div>
          </div>

          {annLoading ? (
            <div className="py-6 text-center text-[12px] text-ink-faint">Loading…</div>
          ) : annList.length === 0 ? (
            <div className="py-6 text-center text-[12px] text-ink-faint">No announcements posted yet</div>
          ) : (
            <div className="space-y-2">
              {annList.map((a) => (
                <div
                  key={a._id}
                  className="flex items-center gap-3 rounded-[14px] border border-line-dark bg-white/[0.03] p-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {a.isUrgent && (
                        <span className="rounded-pill bg-champagne px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-midnight">
                          Urgent
                        </span>
                      )}
                      <div className="truncate font-display text-[13.5px] font-semibold text-ink-on-dark">
                        {a.title}
                      </div>
                    </div>
                    <div className="mt-0.5 truncate text-[11px] text-ink-faint">
                      {new Date(a.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <button
                    onClick={() => setConfirming(a._id)}
                    className="press flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
                    style={{ background: 'rgba(168,70,70,0.20)', border: '1px solid rgba(168,70,70,0.4)' }}
                    aria-label="Delete"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E8A8A8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        {error && (
          <div className="rounded-[16px] bg-error-soft p-3 text-center text-[12px] font-medium text-error">
            {error}
          </div>
        )}

        <div className="mt-4"><OrnamentDivider /></div>
      </div>

      {/* Time picker */}
      {picking && (
        <AnalogTimePicker
          value={times[picking] || '06:00'}
          title={`Jamaat · ${picking.charAt(0).toUpperCase() + picking.slice(1)}`}
          onCancel={() => setPicking(null)}
          onConfirm={(t) => { applyTime(picking, t); setPicking(null); }}
        />
      )}

      {/* Confirm delete modal */}
      {confirming && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-midnight/85 px-5 backdrop-blur-md">
          <div className="glass-dark-strong w-full max-w-[360px] rounded-[26px] p-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full" style={{ background: 'rgba(168,70,70,0.20)', border: '1px solid rgba(168,70,70,0.4)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E8A8A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
              </svg>
            </div>
            <div className="mt-4 font-display text-[17px] font-semibold text-ink-on-dark">Delete this announcement?</div>
            <div className="mt-2 text-[12px] text-ink-soft">This action cannot be undone.</div>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setConfirming(null)}
                disabled={deleting}
                className="glass-dark press flex-1 rounded-pill py-3 text-[10.5px] font-bold uppercase tracking-[0.16em] text-ink-soft"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteAnnouncement(confirming)}
                disabled={deleting}
                className="press flex-1 rounded-pill py-3 text-[10.5px] font-bold uppercase tracking-[0.16em] text-white disabled:opacity-50"
                style={{ background: 'linear-gradient(160deg, #C25B5B 0%, #A84646 55%, #7A2C2C 100%)' }}
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Overlay>
  );
}