'use client';

import React from 'react';
import { Theme } from '@/lib/themes';
import { useDesktop } from '@/context/DesktopContext';

interface ActivitiesButtonProps {
  theme: Theme;
}

export default function ActivitiesButton({ theme }: ActivitiesButtonProps) {
  const { openWindow } = useDesktop();

  const handleClick = () => {
    openWindow({
      id: 'app-menu',
      type: 'app-menu',
      title: 'Applications',
      position: { x: 0, y: 0 },
      size: { width: 720, height: 520 },
    });
  };

  return (
    <button
      onClick={handleClick}
      title="Open Applications"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 14px',
        backgroundColor: theme.accent,
        border: 'none',
        borderRadius: 5,
        cursor: 'pointer',
        fontFamily: 'Courier New, monospace',
        fontSize: '13px',
        color: '#fff',
        height: 32,
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      <span>⊞</span>
      <span>Apps</span>
    </button>
  );
}
