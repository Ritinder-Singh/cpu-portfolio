'use client';

import { useEffect, useState } from 'react';

interface Achievement {
  id: string;
  icon: string;
  title: string;
  date: string;
  description: string;
  order: number;
}

const EMPTY = { icon: '🏆', title: '', date: '', description: '' };

const S = {
  h1: { color: '#bd93f9', fontSize: 22, marginBottom: 24 } as React.CSSProperties,
  addBtn: {
    padding: '8px 18px', background: '#bd93f9', border: 'none', color: '#0a0a0a',
    borderRadius: 4, fontFamily: 'Courier New, monospace', fontSize: 13,
    fontWeight: 'bold' as const, cursor: 'pointer', marginBottom: 24,
  },
  card: {
    background: '#151515', border: '1px solid #222', borderRadius: 8,
    padding: 16, marginBottom: 12, display: 'flex', alignItems: 'flex-start', gap: 16,
  } as React.CSSProperties,
  icon: { fontSize: 28, minWidth: 36 } as React.CSSProperties,
  info: { flex: 1 } as React.CSSProperties,
  title: { color: '#cdd6f4', fontSize: 14, marginBottom: 2 } as React.CSSProperties,
  date: { color: '#555', fontSize: 11, marginBottom: 4 } as React.CSSProperties,
  desc: { color: '#888', fontSize: 12 } as React.CSSProperties,
  actions: { display: 'flex', gap: 8, marginTop: 8 } as React.CSSProperties,
  btn: (color = '#bd93f9') => ({
    padding: '4px 12px', background: 'transparent', border: `1px solid ${color}`,
    color, borderRadius: 4, fontFamily: 'Courier New, monospace', fontSize: 11, cursor: 'pointer',
  }) as React.CSSProperties,
  modal: {
    position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.8)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  },
  modalBox: {
    background: '#151515', border: '1px solid #333', borderRadius: 8,
    padding: 28, width: 480,
  },
  label: { display: 'block', color: '#888', fontSize: 12, marginBottom: 4, marginTop: 14 } as React.CSSProperties,
  input: {
    width: '100%', background: '#0d0d0d', border: '1px solid #333', borderRadius: 4,
    color: '#cdd6f4', padding: '7px 10px', fontFamily: 'Courier New, monospace',
    fontSize: 13, boxSizing: 'border-box' as const,
  },
  saveBtn: {
    padding: '8px 20px', background: '#bd93f9', border: 'none', color: '#0a0a0a',
    borderRadius: 4, fontFamily: 'Courier New, monospace', fontSize: 13,
    fontWeight: 'bold' as const, cursor: 'pointer', marginTop: 20, marginRight: 8,
  },
};

export default function AdminAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [editing, setEditing] = useState<Partial<Achievement> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const load = () => fetch('/api/admin/achievements').then(r => r.json()).then(setAchievements);
  useEffect(() => { load(); }, []);

  const openNew = () => { setIsNew(true); setEditing({ ...EMPTY }); };
  const openEdit = (a: Achievement) => { setIsNew(false); setEditing({ ...a }); };
  const close = () => setEditing(null);

  const save = async () => {
    if (!editing) return;
    if (isNew) {
      await fetch('/api/admin/achievements', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) });
    } else {
      await fetch(`/api/admin/achievements/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) });
    }
    close(); load();
  };

  const del = async (id: string) => {
    if (!confirm('Delete?')) return;
    await fetch(`/api/admin/achievements/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div>
      <h1 style={S.h1}>Achievements</h1>
      <button style={S.addBtn} onClick={openNew}>+ Add Achievement</button>

      {achievements.map(a => (
        <div key={a.id} style={S.card}>
          <div style={S.icon}>{a.icon}</div>
          <div style={S.info}>
            <div style={S.title}>{a.title}</div>
            <div style={S.date}>{a.date}</div>
            <div style={S.desc}>{a.description}</div>
            <div style={S.actions}>
              <button style={S.btn()} onClick={() => openEdit(a)}>Edit</button>
              <button style={S.btn('#ff5555')} onClick={() => del(a.id)}>Delete</button>
            </div>
          </div>
        </div>
      ))}

      {editing && (
        <div style={S.modal} onClick={close}>
          <div style={S.modalBox} onClick={e => e.stopPropagation()}>
            <h2 style={{ color: '#bd93f9', fontSize: 16 }}>{isNew ? 'New Achievement' : 'Edit Achievement'}</h2>

            <label style={S.label}>Icon (emoji)</label>
            <input style={S.input} value={editing.icon ?? ''} onChange={e => setEditing(v => ({ ...v, icon: e.target.value }))} />

            <label style={S.label}>Title</label>
            <input style={S.input} value={editing.title ?? ''} onChange={e => setEditing(v => ({ ...v, title: e.target.value }))} />

            <label style={S.label}>Date</label>
            <input style={S.input} value={editing.date ?? ''} onChange={e => setEditing(v => ({ ...v, date: e.target.value }))} placeholder="2024" />

            <label style={S.label}>Description</label>
            <textarea style={{ ...S.input, minHeight: 80, resize: 'vertical' }} value={editing.description ?? ''} onChange={e => setEditing(v => ({ ...v, description: e.target.value }))} />

            <div style={{ marginTop: 20 }}>
              <button style={S.saveBtn} onClick={save}>Save</button>
              <button style={{ ...S.btn(), padding: '8px 16px' }} onClick={close}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
