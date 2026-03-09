'use client';

import React, { useState } from 'react';
import { Theme } from '@/lib/themes';
import { useDesktop } from '@/context/DesktopContext';
import { COMMAND_REGISTRY } from '@/lib/commands/registry';
import { CommandDef } from '@/lib/commands/types';

interface AppMenuWindowProps {
  theme: Theme;
}

const CATEGORIES = ['Portfolio', 'Filesystem', 'Utility', 'Fun'] as const;

const CATEGORY_ICONS: Record<string, string> = {
  Portfolio: '👤',
  Filesystem: '📁',
  Utility: '⚙️',
  Fun: '🎮',
};

const COMMAND_ICONS: Record<string, string> = {
  // Portfolio
  whoami: '🙋', about: '👤', skills: '⚡', projects: '📁',
  contact: '📬', achievements: '🏆', availability: '📅',
  now: '📍', testimonials: '💬', resume: '📄', blog: '📝',
  // Filesystem
  ls: '📋', cat: '📖', pwd: '🗺️', cd: '📂', tree: '🌳',
  mkdir: '📁', rm: '🗑️',
  // Utility
  date: '📅', time: '⏰', echo: '🔊', clear: '🧹',
  theme: '🎨', help: '❓', man: '📚', open: '🔗',
  ping: '📡', weather: '🌤️', history: '📜', neofetch: '🖥️',
  // Fun
  joke: '😄', quote: '💭', fortune: '🔮', coffee: '☕',
  ascii: '🔤', banner: '🏷️', hack: '💀', matrix: '🟩',
  snake: '🐍', iam: '👋', sudo: '🔑', exit: '🚪',
};

export default function AppMenuWindow({ theme }: AppMenuWindowProps) {
  const { openWindow, executeInTerminal } = useDesktop();
  const [search, setSearch] = useState('');

  const visibleCommands = COMMAND_REGISTRY.filter(
    cmd =>
      cmd.appMenuMode !== 'hidden' &&
      (search === '' ||
        cmd.name.toLowerCase().includes(search.toLowerCase()) ||
        cmd.description.toLowerCase().includes(search.toLowerCase()))
  );

  const grouped: Record<string, CommandDef[]> = {};
  for (const cat of CATEGORIES) {
    const cmds = visibleCommands.filter(c => c.category === cat);
    if (cmds.length > 0) grouped[cat] = cmds;
  }

  const handleCommand = (cmd: CommandDef) => {
    if (cmd.appMenuMode === 'gui' && cmd.guiWindowType) {
      openWindow({
        id: cmd.guiWindowType,
        type: cmd.guiWindowType,
        title: cmd.name.charAt(0).toUpperCase() + cmd.name.slice(1),
        position: { x: 0, y: 0 },
        size: { width: 800, height: 550 },
      });
    } else {
      const cmdStr = [cmd.name, ...(cmd.args || [])].join(' ').replace(/<[^>]+>/g, '').trim();
      executeInTerminal(cmd.name);
    }
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.bg,
        fontFamily: 'Courier New, monospace',
      }}
    >
      {/* Header + Search */}
      <div
        style={{
          padding: '16px 20px',
          backgroundColor: theme.bgDark,
          borderBottom: `1px solid ${theme.border}`,
          flexShrink: 0,
        }}
      >
        <h2
          style={{
            color: theme.primary,
            fontSize: '16px',
            margin: '0 0 12px',
            fontWeight: 700,
          }}
        >
          Applications
        </h2>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search commands..."
          autoFocus
          style={{
            backgroundColor: theme.bgBar,
            border: `1px solid ${theme.border}`,
            color: theme.primary,
            padding: '8px 12px',
            borderRadius: 5,
            fontFamily: 'Courier New, monospace',
            fontSize: '13px',
            outline: 'none',
            width: '100%',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Commands */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        {Object.entries(grouped).map(([cat, cmds]) => (
          <div key={cat} style={{ marginBottom: 24 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 12,
                color: theme.secondary,
                fontSize: '13px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              <span>{CATEGORY_ICONS[cat] || '▸'}</span>
              <span>{cat}</span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: 8,
              }}
            >
              {cmds.map(cmd => (
                <button
                  key={cmd.name}
                  onClick={() => handleCommand(cmd)}
                  title={cmd.description}
                  style={{
                    backgroundColor: theme.bgBar,
                    border: `1px solid ${theme.border}`,
                    color: theme.primary,
                    padding: '10px 14px',
                    borderRadius: 6,
                    fontFamily: 'Courier New, monospace',
                    fontSize: '13px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'border-color 0.15s, background-color 0.15s',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.borderColor = theme.primary;
                    el.style.backgroundColor = theme.bgDark;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.borderColor = theme.border;
                    el.style.backgroundColor = theme.bgBar;
                  }}
                >
                  <span style={{ fontSize: 18, lineHeight: 1 }}>{COMMAND_ICONS[cmd.name] ?? '▸'}</span>
                  <span style={{ fontWeight: 700 }}>{cmd.name}</span>
                  <span
                    style={{
                      fontSize: '11px',
                      color: theme.dim,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {cmd.description.length > 40 ? cmd.description.slice(0, 40) + '…' : cmd.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
        {Object.keys(grouped).length === 0 && (
          <div style={{ color: theme.dim, fontSize: '14px', textAlign: 'center', paddingTop: 32 }}>
            No commands found for &ldquo;{search}&rdquo;
          </div>
        )}
      </div>
    </div>
  );
}
