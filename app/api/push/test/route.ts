import { NextResponse } from 'next/server';
import { sendToAll } from '@/lib/push';

export async function POST() {
  try {
    const result = await sendToAll({
      title: '🕌 Masjid Al-Hamzah',
      body: 'Test notification — everything is working!',
      url: '/',
    });
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}