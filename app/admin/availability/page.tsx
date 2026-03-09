'use client';

import { useEffect, useState } from 'react';

interface Availability {
  status: string;
  looking: string;
  preference: string;
  notice: string;
}

const S = {
  h1: { color: '#bd93f9', fontSize: 22, marginBottom: 24 } as React.CSSProperties,
  h2: { color: '#cdd6f4', fontSize: 16, marginTop: 28, marginBottom: 12 } as React.CSSProperties,
  card: { background: '#151515', border: '1px solid #222', borderRadius: 8, padding: 16, marginBottom: 12 } as React.CSSProperties,
  label: { display: 'block', color: '#888', fontSize: 12, marginBottom: 4, marginTop: 14 } as React.CSSProperties,
  input: {
    width: '100%', background: '#0d0d0d', border: '1px solid #333', borderRadius: 4,
    color: '#cdd6f4', padding: '7px 10px', fontFamily: 'Courier New, monospace',
    fontSize: 13, boxSizing: 'border-box' as const,
  } as React.CSSProperties,
  nowRow: { display: 'flex', gap: 8, marginBottom: 6 } as React.CSSProperties,
  btn: (color = '#bd93f9') => ({
    padding: '4px 10px', background: 'transparent', border: `1px solid ${color}`,
    color, borderRadius: 4, fontFamily: 'Courier New, monospace', fontSize: 11, cursor: 'pointer',
  }) as React.CSSProperties,
  addBtn: {
    padding: '6px 14px', background: 'transparent', border: '1px solid #bd93f9',
    color: '#bd93f9', borderRadius: 4, fontFamily: 'Courier New, monospace',
    fontSize: 12, cursor: 'pointer', marginTop: 4,
  } as React.CSSProperties,
  saveBtn: {
    padding: '8px 20px', background: '#bd93f9', border: 'none', color: '#0a0a0a',
    borderRadius: 4, fontFamily: 'Courier New, monospace', fontSize: 13,
    fontWeight: 'bold' as const, cursor: 'pointer', marginTop: 28,
  },
  saved: { color: '#50fa7b', fontSize: 12, marginTop: 10 } as React.CSSProperties,
};

export default function AdminAvailability() {
  const [avail, setAvail] = useState<Availability>({ status: '', looking: '', preference: '', notice: '' });
  const [nowItems, setNowItems] = useState<string[]>([]);
  const [nowUpdated, setNowUpdated] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/config').then(r => r.json()).then((cfg: Record<string, string>) => {
      if (cfg.availability) setAvail(JSON.parse(cfg.availability));
      if (cfg.nowItems) setNowItems(JSON.parse(cfg.nowItems));
      if (cfg.nowUpdated) setNowUpdated(cfg.nowUpdated);
    });
  }, []);

  const updateNow = (i: number, value: string) =>
    setNowItems(prev => prev.map((item, idx) => idx === i ? value : item));

  const save = async () => {
    setSaving(true);
    const cfg: Record<string, string> = await fetch('/api/admin/config').then(r => r.json());
    await fetch('/api/admin/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...cfg,
        availability: JSON.stringify(avail),
        nowItems: JSON.stringify(nowItems),
        nowUpdated,
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ maxWidth: 680 }}>
      <h1 style={S.h1}>Availability & Now</h1>

      <h2 style={S.h2}>Availability Status</h2>
      <div style={S.card}>
        <label style={S.label}>Status (shown as headline)</label>
        <input style={S.input} value={avail.status} onChange={e => setAvail(a => ({ ...a, status: e.target.value }))} placeholder="OPEN TO OPPORTUNITIES" />
        <label style={S.label}>Looking for</label>
        <input style={S.input} value={avail.looking} onChange={e => setAvail(a => ({ ...a, looking: e.target.value }))} placeholder="Backend / Flutter roles" />
        <label style={S.label}>Work preference</label>
        <input style={S.input} value={avail.preference} onChange={e => setAvail(a => ({ ...a, preference: e.target.value }))} placeholder="Remote (open to hybrid)" />
        <label style={S.label}>Notice / Availability</label>
        <input style={S.input} value={avail.notice} onChange={e => setAvail(a => ({ ...a, notice: e.target.value }))} placeholder="Available immediately" />
      </div>

      <h2 style={S.h2}>What I&apos;m Doing Now</h2>
      <div style={S.card}>
        {nowItems.map((item, i) => (
          <div key={i} style={S.nowRow}>
            <input
              style={{ ...S.input, flex: 1, boxSizing: 'border-box' }}
              value={item}
              onChange={e => updateNow(i, e.target.value)}
              placeholder="What are you working on?"
            />
            <button style={S.btn('#ff5555')} onClick={() => setNowItems(prev => prev.filter((_, idx) => idx !== i))}>✕</button>
          </div>
        ))}
        <button style={S.addBtn} onClick={() => setNowItems(prev => [...prev, ''])}>+ Add item</button>

        <label style={{ ...S.label, marginTop: 16 }}>Last updated (e.g. &quot;March 2025&quot;)</label>
        <input style={S.input} value={nowUpdated} onChange={e => setNowUpdated(e.target.value)} placeholder="March 2025" />
      </div>

      <button style={S.saveBtn} onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
      {saved && <div style={S.saved}>✓ Saved successfully</div>}
    </div>
  );
}
