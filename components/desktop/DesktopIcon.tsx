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
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDoubleClick();
    setSelected(false);
  };

  return (
    <div
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        padding: '6px 8px',
        borderRadius: 6,
        cursor: 'pointer',
        backgroundColor: selected ? `${theme.accent}44` : 'transparent',
        border: selected ? `1px solid ${theme.accent}88` : '1px solid transparent',
        userSelect: 'none',
        width: 72,
        transition: 'background-color 0.1s',
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
