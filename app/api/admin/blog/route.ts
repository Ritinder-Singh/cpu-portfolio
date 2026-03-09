import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-guard';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const posts = await db.blogPost.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json();
  const now = new Date();

  const post = await db.blogPost.create({
    data: {
      title: body.title,
      excerpt: body.excerpt ?? '',
      content: body.content ?? '',
      tags: body.tags ?? [],
      published: body.published ?? false,
      publishedAt: body.published ? now : null,
    },
  });

  return NextResponse.json(post, { status: 201 });
}
