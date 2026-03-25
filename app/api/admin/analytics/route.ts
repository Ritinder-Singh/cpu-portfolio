import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-guard';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

  const [totalVisits, todayVisits, dailyVisits, topCommands, dailyCommands] = await Promise.all([
    db.pageVisit.count(),
    db.pageVisit.count({ where: { date: { gte: today } } }),

    // Daily visits for last 30 days
    db.pageVisit.groupBy({
      by: ['date'],
      where: { date: { gte: thirtyDaysAgo } },
      _count: { id: true },
      orderBy: { date: 'asc' },
    }),

    // Top 10 commands all-time
    db.commandUsage.groupBy({
      by: ['command'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    }),

    // Daily command usage for last 30 days
    db.commandUsage.groupBy({
      by: ['date'],
      where: { date: { gte: thirtyDaysAgo } },
      _count: { id: true },
      orderBy: { date: 'asc' },
    }),
  ]);

  return NextResponse.json({
    totalVisits,
    todayVisits,
    dailyVisits: dailyVisits.map(r => ({
      date: r.date,
      count: r._count.id,
    })),
    topCommands: topCommands.map(r => ({
      command: r.command,
      count: r._count.id,
    })),
    dailyCommands: dailyCommands.map(r => ({
      date: r.date,
      count: r._count.id,
    })),
  });
}
