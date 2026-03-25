import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-guard';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const skills = await db.skill.findMany({ orderBy: [{ category: 'asc' }, { order: 'asc' }] });
  return NextResponse.json(skills);
}

export async function PUT(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  // Accepts array of { id?, category, name, experienceType, projects, order }
  const body: { id?: string; category: string; name: string; experienceType?: string; projects?: unknown[]; order: number }[] =
    await req.json();

  await db.$transaction([
    db.skill.deleteMany(),
    ...body.map((s, i) =>
      db.skill.create({
        data: {
          category: s.category,
          name: s.name,
          experienceType: s.experienceType ?? 'personal',
          projects: (s.projects ?? []) as object[],
          order: i,
        },
      })
    ),
  ]);

  const skills = await db.skill.findMany({ orderBy: [{ category: 'asc' }, { order: 'asc' }] });
  return NextResponse.json(skills);
}
