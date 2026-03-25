'use client';

import { useEffect, useState } from 'react';

interface Project {
  id: string;
  title: string;
  description: string;
  icon: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string | null;
  order: number;
  active: boolean;
}

const EMPTY: Omit<Project, 'id' | 'order'> = {
  title: '',
  description: '',
  icon: '📦',
  techStack: [],
  githubUrl: '',
  liveUrl: '',
  active: true,
};

const S = {
  h1: { color: '#bd93f9', fontSize: 22, marginBottom: 24 } as React.CSSProperties,
  btn: (color = '#bd93f9') => ({
    padding: '6px 14px',
    background: 'transparent',
    border: `1px solid ${color}`,
    color,
    borderRadius: 4,
    fontFamily: 'Courier New, monospace',
    fontSize: 12,
    cursor: 'pointer',
    marginLeft: 8,
  }) as React.CSSProperties,
  addBtn: {
    padding: '8px 18px',
    background: '#bd93f9',
    border: 'none',
    color: '#0a0a0a',
    borderRadius: 4,
    fontFamily: 'Courier New, monospace',
    fontSize: 13,
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: 24,
  } as React.CSSProperties,
  table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: 13 },
  th: { color: '#555', fontWeight: 'normal', textAlign: 'left' as const, padding: '8px 12px', borderBottom: '1px solid #222' },
  td: { padding: '10px 12px', borderBottom: '1px solid #1a1a1a', color: '#cdd6f4', verticalAlign: 'middle' as const },
  modal: {
    position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.8)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  },
  modalBox: {
    background: '#151515', border: '1px solid #333', borderRadius: 8,
    padding: 28, width: 520, maxHeight: '90vh', overflowY: 'auto' as const,
  },
  label: { display: 'block', color: '#888', fontSize: 12, marginBottom: 4, marginTop: 14 } as React.CSSProperties,
  input: {
    width: '100%', background: '#0d0d0d', border: '1px solid #333',
    borderRadius: 4, color: '#cdd6f4', padding: '7px 10px',
    fontFamily: 'Courier New, monospace', fontSize: 13, boxSizing: 'border-box' as const,
  },
};

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const load = () => fetch('/api/admin/projects').then(r => r.json()).then(setProjects);
  useEffect(() => { load(); }, []);

  const openNew = () => { setIsNew(true); setEditing({ ...EMPTY }); };
  const openEdit = (p: Project) => { setIsNew(false); setEditing({ ...p }); };
  const close = () => setEditing(null);

  const save = async () => {
    if (!editing) return;
    const url = isNew ? '/api/admin/projects' : `/api/admin/projects/${editing.id}`;
    const method = isNew ? 'POST' : 'PUT';
    const body = { ...editing, techStack: typeof editing.techStack === 'string' ? (editing.techStack as string).split(',').map(s => s.trim()) : editing.techStack };
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    close();
    load();
  };

  const del = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
    load();
  };

  const toggleActive = async (p: Project) => {
    await fetch(`/api/admin/projects/${p.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...p, active: !p.active }),
    });
    load();
  };

  return (
    <div>
      <h1 style={S.h1}>Projects</h1>
      <button style={S.addBtn} onClick={openNew}>+ Add Project</button>

      <table style={S.table}>
        <thead>
          <tr>
            <th style={S.th}>Icon</th>
            <th style={S.th}>Title</th>
            <th style={S.th}>Stack</th>
            <th style={S.th}>Active</th>
            <th style={S.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(p => (
            <tr key={p.id}>
              <td style={S.td}>{p.icon}</td>
              <td style={S.td}>{p.title}</td>
              <td style={{ ...S.td, color: '#888', fontSize: 11 }}>{p.techStack.join(', ')}</td>
              <td style={S.td}>
                <button style={S.btn(p.active ? '#50fa7b' : '#555')} onClick={() => toggleActive(p)}>
                  {p.active ? 'On' : 'Off'}
                </button>
              </td>
              <td style={S.td}>
                <button style={S.btn()} onClick={() => openEdit(p)}>Edit</button>
                <button style={S.btn('#ff5555')} onClick={() => del(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <div style={S.modal} onClick={close}>
          <div style={S.modalBox} onClick={e => e.stopPropagation()}>
            <h2 style={{ color: '#bd93f9', fontSize: 16, marginBottom: 4 }}>{isNew ? 'New Project' : 'Edit Project'}</h2>

            <label style={S.label}>Icon (emoji)</label>
            <input style={S.input} value={editing.icon ?? ''} onChange={e => setEditing(v => ({ ...v, icon: e.target.value }))} />

            <label style={S.label}>Title</label>
            <input style={S.input} value={editing.title ?? ''} onChange={e => setEditing(v => ({ ...v, title: e.target.value }))} />

            <label style={S.label}>Description</label>
            <textarea style={{ ...S.input, minHeight: 80, resize: 'vertical' }} value={editing.description ?? ''} onChange={e => setEditing(v => ({ ...v, description: e.target.value }))} />

            <label style={S.label}>Tech Stack (comma-separated)</label>
            <input style={S.input} value={Array.isArray(editing.techStack) ? editing.techStack.join(', ') : (editing.techStack ?? '')} onChange={e => setEditing(v => ({ ...v, techStack: e.target.value as unknown as string[] }))} />

            <label style={S.label}>GitHub URL</label>
            <input style={S.input} value={editing.githubUrl ?? ''} onChange={e => setEditing(v => ({ ...v, githubUrl: e.target.value }))} />

            <label style={S.label}>Live URL (optional)</label>
            <input style={S.input} value={editing.liveUrl ?? ''} onChange={e => setEditing(v => ({ ...v, liveUrl: e.target.value }))} />

            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              <button style={{ ...S.addBtn, marginBottom: 0 }} onClick={save}>Save</button>
              <button style={S.btn()} onClick={close}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
