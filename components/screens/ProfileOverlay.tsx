"use client";
import { useEffect, useRef, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Overlay, {
  GlassCard,
  Star8,
  OrnamentDivider,
  Kicker,
  PrimaryButton,
  SecondaryButton,
  ImageAvatar,
  AmbientGlow,
} from "../ui/Theme";

interface Profile {
  id: string;
  name: string;
  email: string;
  image?: string;
  phone?: string;
  city?: string;
  bio?: string;
  createdAt?: string;
}

interface Stats {
  daysActive: number;
  fardsTotal: number;
  completeDays: number;
  currentStreak: number;
  bestStreak: number;
  tasbeehTotal: number;
}

export function ProfileOverlay() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const userId = (session?.user as { id?: string } | undefined)?.id || "";
  const userEmail = session?.user?.email || "";

  async function load() {
    if (!userId && !userEmail) {
      setLoading(false);
      return;
    }
    try {
      const q = userId
        ? `userId=${userId}`
        : `email=${encodeURIComponent(userEmail)}`;
      const r = await fetch(`/api/profile?${q}`, { cache: "no-store" });
      const d = await r.json();
      setProfile(d.profile);
      setStats(d.stats);
    } catch {}
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [userId, userEmail]);

  if (!session) {
    return (
      <Overlay title="Profile">
        <GlassCard variant="cream" padding="p-8" className="text-center">
          <div
            className="mx-auto grid h-20 w-20 place-items-center rounded-full"
            style={{
              background: "linear-gradient(135deg,#fdf6e3 0%,#f4ead3 100%)",
              border: "1px solid rgba(201,164,93,0.35)",
            }}
          >
            <Star8 size={30} />
          </div>
          <p className="mt-5 font-serif text-[18px] font-bold text-ink">
            Sign in to see your profile
          </p>
          <p className="mt-2 text-[12.5px] leading-relaxed text-ink-muted">
            Track your worship, save progress, and connect with the community.
          </p>
          <div className="mt-6">
            <PrimaryButton onClick={() => signIn("google")}>
              Sign in with Google
            </PrimaryButton>
          </div>
        </GlassCard>
      </Overlay>
    );
  }

  if (loading) {
    return (
      <Overlay title="Profile">
        <div className="py-20 text-center text-[13px] text-ink-muted">
          Loading…
        </div>
      </Overlay>
    );
  }

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString(undefined, {
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <Overlay title="Profile">
      <div className="space-y-5">
        <div className="relative">
          <AmbientGlow color="gold" size={220} style={{ top: -60, right: -80, opacity: 0.4 }} />
          <GlassCard variant="cream" padding="p-6">
            <div className="flex flex-col items-center text-center">
              <ImageAvatar src={profile?.image} name={profile?.name} size={92} />
              <p className="mt-4 font-serif text-[20px] font-bold text-ink">
                {profile?.name}
              </p>
              <p className="mt-1 text-[12px] text-ink-muted">{profile?.email}</p>
              {profile?.city && (
                <p className="mt-1 text-[11.5px] text-ink-muted">
                  📍 {profile.city}
                </p>
              )}
              {profile?.bio && (
                <p className="mt-3 max-w-[280px] text-[12.5px] italic leading-relaxed text-[#3a4741]">
                  &ldquo;{profile.bio}&rdquo;
                </p>
              )}
              <div className="mt-3 rounded-full bg-[#c9a45d]/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8a6b15]">
                Community Member
              </div>
              {memberSince && (
                <p className="mt-2 text-[10.5px] text-ink-muted">
                  Member since {memberSince}
                </p>
              )}
              <div className="mt-5 w-full">
                <OrnamentDivider />
              </div>
              <div className="mt-5 w-full">
                <PrimaryButton onClick={() => setEditing(true)}>
                  Edit Profile
                </PrimaryButton>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { v: stats?.daysActive || 0, l: "Days Active" },
            { v: stats?.fardsTotal || 0, l: "Fards Tracked" },
            { v: stats?.completeDays || 0, l: "Complete Days" },
            { v: stats?.tasbeehTotal || 0, l: "Tasbeeh Count" },
          ].map((s) => (
            <GlassCard key={s.l} variant="cream" padding="p-4" className="text-center">
              <p className="font-serif text-[26px] font-bold leading-none text-forest">
                {s.v}
              </p>
              <Kicker className="mt-2">{s.l}</Kicker>
            </GlassCard>
          ))}
        </div>

        <GlassCard variant="gold" padding="p-5">
          <div className="flex items-center justify-between">
            <Kicker>Streaks</Kicker>
            <Star8 size={12} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                Current
              </p>
              <p className="mt-1 font-serif text-[34px] font-bold leading-none text-[#8a6b15]">
                {stats?.currentStreak || 0}
              </p>
              <p className="mt-1 text-[11px] text-ink-muted">days in a row</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                Best
              </p>
              <p className="mt-1 font-serif text-[34px] font-bold leading-none text-[#8a6b15]">
                {stats?.bestStreak || 0}
              </p>
              <p className="mt-1 text-[11px] text-ink-muted">personal record</p>
            </div>
          </div>
        </GlassCard>

        <div className="space-y-2.5">
          {[
            { key: "edit", label: "Edit Profile", sub: "Name, phone, city, bio" },
            { key: "discussions", label: "My Discussions", sub: "Your debate proposals" },
            { key: "saved", label: "Saved Duas", sub: "Bookmarked supplications" },
            { key: "events", label: "My Events", sub: "Registered masjid events" },
            { key: "preferences", label: "Preferences", sub: "Notifications & appearance" },
          ].map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => {
                if (m.key === "edit") setEditing(true);
              }}
              className="flex w-full items-center gap-3 rounded-[18px] bg-card/85 p-4 text-left ring-1 ring-white/70 shadow-[0_10px_22px_-14px_rgba(28,52,42,0.4)]"
            >
              <span
                className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl"
                style={{
                  background:
                    "linear-gradient(160deg, rgba(201,164,93,0.20) 0%, rgba(168,133,92,0.08) 100%)",
                  border: "1px solid rgba(201,164,93,0.28)",
                }}
              >
                <Star8 size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-serif text-[14px] font-semibold text-ink">
                  {m.label}
                </p>
                <p className="mt-0.5 text-[11px] text-ink-muted">{m.sub}</p>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8a6b15"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          ))}
        </div>

        <OrnamentDivider />

        <GlassCard variant="cream" padding="p-4" className="text-center">
          <Kicker>Developed by Ateeb</Kicker>
          <div className="mt-2 flex items-center justify-center gap-3 text-[12px] text-ink-muted">
            <a
              href="https://www.linkedin.com/in/ateeb-zargar-890022386?utm_source=share_via&utm_content=profile&utm_medium=member_android"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-forest"
            >
              LinkedIn
            </a>
            <span>·</span>
            <a
              href="https://github.com/zargarateeb"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-forest"
            >
              GitHub
            </a>
            <span>·</span>
            <a href="mailto:zargarateeb4@gmail.com" className="hover:text-forest">
              Email
            </a>
          </div>
        </GlassCard>

        <button
          type="button"
          onClick={() => signOut()}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#e5483d]/15 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#e5483d] ring-1 ring-[#e5483d]/30"
        >
          Sign out
        </button>
      </div>

      {editing && (
        <EditProfileModal
          profile={profile}
          userId={userId}
          userEmail={userEmail}
          onClose={() => setEditing(false)}
          onSaved={() => {
            setEditing(false);
            load();
          }}
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
  profile: Profile | null;
  userId: string;
  userEmail: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(profile?.name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [city, setCity] = useState(profile?.city || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [image, setImage] = useState(profile?.image || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 800 * 1024) {
      setError("Image too large — max 800KB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function save() {
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          email: userEmail,
          name,
          phone,
          city,
          bio,
          image,
        }),
      });
      const d = await r.json();
      if (d.ok) {
        setSaved(true);
        setTimeout(() => onSaved(), 800);
      } else {
        setError(d.error || "Failed to save");
      }
    } catch {
      setError("Failed to save");
    }
    setBusy(false);
  }

  const inp = (
    value: string,
    setter: (v: string) => void,
    label: string,
    placeholder = "",
    disabled = false
  ) => (
    <div className="mt-3">
      <Kicker className="mb-1">{label}</Kicker>
      <input
        value={value}
        onChange={(e) => setter(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-2xl bg-white/80 px-3 py-3 text-[13px] text-ink outline-none ring-1 ring-divider/50 focus:ring-forest/40 disabled:opacity-50"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 px-3 pb-3 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-[440px] overflow-y-auto rounded-[28px] bg-canvas p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <p className="font-serif text-[17px] font-bold text-ink">Edit Profile</p>
          <button
            type="button"
            onClick={onClose}
            className="text-[22px] leading-none text-ink-muted"
            aria-label="Close"
          >
            ×
          </button>
        </div>

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
            type="button"
            onClick={() => fileRef.current?.click()}
            className="mt-3 rounded-full border border-[#c9a45d]/50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8a6b15]"
          >
            Change Photo
          </button>
          <p className="mt-1 text-[10px] text-ink-muted">Max 800KB · JPG or PNG</p>
        </div>

        {inp(name, setName, "Name")}
        {inp(profile?.email || "", () => {}, "Email (Google-managed)", "", true)}
        {inp(phone, setPhone, "Phone", "+91 …")}
        {inp(city, setCity, "City", "Srinagar")}

        <div className="mt-3">
          <Kicker className="mb-1">Bio</Kicker>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="A short line about yourself"
            className="w-full resize-none rounded-2xl bg-white/80 px-3 py-3 text-[13px] text-ink outline-none ring-1 ring-divider/50 focus:ring-forest/40"
          />
        </div>

        {error && (
          <p className="mt-3 rounded-2xl bg-[#e5483d]/10 p-3 text-center text-[12px] font-medium text-[#e5483d]">
            {error}
          </p>
        )}

        <div className="mt-5">
          <PrimaryButton onClick={save} disabled={busy}>
            {busy ? "Saving…" : saved ? "✓ Saved" : "Save changes"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}