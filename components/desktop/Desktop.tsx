'use client';

import React from 'react';
import { useDesktop } from '@/context/DesktopContext';
import { THEMES } from '@/lib/themes';
import { WallpaperName, DEFAULT_WALLPAPER } from '@/lib/wallpapers';
import Wallpaper from './Wallpaper';
import DesktopIconGrid from './DesktopIconGrid';
import WindowManager from '../windows/WindowManager';
import Taskbar from '../taskbar/Taskbar';
import MobileLayout from '@/components/mobile/MobileLayout';
import { useMobile } from '@/hooks/useMobile';

export default function Desktop() {
  const { state } = useDesktop();
  const theme = THEMES[state.activeTheme];
  const isMobile = useMobile();
  const [mounted, setMounted] = React.useState(false);
  const [wallpaper, setWallpaper] = React.useState<WallpaperName>(DEFAULT_WALLPAPER);

  React.useEffect(() => {
    setMounted(true);
    fetch('/api/content/config')
      .then(r => r.json())
      .then((cfg: Record<string, string>) => {
        if (cfg.wallpaper === 'hacker' || cfg.wallpaper === 'linux') {
          setWallpaper(cfg.wallpaper);
        }
      })
      .catch(() => {});
  }, []);

  if (!mounted) return null;
  if (isMobile) return <MobileLayout />;

  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Wallpaper theme={theme} wallpaper={wallpaper} />
      <DesktopIconGrid />
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 20 }}>
        <div style={{ pointerEvents: 'auto', width: '100%', height: '100%' }}>
          <WindowManager />
        </div>
      </div>
      <Taskbar />
    </div>
  );
}
