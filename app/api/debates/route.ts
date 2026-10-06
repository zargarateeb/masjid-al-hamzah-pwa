import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Debate from '@/lib/models/Debate';

export async function GET() {
  try {
    await connectDB();
    const items = await Debate.find().sort({ createdAt: -1 }).limit(50).lean();
    return NextResponse.json({ items });
  } catch (e: any) {
    return NextResponse.json({ items: [], error: e?.message });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, contact, topic, time, venue, description } = body;
    if (!name || !contact || !topic || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    await connectDB();
    const created = await Debate.create({
      proposerName: name,
      proposerContact: contact,
      topic,
      proposedTime: time,
      venue: venue || 'Masjid Al-Hamzah',
      description: description || '',
      status: 'open',
      responses: [],
    });
    return NextResponse.json({ ok: true, item: created });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}

// Add a response to a debate
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, responderName, responderContact, type, message, counterTime, counterTopic, counterVenue } = body;
    if (!id || !responderName || !type || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    if (type !== 'accept' && type !== 'counter') {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    await connectDB();
    const debate = await Debate.findById(id);
    if (!debate) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    debate.responses.push({
      responderName,
      responderContact: responderContact || '',
      type,
      message,
      counterTime,
      counterTopic,
      counterVenue,
      createdAt: new Date(),
    } as any);

    if (type === 'counter') {
      debate.status = 'negotiating';
    }

    await debate.save();
    return NextResponse.json({ ok: true, item: debate });
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
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    await connectDB();
    await Debate.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}