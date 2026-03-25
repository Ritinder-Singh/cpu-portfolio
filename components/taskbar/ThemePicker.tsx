'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Theme, THEMES, ThemeName } from '@/lib/themes';
import { useDesktop } from '@/context/DesktopContext';

interface ThemePickerProps {
  theme: Theme;
}

const THEME_DOTS: { name: ThemeName; color: string; label: string }[] = [
  { name: 'dracula', color: '#bd93f9', label: 'Dracula' },
  { name: 'tokyo', color: '#7aa2f7', label: 'Tokyo' },
  { name: 'catppuccin', color: '#cba6f7', label: 'Catppuccin' },
  { name: 'nord', color: '#88c0d0', label: 'Nord' },
  { name: 'green', color: '#50fa7b', label: 'Green' },
  { name: 'amber', color: '#ffb86c', label: 'Amber' },
];

export default function ThemePicker({ theme }: ThemePickerProps) {
  const { dispatch, executeInTerminal, state } = useDesktop();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleTheme = (name: ThemeName) => {
    dispatch({ type: 'SET_THEME', payload: { theme: name } });
    executeInTerminal(`theme ${name}`);
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        title="Change theme"
        style={{
          background: 'none',
          border: `1px solid ${theme.border}`,
          borderRadius: 5,
          cursor: 'pointer',
          padding: '4px 8px',
          color: theme.primary,
          fontFamily: 'Courier New, monospace',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        🎨
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            right: 0,
            marginBottom: 8,
            backgroundColor: theme.bgBar,
            border: `1px solid ${theme.border}`,
            borderRadius: 8,
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            minWidth: 140,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              color: theme.dim,
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 4,
              fontFamily: 'Courier New, monospace',
            }}
          >
            Theme
          </div>
          {THEME_DOTS.map(t => (
            <button
              key={t.name}
              onClick={() => handleTheme(t.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: 'none',
                border: state.activeTheme === t.name ? `1px solid ${t.color}` : '1px solid transparent',
                borderRadius: 5,
                cursor: 'pointer',
                padding: '5px 8px',
                fontFamily: 'Courier New, monospace',
                fontSize: '13px',
                color: theme.primary,
                backgroundColor: state.activeTheme === t.name ? `${t.color}22` : 'transparent',
                textAlign: 'left',
              }}
            >
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: t.color,
                  flexShrink: 0,
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              />
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
