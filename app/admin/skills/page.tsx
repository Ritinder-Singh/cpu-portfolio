'use client';

import { useEffect, useState } from 'react';

interface SkillProject {
  name: string;
  githubUrl: string;
  liveUrl: string;
}

interface Skill {
  id: string;
  category: string;
  name: string;
  experienceType: 'professional' | 'personal';
  projects: SkillProject[];
  order: number;
}

const CATEGORIES = ['Languages', 'Backend', 'Mobile', 'DevOps', 'Databases'];

const S = {
  h1: { color: '#bd93f9', fontSize: 22, marginBottom: 24 } as React.CSSProperties,
  tabs: { display: 'flex', gap: 8, marginBottom: 24 } as React.CSSProperties,
  tab: (active: boolean) => ({
    padding: '6px 16px', background: 'transparent',
    border: `1px solid ${active ? '#bd93f9' : '#333'}`,
    color: active ? '#bd93f9' : '#555', borderRadius: 4,
    fontFamily: 'Courier New, monospace', fontSize: 12, cursor: 'pointer',
  }) as React.CSSProperties,
  card: {
    background: '#151515', border: '1px solid #222', borderRadius: 8,
    padding: 16, marginBottom: 12,
  } as React.CSSProperties,
  row: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 } as React.CSSProperties,
  input: {
    background: '#0d0d0d', border: '1px solid #222', borderRadius: 4,
    color: '#cdd6f4', padding: '5px 8px', fontFamily: 'Courier New, monospace', fontSize: 13,
  } as React.CSSProperties,
  expToggle: (active: boolean, color: string) => ({
    padding: '4px 12px', borderRadius: 20, fontSize: 11, cursor: 'pointer',
    fontFamily: 'Courier New, monospace',
    border: `1px solid ${active ? color : '#333'}`,
    background: active ? `${color}22` : 'transparent',
    color: active ? color : '#555',
  }) as React.CSSProperties,
  projectRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 } as React.CSSProperties,
  projectInput: {
    background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 4,
    color: '#aaa', padding: '4px 7px', fontFamily: 'Courier New, monospace', fontSize: 12,
  } as React.CSSProperties,
  btn: (color = '#bd93f9') => ({
    padding: '4px 10px', background: 'transparent', border: `1px solid ${color}`,
    color, borderRadius: 4, fontFamily: 'Courier New, monospace', fontSize: 11, cursor: 'pointer',
  }) as React.CSSProperties,
  addSkillBtn: {
    padding: '7px 16px', background: 'transparent', border: '1px solid #bd93f9',
    color: '#bd93f9', borderRadius: 4, fontFamily: 'Courier New, monospace',
    fontSize: 12, cursor: 'pointer', marginTop: 4,
  } as React.CSSProperties,
  saveBtn: {
    padding: '8px 20px', background: '#bd93f9', border: 'none', color: '#0a0a0a',
    borderRadius: 4, fontFamily: 'Courier New, monospace', fontSize: 13,
    fontWeight: 'bold' as const, cursor: 'pointer', marginTop: 20,
  },
};

function newSkill(category: string, order: number): Skill {
  return { id: `new-${Date.now()}`, category, name: '', experienceType: 'personal', projects: [], order };
}

function newProject(): SkillProject {
  return { name: '', githubUrl: '', liveUrl: '' };
}

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [activeTab, setActiveTab] = useState('Languages');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/skills').then(r => r.json()).then(data => {
      // normalise projects from DB (may come as plain objects)
      const normalised = data.map((s: Skill) => ({
        ...s,
        projects: (s.projects ?? []).map((p: SkillProject) => ({
          name: p.name ?? '', githubUrl: p.githubUrl ?? '', liveUrl: p.liveUrl ?? '',
        })),
      }));
      setSkills(normalised);
    });
  }, []);

  const filtered = skills.filter(s => s.category === activeTab);

  const updateSkill = (id: string, field: keyof Skill, value: unknown) =>
    setSkills(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));

  const updateProject = (skillId: string, pi: number, field: keyof SkillProject, value: string) =>
    setSkills(prev => prev.map(s => {
      if (s.id !== skillId) return s;
      const projects = [...s.projects];
      projects[pi] = { ...projects[pi], [field]: value };
      return { ...s, projects };
    }));

  const addProject = (skillId: string) =>
    setSkills(prev => prev.map(s =>
      s.id === skillId ? { ...s, projects: [...s.projects, newProject()] } : s
    ));

  const removeProject = (skillId: string, pi: number) =>
    setSkills(prev => prev.map(s =>
      s.id === skillId ? { ...s, projects: s.projects.filter((_, i) => i !== pi) } : s
    ));

  const addSkill = () =>
    setSkills(prev => [...prev, newSkill(activeTab, filtered.length)]);

  const removeSkill = (id: string) =>
    setSkills(prev => prev.filter(s => s.id !== id));

  const save = async () => {
    setSaving(true);
    await fetch('/api/admin/skills', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(skills),
    });
    const updated = await fetch('/api/admin/skills').then(r => r.json());
    setSkills(updated.map((s: Skill) => ({
      ...s,
      projects: (s.projects ?? []).map((p: SkillProject) => ({
        name: p.name ?? '', githubUrl: p.githubUrl ?? '', liveUrl: p.liveUrl ?? '',
      })),
    })));
    setSaving(false);
  };

  return (
    <div>
      <h1 style={S.h1}>Skills</h1>

      {/* Category tabs */}
      <div style={S.tabs}>
        {CATEGORIES.map(cat => (
          <button key={cat} style={S.tab(activeTab === cat)} onClick={() => setActiveTab(cat)}>{cat}</button>
        ))}
      </div>

      {/* Skill cards */}
      {filtered.map(skill => (
        <div key={skill.id} style={S.card}>
          {/* Skill header */}
          <div style={S.row}>
            <input
              style={{ ...S.input, flex: 1 }}
              value={skill.name}
              onChange={e => updateSkill(skill.id, 'name', e.target.value)}
              placeholder="Skill name (e.g. Python)"
            />
            {/* Experience type toggle */}
            <button
              style={S.expToggle(skill.experienceType === 'professional', '#bd93f9')}
              onClick={() => updateSkill(skill.id, 'experienceType', 'professional')}
            >
              🏢 Professional
            </button>
            <button
              style={S.expToggle(skill.experienceType === 'personal', '#ff79c6')}
              onClick={() => updateSkill(skill.id, 'experienceType', 'personal')}
            >
              🏠 Personal
            </button>
            <button style={S.btn('#ff5555')} onClick={() => removeSkill(skill.id)}>Remove skill</button>
          </div>

          {/* Projects */}
          <div style={{ paddingLeft: 8 }}>
            <div style={{ color: '#555', fontSize: 11, marginBottom: 6 }}>PROJECTS USING THIS SKILL</div>
            {skill.projects.map((p, pi) => (
              <div key={pi} style={S.projectRow}>
                <input
                  style={{ ...S.projectInput, flex: 1 }}
                  value={p.name}
                  onChange={e => updateProject(skill.id, pi, 'name', e.target.value)}
                  placeholder="Project name"
                />
                <input
                  style={{ ...S.projectInput, width: 180 }}
                  value={p.githubUrl}
                  onChange={e => updateProject(skill.id, pi, 'githubUrl', e.target.value)}
                  placeholder="GitHub URL (optional)"
                />
                <input
                  style={{ ...S.projectInput, width: 160 }}
                  value={p.liveUrl}
                  onChange={e => updateProject(skill.id, pi, 'liveUrl', e.target.value)}
                  placeholder="Live URL (optional)"
                />
                <button style={S.btn('#ff5555')} onClick={() => removeProject(skill.id, pi)}>✕</button>
              </div>
            ))}
            <button style={{ ...S.btn(), fontSize: 11, marginTop: 2 }} onClick={() => addProject(skill.id)}>
              + Add project
            </button>
          </div>
        </div>
      ))}

      <button style={S.addSkillBtn} onClick={addSkill}>+ Add skill to {activeTab}</button>
      <br />
      <button style={S.saveBtn} onClick={save} disabled={saving}>
        {saving ? 'Saving...' : 'Save All'}
      </button>
    </div>
  );
}
