'use client';

import React, { useState, useEffect } from 'react';
import { Theme } from '@/lib/themes';

interface ClockProps {
  theme: Theme;
}

export default function Clock({ theme }: ClockProps) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
      setDate(now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        fontFamily: 'Courier New, monospace',
        lineHeight: 1.2,
      }}
    >
      <span style={{ color: theme.primary, fontSize: '13px', fontWeight: 600 }}>{time}</span>
      <span style={{ color: theme.dim, fontSize: '11px' }}>{date}</span>
    </div>
  );
}
