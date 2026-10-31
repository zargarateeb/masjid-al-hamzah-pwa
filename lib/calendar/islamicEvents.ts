export interface IslamicEvent {
  name: string;
  hijriMonth: number; // 1=Muharram ... 12=Dhul-Hijjah
  hijriDay: number;
  description: string;
}

export const ISLAMIC_EVENTS: IslamicEvent[] = [
  { name: "Hijri New Year",                hijriMonth: 1,  hijriDay: 1,  description: "First day of the Islamic year" },
  { name: "Day of Ashura",                 hijriMonth: 1,  hijriDay: 10, description: "Commemorates Prophet Musa's deliverance" },
  { name: "Mawlid al-Nabi",                hijriMonth: 3,  hijriDay: 12, description: "Birth of Prophet Muhammad ﷺ" },
  { name: "Isra' and Mi'raj",              hijriMonth: 7,  hijriDay: 27, description: "The Night Journey" },
  { name: "Mid-Sha'ban (Shab-e-Barat)",    hijriMonth: 8,  hijriDay: 15, description: "Night of forgiveness" },
  { name: "Ramadan Begins",                hijriMonth: 9,  hijriDay: 1,  description: "Month of fasting" },
  { name: "Laylat al-Qadr",                hijriMonth: 9,  hijriDay: 27, description: "Night of Power (last 10 nights)" },
  { name: "Eid al-Fitr",                   hijriMonth: 10, hijriDay: 1,  description: "Festival of breaking the fast" },
  { name: "First 10 Days of Dhul-Hijjah",  hijriMonth: 12, hijriDay: 1,  description: "Blessed days for good deeds" },
  { name: "Hajj Begins",                   hijriMonth: 12, hijriDay: 8,  description: "Pilgrimage to Makkah" },
  { name: "Day of Arafah",                 hijriMonth: 12, hijriDay: 9,  description: "Peak day of Hajj" },
  { name: "Eid al-Adha",                   hijriMonth: 12, hijriDay: 10, description: "Festival of sacrifice" },
  { name: "Days of Tashriq",               hijriMonth: 12, hijriDay: 11, description: "Remembrance after Eid al-Adha" },
];

/** Find event for a given Hijri month/day. */
export function eventFor(month: number, day: number): IslamicEvent | undefined {
  return ISLAMIC_EVENTS.find((e) => e.hijriMonth === month && e.hijriDay === day);
}

const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
  "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
  "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah",
];

export function hijriMonthName(m: number): string {
  return HIJRI_MONTHS[m - 1] ?? "";
}

/**
 * Parse a Gregorian date into Hijri {year, month, day} using Intl.
 */
export function getHijri(date: Date): { year: number; month: number; day: number; monthName: string } {
  const fmt = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
    day: "numeric", month: "numeric", year: "numeric",
  });
  const parts = fmt.formatToParts(date);
  const year = parseInt(parts.find((p) => p.type === "year")?.value ?? "0", 10);
  const month = parseInt(parts.find((p) => p.type === "month")?.value ?? "0", 10);
  const day = parseInt(parts.find((p) => p.type === "day")?.value ?? "0", 10);
  return { year, month, day, monthName: hijriMonthNames(month) };
}

function hijriMonthNames(m: number): string {
  return HIJRI_MONTHS[m - 1] ?? "";
}

/**
 * Build a full month grid for a given Hijri year + month.
 * Returns { rows: (DayCell | null)[][], gregorianRange: string }.
 * DayCell = { hijriDay, gregorianDay, date, isEvent }
 */
export interface DayCell {
  hijriDay: number;
  gregorianDay: number;
  date: Date;
  isEvent: boolean;
  eventName?: string;
  eventDescription?: string;
}

export function buildHijriMonth(
  hijriYear: number,
  hijriMonth: number,
): { rows: (DayCell | null)[][]; gregorianRange: string; eventDays: number[] } {
  // Find the Gregorian date of the 1st of the Hijri month by scanning forward
  // from roughly 12 months before the target year.
  const now = new Date();
  // Search a window: start ~1 year before now, scan 800 days forward
  const start = new Date(now);
  start.setDate(start.getDate() - 400);
  let firstOfMonth: Date | null = null;
  let lastDay = 0;

  for (let i = 0; i < 800; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const h = getHijri(d);
    if (h.year === hijriYear && h.month === hijriMonth) {
      if (!firstOfMonth) firstOfMonth = new Date(d);
      lastDay = h.day;
    } else if (firstOfMonth && h.year === hijriYear && h.month !== hijriMonth && h.day <= 2) {
      // wrapped past the month
      break;
    }
  }

  if (!firstOfMonth) {
    // Fallback: return empty
    return { rows: [], gregorianRange: "", eventDays: [] };
  }

  // Build the grid starting on firstOfMonth, 7 cols
  const cells: (DayCell | null)[] = [];
  const firstWeekday = firstOfMonth.getDay(); // 0=Sun
  for (let i = 0; i < firstWeekday; i++) cells.push(null);

  const eventDays: number[] = [];
  for (let day = 1; day <= lastDay; day++) {
    const d = new Date(firstOfMonth);
    d.setDate(d.getDate() + (day - 1));
    const ev = eventFor(hijriMonth, day);
    if (ev) eventDays.push(day);
    cells.push({
      hijriDay: day,
      gregorianDay: d.getDate(),
      date: d,
      isEvent: !!ev,
      eventName: ev?.name,
      eventDescription: ev?.description,
    });
  }

  // Pad to multiple of 7
  while (cells.length % 7 !== 0) cells.push(null);

  // Chunk into rows
  const rows: (DayCell | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }

  const lastGreg = new Date(firstOfMonth);
  lastGreg.setDate(lastGreg.getDate() + (lastDay - 1));
  const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });
  const gregorianRange = `${fmt.format(firstOfMonth)} – ${fmt.format(lastGreg)}`;

  return { rows, gregorianRange, eventDays };
}