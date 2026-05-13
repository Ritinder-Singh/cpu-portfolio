import { auth } from './auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function requireAdmin() {
  const apiKey = process.env.SYNC_API_KEY;
  if (apiKey) {
    const headersList = await headers();
    const authorization = headersList.get('authorization') ?? '';
    if (authorization === `Bearer ${apiKey}`) return null;
  }

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}
