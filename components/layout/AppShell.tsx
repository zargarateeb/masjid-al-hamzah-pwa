'use client';

import { useAppStore } from '@/lib/store';
import BottomNav from './BottomNav';
import HomeScreen from '@/components/screens/HomeScreen';
import PrayerScreen from '@/components/screens/PrayerScreen';
import TasbeehScreen from '@/components/screens/TasbeehScreen';
import MoreScreen from '@/components/screens/MoreScreen';
import AnnouncementsScreen from '@/components/screens/AnnouncementsScreen';
import DebateScreen from '@/components/screens/DebateScreen';
import DonateScreen from '@/components/screens/DonateScreen';
import AdminPinScreen from '@/components/screens/AdminPinScreen';
import AdminScreen from '@/components/screens/AdminScreen';
import SettingsScreen from '@/components/screens/SettingsScreen';
import ProfileScreen from '@/components/screens/ProfileScreen';
import NamesOfAllahScreen from '@/components/screens/NamesOfAllahScreen';
import NamesOfProphetScreen from '@/components/screens/NamesOfProphetScreen';
import DuasScreen from '@/components/screens/DuasScreen';
import QiblaScreen from '@/components/screens/QiblaScreen';
import OurMasjidScreen from '@/components/screens/OurMasjidScreen';
import SuperAdminScreen from '@/components/screens/SuperAdminScreen';
import AmbientGlow from '@/components/ui/AmbientGlow';

export default function AppShell() {
  const activeTab = useAppStore((s) => s.activeTab);
  const overlayStack = useAppStore((s) => s.overlayStack);
  const activeOverlay = overlayStack[overlayStack.length - 1];

  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-[480px] bg-midnight overflow-hidden">
      <AmbientGlow color="emerald" size={500} style={{ top: -200, left: -150, opacity: 0.55 }} />
      <AmbientGlow color="gold" size={400} style={{ bottom: 100, right: -180, opacity: 0.35 }} />

      <main className="relative pb-32">
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'prayer' && <PrayerScreen />}
        {activeTab === 'tasbeeh' && <TasbeehScreen />}
        {activeTab === 'more' && <MoreScreen />}
      </main>

      {activeOverlay === 'announcements' && <AnnouncementsScreen />}
      {activeOverlay === 'debate' && <DebateScreen />}
      {activeOverlay === 'donate' && <DonateScreen />}
      {activeOverlay === 'admin-pin' && <AdminPinScreen />}
      {activeOverlay === 'admin' && <AdminScreen />}
      {activeOverlay === 'settings' && <SettingsScreen />}
      {activeOverlay === 'profile' && <ProfileScreen />}
      {activeOverlay === 'names-of-allah' && <NamesOfAllahScreen />}
      {activeOverlay === 'names-of-prophet' && <NamesOfProphetScreen />}
      {activeOverlay === 'duas' && <DuasScreen />}
      {activeOverlay === 'qibla' && <QiblaScreen />}
      {activeOverlay === 'our-masjid' && <OurMasjidScreen />}
      {activeOverlay === 'super-admin' && <SuperAdminScreen />}

      <BottomNav />
    </div>
  );
}