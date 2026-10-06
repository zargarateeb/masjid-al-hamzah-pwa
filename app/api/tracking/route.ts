import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import PrayerLog from '@/lib/models/PrayerLog';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const date = searchParams.get('date');
    if (!userId || !date) {
      return NextResponse.json({ checked: {}, error: 'Missing params' });
    }

    await connectDB();
    const log = await PrayerLog.findOne({ userId, date }).lean();
    return NextResponse.json({
      checked: log?.checked || {},
      pointsEarned: log?.pointsEarned || 0,
    });
  } catch (e: any) {
    console.error('❌ Tracking GET error:', e?.message || e);
    return NextResponse.json({ checked: {}, error: e?.message });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, date, checked } = body;

    if (!userId || !date || !checked) {
      return NextResponse.json(
        { error: 'Missing fields' },
        { status: 400 }
      );
    }

    await connectDB();

    const POINTS: Record<string, number> = {
      fard: 5,
      jamaat: 3,
      sunnat: 2,
      dua: 1,
    };
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
      { userId, date },
      {
        userId,
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
    console.error('❌ Tracking POST error:', e?.message || e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}