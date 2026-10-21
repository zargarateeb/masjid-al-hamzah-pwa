"use client";
import { useHomeData } from "@/lib/home/useHomeData";
import { Hero } from "./Hero";
import { JamaatCard } from "./JamaatCard";
import { PrayerTimeline } from "./PrayerTimeline";
import { FeatureGrid } from "./FeatureGrid";
import { Announcements } from "./Announcements";
import { activeTimelineKey, hijriToday } from "@/lib/home/derive";

export function HomeTab() {
  const { data, loading, error } = useHomeData();

  if (error) {
    return (
      <div className="p-6 text-sm text-ink-muted">
        Could not load home data: {error}
      </div>
    );
  }

  const loadingOrData = loading || !data;

  const upcoming =
    !loadingOrData && data!.prayerRows.length > 0
      ? activeTimelineKey(data!.prayerRows)
      : "fajr";

  return (
    <main>
      <Hero
        user={data?.user ?? { firstName: "Guest", name: "Guest" }}
        hijriDate={loadingOrData ? "" : hijriToday()}
        location="Buchpora, Srinagar"
      />

      <div className="relative z-10 -mt-0 px-2">
        <JamaatCard
          jamaat={loadingOrData ? null : data!.jamaat}
          loading={loadingOrData}
        />
      </div>

      {!loadingOrData && (
        <>
          <div className="px-2">
            <PrayerTimeline rows={data!.prayerRows} activeKey={upcoming} />
            <FeatureGrid />
            <Announcements items={data!.announcements} />
          </div>
        </>
      )}
    </main>
  );
}
