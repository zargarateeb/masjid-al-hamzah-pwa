"use client";
import { useState } from "react";
import {
  buildDeepLink,
  buildShareMessage,
  copyLink as copyLinkFn,
  copyMessage as copyMessageFn,
  shareWhatsApp,
  shareTelegram,
  shareFacebook,
  shareInstagram,
  type ShareableAnnouncement,
} from "@/lib/announcements/share";

export function ShareSheet({
  announcement,
  onClose,
}: {
  announcement: ShareableAnnouncement;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState<"link" | "message" | null>(null);

  async function handleCopyLink() {
    try {
      await copyLinkFn(announcement);
      setCopied("link");
      setTimeout(() => setCopied(null), 1800);
    } catch {
      alert("Could not copy. Try again.");
    }
  }

  async function handleCopyMessage() {
    try {
      await copyMessageFn(announcement);
      setCopied("message");
      setTimeout(() => setCopied(null), 1800);
    } catch {
      alert("Could not copy. Try again.");
    }
  }

  const preview = buildShareMessage(announcement);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/55 px-3 pb-3 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[430px] rounded-[28px] bg-canvas p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-[18px] font-bold text-ink">
            Share announcement
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-full bg-white/70 text-ink-muted ring-1 ring-white/70"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Preview */}
        <div className="mb-4 max-h-[140px] overflow-y-auto rounded-2xl bg-white/60 p-3 ring-1 ring-divider/40">
          <pre className="whitespace-pre-wrap break-words font-sans text-[11px] leading-relaxed text-ink">
            {preview}
          </pre>
        </div>

        {/* Social row */}
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">
          Share via
        </p>
        <div className="mb-4 grid grid-cols-4 gap-2">
          <ShareButton
            label="WhatsApp"
            color="#25D366"
            icon={
              <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M17.5 14.4c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.7.1-1.5-.7-2.5-1.3-3.5-3-.3-.5.3-.4.8-1.4.1-.2 0-.4 0-.5 0-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5 1.9.8 2.6.9 3.5.8.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z M12 2a10 10 0 0 0-8.5 15.2L2 22l4.8-1.5A10 10 0 1 0 12 2z" />
              </svg>
            }
            onClick={() => shareWhatsApp(announcement)}
          />
          <ShareButton
            label="Telegram"
            color="#229ED9"
            icon={
              <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M9.8 15.5l-.4 4.4c.6 0 .8-.3 1.1-.5l2.7-2.5 5.6 4c1 .6 1.7.3 2-.9L23 4.1c.3-1.5-.5-2.1-1.5-1.7L1.7 10.2C.3 10.8.3 11.6 1.5 11.9l5 .2L18 4.6c.6-.4 1.1-.2.7.2" />
              </svg>
            }
            onClick={() => shareTelegram(announcement)}
          />
          <ShareButton
            label="Facebook"
            color="#1877F2"
            icon={
              <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.5 2.9h-2.3v7A10 10 0 0 0 22 12z" />
              </svg>
            }
            onClick={() => shareFacebook(announcement)}
          />
          <ShareButton
            label="Instagram"
            color="#E4405F"
            icon={
              <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M12 2c2.7 0 3.1 0 4.1.1 1.1 0 1.8.2 2.4.5.7.3 1.2.6 1.7 1.2.6.5.9 1 1.2 1.7.2.6.4 1.3.5 2.4 0 1 .1 1.4.1 4.1s0 3.1-.1 4.1c0 1.1-.2 1.8-.5 2.4-.3.7-.6 1.2-1.2 1.7-.5.6-1 .9-1.7 1.2-.6.2-1.3.4-2.4.5-1 0-1.4.1-4.1.1s-3.1 0-4.1-.1c-1.1 0-1.8-.2-2.4-.5a4.7 4.7 0 0 1-1.7-1.2c-.6-.5-.9-1-1.2-1.7-.2-.6-.4-1.3-.5-2.4 0-1-.1-1.4-.1-4.1s0-3.1.1-4.1c0-1.1.2-1.8.5-2.4.3-.7.6-1.2 1.2-1.7.5-.6 1-.9 1.7-1.2.6-.2 1.3-.4 2.4-.5 1 0 1.4-.1 4.1-.1zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zm5.2-8.4a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
              </svg>
            }
            onClick={() => shareInstagram(announcement)}
          />
        </div>

        {/* Copy options */}
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">
          Copy
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 rounded-full bg-white/70 py-3 text-[12px] font-semibold text-forest ring-1 ring-white/70 transition active:scale-[0.98]"
          >
            {copied === "link" ? "✓ Link copied" : "Copy Link"}
          </button>
          <button
            type="button"
            onClick={handleCopyMessage}
            className="flex items-center justify-center gap-2 rounded-full bg-white/70 py-3 text-[12px] font-semibold text-forest ring-1 ring-white/70 transition active:scale-[0.98]"
          >
            {copied === "message" ? "✓ Message copied" : "Copy Message"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ShareButton({
  label,
  color,
  icon,
  onClick,
}: {
  label: string;
  color: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1 rounded-2xl bg-white/60 py-3 ring-1 ring-white/70 transition active:scale-95"
      aria-label={`Share via ${label}`}
    >
      <span style={{ color }}>{icon}</span>
      <span className="text-[9px] font-semibold text-ink">{label}</span>
    </button>
  );
}