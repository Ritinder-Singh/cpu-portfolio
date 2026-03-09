'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Theme } from '@/lib/themes';

const GRID = 20;
const CELL = 20;
const TICK = 150;

type Dir = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Point = { x: number; y: number };

function randomFood(snake: Point[]): Point {
  let food: Point;
  do {
    food = {
      x: Math.floor(Math.random() * GRID),
      y: Math.floor(Math.random() * GRID),
    };
  } while (snake.some(s => s.x === food.x && s.y === food.y));
  return food;
}

interface SnakeGameProps {
  theme: Theme;
  onExit: (score: number) => void;
}

export default function SnakeGame({ theme, onExit }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    snake: [{ x: 10, y: 10 }],
    dir: 'RIGHT' as Dir,
    nextDir: 'RIGHT' as Dir,
    food: { x: 15, y: 10 },
    score: 0,
    alive: true,
  });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const { snake, food } = stateRef.current;

    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = theme.border;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL, 0);
      ctx.lineTo(i * CELL, GRID * CELL);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL);
      ctx.lineTo(GRID * CELL, i * CELL);
      ctx.stroke();
    }

    // Food
    ctx.fillStyle = theme.secondary;
    ctx.fillRect(food.x * CELL + 2, food.y * CELL + 2, CELL - 4, CELL - 4);

    // Snake
    snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? theme.primary : theme.accent;
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
    });
  }, [theme]);

  const tick = useCallback(() => {
    const s = stateRef.current;
    if (!s.alive) return;

    s.dir = s.nextDir;
    const head = s.snake[0];
    const newHead: Point = { x: head.x, y: head.y };

    if (s.dir === 'UP') newHead.y--;
    else if (s.dir === 'DOWN') newHead.y++;
    else if (s.dir === 'LEFT') newHead.x--;
    else newHead.x++;

    // Wall collision
    if (newHead.x < 0 || newHead.x >= GRID || newHead.y < 0 || newHead.y >= GRID) {
      s.alive = false;
      setGameOver(true);
      return;
    }

    // Self collision
    if (s.snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
      s.alive = false;
      setGameOver(true);
      return;
    }

    const ate = newHead.x === s.food.x && newHead.y === s.food.y;
    s.snake = [newHead, ...s.snake.slice(0, ate ? undefined : s.snake.length - 1)];

    if (ate) {
      s.score++;
      setScore(s.score);
      s.food = randomFood(s.snake);
    }

    draw();
  }, [draw]);

  useEffect(() => {
    stateRef.current.food = randomFood(stateRef.current.snake);
    draw();

    const interval = setInterval(tick, TICK);

    const handleKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      const { dir } = s;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        if (dir !== 'DOWN') s.nextDir = 'UP';
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        if (dir !== 'UP') s.nextDir = 'DOWN';
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        if (dir !== 'RIGHT') s.nextDir = 'LEFT';
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        if (dir !== 'LEFT') s.nextDir = 'RIGHT';
      } else if (e.key === 'Escape' || e.key === 'q' || e.key === 'Q') {
        onExit(s.score);
      }
      e.preventDefault();
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKey);
    };
  }, [tick, draw, onExit]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.85)',
        zIndex: 100,
      }}
    >
      <div
        style={{
          color: theme.primary,
          fontFamily: 'Courier New, monospace',
          fontSize: '13px',
          marginBottom: 8,
        }}
      >
        Score: {score} | WASD/Arrows to move | ESC/Q to quit
      </div>
      <canvas
        ref={canvasRef}
        width={GRID * CELL}
        height={GRID * CELL}
        style={{
          border: `2px solid ${theme.border}`,
          imageRendering: 'pixelated',
        }}
      />
      {gameOver && (
        <div
          style={{
            marginTop: 12,
            color: '#ff5555',
            fontFamily: 'Courier New, monospace',
            fontSize: '16px',
            textAlign: 'center',
          }}
        >
          Game Over! Score: {score}
          <br />
          <span
            style={{ fontSize: '13px', color: theme.dim, cursor: 'pointer' }}
            onClick={() => onExit(score)}
          >
            Press ESC or click here to exit
          </span>
        </div>
      )}
    </div>
  );
}
