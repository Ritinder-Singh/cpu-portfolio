'use client';

import React from 'react';
import { WindowState } from '@/lib/types';
import { Theme } from '@/lib/themes';
import { useDesktop } from '@/context/DesktopContext';

interface TaskbarItemProps {
  windowState: WindowState;
  theme: Theme;
  isActive: boolean;
}

const TYPE_ICONS: Record<string, string> = {
  terminal: '💻',
  about: '👤',
  skills: '⚡',
  projects: '📁',
  contact: '📬',
  resume: '📄',
  blog: '✍',
  'app-menu': '🚀',
  achievements: '🏆',
};

export default function TaskbarItem({ windowState, theme, isActive }: TaskbarItemProps) {
  const { focusWindow, restoreWindow, minimizeWindow } = useDesktop();

  const handleClick = () => {
    if (windowState.isMinimized) {
      restoreWindow(windowState.id);
    } else if (isActive) {
      minimizeWindow(windowState.id);
    } else {
      focusWindow(windowState.id);
    }
  };

  const icon = TYPE_ICONS[windowState.type] || '🗔';

  return (
    <button
      onClick={handleClick}
      title={windowState.title}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 12px',
        backgroundColor: isActive ? `${theme.accent}88` : 'transparent',
        border: isActive ? `1px solid ${theme.accent}` : `1px solid ${theme.border}`,
        borderRadius: 5,
        cursor: 'pointer',
        fontFamily: 'Courier New, monospace',
        fontSize: '12px',
        color: isActive ? theme.primary : theme.dim,
        maxWidth: 140,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        height: 32,
        transition: 'background-color 0.15s',
        opacity: windowState.isMinimized ? 0.6 : 1,
      }}
    >
      <span>{icon}</span>
      <span
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: 90,
        }}
      >
        {windowState.title}
      </span>
    </button>
  );
}
