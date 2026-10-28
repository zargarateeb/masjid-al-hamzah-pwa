"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Star8, PrimaryButton } from "./Theme";

export interface Comment {
  _id?: string;
  authorName: string;
  authorEmail?: string;
  message: string;
  createdAt: string;
  type?: "accept" | "counter";
  counterTime?: string;
  counterVenue?: string;
}

function relative(iso: string): string {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "";
  const diff = Date.now() - t;
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) {
    const m = Math.floor(diff / 60_000);
    return m < 1 ? "just now" : `${m}m ago`;
  }
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? "1 day ago" : `${d} days ago`;
}

export default function CommentDialog({
  title,
  subtitle,
  content,
  image,
  comments,
  accentColor = "#1c4a3a",
  isAdmin = false,
  onSubmit,
  onDelete,
  onClose,
}: {
  title: string;
  subtitle: string;
  content: string;
  image?: string;
  comments: Comment[];
  accentColor?: string;
  isAdmin?: boolean;
  onSubmit: (payload: {
    authorName: string;
    authorEmail?: string;
    message: string;
  }) => Promise<boolean>;
  onDelete?: (commentId: string) => Promise<boolean>;
  onClose: () => void;
}) {
  const { data: session } = useSession();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!text.trim() || !session?.user) return;
    setBusy(true);
    try {
      const ok = await onSubmit({
        authorName: session.user.name ?? "Guest",
        authorEmail: session.user.email ?? undefined,
        message: text.trim(),
      });
      if (ok) setText("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 px-0 pb-0 backdrop-blur-sm sm:items-center sm:px-4 sm:pb-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-[430px] flex-col overflow-hidden rounded-t-[28px] bg-canvas shadow-[0_-20px_60px_rgba(0,0,0,0.3)] sm:rounded-[28px]"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-divider/60 px-5 py-4">
          <div className="min-w-0 flex-1">
            <h2 className="truncate font-serif text-[18px] font-bold text-ink">
              {title}
            </h2>
            <p className="mt-0.5 text-[11px] text-ink-muted">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/70 text-forest ring-1 ring-white/70"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {image && (
            <div className="mb-4 overflow-hidden rounded-[18px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="" className="h-[120px] w-full object-cover" />
            </div>
          )}

          <p className="text-[13.5px] leading-relaxed text-[#3a4741]">{content}</p>

          <div className="mt-5 flex items-center gap-2">
            <Star8 size={10} color={accentColor} />
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
              {comments.length} {comments.length === 1 ? "reply" : "replies"}
            </p>
          </div>

          {comments.length === 0 ? (
            <p className="mt-3 rounded-2xl bg-white/50 p-3 text-center text-[12px] text-ink-muted">
              No replies yet. Be the first to respond.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {comments.map((c, i) => (
                <li key={c._id ?? i} className="rounded-[14px] bg-white/60 p-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-[12.5px] font-semibold text-forest">
                      {c.authorName}
                    </span>
                    <span className="shrink-0 text-[10px] text-ink-muted">
                      {relative(c.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-[12.5px] leading-snug text-[#3a4741]">
                    {c.message}
                  </p>
                  {(c.type === "accept" || c.type === "counter") && (
                    <span className="mt-1 inline-block rounded-full bg-forest/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-forest">
                      {c.type}
                    </span>
                  )}
                  {isAdmin && onDelete && c._id && (
                    <button
                      type="button"
                      onClick={async () => {
                        if (await onDelete(c._id!)) {
                          // parent reloads
                        }
                      }}
                      className="mt-2 text-[10px] font-semibold text-[#e5483d]"
                    >
                      Delete
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer input */}
        <div className="border-t border-divider/60 px-5 py-3">
          {session?.user ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !busy) submit();
                }}
                placeholder="Add a reply…"
                className="flex-1 rounded-full bg-white/80 px-4 py-2.5 text-[12.5px] text-ink outline-none ring-1 ring-divider/50 focus:ring-forest/40"
                disabled={busy}
              />
              <button
                type="button"
                onClick={submit}
                disabled={!text.trim() || busy}
                className="rounded-full bg-forest px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white disabled:opacity-40"
              >
                Send
              </button>
            </div>
          ) : (
            <p className="py-2 text-center text-[12px] text-ink-muted">
              Sign in to reply.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}