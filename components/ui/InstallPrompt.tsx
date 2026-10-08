'use client';

import { useEffect, useState } from 'react';

type Platform = 'android' | 'ios' | 'other';

export default function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [platform, setPlatform] = useState<Platform>('other');
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect platform
    const ua = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);
    setPlatform(isIOS ? 'ios' : isAndroid ? 'android' : 'other');

    // Already installed? Never show.
    // @ts-ignore
    if (window.__pwaInstalled) return;

    // User dismissed it before? Don't show again for 7 days.
    const dismissedAt = localStorage.getItem('install-dismissed-at');
    if (dismissedAt) {
      const daysSince = (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) return;
    }

    // iOS: show immediately (no programmatic install exists)
    if (isIOS) {
      setShow(true);
      return;
    }

    // Android: show if install prompt is already captured
    // @ts-ignore
    if (window.__pwaInstallPrompt) {
      setShow(true);
      return;
    }

    // Otherwise, wait for the prompt event
    function onPromptAvailable() {
      // @ts-ignore
      if (!window.__pwaInstalled) setShow(true);
    }
    function onInstalled() {
      setShow(false);
    }

    window.addEventListener('pwa-install-available', onPromptAvailable);
    window.addEventListener('pwa-installed', onInstalled);
    return () => {
      window.removeEventListener('pwa-install-available', onPromptAvailable);
      window.removeEventListener('pwa-installed', onInstalled);
    };
  }, []);

  function dismiss() {
    localStorage.setItem('install-dismissed-at', String(Date.now()));
    setShow(false);
  }

  async function install() {
    // @ts-ignore
    const prompt = window.__pwaInstallPrompt;
    if (!prompt) return;

    setInstalling(true);
    try {
      prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice.outcome === 'accepted') {
        setShow(false);

        // Wait for native install, then try to close the tab
        setTimeout(() => {
          try {
            window.close();
            setTimeout(() => {
              window.location.href = 'about:blank';
            }, 300);
          } catch {
            // Silent — browser may block close
          }
        }, 1500);
      } else {
        setInstalling(false);
      }
    } catch {
      setInstalling(false);
    }
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200]">
      {/* Blurred backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(160deg, rgba(3,26,24,0.92) 0%, rgba(6,46,42,0.94) 50%, rgba(3,26,24,0.98) 100%)',
          backdropFilter: 'blur(28px) saturate(140%)',
          WebkitBackdropFilter: 'blur(28px) saturate(140%)',
        }}
      />

      {/* Ambient glows */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: -100,
          left: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(15,107,74,0.45) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          bottom: -120,
          right: -120,
          width: 350,
          height: 350,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(201,162,39,0.30) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Card */}
      <div className="relative flex h-full w-full items-center justify-center px-6">
        <div
          className="w-full max-w-[380px] rounded-[32px] p-8 text-center"
          style={{
            background:
              'linear-gradient(160deg, rgba(10,65,57,0.92) 0%, rgba(6,46,42,0.96) 55%, rgba(3,26,24,0.98) 100%)',
            border: '1px solid rgba(214,180,106,0.24)',
            boxShadow:
              '0 1px 0 rgba(255,255,255,0.06) inset, 0 -2px 8px rgba(0,0,0,0.4) inset, 0 30px 60px -20px rgba(0,0,0,0.65)',
          }}
        >
          {/* Ornament */}
          <svg
            width="52"
            height="52"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#D6B46A"
            strokeWidth="1.5"
            className="mx-auto mb-5"
            style={{ animation: 'pulse 3s ease-in-out infinite' }}
          >
            <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
            <path
              d="M12 6 L13 11 L18 12 L13 13 L12 18 L11 13 L6 12 L11 11 Z"
              opacity="0.5"
            />
          </svg>

          <div
            className="text-[10px] font-bold uppercase tracking-[0.24em]"
            style={{ color: '#D6B46A' }}
          >
            Masjid Al-Hamzah
          </div>

          <div
            className="mt-3 font-display text-[24px] font-semibold leading-tight"
            style={{
              color: '#F5F0E6',
              textShadow: '0 2px 12px rgba(0,0,0,0.5)',
            }}
          >
            Install the App
          </div>

          <div
            className="mt-3 text-[13.5px] leading-[1.6]"
            style={{ color: 'rgba(245,240,230,0.72)' }}
          >
            Get prayer times, tasbeeh, duas, and community updates — one tap to
            install on your home screen.
          </div>

          <div
            className="my-6"
            style={{
              height: 1,
              background:
                'linear-gradient(90deg, transparent, rgba(214,180,106,0.6), transparent)',
            }}
          />

          {/* Platform-specific */}
          {platform === 'android' && (
            <button
              onClick={install}
              disabled={installing}
              className="flex w-full items-center justify-center gap-2 rounded-pill py-4 text-[12px] font-bold uppercase tracking-[0.18em] disabled:opacity-60"
              style={{
                background:
                  'linear-gradient(160deg, #E5B437 0%, #C9A227 55%, #8A6B15 100%)',
                color: '#031A18',
                boxShadow:
                  '0 1px 0 rgba(255,255,255,0.4) inset, 0 -2px 6px rgba(0,0,0,0.35) inset, 0 12px 24px -6px rgba(201,162,39,0.55)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {installing ? 'Installing…' : 'Install App'}
            </button>
          )}

          {platform === 'ios' && (
            <>
              <div
                className="mb-5 rounded-[20px] p-4 text-left"
                style={{
                  background: 'rgba(214,180,106,0.10)',
                  border: '1px solid rgba(214,180,106,0.24)',
                }}
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span
                      className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                      style={{ background: '#D6B46A', color: '#031A18' }}
                    >
                      1
                    </span>
                    <div className="text-[13px]" style={{ color: '#F5F0E6' }}>
                      Tap the <b>Share</b> button at the bottom of Safari
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span
                      className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                      style={{ background: '#D6B46A', color: '#031A18' }}
                    >
                      2
                    </span>
                    <div className="text-[13px]" style={{ color: '#F5F0E6' }}>
                      Scroll and tap <b>Add to Home Screen</b>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span
                      className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                      style={{ background: '#D6B46A', color: '#031A18' }}
                    >
                      3
                    </span>
                    <div className="text-[13px]" style={{ color: '#F5F0E6' }}>
                      Tap <b>Add</b> — the app will appear on your home screen
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="mb-4 flex items-center justify-center"
                style={{ animation: 'bounceDown 1.6s ease-in-out infinite' }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#D6B46A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14" />
                  <polyline points="19 12 12 19 5 12" />
                </svg>
              </div>

              <button
                onClick={dismiss}
                className="w-full rounded-pill py-3 text-[11px] font-bold uppercase tracking-[0.16em]"
                style={{
                  background:
                    'linear-gradient(160deg, #E5B437 0%, #C9A227 55%, #8A6B15 100%)',
                  color: '#031A18',
                  boxShadow:
                    '0 1px 0 rgba(255,255,255,0.4) inset, 0 -2px 6px rgba(0,0,0,0.35) inset, 0 12px 24px -6px rgba(201,162,39,0.55)',
                }}
              >
                Got it
              </button>
            </>
          )}

          {platform === 'other' && (
            <button
              onClick={dismiss}
              className="w-full rounded-pill py-3 text-[11px] font-bold uppercase tracking-[0.16em]"
              style={{
                background:
                  'linear-gradient(160deg, #E5B437 0%, #C9A227 55%, #8A6B15 100%)',
                color: '#031A18',
              }}
            >
              Continue
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { filter: drop-shadow(0 0 12px rgba(214,180,106,0.5)); }
          50% { filter: drop-shadow(0 0 24px rgba(214,180,106,0.9)); }
        }
        @keyframes bounceDown {
          0%, 100% { transform: translateY(0); opacity: 0.7; }
          50% { transform: translateY(8px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}