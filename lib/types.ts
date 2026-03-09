export type ThemeName = 'dracula' | 'tokyo' | 'catppuccin' | 'nord' | 'green' | 'amber';

export type WindowType =
  | 'terminal'
  | 'about'
  | 'skills'
  | 'projects'
  | 'contact'
  | 'resume'
  | 'blog'
  | 'app-menu'
  | 'achievements';

export interface WindowState {
  id: string;
  type: WindowType;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  meta?: Record<string, unknown>;
}

export interface DesktopState {
  windows: WindowState[];
  topZIndex: number;
  activeTheme: ThemeName;
}

export type DesktopAction =
  | { type: 'OPEN_WINDOW'; payload: Omit<WindowState, 'zIndex' | 'isMinimized' | 'isMaximized' | 'isOpen'> }
  | { type: 'CLOSE_WINDOW'; payload: { id: string } }
  | { type: 'FOCUS_WINDOW'; payload: { id: string } }
  | { type: 'MINIMIZE_WINDOW'; payload: { id: string } }
  | { type: 'MAXIMIZE_WINDOW'; payload: { id: string } }
  | { type: 'RESTORE_WINDOW'; payload: { id: string } }
  | { type: 'MOVE_WINDOW'; payload: { id: string; x: number; y: number } }
  | { type: 'RESIZE_WINDOW'; payload: { id: string; width: number; height: number } }
  | { type: 'SET_THEME'; payload: { theme: ThemeName } };
