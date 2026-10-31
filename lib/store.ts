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
  | 'super-admin'
  | 'edit-times'
  | 'search'
  | 'islamic-calendar';

interface AppState {
  activeTab: Tab;
  overlayStack: OverlayScreen[];
  lastSearchTarget: { type: string; id: string | number } | null;
  pendingAnnouncementId: string | null;
  setTab: (t: Tab) => void;
  pushScreen: (s: OverlayScreen) => void;
  popScreen: () => void;
  clearStack: () => void;
  setSearchTarget: (t: { type: string; id: string | number } | null) => void;
  setPendingAnnouncementId: (id: string | null) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  activeTab: 'home',
  overlayStack: [],
  lastSearchTarget: null,
  pendingAnnouncementId: null,

  setTab: (t) => {
    const current = get().activeTab;
    const stack = get().overlayStack;
    if (stack.length > 0) {
      set({ activeTab: t, overlayStack: [] });
      return;
    }
    if (t !== 'home' && current !== t && typeof window !== 'undefined') {
      window.history.pushState({ tab: t }, '');
    }
    set({ activeTab: t });
  },

  pushScreen: (s) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({ overlay: s }, '');
    }
    set((state) => ({ overlayStack: [...state.overlayStack, s] }));
  },

  popScreen: () => {
    const stack = get().overlayStack;
    if (stack.length === 0) return;
    if (typeof window !== 'undefined' && window.history.state?.overlay) {
      window.history.back();
    } else {
      set({ overlayStack: stack.slice(0, -1) });
    }
  },

  clearStack: () => set({ overlayStack: [] }),

  setSearchTarget: (t) => set({ lastSearchTarget: t }),

  setPendingAnnouncementId: (id) => set({ pendingAnnouncementId: id }),
}));