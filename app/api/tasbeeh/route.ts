import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TasbeehLog from '@/lib/models/TasbeehLog';
import { getSessionUserId } from '@/lib/authHelpers';

export async function GET(req: Request) {
  try {
    const sessionUserId = await getSessionUserId();
    if (!sessionUserId) {
      return NextResponse.json({ counts: {}, error: 'Sign in required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    if (!date) {
      return NextResponse.json({ counts: {}, error: 'Missing date' }, { status: 400 });
    }

    await connectDB();
    const log = await TasbeehLog.findOne({ userId: sessionUserId, date }).lean();
    return NextResponse.json({
      counts: log?.counts || {},
      totalPoints: log?.totalPoints || 0,
    });
  } catch (e: any) {
    console.error('❌ tasbeeh GET error:', e?.message || e);
    return NextResponse.json({ counts: {}, error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const sessionUserId = await getSessionUserId();
    if (!sessionUserId) {
      return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
    }

    const body = await req.json();
    const { date, counts } = body;
    if (!date || !counts) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await connectDB();

    let totalPoints = 0;
    for (const key of Object.keys(counts)) {
      totalPoints += Math.floor((counts[key] || 0) / 33);
    }

    const updated = await TasbeehLog.findOneAndUpdate(
      { userId: sessionUserId, date },
      { userId: sessionUserId, date, counts, totalPoints },
      { upsert: true, new: true }
    ).lean();

    return NextResponse.json({
      ok: true,
      counts: updated?.counts || counts,
      totalPoints,
    });
  } catch (e: any) {
    console.error('❌ tasbeeh POST error:', e?.message || e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}