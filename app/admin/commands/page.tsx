'use client';

import { useEffect, useState } from 'react';

interface CommandRow {
  name: string;
  description: string;
  category: string;
  enabled: boolean;
}

const S = {
  h1: { color: '#bd93f9', fontSize: 22, marginBottom: 8 } as React.CSSProperties,
  note: { color: '#555', fontSize: 12, marginBottom: 24 } as React.CSSProperties,
  saveBtn: {
    padding: '8px 20px', background: '#bd93f9', border: 'none', color: '#0a0a0a',
    borderRadius: 4, fontFamily: 'Courier New, monospace', fontSize: 13,
    fontWeight: 'bold' as const, cursor: 'pointer', marginBottom: 24,
  },
  catTitle: { color: '#555', fontSize: 11, textTransform: 'uppercase' as const, marginBottom: 8, marginTop: 24 },
  row: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '9px 14px', background: '#151515', borderRadius: 4, marginBottom: 4,
  } as React.CSSProperties,
  cmdName: { color: '#cdd6f4', fontSize: 13, fontFamily: 'Courier New, monospace' } as React.CSSProperties,
  cmdDesc: { color: '#555', fontSize: 11, marginTop: 1 } as React.CSSProperties,
  toggle: (enabled: boolean) => ({
    width: 40, height: 22, background: enabled ? '#bd93f9' : '#333',
    borderRadius: 11, border: 'none', cursor: 'pointer', position: 'relative' as const,
    transition: 'background 0.2s',
    display: 'flex', alignItems: 'center',
    padding: enabled ? '0 3px 0 21px' : '0 21px 0 3px',
  }),
  toggleDot: {
    width: 16, height: 16, background: '#fff', borderRadius: 8,
    transition: 'transform 0.2s',
  },
};

export default function AdminCommands() {
  const [commands, setCommands] = useState<CommandRow[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/commands').then(r => r.json()).then(setCommands);
  }, []);

  const toggle = (name: string) => {
    setCommands(prev => prev.map(c => c.name === name ? { ...c, enabled: !c.enabled } : c));
  };

  const save = async () => {
    setSaving(true);
    await fetch('/api/admin/commands', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commands.map(c => ({ name: c.name, enabled: c.enabled }))),
    });
    setSaving(false);
  };

  const categories = [...new Set(commands.map(c => c.category))];

  return (
    <div>
      <h1 style={S.h1}>Terminal Commands</h1>
      <p style={S.note}>Disabled commands are hidden from the terminal and app menu. Changes take effect immediately.</p>

      <button style={S.saveBtn} onClick={save} disabled={saving}>
        {saving ? 'Saving...' : 'Save Changes'}
      </button>

      {categories.map(cat => (
        <div key={cat}>
          <div style={S.catTitle}>{cat}</div>
          {commands.filter(c => c.category === cat).map(cmd => (
            <div key={cmd.name} style={S.row}>
              <div>
                <div style={S.cmdName}>{cmd.name}</div>
                <div style={S.cmdDesc}>{cmd.description}</div>
              </div>
              <button style={S.toggle(cmd.enabled)} onClick={() => toggle(cmd.name)}>
                <div style={S.toggleDot} />
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
