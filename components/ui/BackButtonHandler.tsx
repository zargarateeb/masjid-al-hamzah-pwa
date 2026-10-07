'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Star8 } from '@/components/ui/GoldOrnament';

export default function BackButtonHandler() {
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  useEffect(() => {
    function onPopState() {
      const state = useAppStore.getState();
      const stack = state.overlayStack;
      const activeTab = state.activeTab;

      // Level 1: An overlay is open → close it
      if (stack.length > 0) {
        useAppStore.setState({ overlayStack: stack.slice(0, -1) });
        return;
      }

      // Level 2: Not on Home tab → go back to Home tab
      if (activeTab !== 'home') {
        useAppStore.setState({ activeTab: 'home' });
        return;
      }

      // Level 3: On Home tab, no overlay → ask before exiting
      // Push a state back so the app doesn't exit immediately
      if (typeof window !== 'undefined') {
        window.history.pushState({ confirmExit: true }, '');
        setShowExitConfirm(true);
      }
    }

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  function confirmExit() {
    setShowExitConfirm(false);
    // Actually exit the PWA / close the tab
    if (typeof window !== 'undefined') {
      // Try the PWA exit first
      // @ts-ignore
      if (window.navigator?.app?.exitApp) {
        // @ts-ignore
        window.navigator.app.exitApp();
      } else {
        // Fallback for browsers: close the tab or go back in history
        window.history.go(-2); // Go back past our fake entries
      }
    }
  }

  if (!showExitConfirm) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-midnight/90 px-5 backdrop-blur-md">
      <div className="glass-dark-strong w-full max-w-[340px] rounded-[26px] p-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full glass-gold">
          <Star8 size={26} />
        </div>
        <div className="mt-4 font-display text-[18px] font-semibold text-ink-on-dark">
          Exit Masjid Al-Hamzah?
        </div>
        <div className="mt-2 text-[12.5px] leading-[1.5] text-ink-soft">
          Are you sure you want to close the app?
        </div>
        <div className="mt-5 flex gap-2">
          <button
            onClick={() => setShowExitConfirm(false)}
            className="glass-dark press flex-1 rounded-pill py-3 text-[10.5px] font-bold uppercase tracking-[0.16em] text-ink-soft"
          >
            Stay
          </button>
          <button
            onClick={confirmExit}
            className="press flex-1 rounded-pill py-3 text-[10.5px] font-bold uppercase tracking-[0.16em] text-midnight"
            style={{
              background:
                'linear-gradient(160deg, #E5B437 0%, #C9A227 55%, #8A6B15 100%)',
              boxShadow: '0 4px 12px -4px rgba(201,162,39,0.5)',
            }}
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}