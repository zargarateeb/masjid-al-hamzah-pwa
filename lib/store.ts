import { create } from 'zustand';

export type Tab = 'home' | 'prayer' | 'tasbeeh' | 'more';

export type OverlayScreen =
  | 'announcements'
  | 'debate'
  | 'donate'
  | 'admin-pin'
  | 'admin'
  | 'settings'
  | 'profile'
  | 'names-of-allah'
  | 'names-of-prophet'
  | 'qibla'
  | 'duas'
  | 'our-masjid'
  | 'super-admin';

interface AppState {
  activeTab: Tab;
  overlayStack: OverlayScreen[];
  setTab: (t: Tab) => void;
  pushScreen: (s: OverlayScreen) => void;
  popScreen: () => void;
  clearStack: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  activeTab: 'home',
  overlayStack: [],

  setTab: (t) => {
    // Clear overlays when switching base tabs
    set({ activeTab: t, overlayStack: [] });
  },

  pushScreen: (s) => {
    // Push a history entry so back button triggers popstate
    if (typeof window !== 'undefined') {
      window.history.pushState({ overlay: s }, '');
    }
    set((state) => ({ overlayStack: [...state.overlayStack, s] }));
  },

  popScreen: () => {
    const stack = get().overlayStack;
    if (stack.length === 0) return;

    // If a history entry exists for this overlay, go back (fires popstate)
    // Otherwise just pop locally
    if (typeof window !== 'undefined' && window.history.state?.overlay) {
      window.history.back();
    } else {
      set({ overlayStack: stack.slice(0, -1) });
    }
  },

  clearStack: () => set({ overlayStack: [] }),
}));