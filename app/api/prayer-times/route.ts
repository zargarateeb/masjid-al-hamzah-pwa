import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import PrayerTime from '@/lib/models/PrayerTime';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    if (!date) return NextResponse.json({ time: null });

    await connectDB();

    // 1. Try exact match for this date
    let time = await PrayerTime.findOne({ date }).lean();

    // 2. If not found, get the most recent entry BEFORE or ON this date
    //    (this is what makes times "carry forward")
    if (!time) {
      time = await PrayerTime.findOne({ date: { $lte: date } })
        .sort({ date: -1 })
        .lean();
    }

    return NextResponse.json({ time });
  } catch (e: any) {
    console.error('❌ Prayer-times GET error:', e?.message || e);
    return NextResponse.json({ time: null, error: e?.message });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { date, pin, ...rest } = body;
    if (pin !== process.env.ADMIN_PIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    const updated = await PrayerTime.findOneAndUpdate(
      { date },
      { ...rest, date, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    return NextResponse.json({ ok: true, time: updated });
  } catch (e: any) {
    console.error('❌ Prayer-times POST error:', e?.message || e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}