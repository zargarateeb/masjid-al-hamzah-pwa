export const APP_NAME = 'Masjid Al-Hamzah';
export const APP_TAGLINE = 'Our Faith · Our Community';
export const MASJID_LOCATION = 'HajiBagh, Buchpora';

export const BANK_DETAILS = {
  holder: 'Masjid Al Hamzah',
  accountNumber: '0173040100013447',
  ifsc: 'JAKA0ANCHAR',
  bank: 'J&K Bank',
};

export const PRAYER_OFFSETS = {
  fajr: 40,
  zuhr: 15,
  asr: 15,
  maghrib: 6,
  isha: 15,
  jummah: 15,
};

export const PRAYER_COMPONENTS = ['sunnat', 'fard', 'jamaat', 'dua'] as const;
export type PrayerComponent = typeof PRAYER_COMPONENTS[number];

export const COMPONENT_POINTS: Record<PrayerComponent, number> = {
  fard: 5,
  jamaat: 3,
  sunnat: 2,
  dua: 1,
};

export const ALL_FARD_BONUS = 10;

export const PRAYERS = ['fajr', 'zuhr', 'asr', 'maghrib', 'isha'] as const;
export type PrayerKey = typeof PRAYERS[number];

export const PRAYER_NAMES: Record<PrayerKey | 'jummah', string> = {
  fajr: 'Fajr',
  zuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
  jummah: "Jumu'ah",
};

export const PRAYER_ARABIC: Record<PrayerKey | 'jummah', string> = {
  fajr: 'الفجر',
  zuhr: 'الظهر',
  asr: 'العصر',
  maghrib: 'المغرب',
  isha: 'العشاء',
  jummah: 'الجمعة',
};

export const DEBATE_GUIDELINES = [
  { title: 'Be Respectful', body: 'Always speak with kindness and respect even when you disagree.' },
  { title: 'Stick to Facts', body: 'Base your arguments on knowledge and authentic sources.' },
  { title: 'Stay Peaceful', body: 'The goal is understanding, not winning or personal attacks.' },
  { title: 'Honor Islamic Values', body: 'Keep discussions within the boundaries of Shariah and community harmony.' },
  { title: 'Make Dua for Guidance', body: 'Before and during any debate, ask Allah for clarity and sincerity.' },
];

// ─── Super Admin ──────────────────────────────────────
// Server-side list of super-admin emails
export function getSuperAdminEmails(): string[] {
  const raw = process.env.SUPER_ADMIN_EMAILS || '';
  return raw.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
}

// Client-safe check for a given email
export function isSuperAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const raw = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAILS || '';
  return raw.split(',').map((e) => e.trim().toLowerCase()).includes(email.toLowerCase());
}