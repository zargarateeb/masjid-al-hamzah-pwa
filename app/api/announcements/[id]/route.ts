import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Announcement from '@/lib/models/Announcement';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, content, isUrgent, imageUrl, pin } = body;

    if (pin !== process.env.ADMIN_PIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    await connectDB();
    const update: Record<string, unknown> = { updatedAt: new Date() };
    if (title !== undefined) update.title = title;
    if (content !== undefined) update.content = content;
    if (isUrgent !== undefined) update.isUrgent = !!isUrgent;
    if (imageUrl !== undefined) update.imageUrl = imageUrl;

    const updated = await Announcement.findByIdAndUpdate(id, update, {
      new: true,
    });
    if (!updated) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, item: updated });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}