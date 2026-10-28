import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import PrayerTime from '@/lib/models/PrayerTime';
import ReminderLog from '@/lib/models/ReminderLog';
import { sendToAll } from '@/lib/push';
import { PRAYER_OFFSETS } from '@/lib/constants';

function todayISO(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function addMin(t: string, min: number): string {
  if (!t || !t.includes(':')) return t;
  const [h, m] = t.split(':').map(Number);
  let tot = h * 60 + m + min;
  tot = ((tot % 1440) + 1440) % 1440;
  return `${pad(Math.floor(tot / 60))}:${pad(tot % 60)}`;
}

function toMin(t: string): number | null {
  if (!t || !t.includes(':')) return null;
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

const LABELS: Record<string, { en: string; arabic: string }> = {
  fajr: { en: 'Fajr', arabic: 'الفجر' },
  zuhr: { en: 'Dhuhr', arabic: 'الظهر' },
  asr: { en: 'Asr', arabic: 'العصر' },
  maghrib: { en: 'Maghrib', arabic: 'المغرب' },
  isha: { en: 'Isha', arabic: 'العشاء' },
};

export async function GET(req: Request) {
  // Optional auth via secret
  const url = new URL(req.url);
  const secret = url.searchParams.get('secret');
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    const today = todayISO();
    const times = await PrayerTime.findOne({
      date: { $lte: today },
    })
      .sort({ date: -1 })
      .lean();

    if (!times) {
      return NextResponse.json({ ok: true, reason: 'no times set' });
    }

    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const prayers = ['fajr', 'zuhr', 'asr', 'maghrib', 'isha'] as const;

    const fired: string[] = [];

    for (const p of prayers) {
      const azaan = (times as any)[p];
      if (!azaan) continue;

      const offset = PRAYER_OFFSETS[p];
      const jamaat = addMin(azaan, offset);
      const azaanMin = toMin(azaan);
      const jamaatMin = toMin(jamaat);
      if (azaanMin == null || jamaatMin == null) continue;

      // 1. "Azaan starting" — X min before Jamaat
      const azaanNotify = azaanMin;

      // 2. "5 min before Jamaat"
      const fiveBefore = jamaatMin - 5;

      // Check if we're within ±2 min of a reminder window
      const inWindow = (target: number) =>
        Math.abs(nowMin - target) <= 2;

      for (const [kind, at, title, body] of [
        [
          'azaan',
          azaanNotify,
          `🕌 ${LABELS[p].en} — Azān`,
          `It's time for ${LABELS[p].en}. May Allah accept your prayer.`,
        ],
        [
          'jamaat5',
          fiveBefore,
          `🕌 ${LABELS[p].en} — 5 min to Jamā'ah`,
          `Jama'ah starts in 5 minutes. Get ready.`,
        ],
      ] as [string, number, string, string][]) {
        if (!inWindow(at)) continue;

        // Prevent duplicate
        try {
          await ReminderLog.create({ date: today, prayer: p, kind });
        } catch {
          continue; // already sent
        }

        const result = await sendToAll({
          title,
          body,
          url: '/',
          tag: `${p}-${kind}`,
        });
        fired.push(`${p}-${kind}: ${result.sent}/${result.total}`);
      }
    }

    return NextResponse.json({ ok: true, fired });
  } catch (e: any) {
    console.error('❌ Cron error:', e?.message || e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}