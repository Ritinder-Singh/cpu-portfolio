export interface Theme {
  name: string;
  primary: string;
  secondary: string;
  dim: string;
  bg: string;
  bgDark: string;
  bgBar: string;
  border: string;
  caret: string;
  cursor: string;
  accent: string;
  accentDim: string;
  desktopBg: string;
}

export type ThemeName = 'dracula' | 'tokyo' | 'catppuccin' | 'nord' | 'green' | 'amber';

export const THEMES: Record<ThemeName, Theme> = {
  dracula: {
    name: 'Dracula',
    primary: '#bd93f9',
    secondary: '#ff79c6',
    dim: '#7b5ea7',
    bg: '#282a36',
    bgDark: '#21222c',
    bgBar: '#383a59',
    border: '#44475a',
    caret: '#bd93f9',
    cursor: '#bd93f9',
    accent: '#6272a4',
    accentDim: '#44475a',
    desktopBg: '#21222c',
  },
  tokyo: {
    name: 'Tokyo Night',
    primary: '#7aa2f7',
    secondary: '#9ece6a',
    dim: '#4e6aad',
    bg: '#1a1b26',
    bgDark: '#16161e',
    bgBar: '#24283b',
    border: '#3b4261',
    caret: '#7aa2f7',
    cursor: '#7aa2f7',
    accent: '#3d59a1',
    accentDim: '#3b4261',
    desktopBg: '#16161e',
  },
  catppuccin: {
    name: 'Catppuccin',
    primary: '#cba6f7',
    secondary: '#89b4fa',
    dim: '#8b6fb5',
    bg: '#1e1e2e',
    bgDark: '#181825',
    bgBar: '#313244',
    border: '#45475a',
    caret: '#cba6f7',
    cursor: '#cba6f7',
    accent: '#7287fd',
    accentDim: '#45475a',
    desktopBg: '#181825',
  },
  nord: {
    name: 'Nord',
    primary: '#88c0d0',
    secondary: '#81a1c1',
    dim: '#5a8a99',
    bg: '#2e3440',
    bgDark: '#242933',
    bgBar: '#3b4252',
    border: '#434c5e',
    caret: '#88c0d0',
    cursor: '#88c0d0',
    accent: '#5e81ac',
    accentDim: '#434c5e',
    desktopBg: '#242933',
  },
  green: {
    name: 'Matrix Green',
    primary: '#50fa7b',
    secondary: '#69ff47',
    dim: '#2d8c47',
    bg: '#0a0a0a',
    bgDark: '#050505',
    bgBar: '#111111',
    border: '#1a3a1a',
    caret: '#50fa7b',
    cursor: '#50fa7b',
    accent: '#1a5c1a',
    accentDim: '#1a3a1a',
    desktopBg: '#050505',
  },
  amber: {
    name: 'Amber',
    primary: '#ffb86c',
    secondary: '#ff9e3b',
    dim: '#a06b30',
    bg: '#1a1200',
    bgDark: '#110d00',
    bgBar: '#2a1e00',
    border: '#3a2900',
    caret: '#ffb86c',
    cursor: '#ffb86c',
    accent: '#6b4c00',
    accentDim: '#3a2900',
    desktopBg: '#110d00',
  },
};
