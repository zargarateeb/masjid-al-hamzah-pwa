"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import type { AnnouncementDoc, HeroUser, PrayerTimeDoc } from "./types";
import { buildJamaatInfo, buildPrayerRows, todayISO, firstName } from "./derive";
import type { JamaatInfo, PrayerRow } from "./types";

interface HomeData {
  user: HeroUser;
  prayerDoc: PrayerTimeDoc | null;
  prayerRows: PrayerRow[];
  jamaat: JamaatInfo | null;
  announcements: AnnouncementDoc[];
}

export function useHomeData() {
  const { data: session } = useSession();
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const date = todayISO();
        const [ptRes, annRes] = await Promise.all([
          fetch(`/api/prayer-times?date=${date}`, { cache: "no-store" }),
          fetch(`/api/announcements`, { cache: "no-store" }),
        ]);

        const pt = await ptRes.json();
        const ann = await annRes.json();

        if (cancelled) return;

        const prayerDoc: PrayerTimeDoc | null = pt?.time ?? null;
        const prayerRows = prayerDoc ? buildPrayerRows(prayerDoc) : [];
        const jamaat = prayerDoc ? buildJamaatInfo(prayerDoc) : null;
        const announcements: AnnouncementDoc[] = Array.isArray(ann?.items) ? ann.items : [];

        const name = session?.user?.name ?? null;
        setData({
          user: { name: name ?? "Guest", firstName: firstName(name) },
          prayerDoc,
          prayerRows,
          jamaat,
          announcements,
        });
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [session?.user?.name]);

  return { data, loading, error };
}