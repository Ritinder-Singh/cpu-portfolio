'use client';

import React, { useEffect, useRef } from 'react';
import { Theme } from '@/lib/themes';

interface WallpaperProps {
  theme: Theme;
  onClick?: () => void;
}

export default function Wallpaper({ theme, onClick }: WallpaperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw();
    };

    function draw() {
      if (!ctx || !canvas) return;

      // Base gradient
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, theme.bgDark);
      grad.addColorStop(0.5, theme.bg);
      grad.addColorStop(1, theme.bgDark);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle grid
      ctx.strokeStyle = theme.border;
      ctx.globalAlpha = 0.15;
      ctx.lineWidth = 0.5;

      const gridSize = 40;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;

      // Subtle glow spots
      const glowColors = [theme.primary, theme.secondary, theme.accent];
      const glowPositions = [
        { x: canvas.width * 0.2, y: canvas.height * 0.3 },
        { x: canvas.width * 0.7, y: canvas.height * 0.6 },
        { x: canvas.width * 0.5, y: canvas.height * 0.1 },
      ];

      glowPositions.forEach((pos, i) => {
        const color = glowColors[i % glowColors.length];
        const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 200);
        glow.addColorStop(0, color + '22');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });
    }

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      onClick={onClick}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        cursor: 'default',
      }}
    />
  );
}
