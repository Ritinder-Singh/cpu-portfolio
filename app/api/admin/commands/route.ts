import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-guard';
import { COMMAND_REGISTRY } from '@/lib/commands/registry';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  // Get DB overrides
  const rows = await db.terminalCommand.findMany();
  const dbMap = Object.fromEntries(rows.map((r: {name:string;enabled:boolean}) => [r.name, r.enabled]));

  // Merge with full registry so all commands appear
  const commands = COMMAND_REGISTRY
    .filter(c => c.appMenuMode !== 'hidden')
    .map(c => ({
      name: c.name,
      description: c.description,
      category: c.category,
      enabled: dbMap[c.name] ?? true,
    }));

  return NextResponse.json(commands);
}

export async function PUT(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body: { name: string; enabled: boolean }[] = await req.json();

  await db.$transaction(
    body.map(({ name, enabled }) =>
      db.terminalCommand.upsert({
        where: { name },
        update: { enabled },
        create: { name, enabled },
      })
    )
  );

  return NextResponse.json({ ok: true });
}
