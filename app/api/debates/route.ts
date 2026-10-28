import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Debate from '@/lib/models/Debate';

export async function GET() {
  try {
    await connectDB();
    const items = await Debate.find().sort({ createdAt: -1 }).limit(50).lean();
    const normalized = items.map((i: any) => ({
      ...i,
      responses: Array.isArray(i.responses) ? i.responses : [],
    }));
    return NextResponse.json({ items: normalized });
  } catch (e: any) {
    return NextResponse.json({ items: [], error: e?.message });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, contact, topic, time, venue, description, proposerUserId, proposerEmail } = body;

    if (!name || !contact || !topic || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!proposerUserId) {
      return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
    }

    await connectDB();
    const created = await Debate.create({
      proposerName: name,
      proposerContact: contact,
      proposerUserId,
      proposerEmail,
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

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, responderName, responderEmail, responderUserId, type, message } = body;
    if (!id || !responderName || !type || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    if (type !== 'accept' && type !== 'counter') {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    await connectDB();
    const debate = await Debate.findById(id);
    if (!debate) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (!Array.isArray(debate.responses)) {
      debate.responses = [] as any;
    }

    debate.responses.push({
      responderName,
      responderEmail,
      responderUserId,
      type,
      message,
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
    const userId = searchParams.get('userId');

    if (pin !== process.env.ADMIN_PIN && !userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await connectDB();
    const debate = await Debate.findById(id);
    if (!debate) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Allow if admin (pin) OR owner (userId matches proposerUserId)
    const isAdmin = pin === process.env.ADMIN_PIN;
    const isOwner = userId && debate.proposerUserId === userId;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await Debate.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}

// Delete a single response from a debate
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, responseId, email, pin } = body;

    if (!id || !responseId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await connectDB();
    const debate = await Debate.findById(id);
    if (!debate) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const responses: any[] = Array.isArray(debate.responses) ? debate.responses : [];
    const target = responses.find((r: any) => r._id?.toString() === responseId);
    if (!target) return NextResponse.json({ error: 'Response not found' }, { status: 404 });

    const isAdmin = pin === process.env.ADMIN_PIN;
    const isOwner = email && target.responderEmail === email;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    debate.responses = responses.filter((r: any) => r._id?.toString() !== responseId) as any;
    await debate.save();
    return NextResponse.json({ ok: true, item: debate });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}