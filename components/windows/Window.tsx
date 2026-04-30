'use client';

import React, { useRef, useCallback, useEffect, useState } from 'react';
import { WindowState } from '@/lib/types';
import { Theme } from '@/lib/themes';
import { useDesktop } from '@/context/DesktopContext';
import TitleBar from './TitleBar';

interface WindowProps {
  windowState: WindowState;
  theme: Theme;
  children: React.ReactNode;
}

const TASKBAR_HEIGHT = 48;
const MIN_W = 300;
const MIN_H = 180;

type ResizeDir = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';

const HANDLES: { dir: ResizeDir; cursor: string; style: React.CSSProperties }[] = [
  { dir: 'n',  cursor: 'n-resize',  style: { top: 0, left: 6, right: 6, height: 5 } },
  { dir: 'ne', cursor: 'ne-resize', style: { top: 0, right: 0, width: 10, height: 10 } },
  { dir: 'e',  cursor: 'e-resize',  style: { top: 6, right: 0, bottom: 6, width: 5 } },
  { dir: 'se', cursor: 'se-resize', style: { bottom: 0, right: 0, width: 10, height: 10 } },
  { dir: 's',  cursor: 's-resize',  style: { bottom: 0, left: 6, right: 6, height: 5 } },
  { dir: 'sw', cursor: 'sw-resize', style: { bottom: 0, left: 0, width: 10, height: 10 } },
  { dir: 'w',  cursor: 'w-resize',  style: { top: 6, left: 0, bottom: 6, width: 5 } },
  { dir: 'nw', cursor: 'nw-resize', style: { top: 0, left: 0, width: 10, height: 10 } },
];

export default function Window({ windowState, theme, children }: WindowProps) {
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, dispatch } = useDesktop();

  const { id, title, isMaximized, position, size, zIndex } = windowState;

  const [phase, setPhase] = useState<'opening' | 'idle' | 'closing'>('opening');

  useEffect(() => {
    const raf = requestAnimationFrame(() => setPhase('idle'));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClose = useCallback(() => {
    setPhase('closing');
    setTimeout(() => closeWindow(id), 130);
  }, [id, closeWindow]);

  const handleMinimize = useCallback(() => {
    setPhase('closing');
    setTimeout(() => minimizeWindow(id), 130);
  }, [id, minimizeWindow]);

  const isDragging   = useRef(false);
  const dragOffset   = useRef({ x: 0, y: 0 });

  const isResizing   = useRef(false);
  const resizeDir    = useRef<ResizeDir>('se');
  const resizeStart  = useRef({ mouseX: 0, mouseY: 0, winX: 0, winY: 0, winW: 0, winH: 0 });

  const computedStyle: React.CSSProperties = isMaximized
    ? { position: 'fixed', left: 0, top: 0, width: '100vw', height: `calc(100vh - ${TASKBAR_HEIGHT}px)`, zIndex }
    : { position: 'fixed', left: position.x, top: position.y, width: size.width, height: size.height, zIndex };

  const handleTitleBarMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMaximized) return;
    isDragging.current = true;
    dragOffset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    focusWindow(id);
  }, [isMaximized, position, id, focusWindow]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent, dir: ResizeDir) => {
    if (isMaximized) return;
    e.preventDefault();
    e.stopPropagation();
    isResizing.current = true;
    resizeDir.current = dir;
    resizeStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      winX: position.x,
      winY: position.y,
      winW: size.width,
      winH: size.height,
    };
    focusWindow(id);
  }, [isMaximized, position, size, id, focusWindow]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        const x = Math.max(0, Math.min(e.clientX - dragOffset.current.x, window.innerWidth - 100));
        const y = Math.max(0, Math.min(e.clientY - dragOffset.current.y, window.innerHeight - TASKBAR_HEIGHT - 40));
        dispatch({ type: 'MOVE_WINDOW', payload: { id, x, y } });
        return;
      }

      if (isResizing.current) {
        const { mouseX, mouseY, winX, winY, winW, winH } = resizeStart.current;
        const dx = e.clientX - mouseX;
        const dy = e.clientY - mouseY;
        const dir = resizeDir.current;

        let x = winX, y = winY, w = winW, h = winH;

        if (dir.includes('e')) w = Math.max(MIN_W, winW + dx);
        if (dir.includes('s')) h = Math.max(MIN_H, winH + dy);
        if (dir.includes('w')) { w = Math.max(MIN_W, winW - dx); x = winX + winW - w; }
        if (dir.includes('n')) { h = Math.max(MIN_H, winH - dy); y = winY + winH - h; }

        dispatch({ type: 'MOVE_WINDOW', payload: { id, x, y } });
        dispatch({ type: 'RESIZE_WINDOW', payload: { id, width: w, height: h } });
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      isResizing.current = false;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [id, dispatch]);

  return (
    <div
      onMouseDown={() => focusWindow(id)}
      style={{
        ...computedStyle,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: isMaximized ? 0 : 8,
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
        border: `1px solid ${theme.border}`,
        backgroundColor: theme.bg,
        animation: phase === 'opening' ? 'window-open 0.15s ease-out forwards'
                 : phase === 'closing' ? 'window-close 0.13s ease-in forwards'
                 : undefined,
        willChange: 'opacity, transform',
      }}
    >
      {/* Resize handles — hidden when maximized */}
      {!isMaximized && HANDLES.map(h => (
        <div
          key={h.dir}
          onMouseDown={e => handleResizeMouseDown(e, h.dir)}
          style={{
            position: 'absolute',
            ...h.style,
            cursor: h.cursor,
            zIndex: 10,
          }}
        />
      ))}

      <TitleBar
        title={title}
        windowId={id}
        isMaximized={isMaximized}
        onMouseDown={handleTitleBarMouseDown}
        onClose={handleClose}
        onMinimize={handleMinimize}
        onMaximize={() => maximizeWindow(id)}
        theme={theme}
      />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: theme.bg }}>
        {children}
      </div>
    </div>
  );
}
