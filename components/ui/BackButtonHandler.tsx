'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

/**
 * Handles the browser/OS back button (and mobile back gestures).
 * When an overlay screen is open, pressing back closes the overlay
 * instead of navigating away or exiting the app.
 */
export default function BackButtonHandler() {
  useEffect(() => {
    function onPopState() {
      const state = useAppStore.getState();
      const stack = state.overlayStack;

      if (stack.length > 0) {
        // Pop the top overlay without triggering another history.back()
        useAppStore.setState({ overlayStack: stack.slice(0, -1) });
      }
      // If stack is empty, let the browser handle it naturally
      // (this will exit the app on the installed PWA)
    }

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return null;
}