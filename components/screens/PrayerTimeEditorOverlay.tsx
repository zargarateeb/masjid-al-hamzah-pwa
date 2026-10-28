"use client";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { todayISO } from "@/lib/utils";
import Overlay, {
  GlassCard,
  Kicker,
  PrimaryButton,
  SecondaryButton,
  Star8,
} from "../ui/Theme";

type Key = "fajr" | "zuhr" | "asr" | "maghrib" | "isha" | "jummah";
const FIELDS: { key: Key; label: string; hint: string }[] = [
  { key: "fajr", label: "Fajr", hint: "before sunrise" },
  { key: "zuhr", label: "Dhuhr", hint: "after midday" },
  { key: "asr", label: "Asr", hint: "afternoon" },
  { key: "maghrib", label: "Maghrib", hint: "just after sunset" },
  { key: "isha", label: "Isha", hint: "night" },
  { key: "jummah", label: "Jumu'ah", hint: "Friday only" },
];

type Times = Record<Key, string>;
const EMPTY: Times = {
  fajr: "",
  zuhr: "",
  asr: "",
  maghrib: "",
  isha: "",
  jummah: "",
};

export default function PrayerTimeEditorOverlay() {
  const { data: session, status } = useSession();
  const [date, setDate] = useState(todayISO());
  const [times, setTimes] = useState<Times>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdatedBy, setLastUpdatedBy] = useState<string | null>(null);

  const isSignedIn = !!session?.user?.email;

  // Load existing times for chosen date
  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`/api/prayer-times?date=${date}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d?.time) {
          setTimes({
            fajr: d.time.fajr || "",
            zuhr: d.time.zuhr || "",
            asr: d.time.asr || "",
            maghrib: d.time.maghrib || "",
            isha: d.time.isha || "",
            jummah: d.time.jummah || "",
          });
          setLastUpdatedBy(d.time.updatedBy || null);
        } else {
          setTimes(EMPTY);
          setLastUpdatedBy(null);
        }
      })
      .catch(() => {
        setTimes(EMPTY);
        setLastUpdatedBy(null);
      })
      .finally(() => setLoading(false));
  }, [date]);

  function setField(key: Key, value: string) {
    setTimes((prev) => ({ ...prev, [key]: value }));
    setError("");
    if (saved) setSaved(false);
  }

  async function save() {
    if (!isSignedIn) return;
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const r = await fetch("/api/prayer-times/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, ...times }),
      });
      const d = await r.json();
      if (d.ok) {
        setSaved(true);
        setLastUpdatedBy(session?.user?.email ?? null);
        setTimeout(() => setSaved(false), 2500);
      } else {
        setError(d.error || "Failed to save");
      }
    } catch {
      setError("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (status === "loading") {
    return (
      <Overlay title="Prayer Times">
        <div className="py-20 text-center text-[13px] text-ink-muted">
          Loading…
        </div>
      </Overlay>
    );
  }

  if (!isSignedIn) {
    return (
      <Overlay title="Prayer Times">
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
            Sign in to edit prayer times
          </p>
          <p className="mt-2 text-[12.5px] leading-relaxed text-ink-muted">
            Anyone with a Google account can update the masjid&apos;s prayer
            schedule. Your email is recorded with each change.
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-ink-muted">
            Tap below to sign in. You&apos;ll be redirected to Google&apos;s
            sign-in page and back.
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

  return (
    <Overlay title="Prayer Times">
      <div className="space-y-4">
        {/* Signed-in banner */}
        <GlassCard variant="cream" padding="p-4">
          <div className="flex items-center gap-3">
            {session?.user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt=""
                className="h-10 w-10 rounded-full object-cover ring-2 ring-[#dec680]"
              />
            ) : (
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[#c9a45d] font-serif text-[15px] font-semibold text-white">
                {(session?.user?.name ?? "?").charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <Kicker>Editing as</Kicker>
              <p className="mt-0.5 truncate font-serif text-[14px] font-semibold text-ink">
                {session?.user?.name ?? session?.user?.email}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Date */}
        <GlassCard variant="cream" padding="p-4">
          <Kicker className="mb-2">Date</Kicker>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-2xl bg-white/80 px-3 py-2.5 text-[14px] font-serif font-semibold text-ink outline-none ring-1 ring-divider/50 focus:ring-forest/40"
          />
          {lastUpdatedBy && (
            <p className="mt-2 truncate text-[10.5px] text-ink-muted">
              Last edited by <b className="text-[#8a6b15]">{lastUpdatedBy}</b>
            </p>
          )}
        </GlassCard>

        {/* Time fields */}
        <GlassCard variant="cream" padding="p-4">
          <Kicker className="mb-3">Jamaat Times</Kicker>
          {loading ? (
            <div className="py-6 text-center text-[12px] text-ink-muted">
              Loading existing times…
            </div>
          ) : (
            <div className="space-y-2.5">
              {FIELDS.map((f) => (
                <div
                  key={f.key}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-white/60 px-3 py-2.5 ring-1 ring-divider/40"
                >
                  <div className="min-w-0">
                    <p className="font-serif text-[14px] font-semibold text-ink">
                      {f.label}
                    </p>
                    <p className="mt-0.5 text-[10px] text-ink-muted">
                      {f.hint}
                    </p>
                  </div>
                  <input
                    type="time"
                    value={times[f.key]}
                    onChange={(e) => setField(f.key, e.target.value)}
                    className="w-[110px] rounded-xl bg-white/90 px-2 py-1.5 text-center font-serif text-[14px] font-semibold tabular-nums text-ink outline-none ring-1 ring-divider/50 focus:ring-forest/40"
                  />
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        {error && (
          <div className="rounded-2xl bg-[#e5483d]/10 p-3 text-center text-[12px] font-medium text-[#e5483d]">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTimes(EMPTY)}
            disabled={saving}
            className="flex-1 rounded-full border border-divider bg-white/50 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-forest disabled:opacity-50"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving || loading}
            className="flex-1 rounded-full bg-forest py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white disabled:opacity-50"
          >
            {saving ? "Saving…" : saved ? "✓ Saved" : "Save Times"}
          </button>
        </div>

        <p className="pt-1 text-center text-[10.5px] leading-relaxed text-ink-muted">
          Changes are visible to everyone immediately. Azaan times are
          calculated from these Jamaat times using the mosque&apos;s configured
          offsets.
        </p>
      </div>
    </Overlay>
  );
}