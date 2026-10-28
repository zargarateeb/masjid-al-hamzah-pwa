import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import PrayerLog from '@/lib/models/PrayerLog';
import { getSessionUserId } from '@/lib/authHelpers';

export async function GET(req: Request) {
  try {
    const sessionUserId = await getSessionUserId();
    if (!sessionUserId) {
      return NextResponse.json({ checked: {}, error: 'Sign in required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    if (!date) {
      return NextResponse.json({ checked: {}, error: 'Missing date' }, { status: 400 });
    }

    await connectDB();
    const log = await PrayerLog.findOne({ userId: sessionUserId, date }).lean();
    return NextResponse.json({
      checked: log?.checked || {},
      pointsEarned: log?.pointsEarned || 0,
    });
  } catch (e: any) {
    console.error('❌ tracking GET error:', e?.message || e);
    return NextResponse.json({ checked: {}, error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const sessionUserId = await getSessionUserId();
    if (!sessionUserId) {
      return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
    }

    const body = await req.json();
    const { date, checked } = body;

    if (!date || !checked) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await connectDB();

    const POINTS: Record<string, number> = { fard: 5, jamaat: 3, sunnat: 2, dua: 1 };
    const prayers = ['fajr', 'zuhr', 'asr', 'maghrib', 'isha'];

    let points = 0;
    let fardCount = 0;
    for (const p of prayers) {
      for (const c of ['sunnat', 'fard', 'jamaat', 'dua']) {
        if (checked[`${p}_${c}`] === true) {
          points += POINTS[c] || 0;
        }
      }
      if (checked[`${p}_fard`] === true) fardCount++;
    }
    const allFardBonus = fardCount === 5;
    if (allFardBonus) points += 10;

    const updated = await PrayerLog.findOneAndUpdate(
      { userId: sessionUserId, date },
      {
        userId: sessionUserId,
        date,
        checked,
        fardCount,
        pointsEarned: points,
        allFardBonus,
      },
      { upsert: true, new: true }
    ).lean();

    return NextResponse.json({
      ok: true,
      checked: updated?.checked || checked,
      pointsEarned: points,
      allFardBonus,
    });
  } catch (e: any) {
    console.error('❌ tracking POST error:', e?.message || e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}