'use client';

import React, { useState } from 'react';
import { useDesktop } from '@/context/DesktopContext';
import { THEMES } from '@/lib/themes';
import ThemePicker from '@/components/taskbar/ThemePicker';
import AboutWindow from '@/components/windows/content/AboutWindow';
import SkillsWindow from '@/components/windows/content/SkillsWindow';
import ProjectsWindow from '@/components/windows/content/ProjectsWindow';
import ContactWindow from '@/components/windows/content/ContactWindow';
import ResumeWindow from '@/components/windows/content/ResumeWindow';
import BlogWindow from '@/components/windows/content/BlogWindow';
import AchievementsWindow from '@/components/windows/content/AchievementsWindow';

type Tab = 'about' | 'skills' | 'projects' | 'contact' | 'more';
type MoreTab = 'resume' | 'blog' | 'achievements';

const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: 'about',    icon: '👤', label: 'About'    },
  { id: 'skills',   icon: '⚡', label: 'Skills'   },
  { id: 'projects', icon: '📁', label: 'Projects' },
  { id: 'contact',  icon: '📬', label: 'Contact'  },
  { id: 'more',     icon: '⋯',  label: 'More'     },
];

const MORE_ITEMS: { id: MoreTab; icon: string; label: string }[] = [
  { id: 'resume',       icon: '📄', label: 'Resume'       },
  { id: 'blog',         icon: '📝', label: 'Blog'         },
  { id: 'achievements', icon: '🏆', label: 'Achievements' },
];

export default function MobileLayout() {
  const { state } = useDesktop();
  const theme = THEMES[state.activeTheme];
  const [activeTab, setActiveTab] = useState<Tab>('about');
  const [moreTab, setMoreTab] = useState<MoreTab | null>(null);

  const headerTitle = activeTab === 'more' && moreTab
    ? MORE_ITEMS.find(m => m.id === moreTab)!.label
    : '> ~/portfolio';

  function renderContent() {
    if (activeTab === 'more') {
      if (moreTab === 'resume')       return <ResumeWindow theme={theme} />;
      if (moreTab === 'blog')         return <BlogWindow theme={theme} />;
      if (moreTab === 'achievements') return <AchievementsWindow theme={theme} />;

      return (
        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ color: theme.dim, fontSize: 12, margin: '0 0 8px', fontFamily: 'Courier New, monospace' }}>
            // more sections
          </p>
          {MORE_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setMoreTab(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                backgroundColor: theme.bgBar,
                border: `1px solid ${theme.border}`,
                borderRadius: 10, padding: '16px 20px',
                cursor: 'pointer', fontFamily: 'Courier New, monospace',
                color: theme.primary, fontSize: 15, textAlign: 'left',
                width: '100%',
              }}
            >
              <span style={{ fontSize: 24 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              <span style={{ color: theme.dim, fontSize: 18 }}>›</span>
            </button>
          ))}
        </div>
      );
    }

    if (activeTab === 'about')    return <AboutWindow theme={theme} />;
    if (activeTab === 'skills')   return <SkillsWindow theme={theme} />;
    if (activeTab === 'projects') return <ProjectsWindow theme={theme} />;
    if (activeTab === 'contact')  return <ContactWindow theme={theme} />;
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: theme.bgDark,
        display: 'flex', flexDirection: 'column',
        fontFamily: 'Courier New, monospace',
      }}
    >
      {/* ── Top bar ──────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px',
          height: 52,
          backgroundColor: theme.bgBar,
          borderBottom: `1px solid ${theme.border}`,
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {activeTab === 'more' && moreTab && (
            <button
              onClick={() => setMoreTab(null)}
              style={{
                background: 'none', border: 'none',
                color: theme.primary, cursor: 'pointer',
                fontSize: 22, lineHeight: 1, padding: '0 4px 2px',
              }}
            >
              ‹
            </button>
          )}
          <span style={{ color: theme.primary, fontSize: 14, fontWeight: 700 }}>
            {headerTitle}
          </span>
        </div>
        <ThemePicker theme={theme} />
      </div>

      {/* ── Content ──────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {renderContent()}
      </div>

      {/* ── Bottom tab bar ───────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          backgroundColor: theme.bgBar,
          borderTop: `1px solid ${theme.border}`,
          flexShrink: 0,
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id !== 'more') setMoreTab(null);
              }}
              style={{
                flex: 1,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 3, padding: '10px 4px 8px',
                background: 'none', border: 'none', cursor: 'pointer',
                color: isActive ? theme.primary : theme.dim,
                borderTop: isActive
                  ? `2px solid ${theme.primary}`
                  : '2px solid transparent',
                transition: 'color 0.15s, border-color 0.15s',
              }}
            >
              <span style={{ fontSize: tab.id === 'more' ? 16 : 20, lineHeight: 1 }}>
                {tab.icon}
              </span>
              <span style={{ fontSize: 10, fontFamily: 'Courier New, monospace' }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
