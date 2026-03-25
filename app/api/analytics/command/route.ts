import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const command = typeof body?.command === 'string' ? body.command.trim() : null;

  if (!command) return NextResponse.json({ error: 'Missing command' }, { status: 400 });

  await db.commandUsage.create({ data: { command } });

  return NextResponse.json({ ok: true });
}
