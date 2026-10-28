import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Debate from '@/lib/models/Debate';
import { requireSuperAdmin } from '@/lib/authHelpers';

export async function DELETE(req: Request) {
  try {
    const adminEmail = await requireSuperAdmin();
    if (!adminEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await connectDB();
    await Debate.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('❌ super/debates DELETE error:', e?.message || e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const adminEmail = await requireSuperAdmin();
    if (!adminEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, topic, proposedTime, venue, description, status } = body;

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await connectDB();
    const updated = await Debate.findByIdAndUpdate(
      id,
      { topic, proposedTime, venue, description, status, updatedAt: new Date() },
      { new: true }
    );
    return NextResponse.json({ ok: true, item: updated });
  } catch (e: any) {
    console.error('❌ super/debates PUT error:', e?.message || e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}