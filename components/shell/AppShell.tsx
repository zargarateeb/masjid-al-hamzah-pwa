"use client";
import { useAppStore } from "@/lib/store";
import { BottomNav } from "./BottomNav";
import { OfflineBanner } from "@/components/ui/OfflineBanner";
import { LeafBackground } from "./LeafBackground";
import { StickyTopBar } from "./StickyTopBar";
import PrayerTimeEditorOverlay from "@/components/screens/PrayerTimeEditorOverlay";
import { HomeTab } from "@/components/home/HomeTab";
import { MoreTab } from "@/components/screens/MoreTab";
import { TimingsTab } from "@/components/screens/TimingsTab";
import { TasbeehTab } from "@/components/screens/TasbeehTab";
import { NamesOfAllahOverlay } from "@/components/screens/NamesOfAllahOverlay";
import DuasOverlay from "@/components/screens/DuasOverlay";
import AnnouncementsOverlay from "@/components/screens/AnnouncementsOverlay";
import { NamesOfProphetOverlay } from "@/components/screens/NamesOfProphetOverlay";
import { OurMasjidOverlay } from "@/components/screens/OurMasjidOverlay";
import DonateOverlay from "@/components/screens/DonateOverlay";
import DebateOverlay from "@/components/screens/DebateOverlay";
import { ProfileOverlay } from "@/components/screens/ProfileOverlay";
import { SettingsOverlay } from "@/components/screens/SettingsOverlay";
import { QiblaOverlay } from "@/components/screens/QiblaOverlay";
import AdminPinOverlay from "@/components/screens/AdminPinOverlay";
import { AdminOverlay } from "@/components/screens/AdminOverlay";
import { SearchOverlay } from "@/components/screens/SearchOverlay";
import { SuperAdminOverlay } from "@/components/screens/SuperAdminOverlay";

export function AppShell() {
  const activeTab = useAppStore((s) => s.activeTab);
  const overlayStack = useAppStore((s) => s.overlayStack);

  return (
    <>
      <LeafBackground variant={activeTab === "home" ? "composite" : "plain"} />
      <OfflineBanner />
      <div className="relative min-h-dvh bg-transparent">
        {activeTab === "home" && <StickyTopBar />}
        <main className="relative mx-auto w-full max-w-[540px] pb-32">
          {activeTab === "home" && <HomeTab />}
          {activeTab === "prayer" && <TimingsTab />}
          {activeTab === "tasbeeh" && <TasbeehTab />}
          {activeTab === "more" && <MoreTab />}

          {overlayStack.map((s, i) => (
            <div
              key={`${s}-${i}`}
              className="fixed inset-0 z-50 overflow-y-auto bg-canvas"
              role="dialog"
              aria-label={s}
            >
              <div className="mx-auto min-h-full max-w-[540px]">
                {s === "announcements" && <AnnouncementsOverlay />}
                {s === "duas" && <DuasOverlay />}
                {s === "names-of-allah" && <NamesOfAllahOverlay />}
                {s === "names-of-prophet" && <NamesOfProphetOverlay />}
                {s === "our-masjid" && <OurMasjidOverlay />}
                {s === "donate" && <DonateOverlay />}
                {s === "debate" && <DebateOverlay />}
                {s === "profile" && <ProfileOverlay />}
                {s === "settings" && <SettingsOverlay />}
                {s === "qibla" && <QiblaOverlay />}
                {s === "admin-pin" && <AdminPinOverlay />}
                {s === "admin" && <AdminOverlay />}
                {s === "super-admin" && <SuperAdminOverlay />}
                {s === "edit-times" && <PrayerTimeEditorOverlay />}
                {s === "search" && <SearchOverlay />}
              </div>
            </div>
          ))}
        </main>
        <BottomNav />
      </div>
    </>
  );
}
