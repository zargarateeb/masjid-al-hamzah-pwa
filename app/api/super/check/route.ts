import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import { getSuperAdminEmails } from '@/lib/constants';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    if (!email) return NextResponse.json({ isSuperAdmin: false });

    const list = getSuperAdminEmails();
    if (!list.includes(email.toLowerCase())) {
      return NextResponse.json({ isSuperAdmin: false });
    }

    await connectDB();
    const user = await User.findOne({ email }).lean();
    if (!user) return NextResponse.json({ isSuperAdmin: false });

    // Mark them as isSuperAdmin in DB (one-time migration)
    if (!(user as any).isSuperAdmin) {
      await User.updateOne({ email }, { isSuperAdmin: true });
    }

    return NextResponse.json({ isSuperAdmin: true });
  } catch (e: any) {
    return NextResponse.json({ isSuperAdmin: false, error: e?.message });
  }
}