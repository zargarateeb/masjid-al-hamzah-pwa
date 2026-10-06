import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Announcement from '@/lib/models/Announcement';

export async function GET() {
  try {
    await connectDB();
    const items = await Announcement.find().sort({ createdAt: -1 }).limit(50).lean();

    // Normalize: ensure every item has a comments array
    const normalized = items.map((i: any) => ({
      ...i,
      comments: Array.isArray(i.comments) ? i.comments : [],
    }));

    return NextResponse.json({ items: normalized });
  } catch (e: any) {
    return NextResponse.json({ items: [], error: e?.message });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content, isUrgent, pin } = body;

    if (pin !== process.env.ADMIN_PIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content required' }, { status: 400 });
    }

    await connectDB();
    const created = await Announcement.create({ title, content, isUrgent: !!isUrgent, comments: [] });
    return NextResponse.json({ ok: true, item: created });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}

// Add comment
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, authorName, authorEmail, message } = body;
    if (!id || !authorName || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await connectDB();
    const ann = await Announcement.findById(id);
    if (!ann) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Initialize comments array if missing (older docs)
    if (!Array.isArray(ann.comments)) {
      ann.comments = [] as any;
    }

    ann.comments.push({
      authorName,
      authorEmail,
      message,
      createdAt: new Date(),
    } as any);

    await ann.save();
    return NextResponse.json({ ok: true, item: ann });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const pin = searchParams.get('pin');

    if (pin !== process.env.ADMIN_PIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await connectDB();
    await Announcement.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}