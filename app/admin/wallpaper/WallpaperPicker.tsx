'use client';

import { useState } from 'react';
import { WallpaperName } from '@/lib/wallpapers';

interface Props {
  active: WallpaperName;
  wallpapers: Record<WallpaperName, { name: string; description: string; emoji: string }>;
}

export default function WallpaperPicker({ active, wallpapers }: Props) {
  const [current, setCurrent] = useState<WallpaperName>(active);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const select = async (name: WallpaperName) => {
    if (name === current) return;
    setCurrent(name);
    setSaving(true);
    setSaved(false);
    try {
      await fetch('/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallpaper: name }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {(Object.entries(wallpapers) as [WallpaperName, typeof wallpapers[WallpaperName]][]).map(([key, wp]) => {
          const isActive = current === key;
          return (
            <button
              key={key}
              onClick={() => select(key)}
              style={{
                width: 220,
                padding: '20px 16px',
                background: isActive ? '#1e1e2e' : '#111',
                border: isActive ? '2px solid #bd93f9' : '2px solid #222',
                borderRadius: 8,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'border-color 0.15s, background 0.15s',
                fontFamily: 'Courier New, monospace',
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 10 }}>{wp.emoji}</div>
              <div style={{ color: isActive ? '#bd93f9' : '#888', fontSize: 14, fontWeight: 'bold', marginBottom: 6 }}>
                {wp.name}
                {isActive && <span style={{ color: '#50fa7b', fontSize: 11, marginLeft: 8 }}>● active</span>}
              </div>
              <div style={{ color: '#555', fontSize: 12, lineHeight: 1.5 }}>{wp.description}</div>
            </button>
          );
        })}
      </div>

      {(saving || saved) && (
        <div style={{ marginTop: 16, fontSize: 13, fontFamily: 'Courier New, monospace', color: saved ? '#50fa7b' : '#6272a4' }}>
          {saving ? '⟳ saving...' : '✓ wallpaper updated'}
        </div>
      )}
    </div>
  );
}
