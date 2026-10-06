import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TasbeehLog from '@/lib/models/TasbeehLog';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const date = searchParams.get('date');
    if (!userId || !date) {
      return NextResponse.json({ counts: {}, error: 'Missing params' });
    }
    await connectDB();
    const log = await TasbeehLog.findOne({ userId, date }).lean();
    return NextResponse.json({
      counts: log?.counts || {},
      totalPoints: log?.totalPoints || 0,
    });
  } catch (e: any) {
    console.error('❌ Tasbeeh GET error:', e?.message || e);
    return NextResponse.json({ counts: {}, error: e?.message });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, date, counts } = body;
    if (!userId || !date || !counts) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await connectDB();

    // 1 point per 33 counts of any dhikr
    let totalPoints = 0;
    for (const key of Object.keys(counts)) {
      totalPoints += Math.floor((counts[key] || 0) / 33);
    }

    const updated = await TasbeehLog.findOneAndUpdate(
      { userId, date },
      { userId, date, counts, totalPoints },
      { upsert: true, new: true }
    ).lean();

    return NextResponse.json({
      ok: true,
      counts: updated?.counts || counts,
      totalPoints,
    });
  } catch (e: any) {
    console.error('❌ Tasbeeh POST error:', e?.message || e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}