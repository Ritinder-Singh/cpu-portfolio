'use client';

import React, { useEffect } from 'react';
import { useDesktop } from '@/context/DesktopContext';
import { THEMES } from '@/lib/themes';
import { trackVisit } from '@/lib/analytics';
import Wallpaper from './Wallpaper';
import DesktopIconGrid from './DesktopIconGrid';
import WindowManager from '../windows/WindowManager';
import Taskbar from '../taskbar/Taskbar';

export default function Desktop() {
  const { state } = useDesktop();
  const theme = THEMES[state.activeTheme];

  useEffect(() => { trackVisit(); }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Wallpaper layer */}
      <Wallpaper theme={theme} />

      {/* Desktop icons */}
      <DesktopIconGrid />

      {/* Windows layer */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
        }}
      >
        <div style={{ pointerEvents: 'auto', width: '100%', height: '100%' }}>
          <WindowManager />
        </div>
      </div>

      {/* Taskbar — always on top */}
      <Taskbar />
    </div>
  );
}
