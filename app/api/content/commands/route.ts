import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const rows = await db.terminalCommand.findMany();
  const map = Object.fromEntries(rows.map((r: {name:string;enabled:boolean}) => [r.name, r.enabled]));
  return NextResponse.json(map);
}
