import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { WALLPAPERS, WallpaperName } from '@/lib/wallpapers';
import { redirect } from 'next/navigation';
import WallpaperPicker from './WallpaperPicker';

export default async function WallpaperPage() {
  const session = await auth();
  if (!session?.user) redirect('/admin/login');

  const row = await db.siteConfig.findUnique({ where: { key: 'wallpaper' } });
  const active = (row?.value ?? 'linux') as WallpaperName;

  return (
    <div>
      <h1 style={{ color: '#bd93f9', fontSize: 20, marginBottom: 6, fontFamily: 'Courier New, monospace' }}>
        🖼 Wallpaper
      </h1>
      <p style={{ color: '#555', fontSize: 13, marginBottom: 28, fontFamily: 'Courier New, monospace' }}>
        Select the active wallpaper for the desktop. Changes apply to all visitors.
      </p>
      <WallpaperPicker active={active} wallpapers={WALLPAPERS} />
    </div>
  );
}
