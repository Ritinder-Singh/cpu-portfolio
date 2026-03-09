'use client';

import { useEffect, useState } from 'react';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

const S = {
  h1: { color: '#bd93f9', fontSize: 22, marginBottom: 24 } as React.CSSProperties,
  card: { background: '#151515', border: '1px solid #222', borderRadius: 8, padding: 16, marginBottom: 12 } as React.CSSProperties,
  label: { color: '#555', fontSize: 11, marginBottom: 4, display: 'block' } as React.CSSProperties,
  input: {
    width: '100%', background: '#0d0d0d', border: '1px solid #222', borderRadius: 4,
    color: '#cdd6f4', padding: '6px 9px', fontFamily: 'Courier New, monospace',
    fontSize: 13, boxSizing: 'border-box' as const, marginBottom: 10,
  } as React.CSSProperties,
  row: { display: 'flex', gap: 10 } as React.CSSProperties,
  btn: (color = '#bd93f9') => ({
    padding: '4px 10px', background: 'transparent', border: `1px solid ${color}`,
    color, borderRadius: 4, fontFamily: 'Courier New, monospace', fontSize: 11, cursor: 'pointer',
  }) as React.CSSProperties,
  addBtn: {
    padding: '7px 16px', background: 'transparent', border: '1px solid #bd93f9',
    color: '#bd93f9', borderRadius: 4, fontFamily: 'Courier New, monospace',
    fontSize: 12, cursor: 'pointer', marginTop: 4,
  } as React.CSSProperties,
  saveBtn: {
    padding: '8px 20px', background: '#bd93f9', border: 'none', color: '#0a0a0a',
    borderRadius: 4, fontFamily: 'Courier New, monospace', fontSize: 13,
    fontWeight: 'bold' as const, cursor: 'pointer', marginTop: 24,
  },
  saved: { color: '#50fa7b', fontSize: 12, marginTop: 10 } as React.CSSProperties,
};

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/config').then(r => r.json()).then((cfg: Record<string, string>) => {
      if (cfg.testimonials) setTestimonials(JSON.parse(cfg.testimonials));
    });
  }, []);

  const update = (i: number, field: keyof Testimonial, value: string) =>
    setTestimonials(prev => prev.map((t, idx) => idx === i ? { ...t, [field]: value } : t));

  const save = async () => {
    setSaving(true);
    const cfg: Record<string, string> = await fetch('/api/admin/config').then(r => r.json());
    await fetch('/api/admin/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...cfg, testimonials: JSON.stringify(testimonials) }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ maxWidth: 680 }}>
      <h1 style={S.h1}>Testimonials</h1>

      {testimonials.map((t, i) => (
        <div key={i} style={S.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: '#555', fontSize: 11 }}>TESTIMONIAL {i + 1}</span>
            <button style={S.btn('#ff5555')} onClick={() => setTestimonials(prev => prev.filter((_, idx) => idx !== i))}>Remove</button>
          </div>
          <label style={S.label}>Quote</label>
          <textarea
            style={{ ...S.input, minHeight: 80, resize: 'vertical' }}
            value={t.quote}
            onChange={e => update(i, 'quote', e.target.value)}
            placeholder="What they said about you..."
          />
          <div style={S.row}>
            <div style={{ flex: 1 }}>
              <label style={S.label}>Author Name</label>
              <input style={{ ...S.input, marginBottom: 0 }} value={t.author} onChange={e => update(i, 'author', e.target.value)} placeholder="Jane Doe" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={S.label}>Role / Company</label>
              <input style={{ ...S.input, marginBottom: 0 }} value={t.role} onChange={e => update(i, 'role', e.target.value)} placeholder="CTO at Acme" />
            </div>
          </div>
        </div>
      ))}

      <button style={S.addBtn} onClick={() => setTestimonials(prev => [...prev, { quote: '', author: '', role: '' }])}>
        + Add Testimonial
      </button>
      <br />
      <button style={S.saveBtn} onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Testimonials'}</button>
      {saved && <div style={S.saved}>✓ Saved successfully</div>}
    </div>
  );
}
