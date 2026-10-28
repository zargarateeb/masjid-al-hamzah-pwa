"use client";
import { useEffect, useState } from "react";
import Overlay, {
  GlassCard,
  Kicker,
  PrimaryButton,
  SecondaryButton,
} from "../ui/Theme";
import AnalogTimePicker from "../ui/AnalogTimePicker";
import { todayISO } from "@/lib/utils";

type PrayerKey = "fajr" | "zuhr" | "asr" | "maghrib" | "isha" | "jummah";
type Times = Record<PrayerKey, string>;
const EMPTY: Times = {
  fajr: "",
  zuhr: "",
  asr: "",
  maghrib: "",
  isha: "",
  jummah: "",
};

const OFFSETS: Record<PrayerKey, number> = {
  fajr: 40,
  zuhr: 15,
  asr: 15,
  maghrib: 6,
  isha: 15,
  jummah: 15,
};

interface Ann {
  _id: string;
  title: string;
  content: string;
  isUrgent: boolean;
  imageUrl?: string;
  createdAt: string;
}

export function AdminOverlay() {
  const [date, setDate] = useState(todayISO());
  const [times, setTimes] = useState<Times>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [picking, setPicking] = useState<PrayerKey | null>(null);

  // Announcement form
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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
            fajr: d.time.fajr || "",
            zuhr: d.time.zuhr || "",
            asr: d.time.asr || "",
            maghrib: d.time.maghrib || "",
            isha: d.time.isha || "",
            jummah: d.time.jummah || "",
          });
          setLastUpdated(d.time.date);
        } else {
          setTimes(EMPTY);
          setLastUpdated(null);
        }
      })
      .catch(() => {});
  }, [date]);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function loadAnnouncements() {
    setAnnLoading(true);
    try {
      const r = await fetch("/api/announcements");
      const d = await r.json();
      setAnnList(d.items || []);
    } catch {}
    setAnnLoading(false);
  }

  function applyTime(key: PrayerKey, value: string) {
    setTimes((prev) => ({ ...prev, [key]: value }));
  }

  async function saveTimes() {
    setSaving(true);
    setError("");
    const pin = sessionStorage.getItem("admin_pin") || "";
    try {
      const res = await fetch("/api/prayer-times", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, pin, ...times }),
      });
      const data = await res.json();
      if (data.ok) {
        setSavedAt(Date.now());
        setLastUpdated(date);
        setTimeout(() => setSavedAt(null), 2500);
      } else setError(data.error || "Failed");
    } catch {
      setError("Failed");
    } finally {
      setSaving(false);
    }
  }

  function resetAnnForm() {
    setTitle("");
    setContent("");
    setImageUrl("");
    setUrgent(false);
    setEditingId(null);
  }

  function startEdit(a: Ann) {
    setTitle(a.title);
    setContent(a.content);
    setImageUrl(a.imageUrl || "");
    setUrgent(a.isUrgent);
    setEditingId(a._id);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function postAnnouncement() {
    if (!title || !content) {
      setError("Title and content required");
      return;
    }
    setPosting(true);
    setError("");
    const pin = sessionStorage.getItem("admin_pin") || "";

    try {
      if (editingId) {
        // PATCH existing
        const res = await fetch(`/api/announcements/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            content,
            isUrgent: urgent,
            imageUrl,
            pin,
          }),
        });
        const data = await res.json();
        if (data.ok) {
          setPosted(true);
          setTimeout(() => setPosted(false), 2500);
          resetAnnForm();
          loadAnnouncements();
        } else setError(data.error || "Failed");
      } else {
        // POST new
        const res = await fetch("/api/announcements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            content,
            isUrgent: urgent,
            imageUrl,
            pin,
          }),
        });
        const data = await res.json();
        if (data.ok) {
          setPosted(true);
          setTimeout(() => setPosted(false), 2500);
          resetAnnForm();
          loadAnnouncements();
        } else setError(data.error || "Failed");
      }
    } catch {
      setError("Failed");
    } finally {
      setPosting(false);
    }
  }

  async function deleteAnnouncement(id: string) {
    setDeleting(true);
    const pin = sessionStorage.getItem("admin_pin") || "";
    try {
      const r = await fetch(
        `/api/announcements?id=${id}&pin=${encodeURIComponent(pin)}`,
        { method: "DELETE" }
      );
      const d = await r.json();
      if (d.ok) setAnnList((prev) => prev.filter((x) => x._id !== id));
      else setError(d.error || "Failed to delete");
    } catch {
      setError("Failed to delete");
    }
    setDeleting(false);
    setConfirming(null);
  }

  function subtract(time: string, min: number): string {
    if (!time || !time.includes(":")) return "--:--";
    const [h, m] = time.split(":").map(Number);
    let tot = h * 60 + m - min;
    tot = ((tot % 1440) + 1440) % 1440;
    return `${String(Math.floor(tot / 60)).padStart(2, "0")}:${String(
      tot % 60
    ).padStart(2, "0")}`;
  }

  const field = (label: string, key: PrayerKey) => (
    <button
      type="button"
      onClick={() => setPicking(key)}
      className="flex w-full items-center justify-between gap-4 border-b border-divider/40 py-3 text-left last:border-0"
    >
      <div>
        <p className="font-serif text-[14px] font-semibold text-ink">{label}</p>
        <p className="mt-0.5 text-[10.5px] text-ink-muted">
          Azaan at {times[key] ? subtract(times[key], OFFSETS[key]) : "--:--"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={
            "font-serif text-[16px] tabular-nums " +
            (times[key] ? "text-[#8a6b15]" : "text-ink-muted")
          }
        >
          {times[key] || "--:--"}
        </span>
        <div
          className="grid h-9 w-9 place-items-center rounded-full"
          style={{
            background:
              "linear-gradient(160deg, rgba(201,164,93,0.25) 0%, rgba(168,133,92,0.10) 100%)",
            border: "1px solid rgba(201,164,93,0.30)",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8a6b15"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
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
        <GlassCard variant="cream" padding="p-5">
          <Kicker className="mb-1">Set Jamaat Times</Kicker>
          <p className="mb-3 text-[11px] text-ink-muted">
            Enter the Jamaat time — Azaan will be calculated automatically
          </p>
          {lastUpdated && (
            <p className="mb-3 text-[11px] text-ink-muted">
              Currently using times from{" "}
              <b className="text-[#8a6b15]">{lastUpdated}</b>
            </p>
          )}
          <div className="mb-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-xl bg-white/80 px-3 py-2 text-[13px] text-ink outline-none ring-1 ring-divider/50 focus:ring-forest/40"
            />
          </div>
          {field("Fajr", "fajr")}
          {field("Dhuhr", "zuhr")}
          {field("Asr", "asr")}
          {field("Maghrib", "maghrib")}
          {field("Isha", "isha")}
          {field("Jumu'ah", "jummah")}
          <div className="mt-5">
            <PrimaryButton onClick={saveTimes} disabled={saving}>
              {saving ? "Saving…" : savedAt ? "✓ Saved" : "Save prayer times"}
            </PrimaryButton>
          </div>
        </GlassCard>

        <GlassCard variant="gold" padding="p-5">
          <div className="mb-3 flex items-center justify-between">
            <Kicker>
              {editingId ? "Edit Announcement" : "Post Announcement"}
            </Kicker>
            {editingId && (
              <button
                type="button"
                onClick={resetAnnForm}
                className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a6b15]"
              >
                Cancel
              </button>
            )}
          </div>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full rounded-xl bg-white/80 px-3 py-3 text-[13px] text-ink outline-none ring-1 ring-divider/50 focus:ring-forest/40"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            rows={4}
            className="mt-3 w-full resize-none rounded-xl bg-white/80 px-3 py-3 text-[13px] text-ink outline-none ring-1 ring-divider/50 focus:ring-forest/40"
          />
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Image URL (optional) — e.g. https://ik.imagekit.io/..."
            className="mt-3 w-full rounded-xl bg-white/80 px-3 py-2.5 text-[12px] text-ink outline-none ring-1 ring-divider/50 focus:ring-forest/40"
          />
          {imageUrl && (
            <div className="mt-2 overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Preview"
                className="h-[100px] w-full object-cover"
              />
            </div>
          )}
          <label className="mt-3 flex items-center gap-2 text-[12.5px] text-ink">
            <input
              type="checkbox"
              checked={urgent}
              onChange={(e) => setUrgent(e.target.checked)}
              className="h-4 w-4"
            />
            Mark as urgent
          </label>
          <div className="mt-4">
            <PrimaryButton onClick={postAnnouncement} disabled={posting}>
              {posting
                ? editingId
                  ? "Saving…"
                  : "Posting…"
                : editingId
                ? "Save Changes"
                : posted
                ? "✓ Posted"
                : "Post announcement"}
            </PrimaryButton>
          </div>
        </GlassCard>

        <GlassCard variant="cream" padding="p-5">
          <div className="mb-3 flex items-center justify-between">
            <Kicker>Manage Announcements</Kicker>
            <span className="rounded-full bg-[#c9a45d]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#8a6b15]">
              {annList.length}
            </span>
          </div>
          {annLoading ? (
            <p className="py-6 text-center text-[12px] text-ink-muted">
              Loading…
            </p>
          ) : annList.length === 0 ? (
            <p className="py-6 text-center text-[12px] text-ink-muted">
              No announcements posted yet
            </p>
          ) : (
            <div className="space-y-2">
              {annList.map((a) => (
                <div
                  key={a._id}
                  className="flex items-center gap-2 rounded-2xl bg-white/50 p-3"
                >
                  {a.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={a.imageUrl}
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#e6ebdf] text-forest">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M3 11v2a1 1 0 0 0 1 1h2l4 4V6L6 10H4a1 1 0 0 0-1 1z" />
                        <path d="M16 8a5 5 0 0 1 0 8" />
                      </svg>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {a.isUrgent && (
                        <span className="rounded-full bg-[#c9a45d] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-white">
                          Urgent
                        </span>
                      )}
                      <p className="truncate font-serif text-[13px] font-semibold text-ink">
                        {a.title}
                      </p>
                    </div>
                    <p className="mt-0.5 truncate text-[11px] text-ink-muted">
                      {new Date(a.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => startEdit(a)}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#c9a45d]/20 text-[#8a6b15]"
                    aria-label="Edit"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirming(a._id)}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#e5483d]/15 text-[#e5483d]"
                    aria-label="Delete"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
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
          <div className="rounded-2xl bg-[#e5483d]/10 p-3 text-center text-[12px] font-medium text-[#e5483d]">
            {error}
          </div>
        )}
      </div>

      {picking && (
        <AnalogTimePicker
          value={times[picking] || "06:00"}
          title={`Jamaat · ${picking.charAt(0).toUpperCase() + picking.slice(1)}`}
          onCancel={() => setPicking(null)}
          onConfirm={(t) => {
            applyTime(picking, t);
            setPicking(null);
          }}
        />
      )}

      {confirming && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 px-5 backdrop-blur-sm">
          <div className="w-full max-w-[360px] rounded-[26px] bg-canvas p-6 text-center shadow-2xl">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#e5483d]/15 text-[#e5483d]">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
              </svg>
            </div>
            <p className="mt-4 font-serif text-[16px] font-bold text-ink">
              Delete this announcement?
            </p>
            <p className="mt-1 text-[12px] text-ink-muted">
              This action cannot be undone.
            </p>
            <div className="mt-5 flex gap-2">
              <SecondaryButton
                onClick={() => setConfirming(null)}
                disabled={deleting}
              >
                Cancel
              </SecondaryButton>
              <button
                type="button"
                onClick={() => deleteAnnouncement(confirming)}
                disabled={deleting}
                className="w-full rounded-full bg-[#e5483d] py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Overlay>
  );
}