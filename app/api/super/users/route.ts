import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import { getSuperAdminEmails } from '@/lib/constants';

function checkAuth(email: string | null): boolean {
  if (!email) return false;
  return getSuperAdminEmails().includes(email.toLowerCase());
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    if (!checkAuth(email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const users = await User.find()
      .sort({ createdAt: -1 })
      .select('email name image isAdmin isSuperAdmin createdAt')
      .lean();

    return NextResponse.json({ users });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}