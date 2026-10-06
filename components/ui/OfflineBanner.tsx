'use client';

import { useEffect, useState } from 'react';

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Initial state
    const offline = !navigator.onLine;
    setIsOffline(offline);
    if (offline) {
      // Small delay so it doesn't flash immediately on load
      setTimeout(() => setVisible(true), 800);
    }

    const onOnline = () => {
      setIsOffline(false);
      setVisible(false);
    };
    const onOffline = () => {
      setIsOffline(true);
      setTimeout(() => setVisible(true), 400);
    };

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  if (!visible || !isOffline) return null;

  return (
    <>
      <div
        className="pointer-events-none fixed left-1/2 top-3 z-[80] w-[calc(100%-24px)] max-w-[440px] -translate-x-1/2"
        style={{ animation: 'softSlideDown 400ms cubic-bezier(0.23, 1, 0.32, 1)' }}
      >
        <div
          className="pointer-events-auto flex items-center gap-2.5 rounded-full px-4 py-2.5"
          style={{
            background:
              'linear-gradient(160deg, rgba(10,65,57,0.92) 0%, rgba(6,46,42,0.95) 60%, rgba(3,26,24,0.98) 100%)',
            border: '1px solid rgba(214,180,106,0.28)',
            backdropFilter: 'blur(20px) saturate(150%)',
            WebkitBackdropFilter: 'blur(20px) saturate(150%)',
            boxShadow:
              '0 1px 0 rgba(255,255,255,0.06) inset, 0 -1px 0 rgba(0,0,0,0.35) inset, 0 12px 30px -12px rgba(0,0,0,0.55)',
          }}
        >
          {/* Small pulsing gold dot — not alarming */}
          <span
            className="relative flex h-2 w-2 flex-shrink-0"
            aria-hidden="true"
          >
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
              style={{ background: '#D6B46A' }}
            />
            <span
              className="relative inline-flex h-2 w-2 rounded-full"
              style={{ background: '#D6B46A' }}
            />
          </span>

          <div className="min-w-0 flex-1">
            <div
              className="text-[11.5px] font-semibold leading-tight"
              style={{ color: '#F5F0E6' }}
            >
              Offline mode
            </div>
            <div
              className="mt-0.5 text-[10.5px] leading-tight"
              style={{ color: 'rgba(245,240,230,0.60)' }}
            >
              Live updates paused — showing last known data
            </div>
          </div>

          {/* Tiny gold star on the right */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#D6B46A"
            strokeWidth="1.5"
            className="flex-shrink-0"
          >
            <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
          </svg>
        </div>
      </div>

      <style jsx>{`
        @keyframes softSlideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -16px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
          }
        }
      `}</style>
    </>
  );
}