import { db } from '@/lib/db';
import { fetchGithubRepos } from '@/lib/github';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const apiKey = process.env.SYNC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'SYNC_API_KEY not configured' }, { status: 500 });
  }

  const auth = req.headers.get('authorization') ?? '';
  if (auth !== `Bearer ${apiKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const username = process.env.GITHUB_USERNAME;
  if (!username) {
    return NextResponse.json({ error: 'GITHUB_USERNAME not configured' }, { status: 500 });
  }

  let repos;
  try {
    repos = await fetchGithubRepos(username, process.env.GITHUB_TOKEN);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }

  const maxOrderRow = await db.project.findFirst({ orderBy: { order: 'desc' } });
  let nextOrder = (maxOrderRow?.order ?? -1) + 1;

  let created = 0;
  let updated = 0;

  for (const repo of repos) {
    const existing = await db.project.findFirst({ where: { githubUrl: repo.githubUrl } });

    if (existing) {
      await db.project.update({
        where: { id: existing.id },
        data: {
          title: repo.title,
          description: repo.description,
          icon: repo.icon,
          techStack: repo.techStack,
          liveUrl: repo.liveUrl,
        },
      });
      updated++;
    } else {
      await db.project.create({
        data: {
          ...repo,
          order: nextOrder++,
          active: true,
        },
      });
      created++;
    }
  }

  return NextResponse.json({ synced: repos.length, created, updated });
}
