import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-guard';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const body = await req.json();

  const achievement = await db.achievement.update({
    where: { id },
    data: {
      icon: body.icon,
      title: body.title,
      date: body.date,
      description: body.description,
      order: body.order,
    },
  });

  return NextResponse.json(achievement);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  await db.achievement.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
