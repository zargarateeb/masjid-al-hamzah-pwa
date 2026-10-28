"use client";
import { Megaphone, ChevronRight } from "lucide-react";
import type { AnnouncementDoc } from "@/lib/home/types";
import { useAppStore } from "@/lib/store";

function relative(iso: string): string {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "";
  const diff = Date.now() - t;
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) {
    const m = Math.floor(diff / 60_000);
    return m < 1 ? "just now" : `${m} min ago`;
  }
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? "1 day ago" : `${d} days ago`;
}

function excerpt(text: string, n = 140): string {
  const trimmed = text.trim();
  return trimmed.length <= n ? trimmed : trimmed.slice(0, n - 1) + "…";
}

export function Announcements({ items }: { items: AnnouncementDoc[] }) {
  const pushScreen = useAppStore((s) => s.pushScreen);
  const openAll = () => pushScreen("announcements");

  return (
    <section className="mt-8">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="font-serif text-[22px] text-forest">Latest Announcement</h2>
        <button
          type="button"
          onClick={openAll}
          className="text-[12px] font-medium text-forest"
        >
          View All →
        </button>
      </div>

      {items.length === 0 ? (
  <div className="flex items-center gap-3 rounded-[24px] bg-card p-4 ring-1 ring-divider/60 shadow-[0_6px_16px_-8px_rgba(23,75,59,0.25)]">
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sage text-forest">
      <Megaphone size={18} strokeWidth={2} />
    </span>
    <div className="min-w-0 flex-1">
      <p className="text-[14px] font-semibold text-forest">No announcements yet</p>
      <p className="mt-1 text-[12px] leading-snug text-ink-muted">
        Community updates from the mosque committee will appear here.
      </p>
    </div>
  </div>
) : (
        <ul className="space-y-3">
          {items.slice(0, 1).map((a) => (
            <li key={a._id}>
              <button
                type="button"
                onClick={openAll}
                className="flex w-full items-start gap-3 rounded-[24px] bg-card p-4 text-left ring-1 ring-divider/60 shadow-sm"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sage text-forest">
                  <Megaphone size={18} strokeWidth={2} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="text-[14px] font-semibold text-forest">
                      {a.title}
                    </span>
                    <span className="shrink-0 text-[10px] text-ink-muted">
                      {relative(a.createdAt)}
                    </span>
                  </span>
                  <span className="mt-1 block text-[12px] leading-snug text-ink-muted">
                    {excerpt(a.content)}
                  </span>
                </span>
                <ChevronRight size={16} className="self-center text-forest/50" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}