'use client';

import React from 'react';
import { Theme } from '@/lib/themes';

interface TerminalInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  theme: Theme;
  currentDir: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export default function TerminalInput({
  value,
  onChange,
  onKeyDown,
  theme,
  currentDir,
  inputRef,
}: TerminalInputProps) {
  const prompt = `ritinder@portfolio:${currentDir}$ `;

  return (
    <>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .terminal-cursor {
          animation: blink 1s step-end infinite;
          display: inline-block;
          width: 8px;
          height: 1.1em;
          background: ${theme.caret};
          vertical-align: text-bottom;
          margin-left: 1px;
        }
      `}</style>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '4px 12px 8px',
          backgroundColor: theme.bg,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            color: theme.primary,
            fontFamily: 'Courier New, monospace',
            fontSize: '13px',
            whiteSpace: 'nowrap',
            userSelect: 'none',
          }}
        >
          {prompt}
        </span>
        <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
          <input
            ref={inputRef}
            value={value}
            onChange={e => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: theme.primary,
              fontFamily: 'Courier New, monospace',
              fontSize: '13px',
              width: '100%',
              caretColor: theme.caret,
            }}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </div>
      </div>
    </>
  );
}
