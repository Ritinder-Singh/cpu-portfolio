'use client';

import React, { useState } from 'react';
import { Theme } from '@/lib/themes';

interface DesktopIconProps {
  icon: string;
  label: string;
  onDoubleClick: () => void;
  theme: Theme;
}

export default function DesktopIcon({ icon, label, onDoubleClick, theme }: DesktopIconProps) {
  const [selected, setSelected] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected(true);
    onDoubleClick();
    setTimeout(() => setSelected(false), 150);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        padding: '6px 8px',
        borderRadius: 6,
        cursor: 'pointer',
        backgroundColor: selected ? `${theme.accent}66` : `${theme.bgBar}cc`,
        border: selected ? `1px solid ${theme.primary}88` : `1px solid ${theme.border}`,
        userSelect: 'none',
        width: 72,
        transition: 'background-color 0.1s',
        backdropFilter: 'blur(4px)',
        boxShadow: selected
          ? `0 0 10px ${theme.primary}44`
          : '0 2px 6px rgba(0,0,0,0.5)',
      }}
    >
      <div
        style={{
          fontSize: '32px',
          width: 48,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </div>
      <span
        style={{
          color: '#fff',
          fontSize: '11px',
          textAlign: 'center',
          textShadow: '0 1px 3px rgba(0,0,0,0.8)',
          lineHeight: 1.3,
          maxWidth: '100%',
          wordBreak: 'break-word',
          fontFamily: 'Courier New, monospace',
        }}
      >
        {label}
      </span>
    </div>
  );
}
