import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import PrayerLog from '@/lib/models/PrayerLog';
import TasbeehLog from '@/lib/models/TasbeehLog';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');
    if (!userId && !email) return NextResponse.json({ error: 'Missing userId or email' }, { status: 400 });

    await connectDB();
    const user = userId
      ? await User.findById(userId).lean()
      : await User.findOne({ email }).lean();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const uid = (user as any)._id.toString();

    const prayerLogs = await PrayerLog.find({ userId: uid }).lean();
    let fardsTotal = 0;
    let completeDays = 0;
    const dayFards: Record<string, number> = {};
    for (const log of prayerLogs) {
      const c = (log as any).checked || {};
      let f = 0;
      for (const p of ['fajr', 'zuhr', 'asr', 'maghrib', 'isha']) {
        if (c[`${p}_fard`]) f++;
      }
      dayFards[(log as any).date] = f;
      fardsTotal += f;
      if (f === 5) completeDays++;
    }

    let currentStreak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (dayFards[iso] === 5) currentStreak++;
      else if (i > 0) break;
    }

    let bestStreak = 0;
    const sorted = Object.keys(dayFards).sort();
    let run = 0;
    let prev: Date | null = null;
    for (const dstr of sorted) {
      if (dayFards[dstr] !== 5) { run = 0; prev = null; continue; }
      const d = new Date(dstr + 'T00:00:00');
      if (prev && d.getTime() - prev.getTime() === 86400000) run++;
      else run = 1;
      bestStreak = Math.max(bestStreak, run);
      prev = d;
    }

    const tasbeehLogs = await TasbeehLog.find({ userId: uid }).lean();
    const tasbeehTotal = tasbeehLogs.reduce((sum, log: any) => {
      return sum + Object.values(log.counts || {}).reduce((a: any, b: any) => a + (b || 0), 0);
    }, 0);

    const allDates = new Set<string>();
    prayerLogs.forEach((l: any) => allDates.add(l.date));
    tasbeehLogs.forEach((l: any) => allDates.add(l.date));

    return NextResponse.json({
      profile: {
        id: uid,
        name: (user as any).name,
        email: (user as any).email,
        image: (user as any).image,
        phone: (user as any).phone || '',
        city: (user as any).city || '',
        bio: (user as any).bio || '',
        createdAt: (user as any).createdAt,
      },
      stats: {
        daysActive: allDates.size,
        fardsTotal,
        completeDays,
        currentStreak,
        bestStreak,
        tasbeehTotal,
      },
    });
  } catch (e: any) {
    console.error('❌ Profile GET error:', e?.message || e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, email, name, phone, city, bio, image } = body;

    await connectDB();

    // Find the user by id first, fall back to email
    let user = userId ? await User.findById(userId) : null;
    if (!user && email) user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const update: any = {};
    if (name !== undefined && name !== '') update.name = name;
    if (phone !== undefined) update.phone = phone;
    if (city !== undefined) update.city = city;
    if (bio !== undefined) update.bio = bio;
    if (image !== undefined) update.image = image;

    await User.findByIdAndUpdate((user as any)._id, update);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('❌ Profile POST error:', e?.message || e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}