import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-guard';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const achievements = await db.achievement.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json(achievements);
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json();
  const count = await db.achievement.count();

  const achievement = await db.achievement.create({
    data: {
      icon: body.icon ?? '🏆',
      title: body.title,
      date: body.date ?? '',
      description: body.description,
      order: count,
    },
  });

  return NextResponse.json(achievement, { status: 201 });
}
