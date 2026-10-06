import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { pin } = await req.json();
  const expected = process.env.ADMIN_PIN || '1234';
  return NextResponse.json({ ok: pin === expected });
}