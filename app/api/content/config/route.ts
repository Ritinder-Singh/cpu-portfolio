import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const rows = await db.siteConfig.findMany();
  const config = Object.fromEntries(rows.map((r: {key:string;value:string}) => [r.key, r.value]));
  return NextResponse.json(config);
}
