import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const posts = await db.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      title: true,
      excerpt: true,
      tags: true,
      publishedAt: true,
    },
  });
  return NextResponse.json(posts);
}
