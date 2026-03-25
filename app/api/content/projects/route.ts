import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const projects = await db.project.findMany({
    where: { active: true },
    orderBy: { order: 'asc' },
  });
  return NextResponse.json(projects);
}
