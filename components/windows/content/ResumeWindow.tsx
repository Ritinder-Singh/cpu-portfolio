'use client';

import React, { useEffect, useState } from 'react';
import { Theme } from '@/lib/themes';

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

interface ResumeWindowProps {
  theme: Theme;
}

export default function ResumeWindow({ theme }: ResumeWindowProps) {
  const [cfg, setCfg] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/content/config')
      .then(r => r.json())
      .then((data: Record<string, string>) => { setCfg(data); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  const jobs: Job[] = (() => {
    try { return JSON.parse(cfg.resumeJobs ?? '[]'); } catch { return []; }
  })();

  const edu: Education | null = (() => {
    try { const e = JSON.parse(cfg.resumeEducation ?? 'null'); return e; } catch { return null; }
  })();

  const name = cfg.name ?? '';
  const tagline = cfg.tagline ?? '';
  const email = cfg.email ?? '';
  const github = cfg.github ?? '';
  const linkedin = cfg.linkedin ?? '';
  const location = cfg.location ?? '';
  const resumeUrl = cfg.resumeUrl ?? '/resume.pdf';

  const contactParts = [email, github?.replace('https://', ''), linkedin?.replace('https://', ''), location].filter(Boolean);

  return (
    <div
      style={{
        height: '100%', overflowY: 'auto', backgroundColor: theme.bg,
        fontFamily: 'Courier New, monospace', padding: '24px', color: theme.primary,
        opacity: loaded ? 1 : 0, transition: 'opacity 0.2s',
      }}
    >
      {/* Download button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <a href={resumeUrl} download style={{ backgroundColor: theme.accent, color: '#fff', padding: '8px 16px', borderRadius: 5, textDecoration: 'none', fontSize: '13px', fontFamily: 'Courier New, monospace' }}>
          ↓ Download PDF
        </a>
      </div>

      {/* Resume Card */}
      <div style={{ backgroundColor: theme.bgBar, border: `1px solid ${theme.border}`, borderRadius: 8, padding: '32px', maxWidth: 700, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', borderBottom: `2px solid ${theme.primary}`, paddingBottom: 20, marginBottom: 24 }}>
          <h1 style={{ fontSize: '24px', margin: '0 0 6px', color: theme.primary }}>{name}</h1>
          <div style={{ color: theme.secondary, fontSize: '14px' }}>{tagline}</div>
          {contactParts.length > 0 && (
            <div style={{ color: theme.dim, fontSize: '13px', marginTop: 8, display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              {contactParts.map((part, i) => <span key={i}>{part}</span>)}
            </div>
          )}
        </div>

        {/* Experience */}
        {jobs.length > 0 && (
          <section style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.secondary, margin: '0 0 16px', borderBottom: `1px solid ${theme.border}`, paddingBottom: 6 }}>
              Experience
            </h2>
            {jobs.map((exp, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: theme.primary }}>{exp.title}</div>
                    <div style={{ color: theme.secondary, fontSize: '13px' }}>{exp.company}</div>
                  </div>
                  <span style={{ color: theme.dim, fontSize: '12px' }}>{exp.period}</span>
                </div>
                <ul style={{ margin: '8px 0 0 16px', padding: 0 }}>
                  {exp.points.map((p, pi) => (
                    <li key={pi} style={{ color: theme.primary, fontSize: '13px', lineHeight: 1.7, opacity: 0.85 }}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {edu && (
          <section>
            <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.secondary, margin: '0 0 16px', borderBottom: `1px solid ${theme.border}`, paddingBottom: 6 }}>
              Education
            </h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: theme.primary }}>{edu.degree}</div>
                <div style={{ color: theme.secondary, fontSize: '13px' }}>{edu.school}</div>
              </div>
              <span style={{ color: theme.dim, fontSize: '12px' }}>{edu.period}</span>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
