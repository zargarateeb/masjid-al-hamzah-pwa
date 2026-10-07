// ═══════════════════════════════════════════════════════════
//  MASJID AL-HAMZAH — Image Library
// ═══════════════════════════════════════════════════════════

const IK = 'https://ik.imagekit.io/rgbcpayfx';

// ─── Branding ──────────────────────────────────────────
export const MASJID_LOGO =
  'https://ik.imagekit.io/rgbcpayfx/masjid-logo.png';
// ─── Home ──────────────────────────────────────────────
export const HOME_BACKGROUND =
  'https://ik.imagekit.io/rgbcpayfx/masjid-hamzah.jpg?updatedAt=1791299763385';
export const HERO_HOME = HOME_BACKGROUND;

// ─── Per-prayer (mihrab card + prayer list) ────────────
export const PRAYER_IMAGES: Record<string, string> = {
  fajr: 'https://ik.imagekit.io/5xwchyocd7/FAJR.jpg',
  zuhr: 'https://ik.imagekit.io/5xwchyocd7/ZUHR.png',
  asr: 'https://ik.imagekit.io/5xwchyocd7/ASR%20(1).jpg',
  maghrib: 'https://ik.imagekit.io/5xwchyocd7/MGRB.png',
  isha: 'https://ik.imagekit.io/5xwchyocd7/ISHA.png',
  jummah: 'https://ik.imagekit.io/5xwchyocd7/ZUHR.png',
};

export function prayerImage(key: string): string {
  return PRAYER_IMAGES[key] ?? PRAYER_IMAGES.asr;
}

// ─── Fallback ──────────────────────────────────────────
export const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=900&q=80';

// ─── More screen tile images (ImageKit · rgbcpayfx) ────
export const TILE_IMAGES: Record<string, string> = {
  'names-of-allah': `${IK}/Names-of-Allah.jpg`,
  'names-of-prophet': `${IK}/Names-of-Prophet.jpg`,
  duas: `${IK}/Supplication.jpg`,
  qibla: `${IK}/Qibla.jpg`,
  'our-masjid': `${IK}/masjid-hamzah.jpg`,
  announcements: `${IK}/Announcements.jpg`,
  debate: `${IK}/debate.jpg`,
  donate: `${IK}/Donate.jpg`,
  settings: `${IK}/Settings.jpg`,
};

// ─── Duas — category thumbnails (ImageKit · rgbcpayfx) ─
export const DUA_CATEGORY_IMAGES: Record<string, string> = {
  'Morning & Evening': `${IK}/morning-&-evening.jpg`,
  'Eating & Drinking': `${IK}/eating-&-drinking.jpg`,
  'Sleeping & Waking': `${IK}/sleep-&-walking.jpg`,
  Travel: `${IK}/travel.jpg`,
  'Home & Masjid': `${IK}/home-&-masjid.jpg`,
  Protection: `${IK}/protection.jpg`,
  Forgiveness: `${IK}/forgiveness.jpg`,
  'Parents & Family': `${IK}/parents-and-family.jpg`,
  'Anxiety & Sadness': `${IK}/anxiety.jpg`,
  General: `${IK}/general-dua.jpg`,
};

export function duaCategoryImage(cat: string): string {
  return DUA_CATEGORY_IMAGES[cat] || DUA_CATEGORY_IMAGES.General;
}

// ─── Sacred backgrounds (still Unsplash for these) ─────
export const KAABA_DUSK =
  'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80';
export const MOSQUE_NIGHT =
  'https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=1200&q=80';
export const MOSQUE_INTERIOR =
  'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1200&q=80';
export const MOSQUE_ARCHES =
  'https://ik.imagekit.io/rgbcpayfx/Announcements.jpg';
export const MOSQUE_GOLDEN =
  'https://images.unsplash.com/photo-1585129777188-9d57e6c8b8e8?auto=format&fit=crop&w=1200&q=80';
export const MOSQUE_SILHOUETTE =
  'https://images.unsplash.com/photo-1565019011521-b0575cbb57c4?auto=format&fit=crop&w=1200&q=80';

// ─── Names screens ─────────────────────────────────────
export const NAMES_ALLAH_BG =
  'https://ik.imagekit.io/rgbcpayfx/Names-of-Allah.jpg';
export const NAMES_PROPHET_BG =
  'https://ik.imagekit.io/rgbcpayfx/Names-of-Prophet.jpg';

// ─── Other screens ─────────────────────────────────────
export const QIBLA_BG =
  'https://ik.imagekit.io/rgbcpayfx/Qibla.jpg';
export const MASJID_HERO = 
 'https://ik.imagekit.io/rgbcpayfx/masjid-hamzah.jpg?updatedAt=1791299763385';
export const PRAYER_HERO = 
 'https://ik.imagekit.io/rgbcpayfx/parents-and-family.jpg';
export const TASBEEH_BG = 
 'https://ik.imagekit.io/rgbcpayfx/Supplication.jpg';
export const DONATE_HERO = 
 'https://ik.imagekit.io/rgbcpayfx/donation-masjid.jpg';
export const ANNOUNCEMENT_HERO = 
 'https://ik.imagekit.io/rgbcpayfx/Announcements.jpg';
export const DEBATE_HERO =
 'https://ik.imagekit.io/rgbcpayfx/debate.jpg';
// ─── Avatars ───────────────────────────────────────────
export const FALLBACK_AVATAR = MOSQUE_INTERIOR;