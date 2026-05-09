'use client';

import React from 'react';
import { useDesktop } from '@/context/DesktopContext';
import { THEMES } from '@/lib/themes';
import { WindowType } from '@/lib/types';
import DesktopIcon from './DesktopIcon';

const DESKTOP_ICONS: {
  icon: string;
  label: string;
  type: WindowType;
  title: string;
  size?: { width: number; height: number };
}[] = [
  { icon: '💻', label: 'Terminal', type: 'terminal', title: 'Terminal', size: { width: 700, height: 500 } },
  { icon: '👤', label: 'About', type: 'about', title: 'About — Ritinder Singh' },
  { icon: '⚡', label: 'Skills', type: 'skills', title: 'Skills' },
  { icon: '📁', label: 'Projects', type: 'projects', title: 'Projects' },
  { icon: '📬', label: 'Contact', type: 'contact', title: 'Contact' },
  { icon: '📄', label: 'Resume', type: 'resume', title: 'Resume' },
  { icon: '🚀', label: 'App Menu', type: 'app-menu', title: 'Applications' },
  { icon: '🏆', label: 'Awards', type: 'achievements', title: 'Achievements' },
];

export default function DesktopIconGrid() {
  const { openWindow, state } = useDesktop();
  const theme = THEMES[state.activeTheme];

  // Terminal is open once any window has been opened
  const terminalEverOpened = state.windows.some(
    w => w.type === 'terminal' && w.isOpen
  );

  const handleOpen = (icon: typeof DESKTOP_ICONS[0]) => {
    openWindow({
      id: icon.type === 'terminal' ? 'terminal-main' : icon.type,
      type: icon.type,
      title: icon.title,
      position: { x: 0, y: 0 },
      size: icon.size || { width: 800, height: 550 },
    });
  };

  return (
    <>
      {/* Semi-transparent sidebar panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 90,
          bottom: 48, // above taskbar
          background: theme.bgDark,
          backdropFilter: 'blur(16px)',
          borderRight: `1px solid ${theme.border}`,
          zIndex: 9,
          pointerEvents: 'none',
        }}
      />
    <div
      style={{
        position: 'fixed',
        top: 8,
        left: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        zIndex: 10,
        pointerEvents: 'auto',
      }}
      onClick={e => e.stopPropagation()}
    >
      {DESKTOP_ICONS.map(icon => (
        <div key={icon.type} style={{ position: 'relative' }}>
          <DesktopIcon
            icon={icon.icon}
            label={icon.label}
            theme={theme}
            onDoubleClick={() => handleOpen(icon)}
          />

          {/* Explore hint — only on Terminal, only before it's been opened */}
          {icon.type === 'terminal' && !terminalEverOpened && (
            <div
              style={{
                position: 'absolute',
                left: 80,
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                pointerEvents: 'none',
                animation: 'pulse-hint 1.4s ease-in-out infinite',
              }}
            >
              <style>{`
                @keyframes pulse-hint {
                  0%, 100% { opacity: 1; transform: translateY(-50%) translateX(0px); }
                  50% { opacity: 0.6; transform: translateY(-50%) translateX(-5px); }
                }
              `}</style>
              <span style={{
                fontSize: 13,
                color: theme.primary,
                whiteSpace: 'nowrap',
                textShadow: '0 1px 4px rgba(0,0,0,0.9)',
                fontFamily: 'Courier New, monospace',
              }}>
                ← start here
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
    </>
  );
}
