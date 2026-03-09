'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Line } from './TerminalOutput';
import { processInput } from '@/lib/commands/registry';
import { COMMAND_REGISTRY } from '@/lib/commands/registry';
import { ThemeName } from '@/lib/types';
import { THEMES, Theme } from '@/lib/themes';
import { useDesktop } from '@/context/DesktopContext';
import { completeInput } from './TabCompletion';
import { GREETING } from './greeting';

const COMMAND_NAMES = COMMAND_REGISTRY.map(c => c.name);
const MAX_HISTORY = 100;

function loadHistory(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('terminal_history') || '[]');
  } catch {
    return [];
  }
}

function saveHistory(history: string[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('terminal_history', JSON.stringify(history.slice(-MAX_HISTORY)));
  } catch {
    // ignore
  }
}

function loadTheme(): ThemeName {
  if (typeof window === 'undefined') return 'dracula';
  const saved = localStorage.getItem('terminal_theme') as ThemeName | null;
  if (saved && saved in THEMES) return saved;
  return 'dracula';
}

let lineIdCounter = 0;
function mkLine(type: Line['type'], text: string): Line {
  return { type, text, id: String(lineIdCounter++) };
}

export interface UseTerminalResult {
  lines: Line[];
  input: string;
  setInput: (v: string) => void;
  history: string[];
  currentDir: string;
  matrixActive: boolean;
  setMatrixActive: (v: boolean) => void;
  snakeActive: boolean;
  setSnakeActive: (v: boolean) => void;
  executeCommand: (cmd: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  theme: Theme;
  themeName: ThemeName;
  setTheme: (name: ThemeName) => void;
  greetingDone: boolean;
}

export function useTerminal(
  executeRef?: React.MutableRefObject<((cmd: string) => void) | null>
): UseTerminalResult {
  const { openWindow, dispatch } = useDesktop();
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>(() => loadHistory());
  const [histIdx, setHistIdx] = useState(-1);
  const [currentDir, setCurrentDir] = useState('~');
  const [matrixActive, setMatrixActive] = useState(false);
  const [snakeActive, setSnakeActive] = useState(false);
  const [themeName, setThemeName] = useState<ThemeName>(() => loadTheme());
  const [greetingDone, setGreetingDone] = useState(false);

  const theme = THEMES[themeName];

  // Show greeting on mount
  useEffect(() => {
    setLines([mkLine('system', GREETING)]);
    const timer = setTimeout(() => setGreetingDone(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const setTheme = useCallback((name: ThemeName) => {
    setThemeName(name);
    if (typeof window !== 'undefined') {
      localStorage.setItem('terminal_theme', name);
    }
    dispatch({ type: 'SET_THEME', payload: { theme: name } });
  }, [dispatch]);

  const addLines = useCallback((newLines: Line[]) => {
    setLines(prev => [...prev, ...newLines]);
  }, []);

  const executeCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim();

    // Add to history
    if (trimmed) {
      setHistory(prev => {
        const next = [...prev.filter(h => h !== trimmed), trimmed].slice(-MAX_HISTORY);
        saveHistory(next);
        return next;
      });
    }
    setHistIdx(-1);

    // Show the input line
    const prompt = `ritinder@portfolio:${currentDir}$ ${cmd}`;
    addLines([mkLine('input', prompt)]);

    if (!trimmed) return;

    const result = processInput(trimmed, currentDir);

    if (result === null) return;

    if (result === '__HISTORY__') {
      const historyLines = history.map((h, i) => `  ${String(i + 1).padStart(3, ' ')}  ${h}`);
      addLines([mkLine('output', historyLines.join('\n'))]);
      return;
    }

    if (typeof result === 'string') {
      if (result.startsWith('__MAN__:')) {
        // already handled in registry
        addLines([mkLine('output', result)]);
      } else if (result.startsWith('Command not found:')) {
        addLines([mkLine('error', result)]);
      } else {
        addLines([mkLine('output', result)]);
      }
      return;
    }

    if (result instanceof Promise) {
      const loadingId = String(lineIdCounter++);
      setLines(prev => [...prev, { type: 'output', text: 'Loading...', id: loadingId }]);
      result.then(text => {
        setLines(prev =>
          prev.map(l => (l.id === loadingId ? mkLine('output', text) : l))
        );
      }).catch(() => {
        setLines(prev =>
          prev.map(l =>
            l.id === loadingId ? mkLine('error', 'Error: failed to fetch') : l
          )
        );
      });
      return;
    }

    // Object results
    switch (result.type) {
      case 'CLEAR':
        setLines([]);
        break;
      case 'MATRIX':
        setMatrixActive(true);
        break;
      case 'SNAKE':
        setSnakeActive(true);
        break;
      case 'THEME': {
        const name = result.name as ThemeName;
        if (name in THEMES) {
          setTheme(name);
          addLines([mkLine('output', `Theme switched to: ${THEMES[name].name}`)]);
        } else {
          addLines([mkLine('error', `Unknown theme: ${name}`)]);
        }
        break;
      }
      case 'CHANGE_DIR':
        setCurrentDir(result.dir);
        break;
      case 'OPEN_WINDOW':
        openWindow({
          id: result.windowType,
          type: result.windowType,
          title: result.title,
          position: { x: 0, y: 0 },
          size: { width: 800, height: 550 },
          meta: result.meta,
        });
        addLines([mkLine('system', `Opening ${result.title}...`)]);
        break;
    }
  }, [addLines, currentDir, history, openWindow, setTheme]);

  // Expose executeCommand via ref
  useEffect(() => {
    if (executeRef) {
      executeRef.current = executeCommand;
    }
  }, [executeRef, executeCommand]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const completed = completeInput(input, COMMAND_NAMES);
      setInput(completed);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIdx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(newIdx);
      if (history.length > 0) {
        setInput(history[history.length - 1 - newIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIdx = Math.max(histIdx - 1, -1);
      setHistIdx(newIdx);
      if (newIdx === -1) {
        setInput('');
      } else {
        setInput(history[history.length - 1 - newIdx] || '');
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    } else if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      addLines([mkLine('input', `ritinder@portfolio:${currentDir}$ ${input}^C`)]);
      setInput('');
    }
  }, [input, history, histIdx, executeCommand, addLines, currentDir]);

  return {
    lines,
    input,
    setInput,
    history,
    currentDir,
    matrixActive,
    setMatrixActive,
    snakeActive,
    setSnakeActive,
    executeCommand,
    handleKeyDown,
    theme,
    themeName,
    setTheme,
    greetingDone,
  };
}
