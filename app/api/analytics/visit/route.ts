import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  const ipHash = createHash('sha256').update(ip).digest('hex');
  const userAgent = req.headers.get('user-agent') ?? undefined;
  const referrer = req.headers.get('referer') ?? undefined;

  await db.pageVisit.create({ data: { ipHash, userAgent, referrer } });

  return NextResponse.json({ ok: true });
}
