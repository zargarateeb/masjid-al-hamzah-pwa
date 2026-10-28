import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import { requireSuperAdmin } from '@/lib/authHelpers';

export async function GET() {
  try {
    const adminEmail = await requireSuperAdmin();
    if (!adminEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const users = await User.find()
      .sort({ createdAt: -1 })
      .select('email name image isAdmin isSuperAdmin createdAt')
      .lean();

    return NextResponse.json({ users });
  } catch (e: any) {
    console.error('❌ super/users error:', e?.message || e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}