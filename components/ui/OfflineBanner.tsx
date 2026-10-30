"use client";
import { useEffect, useState } from "react";

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initial check
    setIsOffline(!navigator.onLine);

    const goOnline = () => {
      setIsOffline(false);
      setDismissed(false);
    };
    const goOffline = () => {
      setIsOffline(true);
      setDismissed(false);
    };

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  async function retry() {
    setRetrying(true);
    try {
      // Ping a cheap endpoint to verify connectivity
      const r = await fetch("/api/announcements", {
        method: "GET",
        cache: "no-store",
      });
      if (r.ok) {
        setIsOffline(false);
        window.location.reload();
        return;
      }
    } catch {
      // still offline
    }
    setRetrying(false);
    // Give feedback
    setTimeout(() => setRetrying(false), 1000);
  }

  // Don't render during SSR
  if (!mounted || !isOffline || dismissed) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed inset-x-0 top-0 z-[60] flex justify-center px-3 pt-[max(12px,env(safe-area-inset-top))]"
    >
      <div className="w-full max-w-[430px] rounded-2xl bg-[#1c4a3a] p-4 text-white shadow-[0_12px_32px_-8px_rgba(0,0,0,0.5)] ring-1 ring-white/20">
        <div className="flex items-start gap-3">
          {/* Wifi-off icon */}
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2 8a15 15 0 0 1 20 0" />
              <path d="M5 12a10 10 0 0 1 14 0" />
              <path d="M8.5 15.5a5 5 0 0 1 7 0" />
              <circle cx="12" cy="20" r="0.5" fill="currentColor" />
              <line x1="3" y1="3" x2="21" y2="21" />
            </svg>
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#dec680]">
              OFFLINE MODE
            </p>
            <p className="mt-1 text-[13px] font-semibold leading-snug text-white">
              Live updates paused — showing last known data.
            </p>
            <p className="mt-0.5 text-[11px] leading-snug text-white/70">
              Connect to the internet to get the latest times.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={retry}
                disabled={retrying}
                className="rounded-full bg-[#dec680] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#17261f] transition active:scale-95 disabled:opacity-60"
              >
                {retrying ? "Retrying…" : "Retry"}
              </button>
              <button
                type="button"
                onClick={() => setDismissed(true)}
                className="rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70"
                aria-label="Dismiss offline message"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}