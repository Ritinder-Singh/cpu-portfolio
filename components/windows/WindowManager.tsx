'use client';

import React from 'react';
import { useDesktop } from '@/context/DesktopContext';
import { THEMES, Theme } from '@/lib/themes';
import { WindowState } from '@/lib/types';
import Window from './Window';
import TerminalWindow from '../terminal/TerminalWindow';
import AboutWindow from './content/AboutWindow';
import SkillsWindow from './content/SkillsWindow';
import ProjectsWindow from './content/ProjectsWindow';
import ContactWindow from './content/ContactWindow';
import ResumeWindow from './content/ResumeWindow';
import AchievementsWindow from './content/AchievementsWindow';
import AppMenuWindow from './content/AppMenuWindow';
import BlogWindow from './content/BlogWindow';

function WindowContent({ windowState, theme }: { windowState: WindowState; theme: Theme }) {
  const t = theme;
  switch (windowState.type) {
    case 'terminal':
      return <TerminalWindow />;
    case 'about':
      return <AboutWindow theme={t} />;
    case 'skills':
      return <SkillsWindow theme={t} />;
    case 'projects':
      return <ProjectsWindow theme={t} />;
    case 'contact':
      return <ContactWindow theme={t} />;
    case 'resume':
      return <ResumeWindow theme={t} />;
    case 'achievements':
      return <AchievementsWindow theme={t} />;
    case 'app-menu':
      return <AppMenuWindow theme={t} />;
    case 'blog':
      return <BlogWindow theme={t} />;
    default:
      return (
        <div style={{ padding: 20, color: t.primary }}>
          Window: {windowState.type}
        </div>
      );
  }
}

export default function WindowManager() {
  const { state } = useDesktop();
  const theme = THEMES[state.activeTheme];

  const visibleWindows = state.windows.filter(w => w.isOpen && !w.isMinimized);

  return (
    <>
      {visibleWindows.map(windowState => (
        <Window key={windowState.id} windowState={windowState} theme={theme}>
          <WindowContent windowState={windowState} theme={theme as never} />
        </Window>
      ))}
    </>
  );
}
