import { db } from '@/lib/db';
import { fetchGithubRepos } from '@/lib/github';
import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';

// TODO: Add GITHUB_WEBHOOK_SECRET to .env and Northflank environment
// TODO: Register this webhook on GitHub:
//   Repo → Settings → Webhooks → Add webhook
//   Payload URL: https://site.ritinder-singh.com/api/webhooks/github
//   Content type: application/json
//   Secret: <GITHUB_WEBHOOK_SECRET>
//   Events: Just the push event

function verifySignature(body: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const expected = 'sha256=' + createHmac('sha256', secret).update(body).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

// Trigger patterns (case-insensitive):
//   [portfolio]           → upsert project from this repo
//   [portfolio remove]    → set project inactive
//   [portfolio: My Title] → upsert with custom title override
const TRIGGER = /\[portfolio(?::\s*([^\]]+))?\]/i;
const REMOVE  = /\[portfolio\s+remove\]/i;

export async function POST(req: NextRequest) {
  // TODO: remove early return once GITHUB_WEBHOOK_SECRET is set
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'GITHUB_WEBHOOK_SECRET not configured' }, { status: 500 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get('x-hub-signature-256');

  if (!verifySignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = req.headers.get('x-github-event');
  if (event !== 'push') {
    return NextResponse.json({ skipped: true, reason: 'not a push event' });
  }

  // TODO: parse payload and check commit messages
  const payload = JSON.parse(rawBody);
  const repoFullName: string = payload.repository?.full_name ?? '';
  const commits: { message: string }[] = payload.commits ?? [];

  const triggered = commits.some(c => TRIGGER.test(c.message));
  if (!triggered) {
    return NextResponse.json({ skipped: true, reason: 'no [portfolio] trigger in commits' });
  }

  const isRemove = commits.some(c => REMOVE.test(c.message));

  // TODO: extract custom title override if provided, e.g. [portfolio: My App]
  let customTitle: string | null = null;
  for (const c of commits) {
    const m = c.message.match(TRIGGER);
    if (m?.[1]) { customTitle = m[1].trim(); break; }
  }

  if (isRemove) {
    // TODO: deactivate project by githubUrl match
    const repoUrl = payload.repository?.html_url;
    await db.project.updateMany({
      where: { githubUrl: repoUrl },
      data: { active: false },
    });
    return NextResponse.json({ action: 'deactivated', repo: repoFullName });
  }

  // TODO: fetch repo details from GitHub API and upsert into Project table
  const username = repoFullName.split('/')[0];
  const repoName = repoFullName.split('/')[1];

  const allRepos = await fetchGithubRepos(username, process.env.GITHUB_TOKEN);
  const repo = allRepos.find(r => r.githubUrl === payload.repository?.html_url);

  if (!repo) {
    return NextResponse.json({ error: 'Repo not found or is a fork/archived' }, { status: 404 });
  }

  const project = {
    title: customTitle ?? repo.title,
    description: repo.description,
    icon: repo.icon,
    techStack: repo.techStack,
    githubUrl: repo.githubUrl,
    liveUrl: repo.liveUrl,
  };

  const existing = await db.project.findFirst({ where: { githubUrl: repo.githubUrl } });

  if (existing) {
    await db.project.update({ where: { id: existing.id }, data: project });
  } else {
    const maxOrder = await db.project.findFirst({ orderBy: { order: 'desc' } });
    await db.project.create({
      data: { ...project, order: (maxOrder?.order ?? -1) + 1, active: true },
    });
  }

  return NextResponse.json({ action: existing ? 'updated' : 'created', repo: repoName, title: project.title });
}
