'use client';

import React, { useEffect, useState } from 'react';
import { Theme } from '@/lib/themes';
import { Skeleton } from '@/components/ui/Skeleton';

interface Project {
  id: string;
  title: string;
  description: string;
  icon: string;
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
}

interface ProjectsWindowProps {
  theme: Theme;
}

export default function ProjectsWindow({ theme }: ProjectsWindowProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/content/projects')
      .then(r => r.json())
      .then((data: Project[]) => { setProjects(data); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  return (
    <>
    {!loaded && (
      <div style={{ padding: 24, backgroundColor: theme.bg, height: '100%' }}>
        <Skeleton width="35%" height={14} color={theme.secondary} style={{ marginBottom: 20 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 20, border: `1px solid ${theme.border}`, borderRadius: 8 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <Skeleton width={28} height={28} radius={4} color={theme.primary} />
                <Skeleton width="50%" height={16} color={theme.primary} />
              </div>
              <Skeleton height={12} color={theme.primary} />
              <Skeleton height={12} color={theme.primary} />
              <Skeleton width="60%" height={12} color={theme.primary} />
              <div style={{ display: 'flex', gap: 6 }}>
                <Skeleton width={60} height={20} radius={3} color={theme.secondary} />
                <Skeleton width={60} height={20} radius={3} color={theme.secondary} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Skeleton width={80} height={30} radius={5} color={theme.accent} />
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
    <div
      style={{
        height: '100%', overflowY: 'auto', backgroundColor: theme.bg,
        padding: '24px', fontFamily: 'Courier New, monospace',
        display: loaded ? undefined : 'none',
      }}
    >
      <h2 style={{ color: theme.secondary, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 20px', borderBottom: `1px solid ${theme.border}`, paddingBottom: 8 }}>
        Portfolio Projects
      </h2>

      {projects.length === 0 && loaded && (
        <div style={{ color: theme.dim, fontSize: '13px' }}>No projects yet.</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {projects.map(project => (
          <div
            key={project.id}
            style={{ backgroundColor: theme.bgBar, border: `1px solid ${theme.border}`, borderRadius: 8, padding: 20, display: 'flex', flexDirection: 'column', gap: 12, transition: 'border-color 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = theme.primary; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = theme.border; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '24px' }}>{project.icon}</span>
              <h3 style={{ color: theme.primary, fontSize: '15px', margin: 0, fontWeight: 700 }}>{project.title}</h3>
            </div>

            <p style={{ color: theme.primary, fontSize: '13px', lineHeight: 1.6, margin: 0, opacity: 0.85, flex: 1 }}>
              {project.description}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {project.techStack.map(t => (
                <span key={t} style={{ backgroundColor: theme.bgDark, border: `1px solid ${theme.border}`, color: theme.secondary, padding: '2px 8px', borderRadius: 3, fontSize: '11px' }}>
                  {t}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: theme.accent, color: '#fff', padding: '7px 14px', borderRadius: 5, textDecoration: 'none', fontSize: '12px', fontFamily: 'Courier New, monospace', cursor: 'pointer' }}>
                  ⌥ GitHub
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: 'transparent', border: `1px solid ${theme.border}`, color: theme.primary, padding: '7px 14px', borderRadius: 5, textDecoration: 'none', fontSize: '12px', fontFamily: 'Courier New, monospace', cursor: 'pointer' }}>
                  🔗 Live
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
