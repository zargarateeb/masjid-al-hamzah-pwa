import type { PrayerKey } from "@/lib/constants";

/** Shape returned by GET /api/prayer-times?date=YYYY-MM-DD */
export interface PrayerTimeDoc {
  date: string;            // "YYYY-MM-DD"
  fajr: string;            // "HH:mm" 24h
  zuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  jummah: string;          // Friday only; may be ""
  updatedAt?: string;
}

export interface PrayerRow {
  key: PrayerKey;
  label: string;           // "Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"
  time24: string;
  display: string;         // "5:50 AM"
}

export interface JamaatInfo {
  title: string;           // "Jumu'ah" | "Fajr" | "Dhuhr" | ...
  azaanDisplay: string;
  azaanIso: string;
  jamaatDisplay: string;
  jamaatIso: string;
  windowStartIso: string;  // used for real progress bar = azaan time
}

/** Shape returned by GET /api/announcements */
export interface AnnouncementDoc {
  _id: string;
  title: string;
  content: string;
  isUrgent: boolean;
  comments: unknown[];
  createdAt: string;
}

export interface HeroUser {
  name: string;
  firstName: string;       // derived from name
}