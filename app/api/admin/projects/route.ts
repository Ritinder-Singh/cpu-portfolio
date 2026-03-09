import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-guard';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const projects = await db.project.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json();
  const count = await db.project.count();

  const project = await db.project.create({
    data: {
      title: body.title,
      description: body.description,
      icon: body.icon ?? '📦',
      techStack: body.techStack ?? [],
      githubUrl: body.githubUrl,
      liveUrl: body.liveUrl ?? null,
      order: count,
      active: body.active ?? true,
    },
  });

  return NextResponse.json(project, { status: 201 });
}
