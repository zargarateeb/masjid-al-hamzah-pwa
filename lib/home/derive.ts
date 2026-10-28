import { PRAYER_OFFSETS, PRAYERS, type PrayerKey } from "@/lib/constants";
import { formatTime12, timeToMinutes } from "@/lib/utils";
import type { JamaatInfo, PrayerRow, PrayerTimeDoc } from "./types";

const LABEL: Record<PrayerKey, string> = {
  fajr: "Fajr",
  zuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};

export function buildPrayerRows(doc: PrayerTimeDoc): PrayerRow[] {
  return PRAYERS.map((k) => ({
    key: k,
    label: LABEL[k],
    time24: doc[k] ?? "",
    display: formatTime12(doc[k] ?? ""),
  }));
}

/** The next prayer strictly after "now", or null if all have passed. */
export function nextPrayerKey(
  rows: PrayerRow[],
  now = new Date(),
): PrayerKey | null {
  const nowMin = now.getHours() * 60 + now.getMinutes();
  for (const r of rows) {
    const m = timeToMinutes(r.time24);
    if (m != null && m > nowMin) return r.key;
  }
  return null;
}

/** Highlighted timeline capsule: next prayer, or Isha after Isha (until midnight). */
export function activeTimelineKey(
  rows: PrayerRow[],
  now = new Date(),
): PrayerKey {
  return nextPrayerKey(rows, now) ?? "isha";
}

/**
 * Convert "HH:mm" to an ISO string for that time on today's date + `daysOffset`.
 * Uses local time so `new Date(iso).getTime()` compares correctly with `Date.now()`.
 */
function time24ToIso(hhmm: string, daysOffset = 0, base = new Date()): string {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date(base);
  d.setDate(d.getDate() + daysOffset);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

/** Subtract offset minutes from a "HH:mm" string, wrapping around midnight. */
function subtractMinutes(hhmm: string, minutes: number): string {
  const [h, m] = hhmm.split(":").map(Number);
  let tot = h * 60 + m - minutes;
  tot = ((tot % 1440) + 1440) % 1440;
  const nh = Math.floor(tot / 60);
  const nm = tot % 60;
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(nh)}:${p(nm)}`;
}

/**
 * The "NEXT JAMAAT" card.
 * DB stores JAMAAT time. Azaan = Jamaat − offset.
 * - Friday with jummah set → Jumu'ah
 * - After Isha passes → tomorrow's Fajr (countdown must be positive)
 */
export function buildJamaatInfo(
  doc: PrayerTimeDoc,
  now = new Date(),
): JamaatInfo | null {
  const isFriday = now.getDay() === 5;

  if (isFriday && doc.jummah) {
    const jamaat = doc.jummah;
    const azaan = subtractMinutes(jamaat, PRAYER_OFFSETS.jummah);
    return {
      title: "Jumu'ah",
      azaanDisplay: formatTime12(azaan),
      azaanIso: time24ToIso(azaan, 0, now),
      jamaatDisplay: formatTime12(jamaat),
      jamaatIso: time24ToIso(jamaat, 0, now),
      windowStartIso: time24ToIso(azaan, 0, now),
    };
  }

  const rows = buildPrayerRows(doc);
  const nextKey = nextPrayerKey(rows, now);

  // If all today's prayers have passed, roll over to tomorrow's Fajr
  const daysOffset = nextKey === null ? 1 : 0;
  const prayerKey: PrayerKey = nextKey ?? "fajr";

  const jamaat = doc[prayerKey];
  if (!jamaat) return null;

  const azaan = subtractMinutes(jamaat, PRAYER_OFFSETS[prayerKey]);
  return {
    title: LABEL[prayerKey],
    azaanDisplay: formatTime12(azaan),
    azaanIso: time24ToIso(azaan, daysOffset, now),
    jamaatDisplay: formatTime12(jamaat),
    jamaatIso: time24ToIso(jamaat, daysOffset, now),
    windowStartIso: time24ToIso(azaan, daysOffset, now),
  };
}

/** Simple "first name" derivation from full name; empty string → "Guest". */
export function firstName(fullName: string | null | undefined): string {
  if (!fullName) return "Guest";
  const trimmed = fullName.trim();
  return trimmed.split(/\s+/)[0] || "Guest";
}

/** Today in local YYYY-MM-DD, matching your `todayISO()` helper. */
export function todayISO(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Umm al-Qura Hijri via Intl. Returns "" if the runtime lacks support. */
export function hijriToday(): string {
  try {
    const fmt = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const parts = fmt.formatToParts(new Date());
    
    // Extract parts manually to avoid browser-specific suffixes like "BC" or "AD"
    const day = parts.find((p) => p.type === "day")?.value ?? "";
    const month = parts.find((p) => p.type === "month")?.value ?? "";
    const yearStr = parts.find((p) => p.type === "year")?.value ?? "";
    
    // Strip any non-digit characters from the year (removes "BC", "AD", spaces, etc.)
    const cleanYear = yearStr.replace(/\D/g, "");
    
    return `${day} ${month}, ${cleanYear} AH`;
  } catch {
    return "";
  }
}
