import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Debate from '@/lib/models/Debate';
import { getSuperAdminEmails } from '@/lib/constants';

function checkAuth(email: string | null): boolean {
  if (!email) return false;
  return getSuperAdminEmails().includes(email.toLowerCase());
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const id = searchParams.get('id');

    if (!checkAuth(email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await connectDB();
    await Debate.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { email, id, topic, proposedTime, venue, description, status } = body;

    if (!checkAuth(email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await connectDB();
    const updated = await Debate.findByIdAndUpdate(
      id,
      { topic, proposedTime, venue, description, status, updatedAt: new Date() },
      { new: true }
    );
    return NextResponse.json({ ok: true, item: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}