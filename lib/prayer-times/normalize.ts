import { PRAYER_OFFSETS, PRAYER_NAMES, PRAYER_ARABIC, PRAYERS, type PrayerKey } from "@/lib/constants";

/** Minutes-of-day values that are FIXED regardless of DB. */
export const FIXED_TIMES = {
  zuhr: "13:00",
  jummah: "13:15",
} as const;

/** Fixed Azaan/Khutbah times that precede the fixed Jamaat. */
export const FIXED_PRIOR_TIMES = {
  zuhr: "12:45", // Zuhr azaan = jamaat − 15
  jummah: "12:30", // Jumu'ah Khutbah (not azaan)
} as const;

/**
 * Snap a "HH:mm" time to the nearest 5-minute mark.
 * Applies to Fajr, Asr, Isha only.
 */
export function snapToFiveMinutes(hhmm: string): string {
  if (!hhmm || !hhmm.includes(":")) return hhmm;
  const [h, m] = hhmm.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return hhmm;
  const rounded = Math.round(m / 5) * 5;
  // Handle m=58 → 60 → carry to next hour
  if (rounded === 60) {
    const nh = (h + 1) % 24;
    return `${String(nh).padStart(2, "0")}:00`;
  }
  return `${String(h).padStart(2, "0")}:${String(rounded).padStart(2, "0")}`;
}

/** True if the time is already a valid 5-min mark. */
export function isValidFiveMin(hhmm: string): boolean {
  if (!hhmm || !hhmm.includes(":")) return false;
  const [h, m] = hhmm.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return false;
  return m % 5 === 0;
}

/** Subtract minutes from "HH:mm", wrapping past midnight. */
export function subtractMinutes(hhmm: string, minutes: number): string {
  const [h, m] = hhmm.split(":").map(Number);
  let tot = h * 60 + m - minutes;
  tot = ((tot % 1440) + 1440) % 1440;
  return `${String(Math.floor(tot / 60)).padStart(2, "0")}:${String(tot % 60).padStart(2, "0")}`;
}

export interface NormalizedPrayer {
  key: PrayerKey;
  name: string;
  arabic: string;
  jamaat: string; // effective jamaat time
  prior: string;  // effective azaan OR khutbah time
  priorLabel: "Azaan" | "Khutbah"; // Khutbah for Jumu'ah
}

/**
 * Apply all rules to a raw PrayerTime doc and return the effective times
 * for a given set of prayers (5 weekday + jummah, or 5 + jummah on Friday).
 *
 * Rules:
 * - Zuhr: fixed jamaat 13:00, azaan 12:45
 * - Jumu'ah: fixed jamaat 13:15, khutbah 12:30
 * - Fajr / Asr / Isha: jamaat snapped to nearest 5 min, azaan = jamaat − offset
 * - Maghrib: exact jamaat from DB, azaan = jamaat − 6
 */
export function effectivePrayers(
  doc: Record<string, string>,
  includeJummah: boolean,
): NormalizedPrayer[] {
  const out: NormalizedPrayer[] = [];

  for (const key of PRAYERS) {
    const raw = doc[key] ?? "";
    let jamaat: string;
    let prior: string;

    if (key === "zuhr") {
      jamaat = FIXED_TIMES.zuhr;
      prior = FIXED_PRIOR_TIMES.zuhr;
    } else if (key === "maghrib") {
      jamaat = raw;
      prior = raw ? subtractMinutes(raw, PRAYER_OFFSETS.maghrib) : "";
    } else {
      // Fajr, Asr, Isha — snap to 5 min
      jamaat = raw ? snapToFiveMinutes(raw) : "";
      prior = jamaat ? subtractMinutes(jamaat, PRAYER_OFFSETS[key]) : "";
    }

    if (!jamaat) continue;

    out.push({
      key,
      name: PRAYER_NAMES[key],
      arabic: PRAYER_ARABIC[key],
      jamaat,
      prior,
      priorLabel: "Azaan",
    });
  }

  if (includeJummah) {
    // Replace Zuhr with Jumu'ah
    const idx = out.findIndex((p) => p.key === "zuhr");
    const jummahEntry: NormalizedPrayer = {
      key: "zuhr", // typed as zuhr for state tracking; display uses name "Jumu'ah"
      name: "Jumu'ah",
      arabic: PRAYER_ARABIC.jummah,
      jamaat: FIXED_TIMES.jummah,
      prior: FIXED_PRIOR_TIMES.jummah,
      priorLabel: "Khutbah",
    };
    if (idx >= 0) out[idx] = jummahEntry;
  }

  return out;
}
