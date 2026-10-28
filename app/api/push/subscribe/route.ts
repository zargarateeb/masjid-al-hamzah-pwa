import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import PushSubscription from '@/lib/models/PushSubscription';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { subscription, userId } = body;
    if (!subscription?.endpoint || !subscription?.keys) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
    }

    await connectDB();

    await PushSubscription.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      {
        endpoint: subscription.endpoint,
        keys: subscription.keys,
        userId: userId || undefined,
        lastSeen: new Date(),
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('❌ Push subscribe error:', e?.message || e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}