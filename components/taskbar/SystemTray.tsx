'use client';

import React from 'react';
import { Theme } from '@/lib/themes';
import Clock from './Clock';
import ThemePicker from './ThemePicker';

interface SystemTrayProps {
  theme: Theme;
}

export default function SystemTray({ theme }: SystemTrayProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <ThemePicker theme={theme} />
      <Clock theme={theme} />
    </div>
  );
}
