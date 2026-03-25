'use client';

import { useEffect, useState } from 'react';

interface Job {
  title: string;
  company: string;
  period: string;
  points: string[];
}

interface Education {
  degree: string;
  school: string;
  period: string;
}

const S = {
  h1: { color: '#bd93f9', fontSize: 22, marginBottom: 24 } as React.CSSProperties,
  h2: { color: '#cdd6f4', fontSize: 16, marginTop: 32, marginBottom: 16 } as React.CSSProperties,
  card: { background: '#151515', border: '1px solid #222', borderRadius: 8, padding: 16, marginBottom: 12 } as React.CSSProperties,
  row: { display: 'flex', gap: 10, marginBottom: 10 } as React.CSSProperties,
  input: {
    background: '#0d0d0d', border: '1px solid #222', borderRadius: 4,
    color: '#cdd6f4', padding: '6px 9px', fontFamily: 'Courier New, monospace',
    fontSize: 13, flex: 1,
  } as React.CSSProperties,
  pointRow: { display: 'flex', gap: 8, marginBottom: 6 } as React.CSSProperties,
  pointInput: {
    background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 4,
    color: '#aaa', padding: '5px 8px', fontFamily: 'Courier New, monospace',
    fontSize: 12, flex: 1,
  } as React.CSSProperties,
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
  label: { color: '#555', fontSize: 11, marginBottom: 4, display: 'block' } as React.CSSProperties,
};

function newJob(): Job {
  return { title: '', company: '', period: '', points: [''] };
}

export default function AdminResume() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [edu, setEdu] = useState<Education>({ degree: '', school: '', period: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/config').then(r => r.json()).then((cfg: Record<string, string>) => {
      if (cfg.resumeJobs) setJobs(JSON.parse(cfg.resumeJobs));
      if (cfg.resumeEducation) setEdu(JSON.parse(cfg.resumeEducation));
    });
  }, []);

  const updateJob = (i: number, field: keyof Job, value: string | string[]) =>
    setJobs(prev => prev.map((j, idx) => idx === i ? { ...j, [field]: value } : j));

  const updatePoint = (ji: number, pi: number, value: string) =>
    setJobs(prev => prev.map((j, idx) => {
      if (idx !== ji) return j;
      const points = [...j.points];
      points[pi] = value;
      return { ...j, points };
    }));

  const addPoint = (ji: number) =>
    setJobs(prev => prev.map((j, idx) => idx === ji ? { ...j, points: [...j.points, ''] } : j));

  const removePoint = (ji: number, pi: number) =>
    setJobs(prev => prev.map((j, idx) => idx === ji ? { ...j, points: j.points.filter((_, i) => i !== pi) } : j));

  const save = async () => {
    setSaving(true);
    const cfg: Record<string, string> = await fetch('/api/admin/config').then(r => r.json());
    await fetch('/api/admin/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...cfg, resumeJobs: JSON.stringify(jobs), resumeEducation: JSON.stringify(edu) }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={S.h1}>Resume</h1>

      <h2 style={S.h2}>Work Experience</h2>
      {jobs.map((job, ji) => (
        <div key={ji} style={S.card}>
          <div style={S.row}>
            <div style={{ flex: 1 }}>
              <label style={S.label}>Job Title</label>
              <input style={S.input} value={job.title} onChange={e => updateJob(ji, 'title', e.target.value)} placeholder="Backend Developer" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={S.label}>Company</label>
              <input style={S.input} value={job.company} onChange={e => updateJob(ji, 'company', e.target.value)} placeholder="Acme Corp" />
            </div>
            <div style={{ flex: '0 0 160px' }}>
              <label style={S.label}>Period</label>
              <input style={S.input} value={job.period} onChange={e => updateJob(ji, 'period', e.target.value)} placeholder="2022 — Present" />
            </div>
            <div style={{ paddingTop: 20 }}>
              <button style={S.btn('#ff5555')} onClick={() => setJobs(prev => prev.filter((_, i) => i !== ji))}>✕</button>
            </div>
          </div>
          <div style={{ paddingLeft: 4 }}>
            <label style={S.label}>Bullet Points</label>
            {job.points.map((pt, pi) => (
              <div key={pi} style={S.pointRow}>
                <input
                  style={S.pointInput}
                  value={pt}
                  onChange={e => updatePoint(ji, pi, e.target.value)}
                  placeholder="Describe what you did..."
                />
                <button style={S.btn('#ff5555')} onClick={() => removePoint(ji, pi)}>✕</button>
              </div>
            ))}
            <button style={{ ...S.btn(), fontSize: 11, marginTop: 2 }} onClick={() => addPoint(ji)}>+ Add point</button>
          </div>
        </div>
      ))}
      <button style={S.addBtn} onClick={() => setJobs(prev => [...prev, newJob()])}>+ Add Job</button>

      <h2 style={S.h2}>Education</h2>
      <div style={S.card}>
        <div style={S.row}>
          <div style={{ flex: 1 }}>
            <label style={S.label}>Degree</label>
            <input style={S.input} value={edu.degree} onChange={e => setEdu(d => ({ ...d, degree: e.target.value }))} placeholder="B.Tech in Computer Science" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={S.label}>School</label>
            <input style={S.input} value={edu.school} onChange={e => setEdu(d => ({ ...d, school: e.target.value }))} placeholder="University Name, Country" />
          </div>
          <div style={{ flex: '0 0 160px' }}>
            <label style={S.label}>Period</label>
            <input style={S.input} value={edu.period} onChange={e => setEdu(d => ({ ...d, period: e.target.value }))} placeholder="2019 — 2023" />
          </div>
        </div>
      </div>

      <br />
      <button style={S.saveBtn} onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Resume'}</button>
      {saved && <div style={S.saved}>✓ Saved successfully</div>}
    </div>
  );
}
