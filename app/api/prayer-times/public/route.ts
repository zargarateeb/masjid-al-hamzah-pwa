import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import PrayerTime from "@/lib/models/PrayerTime";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Sign in required to edit prayer times" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { date, fajr, zuhr, asr, maghrib, isha, jummah } = body;

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: "Valid date (YYYY-MM-DD) required" },
        { status: 400 }
      );
    }

    // Only allow strictly-formatted HH:mm values; ignore empty strings
    const HHMM = /^\d{2}:\d{2}$/;
    const clean = (v: unknown): string =>
      typeof v === "string" && HHMM.test(v) ? v : "";

    const times = {
      fajr: clean(fajr),
      zuhr: clean(zuhr),
      asr: clean(asr),
      maghrib: clean(maghrib),
      isha: clean(isha),
      jummah: clean(jummah),
    };

    const hasAny = Object.values(times).some((t) => t.length > 0);
    if (!hasAny) {
      return NextResponse.json(
        { error: "At least one valid HH:mm prayer time required" },
        { status: 400 }
      );
    }

    await connectDB();

    const updated = await PrayerTime.findOneAndUpdate(
      { date },
      {
        ...times,
        date,
        updatedAt: new Date(),
        updatedBy: session.user.email,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ ok: true, time: updated });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    console.error("❌ Public prayer-times POST error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}