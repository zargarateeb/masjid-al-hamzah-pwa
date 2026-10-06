import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Committee from '@/lib/models/Committee';

const DEFAULT_COMMITTEE = [
  { role: 'Imam', name: '', phone: '', email: '' },
  { role: 'President', name: '', phone: '', email: '' },
  { role: 'Vice President', name: '', phone: '', email: '' },
  { role: 'General Secretary', name: '', phone: '', email: '' },
  { role: 'Treasurer / Accounts Manager', name: '', phone: '', email: '' },
];

export async function GET() {
  try {
    await connectDB();
    let doc = await Committee.findOne({ _key: 'main' }).lean();
    if (!doc) {
      doc = await Committee.create({
        _key: 'main',
        committee: DEFAULT_COMMITTEE,
        members: [],
      });
      doc = doc.toObject();
    }
    return NextResponse.json({ committee: doc });
  } catch (e: any) {
    console.error('❌ Committee GET error:', e?.message || e);
    return NextResponse.json({ committee: null, error: e?.message });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pin, ...rest } = body;
    if (pin !== process.env.ADMIN_PIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    const updated = await Committee.findOneAndUpdate(
      { _key: 'main' },
      { ...rest, _key: 'main', updatedAt: new Date() },
      { upsert: true, new: true }
    ).lean();
    return NextResponse.json({ ok: true, committee: updated });
  } catch (e: any) {
    console.error('❌ Committee POST error:', e?.message || e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}