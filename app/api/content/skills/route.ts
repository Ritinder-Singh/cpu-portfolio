import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const skills = await db.skill.findMany({ orderBy: [{ category: 'asc' }, { order: 'asc' }] });
  return NextResponse.json(skills);
}
