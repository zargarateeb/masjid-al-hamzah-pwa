import { NextResponse } from "next/server";
import { verifyAdminPin } from "@/lib/adminAuth";

export async function POST(req: Request) {
  try {
    const { pin } = await req.json();
    const auth = verifyAdminPin(pin);
    if (!auth.ok) {
      return NextResponse.json(
        { ok: false, error: auth.error },
        { status: auth.status }
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}