import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const achievements = await db.achievement.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json(achievements);
}
