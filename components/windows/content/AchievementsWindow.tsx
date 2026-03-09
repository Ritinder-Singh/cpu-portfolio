'use client';

import React, { useEffect, useState } from 'react';
import { Theme } from '@/lib/themes';

interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  date: string;
  order: number;
}

interface AchievementsWindowProps {
  theme: Theme;
}

const COLORS = ['#ffb86c', '#ff79c6', '#bd93f9', '#50fa7b', '#8be9fd', '#f1fa8c'];

export default function AchievementsWindow({ theme }: AchievementsWindowProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/content/achievements')
      .then(r => r.json())
      .then((data: Achievement[]) => { setAchievements(data); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  return (
    <div
      style={{
        height: '100%', overflowY: 'auto', backgroundColor: theme.bg,
        fontFamily: 'Courier New, monospace', padding: '24px', color: theme.primary,
        opacity: loaded ? 1 : 0, transition: 'opacity 0.2s',
      }}
    >
      <h2 style={{ color: theme.secondary, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 20px', borderBottom: `1px solid ${theme.border}`, paddingBottom: 8 }}>
        Achievements & Milestones
      </h2>

      {achievements.length === 0 && loaded && (
        <div style={{ color: theme.dim, fontSize: '13px' }}>No achievements yet.</div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {achievements.map((ach, i) => {
          const color = COLORS[i % COLORS.length];
          return (
            <div
              key={ach.id}
              style={{ backgroundColor: theme.bgBar, border: `1px solid ${theme.border}`, borderLeft: `4px solid ${color}`, borderRadius: 8, padding: '16px 20px', display: 'flex', gap: 16, alignItems: 'flex-start', transition: 'transform 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateX(4px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateX(0)'; }}
            >
              <span style={{ fontSize: '28px', flexShrink: 0 }}>{ach.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: theme.primary }}>{ach.title}</h3>
                  <span style={{ backgroundColor: theme.bgDark, border: `1px solid ${theme.border}`, color: theme.dim, padding: '2px 8px', borderRadius: 4, fontSize: '12px' }}>
                    {ach.date}
                  </span>
                </div>
                <p style={{ color: theme.primary, fontSize: '13px', lineHeight: 1.6, margin: 0, opacity: 0.85 }}>{ach.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
