'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Overlay from './Overlay';
import GlassCard from '@/components/ui/GlassCard';
import AmbientGlow from '@/components/ui/AmbientGlow';
import { Star8, OrnamentDivider } from '@/components/ui/GoldOrnament';
import ImageAvatar from '@/components/ui/ImageAvatar';

export default function ProfileScreen() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const userId = (session?.user as any)?.id || '';
  const userEmail = session?.user?.email || '';

  async function load() {
    if (!userId && !userEmail) { setLoading(false); return; }
    try {
      const q = userId ? `userId=${userId}` : `email=${encodeURIComponent(userEmail)}`;
      const r = await fetch(`/api/profile?${q}`);
      const d = await r.json();
      setProfile(d.profile);
      setStats(d.stats);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { load(); }, [userId, userEmail]);

  if (!session) {
    return (
      <Overlay title="Profile">
        <GlassCard variant="dark-strong" padding="p-8" className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full glass-gold">
            <Star8 size={30} />
          </div>
          <div className="mt-5 font-display text-[20px] font-semibold text-ink-on-dark">
            Sign in to see your profile
          </div>
          <div className="mt-2 text-[13px] text-ink-soft">
            Track your worship, save progress, and connect with the community.
          </div>
          <button onClick={() => signIn('google')} className="press mt-6 w-full rounded-pill bg-champagne py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-midnight">
            Sign in with Google
          </button>
        </GlassCard>
      </Overlay>
    );
  }

  if (loading) {
    return (
      <Overlay title="Profile">
        <div className="py-20 text-center text-[13px] text-ink-faint">Loading…</div>
      </Overlay>
    );
  }

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
    : '';

  return (
    <Overlay title="Profile">
      <div className="space-y-5">
        <div className="relative">
          <AmbientGlow color="gold" size={220} style={{ top: -60, right: -80, opacity: 0.4 }} />
          <GlassCard variant="dark-strong" padding="p-6">
            <div className="flex flex-col items-center text-center">
              <ImageAvatar src={profile?.image} name={profile?.name} size={92} />
              <div className="mt-4 font-display text-[22px] font-semibold text-ink-on-dark text-glow-white">
                {profile?.name}
              </div>
              <div className="mt-1 text-[12px] text-ink-faint">{profile?.email}</div>
              {profile?.city && <div className="mt-1 text-[11.5px] text-ink-soft">📍 {profile.city}</div>}
              {profile?.bio && <div className="mt-3 max-w-[280px] text-[12.5px] leading-[1.5] text-ink-soft italic">&ldquo;{profile.bio}&rdquo;</div>}
              <div className="mt-3 rounded-pill bg-champagne/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-champagne">
                Community Member
              </div>
              {memberSince && <div className="mt-2 text-[10.5px] text-ink-faint">Member since {memberSince}</div>}
              <div className="mt-5 w-full"><OrnamentDivider width="100%" /></div>
              <button onClick={() => setEditing(true)} className="press mt-5 w-full rounded-pill bg-champagne py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-midnight">
                Edit Profile
              </button>
            </div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { v: stats?.daysActive || 0, l: 'Days Active' },
            { v: stats?.fardsTotal || 0, l: 'Fards Tracked' },
            { v: stats?.completeDays || 0, l: 'Complete Days' },
            { v: stats?.tasbeehTotal || 0, l: 'Tasbeeh Count' },
          ].map((s) => (
            <GlassCard key={s.l} variant="dark" padding="p-4" className="text-center">
              <div className="font-display text-[28px] font-semibold leading-none text-champagne">{s.v}</div>
              <div className="mt-2 kicker kicker-gold">{s.l}</div>
            </GlassCard>
          ))}
        </div>

        <GlassCard variant="gold" padding="p-5">
          <div className="flex items-center justify-between">
            <div className="kicker kicker-gold">Streaks</div>
            <Star8 size={12} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-faint">Current</div>
              <div className="mt-1 font-display text-[34px] font-semibold leading-none text-champagne text-glow-gold">{stats?.currentStreak || 0}</div>
              <div className="mt-1 text-[11px] text-ink-soft">days in a row</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-faint">Best</div>
              <div className="mt-1 font-display text-[34px] font-semibold leading-none text-champagne">{stats?.bestStreak || 0}</div>
              <div className="mt-1 text-[11px] text-ink-soft">personal record</div>
            </div>
          </div>
        </GlassCard>

        <div className="space-y-2.5">
          {[
            { key: 'edit', label: 'Edit Profile', sub: 'Name, phone, city, bio' },
            { key: 'discussions', label: 'My Discussions', sub: 'Your debate proposals' },
            { key: 'saved', label: 'Saved Duas', sub: 'Bookmarked supplications' },
            { key: 'events', label: 'My Events', sub: 'Registered masjid events' },
            { key: 'preferences', label: 'Preferences', sub: 'Notifications & appearance' },
          ].map((m) => (
            <button
              key={m.key}
              onClick={() => { if (m.key === 'edit') setEditing(true); }}
              className="glass-dark press flex w-full items-center gap-3 rounded-[18px] p-4 text-left"
            >
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl" style={{ background: 'linear-gradient(160deg, rgba(214,180,106,0.20) 0%, rgba(184,149,80,0.08) 100%)', border: '1px solid rgba(214,180,106,0.24)' }}>
                <Star8 size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-display text-[14.5px] font-semibold text-ink-on-dark">{m.label}</div>
                <div className="mt-0.5 text-[11px] text-ink-faint">{m.sub}</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-champagne)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          ))}
        </div>

        <OrnamentDivider />

        <GlassCard variant="dark" padding="p-4" className="text-center">
          <div className="kicker kicker-gold">Developed by Ateeb</div>
          <div className="mt-2 flex items-center justify-center gap-3 text-[12px] text-ink-soft">
            <a href="https://linkedin.com/in/zargarateeb" target="_blank" rel="noopener noreferrer" className="hover:text-champagne">LinkedIn</a>
            <span className="text-ink-faint">·</span>
            <a href="https://github.com/zargarateeb" target="_blank" rel="noopener noreferrer" className="hover:text-champagne">GitHub</a>
            <span className="text-ink-faint">·</span>
            <a href="mailto:zargarateeb4@gmail.com" className="hover:text-champagne">Email</a>
          </div>
        </GlassCard>

        <button onClick={() => signOut()} className="press flex w-full items-center justify-center gap-2 rounded-pill py-3.5 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ background: 'rgba(168,70,70,0.20)', border: '1px solid rgba(168,70,70,0.4)', color: '#E8A8A8' }}>
          Sign out
        </button>
      </div>

      {editing && (
        <EditProfileModal
          profile={profile}
          userId={userId}
          userEmail={userEmail}
          onClose={() => setEditing(false)}
          onSaved={() => { setEditing(false); load(); }}
        />
      )}
    </Overlay>
  );
}

function EditProfileModal({
  profile,
  userId,
  userEmail,
  onClose,
  onSaved,
}: {
  profile: any;
  userId: string;
  userEmail: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(profile?.name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [city, setCity] = useState(profile?.city || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [image, setImage] = useState(profile?.image || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 800 * 1024) {
      setError('Image too large — max 800KB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function save() {
    setBusy(true);
    setError('');
    try {
      const r = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, email: userEmail, name, phone, city, bio, image }),
      });
      const d = await r.json();
      if (d.ok) {
        setSaved(true);
        setTimeout(() => onSaved(), 800);
      } else {
        setError(d.error || 'Failed to save');
      }
    } catch {
      setError('Failed to save');
    }
    setBusy(false);
  }

  const inp = (value: string, setter: (v: string) => void, label: string, placeholder = '', disabled = false) => (
    <div className="mt-3">
      <div className="kicker kicker-gold mb-1">{label}</div>
      <input
        value={value}
        onChange={(e) => setter(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-[12px] border border-line-dark bg-white/5 px-3 py-3 text-[14px] text-ink-on-dark outline-none focus:border-champagne disabled:opacity-50"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-midnight/85 px-3 pb-3 backdrop-blur-md">
      <div className="glass-dark-strong max-h-[90vh] w-full max-w-[440px] overflow-y-auto rounded-[28px] p-5">
        <div className="flex items-center justify-between">
          <div className="font-display text-[18px] font-semibold text-ink-on-dark">Edit Profile</div>
          <button onClick={onClose} className="text-[22px] leading-none text-ink-faint">×</button>
        </div>

        {/* Avatar uploader */}
        <div className="mt-5 flex flex-col items-center">
          <ImageAvatar src={image} name={name} size={96} />
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="press mt-3 rounded-pill border border-champagne/40 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-champagne"
          >
            Change Photo
          </button>
          <div className="mt-1 text-[10px] text-ink-faint">Max 800KB · JPG or PNG</div>
        </div>

        {inp(name, setName, 'Name')}
        {inp(profile?.email || '', () => {}, 'Email (Google-managed)', '', true)}
        {inp(phone, setPhone, 'Phone', '+91 ...')}
        {inp(city, setCity, 'City', 'Srinagar')}

        <div className="mt-3">
          <div className="kicker kicker-gold mb-1">Bio</div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="A short line about yourself"
            className="w-full rounded-[12px] border border-line-dark bg-white/5 px-3 py-3 text-[14px] text-ink-on-dark outline-none focus:border-champagne"
          />
        </div>

        {error && (
          <div className="mt-3 rounded-[12px] bg-error-soft p-3 text-center text-[12px] font-medium text-error">{error}</div>
        )}

        <button
          onClick={save}
          disabled={busy}
          className="press mt-5 w-full rounded-pill bg-champagne py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-midnight disabled:opacity-50"
        >
          {busy ? 'Saving…' : saved ? '✓ Saved' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}