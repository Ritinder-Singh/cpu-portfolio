'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useRef,
  useCallback,
  Dispatch,
} from 'react';
import { DesktopState, DesktopAction, WindowState } from '@/lib/types';
import { desktopReducer, initialState } from './desktopReducer';

interface DesktopContextValue {
  state: DesktopState;
  dispatch: Dispatch<DesktopAction>;
  openWindow: (payload: Omit<WindowState, 'zIndex' | 'isMinimized' | 'isMaximized' | 'isOpen'>) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  executeInTerminal: (cmd: string) => void;
  terminalExecuteRef: React.MutableRefObject<((cmd: string) => void) | null>;
}

const DesktopContext = createContext<DesktopContextValue | null>(null);

export function DesktopProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(desktopReducer, initialState);
  const terminalExecuteRef = useRef<((cmd: string) => void) | null>(null);

  const openWindow = useCallback(
    (payload: Omit<WindowState, 'zIndex' | 'isMinimized' | 'isMaximized' | 'isOpen'>) => {
      dispatch({ type: 'OPEN_WINDOW', payload });
    },
    []
  );

  const closeWindow = useCallback((id: string) => {
    dispatch({ type: 'CLOSE_WINDOW', payload: { id } });
  }, []);

  const focusWindow = useCallback((id: string) => {
    dispatch({ type: 'FOCUS_WINDOW', payload: { id } });
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    dispatch({ type: 'MINIMIZE_WINDOW', payload: { id } });
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    dispatch({ type: 'MAXIMIZE_WINDOW', payload: { id } });
  }, []);

  const restoreWindow = useCallback((id: string) => {
    dispatch({ type: 'RESTORE_WINDOW', payload: { id } });
  }, []);

  const executeInTerminal = useCallback((cmd: string) => {
    // Ensure terminal window is open and focused
    const terminalWindow = state.windows.find(w => w.type === 'terminal');
    if (!terminalWindow) {
      dispatch({
        type: 'OPEN_WINDOW',
        payload: {
          id: 'terminal-main',
          type: 'terminal',
          title: 'Terminal',
          position: { x: 80, y: 60 },
          size: { width: 700, height: 500 },
        },
      });
    } else {
      if (!terminalWindow.isOpen) {
        dispatch({ type: 'OPEN_WINDOW', payload: terminalWindow });
      }
      if (terminalWindow.isMinimized) {
        dispatch({ type: 'RESTORE_WINDOW', payload: { id: terminalWindow.id } });
      }
      dispatch({ type: 'FOCUS_WINDOW', payload: { id: terminalWindow.id } });
    }

    setTimeout(() => {
      terminalExecuteRef.current?.(cmd);
    }, 150);
  }, [state.windows]);

  const value: DesktopContextValue = {
    state,
    dispatch,
    openWindow,
    closeWindow,
    focusWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    executeInTerminal,
    terminalExecuteRef,
  };

  return (
    <DesktopContext.Provider value={value}>
      {children}
    </DesktopContext.Provider>
  );
}

export function useDesktop(): DesktopContextValue {
  const ctx = useContext(DesktopContext);
  if (!ctx) throw new Error('useDesktop must be used within DesktopProvider');
  return ctx;
}
