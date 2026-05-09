'use client';

import { Theme } from '@/lib/themes';
import { WallpaperName } from '@/lib/wallpapers';
import LinuxWallpaper from './wallpapers/LinuxWallpaper';
import HackerWallpaper from './wallpapers/HackerWallpaper';

interface WallpaperProps {
  theme: Theme;
  wallpaper: WallpaperName;
  onClick?: () => void;
}

export default function Wallpaper({ theme, wallpaper, onClick }: WallpaperProps) {
  if (wallpaper === 'hacker') return <HackerWallpaper theme={theme} onClick={onClick} />;
  return <LinuxWallpaper theme={theme} onClick={onClick} />;
}
