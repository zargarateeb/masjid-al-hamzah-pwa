import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import PrayerLog from '@/lib/models/PrayerLog';
import TasbeehLog from '@/lib/models/TasbeehLog';
import Debate from '@/lib/models/Debate';
import Announcement from '@/lib/models/Announcement';
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

    const [
      totalUsers,
      totalPrayerLogs,
      totalTasbeehLogs,
      totalDebates,
      totalAnnouncements,
    ] = await Promise.all([
      User.countDocuments(),
      PrayerLog.countDocuments(),
      TasbeehLog.countDocuments(),
      Debate.countDocuments(),
      Announcement.countDocuments(),
    ]);

    // Total tasbeeh counts across all users
    const tasbeehLogs = await TasbeehLog.find().lean();
    const totalTasbeeh = tasbeehLogs.reduce((sum, log: any) => {
      return sum + Object.values(log.counts || {}).reduce((a: any, b: any) => a + (b || 0), 0);
    }, 0);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalPrayerLogs,
        totalTasbeehLogs,
        totalTasbeeh,
        totalDebates,
        totalAnnouncements,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}