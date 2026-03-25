'use client';

import React, { useEffect, useState } from 'react';
import { Theme } from '@/lib/themes';

interface SkillProject {
  name: string;
  githubUrl?: string;
  liveUrl?: string;
}

interface Skill {
  id: string;
  name: string;
  category: string;
  experienceType: 'professional' | 'personal';
  projects: SkillProject[];
  order: number;
}

interface SkillsWindowProps {
  theme: Theme;
}

function GithubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  );
}

export default function SkillsWindow({ theme }: SkillsWindowProps) {
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const [filter, setFilter] = useState<'all' | 'professional' | 'personal'>('all');

  useEffect(() => {
    fetch('/api/content/skills')
      .then(r => r.json())
      .then((data: Skill[]) => {
        setAllSkills(data);
        setLoaded(true);
        if (data.length > 0 && !activeTab) {
          const categories = [...new Set(data.map(s => s.category))].sort();
          setActiveTab(categories[0] ?? '');
        }
      })
      .catch(() => setLoaded(true));
  }, []);

  const categories = [...new Set(allSkills.map(s => s.category))].sort();

  const tabSkills = allSkills
    .filter(s => s.category === activeTab)
    .filter(s => filter === 'all' || s.experienceType === filter)
    .sort((a, b) => a.order - b.order);

  const proColor = theme.primary;
  const personalColor = theme.secondary;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: theme.bg, fontFamily: 'Courier New, monospace', opacity: loaded ? 1 : 0, transition: 'opacity 0.2s' }}>

      {/* Category tabs */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.bgDark, overflowX: 'auto', flexShrink: 0 }}>
        {categories.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer',
              fontFamily: 'Courier New, monospace', fontSize: 13,
              color: activeTab === tab ? theme.primary : theme.dim,
              borderBottom: activeTab === tab ? `2px solid ${theme.primary}` : '2px solid transparent',
              whiteSpace: 'nowrap', transition: 'color 0.15s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.bgDark, flexShrink: 0 }}>
        <span style={{ color: theme.dim, fontSize: 11, marginRight: 4 }}>Show:</span>
        {(['all', 'professional', 'personal'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '3px 12px', borderRadius: 20, fontSize: 11, cursor: 'pointer',
              fontFamily: 'Courier New, monospace', border: '1px solid',
              borderColor: filter === f ? (f === 'professional' ? proColor : f === 'personal' ? personalColor : theme.accent) : theme.border,
              background: filter === f ? (f === 'professional' ? `${proColor}22` : f === 'personal' ? `${personalColor}22` : `${theme.accent}22`) : 'transparent',
              color: filter === f ? (f === 'professional' ? proColor : f === 'personal' ? personalColor : theme.primary) : theme.dim,
            }}
          >
            {f === 'all' ? 'All' : f === 'professional' ? '🏢 Professional' : '🏠 Personal'}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 14, fontSize: 10, color: theme.dim }}>
          <span style={{ color: proColor }}>🏢 = professional work</span>
          <span style={{ color: personalColor }}>🏠 = personal / hobby</span>
        </div>
      </div>

      {/* Skill cards */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {tabSkills.length === 0 && loaded && (
          <div style={{ color: theme.dim, fontSize: 13, paddingTop: 16 }}>No {filter === 'all' ? '' : filter} skills in this category.</div>
        )}
        {tabSkills.map(skill => {
          const isPro = skill.experienceType === 'professional';
          const badgeColor = isPro ? proColor : personalColor;

          return (
            <div
              key={skill.id}
              style={{ backgroundColor: theme.bgDark, border: `1px solid ${theme.border}`, borderLeft: `3px solid ${badgeColor}`, borderRadius: 6, padding: '12px 16px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: skill.projects.length ? 10 : 0 }}>
                <span style={{ color: theme.primary, fontSize: 14, fontWeight: 700 }}>{skill.name}</span>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, border: `1px solid ${badgeColor}44`, backgroundColor: `${badgeColor}18`, color: badgeColor, whiteSpace: 'nowrap' }}>
                  {isPro ? '🏢 Professional' : '🏠 Personal'}
                </span>
              </div>

              {skill.projects.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {skill.projects.map((p, i) => (
                    <div
                      key={i}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: theme.bgBar, border: `1px solid ${theme.border}`, borderRadius: 4, padding: '3px 8px', fontSize: 12, color: theme.dim }}
                    >
                      <span>{p.name}</span>
                      {p.githubUrl && (
                        <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" title="GitHub"
                          style={{ color: theme.dim, display: 'flex', alignItems: 'center', lineHeight: 1 }}
                          onMouseEnter={e => (e.currentTarget.style.color = theme.primary)}
                          onMouseLeave={e => (e.currentTarget.style.color = theme.dim)}
                        >
                          <GithubIcon />
                        </a>
                      )}
                      {p.liveUrl && (
                        <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" title="Live"
                          style={{ color: theme.dim, display: 'flex', alignItems: 'center', lineHeight: 1 }}
                          onMouseEnter={e => (e.currentTarget.style.color = theme.secondary)}
                          onMouseLeave={e => (e.currentTarget.style.color = theme.dim)}
                        >
                          <LinkIcon />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
