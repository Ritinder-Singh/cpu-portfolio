'use client';

import React from 'react';
import { useDesktop } from '@/context/DesktopContext';
import { THEMES } from '@/lib/themes';
import ActivitiesButton from './ActivitiesButton';
import TaskbarItem from './TaskbarItem';
import SystemTray from './SystemTray';

export default function Taskbar() {
  const { state } = useDesktop();
  const theme = THEMES[state.activeTheme];

  const openWindows = state.windows.filter(w => w.isOpen);
  const topZIndex = Math.max(...openWindows.map(w => w.zIndex), 0);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 48,
        backgroundColor: theme.bgDark + 'ee',
        borderTop: `1px solid ${theme.border}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        gap: 8,
        zIndex: 9000,
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Left: Activities button */}
      <ActivitiesButton theme={theme} />

      {/* Divider */}
      <div
        style={{
          width: 1,
          height: 24,
          backgroundColor: theme.border,
          flexShrink: 0,
        }}
      />

      {/* Middle: Window list */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          overflowX: 'auto',
          overflowY: 'hidden',
        }}
      >
        {openWindows.map(w => (
          <TaskbarItem
            key={w.id}
            windowState={w}
            theme={theme}
            isActive={w.zIndex === topZIndex && !w.isMinimized}
          />
        ))}
      </div>

      {/* Right: System tray */}
      <SystemTray theme={theme} />
    </div>
  );
}
