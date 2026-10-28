import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import PrayerLog from '@/lib/models/PrayerLog';
import TasbeehLog from '@/lib/models/TasbeehLog';
import Debate from '@/lib/models/Debate';
import Announcement from '@/lib/models/Announcement';
import { requireSuperAdmin } from '@/lib/authHelpers';

export async function GET() {
  try {
    // Verify session email is in SUPER_ADMIN_EMAILS. Never trust client input.
    const adminEmail = await requireSuperAdmin();
    if (!adminEmail) {
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
    console.error('❌ super/stats error:', e?.message || e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}