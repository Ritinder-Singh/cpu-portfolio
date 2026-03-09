'use client';

import React from 'react';
import { Theme } from '@/lib/themes';

interface TitleBarProps {
  title: string;
  windowId: string;
  isMaximized: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  theme: Theme;
}

export default function TitleBar({
  title,
  isMaximized,
  onMouseDown,
  onClose,
  onMinimize,
  onMaximize,
  theme,
}: TitleBarProps) {
  return (
    <div
      onMouseDown={onMouseDown}
      style={{
        height: 36,
        backgroundColor: theme.accent,
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        userSelect: 'none',
        cursor: 'grab',
        flexShrink: 0,
        borderRadius: '8px 8px 0 0',
      }}
    >
      {/* Traffic lights */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', zIndex: 1 }}>
        <button
          onClick={e => { e.stopPropagation(); onClose(); }}
          onMouseDown={e => e.stopPropagation()}
          title="Close"
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: '#ff5555',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        />
        <button
          onClick={e => { e.stopPropagation(); onMinimize(); }}
          onMouseDown={e => e.stopPropagation()}
          title="Minimize"
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: '#ffb86c',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            flexShrink: 0,
          }}
        />
        <button
          onClick={e => { e.stopPropagation(); onMaximize(); }}
          onMouseDown={e => e.stopPropagation()}
          title={isMaximized ? 'Restore' : 'Maximize'}
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: '#50fa7b',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            flexShrink: 0,
          }}
        />
      </div>

      {/* Title */}
      <div
        style={{
          flex: 1,
          textAlign: 'center',
          color: 'rgba(255,255,255,0.85)',
          fontSize: '13px',
          fontFamily: 'Courier New, monospace',
          fontWeight: 500,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          marginLeft: -68,
          paddingLeft: 68,
          paddingRight: 8,
        }}
      >
        {title}
      </div>
    </div>
  );
}
