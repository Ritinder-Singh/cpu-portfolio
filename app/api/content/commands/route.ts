import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const rows = await db.terminalCommand.findMany();
  const map = Object.fromEntries(rows.map(r => [r.name, r.enabled]));
  return NextResponse.json(map);
}
