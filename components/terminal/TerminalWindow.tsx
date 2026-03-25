'use client';

import React, { useRef, useEffect } from 'react';
import { useDesktop } from '@/context/DesktopContext';
import { useTerminal } from './useTerminal';
import TerminalOutput from './TerminalOutput';
import TerminalInput from './TerminalInput';
import MatrixRain from './MatrixRain';
import SnakeGame from './SnakeGame';

export default function TerminalWindow() {
  const { terminalExecuteRef, state } = useDesktop();
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    lines,
    input,
    setInput,
    currentDir,
    matrixActive,
    setMatrixActive,
    snakeActive,
    setSnakeActive,
    executeCommand,
    handleKeyDown,
    theme,
  } = useTerminal(terminalExecuteRef);

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Re-focus when window becomes active/front
  const terminalWindow = state.windows.find(w => w.type === 'terminal');
  useEffect(() => {
    if (terminalWindow && !terminalWindow.isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [terminalWindow?.zIndex, terminalWindow?.isMinimized]);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.bg,
        position: 'relative',
        overflow: 'hidden',
      }}
      onClick={handleContainerClick}
    >
      {matrixActive && (
        <MatrixRain
          theme={theme}
          onExit={() => {
            setMatrixActive(false);
            setTimeout(() => inputRef.current?.focus(), 100);
          }}
        />
      )}
      {snakeActive && (
        <SnakeGame
          theme={theme}
          onExit={(score: number) => {
            setSnakeActive(false);
            executeCommand(`echo "Snake game over! Final score: ${score}"`);
            setTimeout(() => inputRef.current?.focus(), 100);
          }}
        />
      )}
      <TerminalOutput lines={lines} theme={theme} />
      <TerminalInput
        value={input}
        onChange={setInput}
        onKeyDown={handleKeyDown}
        theme={theme}
        currentDir={currentDir}
        inputRef={inputRef}
      />
    </div>
  );
}
