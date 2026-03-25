'use client';

import React, { useEffect, useRef } from 'react';
import { Theme } from '@/lib/themes';

export interface Line {
  type: 'output' | 'input' | 'error' | 'system';
  text: string;
  id?: string;
}

interface TerminalOutputProps {
  lines: Line[];
  theme: Theme;
}

function linkify(text: string, color: string): React.ReactNode[] {
  const urlPattern = /(https?:\/\/[^\s]+|github\.com\/[^\s]+|linkedin\.com\/[^\s]+)/g;
  const parts = text.split(urlPattern);
  return parts.map((part, i) => {
    if (urlPattern.test(part)) {
      const href = part.startsWith('http') ? part : `https://${part}`;
      return (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: color,
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

function getLineColor(type: Line['type'], theme: Theme): string {
  switch (type) {
    case 'input': return theme.dim;
    case 'error': return '#ff5555';
    case 'system': return theme.secondary;
    case 'output': return theme.primary;
    default: return theme.primary;
  }
}

export default function TerminalOutput({ lines, theme }: TerminalOutputProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '8px 12px',
        fontFamily: 'Courier New, monospace',
        fontSize: '13px',
        lineHeight: '1.6',
        backgroundColor: theme.bg,
      }}
    >
      {lines.map((line, i) => {
        const color = getLineColor(line.type, theme);
        const texts = line.text.split('\n');
        return (
          <div key={line.id || i}>
            {texts.map((t, j) => (
              <div
                key={j}
                style={{
                  color,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  minHeight: t === '' ? '1.2em' : undefined,
                }}
              >
                {line.type === 'output' ? linkify(t, theme.secondary) : t}
              </div>
            ))}
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
