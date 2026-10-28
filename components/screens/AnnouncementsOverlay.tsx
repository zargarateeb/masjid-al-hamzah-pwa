"use client";
import { useEffect, useState } from "react";
import Overlay, {
  GlassCard,
  Star8,
  OrnamentDivider,
} from "../ui/Theme";
import CommentDialog, { type Comment } from "../ui/CommentDialog";

interface Ann {
  _id: string;
  title: string;
  content: string;
  isUrgent: boolean;
  imageUrl?: string;
  comments: Comment[];
  createdAt: string;
}

export default function AnnouncementsOverlay() {
  const [items, setItems] = useState<Ann[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  async function load() {
    try {
      const r = await fetch("/api/announcements", { cache: "no-store" });
      const d = await r.json();
      setItems(d.items || []);
    } catch {}
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAdmin(!!sessionStorage.getItem("admin_pin"));
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
    const r = await fetch("/api/announcements", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: open._id,
        authorName: payload.authorName,
        authorEmail: payload.authorEmail,
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

  async function deleteComment(commentId: string) {
    if (!open) return false;
    const pin = sessionStorage.getItem("admin_pin") || "";
    const r = await fetch("/api/announcements", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: open._id, commentId, email: "", pin }),
    });
    const d = await r.json();
    if (d.ok) {
      await load();
      return true;
    }
    return false;
  }

  return (
    <Overlay title="Announcements">
      {loading ? (
        <div className="py-20 text-center text-[13px] text-ink-muted">
          Loading…
        </div>
      ) : items.length === 0 ? (
        <GlassCard variant="cream" padding="p-8" className="text-center">
          <div
            className="mx-auto grid h-14 w-14 place-items-center rounded-full"
            style={{
              background: "linear-gradient(135deg,#fdf6e3 0%,#f4ead3 100%)",
              border: "1px solid rgba(201,164,93,0.35)",
            }}
          >
            <Star8 size={22} color="#C9A45D" />
          </div>
          <p className="mt-4 font-serif text-[16px] font-bold text-ink">
            No announcements yet
          </p>
          <p className="mt-1 text-[12px] text-ink-muted">
            Check back later for updates.
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const replyCount = item.comments?.length || 0;
            const hasImage = !!item.imageUrl;
            return (
              <GlassCard
                key={item._id}
                variant={item.isUrgent ? "gold" : "cream"}
                padding="p-0"
                className="overflow-hidden"
                onClick={() => setOpenId(item._id)}
              >
                {/* Poster / banner image — full, uncropped */}
{hasImage && (
  <div className="relative w-full overflow-hidden bg-black/5">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src={item.imageUrl}
      alt=""
      className="h-auto w-full object-contain"
    />
    {item.isUrgent && (
      <span className="absolute left-3 top-3 rounded-full bg-[#c9a45d] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white shadow-md">
        Urgent
      </span>
    )}
  </div>
)}

                {!hasImage && item.isUrgent && (
                  <div className="flex justify-end px-4 pt-3">
                    <span className="rounded-full bg-[#c9a45d] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white">
                      Urgent
                    </span>
                  </div>
                )}

                <div className={`p-5 ${hasImage ? "pt-2" : "pt-3"}`}>
                  <p className="font-serif text-[17px] font-bold text-ink">
                    {item.title}
                  </p>
                  <div className="my-3">
                    <OrnamentDivider />
                  </div>
                  <p className="line-clamp-2 text-[13px] leading-relaxed text-[#3a4741]">
                    {item.content}
                  </p>
                  <div className="mt-3 flex items-center justify-between border-t border-divider/50 pt-3">
                    <p className="text-[11px] text-ink-muted">
                      {new Date(item.createdAt).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-forest">
                      {replyCount} {replyCount === 1 ? "reply" : "replies"}
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
            );
          })}
        </div>
      )}

      {open && (
        <CommentDialog
          title={open.title}
          subtitle={new Date(open.createdAt).toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
          content={open.content}
          image={open.imageUrl}
          comments={open.comments || []}
          accentColor="#c9a45d"
          isAdmin={isAdmin}
          onSubmit={submitComment}
          onDelete={deleteComment}
          onClose={() => setOpenId(null)}
        />
      )}
    </Overlay>
  );
}
