import { PRAYER_OFFSETS, PRAYERS, type PrayerKey } from "@/lib/constants";
import { addMinutes, formatTime12, timeToMinutes } from "@/lib/utils";
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
export function nextPrayerKey(rows: PrayerRow[], now = new Date()): PrayerKey | null {
  const nowMin = now.getHours() * 60 + now.getMinutes();
  for (const r of rows) {
    const m = timeToMinutes(r.time24);
    if (m != null && m > nowMin) return r.key;
  }
  return null;
}

/** Highlighted timeline capsule: next prayer, or Isha after Isha (until midnight). */
export function activeTimelineKey(rows: PrayerRow[], now = new Date()): PrayerKey {
  return nextPrayerKey(rows, now) ?? "isha";
}

function time24ToIsoToday(hhmm: string, base = new Date()): string {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date(base);
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
 * The DB stores the JAMAAT time. Azaan = Jamaat − offset.
 * - Friday with jummah set → Jumu'ah
 * - Otherwise → next prayer
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
      azaanIso: time24ToIsoToday(azaan, now),
      jamaatDisplay: formatTime12(jamaat),
      jamaatIso: time24ToIsoToday(jamaat, now),
      windowStartIso: time24ToIsoToday(azaan, now),
    };
  }

  const rows = buildPrayerRows(doc);
  const key = nextPrayerKey(rows, now) ?? "fajr";
  const jamaat = doc[key];
  if (!jamaat) return null;

  const azaan = subtractMinutes(jamaat, PRAYER_OFFSETS[key]);
  return {
    title: LABEL[key],
    azaanDisplay: formatTime12(azaan),
    azaanIso: time24ToIsoToday(azaan, now),
    jamaatDisplay: formatTime12(jamaat),
    jamaatIso: time24ToIsoToday(jamaat, now),
    windowStartIso: time24ToIsoToday(azaan, now),
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
    return new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date());
  } catch {
    return "";
  }
}
