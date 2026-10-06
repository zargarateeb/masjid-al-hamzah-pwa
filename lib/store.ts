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
  | 'our-masjid';

interface AppState {
  activeTab: Tab;
  overlayStack: OverlayScreen[];
  setTab: (t: Tab) => void;
  pushScreen: (s: OverlayScreen) => void;
  popScreen: () => void;
  clearStack: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeTab: 'home',
  overlayStack: [],
  setTab: (t) => set({ activeTab: t, overlayStack: [] }),
  pushScreen: (s) =>
    set((state) => ({ overlayStack: [...state.overlayStack, s] })),
  popScreen: () =>
    set((state) => ({ overlayStack: state.overlayStack.slice(0, -1) })),
  clearStack: () => set({ overlayStack: [] }),
}));