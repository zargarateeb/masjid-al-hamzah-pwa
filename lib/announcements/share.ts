export const APP_URL = "https://masjid-al-hamzah-pwa.vercel.app";

export interface ShareableAnnouncement {
  _id: string;
  title: string;
  content: string;
}

export function buildDeepLink(id: string): string {
  return `${APP_URL}/?announcement=${encodeURIComponent(id)}`;
}

/**
 * WhatsApp/Facebook/Telegram bold markup: *bold*
 * Instagram doesn't support bold via URL, so text is plain there.
 */
export function buildShareMessage(a: ShareableAnnouncement): string {
  const url = buildDeepLink(a._id);
  const bold = `*${a.title}*`;
  const ad = `🕌 *Masjid Al-Hamzah* — Install our app: ${APP_URL}`;
  return `${bold}\n\n${a.content}\n\n🔗 ${url}\n\n${ad}`;
}

export function shareWhatsApp(a: ShareableAnnouncement) {
  const text = buildShareMessage(a);
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
}

export function shareTelegram(a: ShareableAnnouncement) {
  const url = buildDeepLink(a._id);
  const text = buildShareMessage(a);
  window.open(
    `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    "_blank"
  );
}

export function shareFacebook(a: ShareableAnnouncement) {
  // Facebook only accepts URL prefill; text prefill is removed from their sharer API
  const url = buildDeepLink(a._id);
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    "_blank"
  );
}

export async function shareInstagram(a: ShareableAnnouncement) {
  const text = buildShareMessage(a);
  // Instagram has no web share URL. Use the OS share sheet.
  if (typeof navigator !== "undefined" && (navigator as any).share) {
    try {
      await (navigator as any).share({ text });
      return;
    } catch {
      // user cancelled or unsupported
    }
  }
  // Fallback: copy message and alert
  await navigator.clipboard.writeText(text);
  alert("Instagram doesn't support direct sharing. Message copied — paste it in Instagram.");
}

export async function copyLink(a: ShareableAnnouncement) {
  const url = buildDeepLink(a._id);
  await navigator.clipboard.writeText(url);
}

export async function copyMessage(a: ShareableAnnouncement) {
  const text = buildShareMessage(a);
  await navigator.clipboard.writeText(text);
}