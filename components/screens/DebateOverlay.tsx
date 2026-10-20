"use client";
import { useEffect, useState } from "react";
import { DEBATE_HERO } from "@/lib/images";
import { useSession, signIn } from "next-auth/react";
import Overlay, {
  GlassCard,
  Star8,
  OrnamentDivider,
  Kicker,
  PrimaryButton,
  SecondaryButton,
} from "../ui/Theme";
import CommentDialog, { type Comment } from "../ui/CommentDialog";

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
  status: "open" | "negotiating" | "confirmed" | "closed";
  responses: Comment[];
  createdAt: string;
}

const GUIDELINES_KEY = "hasSeenDebateGuidelines";

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  open: { bg: "rgba(47,99,80,0.15)", color: "#1c4a3a" },
  negotiating: { bg: "rgba(201,164,93,0.18)", color: "#8a6b15" },
  confirmed: { bg: "rgba(47,99,80,0.22)", color: "#1c4a3a" },
  closed: { bg: "rgba(119,121,112,0.15)", color: "#6c746e" },
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

  const userId = (session?.user as { id?: string } | undefined)?.id || "";
  const userEmail = session?.user?.email || "";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const seen = localStorage.getItem(GUIDELINES_KEY);
      if (!seen) setShowGuidelines(true);
      setIsAdmin(!!sessionStorage.getItem("admin_pin"));
    }
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/debates", { cache: "no-store" });
      const d = await r.json();
      setItems(d.items || []);
    } catch {}
    setLoading(false);
  }

  async function remove(id: string) {
    setBusy(true);
    const pin = sessionStorage.getItem("admin_pin") || "";
    try {
      const r = await fetch(
        `/api/debates?id=${id}&pin=${encodeURIComponent(pin)}&userId=${encodeURIComponent(userId)}`,
        { method: "DELETE" }
      );
      const d = await r.json();
      if (d.ok) setItems((prev) => prev.filter((x) => x._id !== id));
      else alert(d.error || "Failed to delete");
    } catch {
      alert("Failed to delete");
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
    const r = await fetch("/api/debates", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: respondTo._id,
        responderName: payload.authorName,
        responderEmail: payload.authorEmail,
        responderUserId: userId,
        type: "accept",
        message: payload.message,
      }),
    });
    const d = await r.json();
    if (d.ok) {
      await load();
      return true;
    }
    return false;
  }

  return (
    <Overlay title="Debate & Discussions">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[12px] text-ink-muted">
          {items.length} proposal{items.length === 1 ? "" : "s"}
        </p>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="rounded-full bg-forest px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white"
        >
          + Propose
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-[13px] text-ink-muted">Loading…</div>
      ) : items.length === 0 ? (
        <GlassCard variant="cream" padding="p-8" className="text-center">
          <div
            className="mx-auto grid h-14 w-14 place-items-center rounded-full"
            style={{
              background: "linear-gradient(135deg,#fdf6e3 0%,#f4ead3 100%)",
              border: "1px solid rgba(201,164,93,0.35)",
            }}
          >
            <Star8 size={22} />
          </div>
          <p className="mt-4 font-serif text-[16px] font-bold text-ink">
            No debates yet
          </p>
          <p className="mt-1 text-[12px] text-ink-muted">
            Be the first to propose one.
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {items.map((d) => {
            const s = STATUS_STYLE[d.status] || STATUS_STYLE.open;
            const replyCount = d.responses?.length || 0;
            const owned = canDelete(d);

            return (
              <div key={d._id} className="relative">
                                <GlassCard
                  variant="cream"
                  padding="p-0"
                  className="relative overflow-hidden"
                  onClick={() => setRespondTo(d)}
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 right-0 w-1/2"
                    style={{
                      backgroundImage: `linear-gradient(90deg, #fbf9f4 0%, rgba(251,249,244,0.85) 50%, transparent 100%), url(${DEBATE_HERO})`,
                      backgroundSize: "cover, cover",
                      backgroundPosition: "center, center",
                      backgroundRepeat: "no-repeat, no-repeat",
                    }}
                  />
                  <div className="relative z-10 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-serif text-[16px] font-bold leading-tight text-ink">
                      {d.topic}
                    </p>
                    <span
                      className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em]"
                      style={{ background: s.bg, color: s.color }}
                    >
                      {d.status}
                    </span>
                  </div>
                  <p className="mt-2 text-[12px] text-ink-muted">
                    {d.proposerName} · {d.proposedTime}
                    {userId && d.proposerUserId === userId && (
                      <span className="ml-2 rounded-full bg-[#c9a45d]/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#8a6b15]">
                        Yours
                      </span>
                    )}
                  </p>
                  {d.venue && (
                    <p className="mt-0.5 text-[12px] text-ink-muted">
                      📍 {d.venue}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between border-t border-divider/50 pt-3">
                    <p className="text-[12px] text-ink-muted">
                      {replyCount} response{replyCount === 1 ? "" : "s"}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-forest">
                      Open
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </div>
                  </div>
                </GlassCard>

                {owned && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirming(d._id);
                    }}
                    className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-[#c9a45d] text-white shadow-md transition active:scale-95"
                    aria-label="Delete"
                  >
                    <svg
                      width="12"
                      height="12"
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
                )}
              </div>
            );
          })}
        </div>
      )}

      {respondTo && (
        <CommentDialog
          title={respondTo.topic}
          subtitle={`by ${respondTo.proposerName} · ${respondTo.proposedTime}${respondTo.venue ? ` · ${respondTo.venue}` : ""}`}
          content={respondTo.description}
          comments={respondTo.responses || []}
          accentColor="#7a6b9b"
          isAdmin={isAdmin}
          onSubmit={submitResponse}
          onDelete={async (responseId: string) => {
            const pin = sessionStorage.getItem("admin_pin") || "";
            const r = await fetch("/api/debates", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: respondTo._id,
                responseId,
                email: userEmail,
                pin,
              }),
            });
            const d = await r.json();
            if (d.ok) {
              await load();
              return true;
            }
            return false;
          }}
          onClose={() => {
            setRespondTo(null);
            load();
          }}
        />
      )}

      {confirming && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 px-5 backdrop-blur-sm">
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
            <p className="mt-4 font-serif text-[17px] font-bold text-ink">
              Delete this debate?
            </p>
            <p className="mt-1 text-[12px] text-ink-muted">
              All responses will also be deleted. This cannot be undone.
            </p>
            <div className="mt-5 flex gap-2">
              <SecondaryButton onClick={() => setConfirming(null)} disabled={busy}>
                Cancel
              </SecondaryButton>
              <button
                type="button"
                onClick={() => remove(confirming)}
                disabled={busy}
                className="w-full rounded-full bg-[#e5483d] py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-white disabled:opacity-50"
              >
                {busy ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showGuidelines && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 px-5 backdrop-blur-sm">
          <div className="w-full max-w-[400px] rounded-[28px] bg-canvas p-6 shadow-2xl">
            <div className="text-center">
              <div
                className="mx-auto grid h-14 w-14 place-items-center rounded-full"
                style={{
                  background: "linear-gradient(135deg,#fdf6e3 0%,#f4ead3 100%)",
                  border: "1px solid rgba(201,164,93,0.35)",
                }}
              >
                <Star8 size={22} />
              </div>
              <p className="mt-4 font-serif text-[18px] font-bold text-ink">
                Debate Guidelines
              </p>
            </div>
            <div className="mt-5 space-y-3 text-[13px] leading-relaxed text-[#3a4741]">
              <p>
                <b className="text-[#8a6b15]">Be Respectful.</b> Speak with
                kindness even when you disagree.
              </p>
              <p>
                <b className="text-[#8a6b15]">Stick to Facts.</b> Base your
                arguments on knowledge and authentic sources.
              </p>
              <p>
                <b className="text-[#8a6b15]">Stay Peaceful.</b> The goal is
                understanding, not winning.
              </p>
              <p>
                <b className="text-[#8a6b15]">Honor Islamic Values.</b> Keep
                within the bounds of Shariah.
              </p>
              <p>
                <b className="text-[#8a6b15]">Make Dua.</b> Ask Allah for
                clarity and sincerity.
              </p>
            </div>
            <div className="mt-6">
              <PrimaryButton
                onClick={() => {
                  localStorage.setItem(GUIDELINES_KEY, "1");
                  setShowGuidelines(false);
                }}
              >
                I agree — continue
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <ProposeForm
          session={session}
          onClose={() => setShowForm(false)}
          onCreated={() => {
            setShowForm(false);
            load();
          }}
        />
      )}
    </Overlay>
  );
}

function ProposeForm({
  session,
  onClose,
  onCreated,
}: {
  session: { user?: { name?: string | null; email?: string | null; id?: string } } | null;
  onClose: () => void;
  onCreated: () => void;
}) {
  const isSignedIn = !!session?.user?.email;
  const [contact, setContact] = useState("");
  const [topic, setTopic] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("Masjid Al-Hamzah");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!isSignedIn) return;
    if (!contact || !topic || !time) {
      setError("Fill all required fields");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/debates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: session?.user?.name,
          contact,
          topic,
          time,
          venue,
          description,
          proposerUserId: session?.user?.id,
          proposerEmail: session?.user?.email,
        }),
      });
      const d = await r.json();
      if (d.ok) onCreated();
      else setError(d.error || "Failed");
    } catch {
      setError("Failed");
    } finally {
      setBusy(false);
    }
  }

  const field = (
    value: string,
    setter: (v: string) => void,
    label: string,
    required = false,
    textarea = false,
    placeholder = ""
  ) => (
    <div className="mt-3">
      <Kicker className="mb-1">
        {label}
        {required && " *"}
      </Kicker>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => setter(e.target.value)}
          rows={3}
          placeholder={placeholder}
          className="w-full resize-none rounded-2xl bg-white/80 px-3 py-3 text-[13px] text-ink outline-none ring-1 ring-divider/50 focus:ring-forest/40"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => setter(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl bg-white/80 px-3 py-3 text-[13px] text-ink outline-none ring-1 ring-divider/50 focus:ring-forest/40"
        />
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 px-3 pb-3 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-[440px] overflow-y-auto rounded-[28px] bg-canvas p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <p className="font-serif text-[17px] font-bold text-ink">
            Propose a debate
          </p>
          <button
            type="button"
            onClick={onClose}
            className="text-[22px] leading-none text-ink-muted"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {!isSignedIn ? (
          <div className="mt-5 text-center">
            <div
              className="mx-auto grid h-14 w-14 place-items-center rounded-full"
              style={{
                background: "linear-gradient(135deg,#fdf6e3 0%,#f4ead3 100%)",
                border: "1px solid rgba(201,164,93,0.35)",
              }}
            >
              <Star8 size={22} />
            </div>
            <p className="mt-4 font-serif text-[16px] font-bold text-ink">
              Sign in to propose a debate
            </p>
            <p className="mt-1 text-[12.5px] text-ink-muted">
              Only signed-in members can propose debates.
            </p>
            <div className="mt-5">
              <PrimaryButton onClick={() => signIn("google")}>
                Sign in with Google
              </PrimaryButton>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-4 rounded-2xl bg-white/60 p-3">
              <Kicker>Proposing as</Kicker>
              <p className="mt-1 font-serif text-[14px] font-bold text-ink">
                {session?.user?.name}
              </p>
              <p className="text-[11px] text-ink-muted">
                {session?.user?.email}
              </p>
            </div>
            {field(contact, setContact, "Contact number", true, false, "+91 …")}
            {field(topic, setTopic, "Topic", true)}
            {field(
              time,
              setTime,
              "Proposed time",
              true,
              false,
              "e.g. Friday after Maghrib"
            )}
            {field(venue, setVenue, "Venue", false, false, "Masjid Al-Hamzah")}
            {field(
              description,
              setDescription,
              "Description",
              false,
              true,
              "Add context to your proposal"
            )}
            {error && (
              <p className="mt-3 rounded-2xl bg-[#e5483d]/10 p-3 text-center text-[12px] text-[#e5483d]">
                {error}
              </p>
            )}
            <div className="mt-5">
              <PrimaryButton onClick={submit} disabled={busy}>
                {busy ? "Posting…" : "Submit proposal"}
              </PrimaryButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}