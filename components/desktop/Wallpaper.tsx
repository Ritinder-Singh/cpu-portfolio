'use client';

import React, { useEffect, useRef } from 'react';
import { Theme } from '@/lib/themes';

interface WallpaperProps {
  theme: Theme;
  onClick?: () => void;
}

class RNG {
  private s: number;
  constructor(seed: number) { this.s = (seed ^ 0xA5A5A5A5) >>> 0; }
  next() {
    this.s ^= this.s << 13; this.s ^= this.s >>> 17; this.s ^= this.s << 5;
    return (this.s >>> 0) / 0x100000000;
  }
  int(lo: number, hi: number) { return lo + Math.floor(this.next() * (hi - lo)); }
  float(lo: number, hi: number) { return lo + this.next() * (hi - lo); }
  pick<T>(arr: readonly T[]): T { return arr[this.int(0, arr.length)]; }
  bool(p = 0.5) { return this.next() < p; }
}

function op(color: string, opacity: number) {
  return color + Math.round(Math.min(1, Math.max(0, opacity)) * 255).toString(16).padStart(2, '0');
}

// Zone: absolute pixel box
interface Zone { x: number; y: number; w: number; h: number }

// ── Background: very faint hex dump texture ───────────────────────────────────
function drawBgTexture(ctx: CanvasRenderingContext2D, rng: RNG, W: number, H: number, color: string) {
  ctx.font = '10px "Courier New", monospace';
  const lineH = 16;
  for (let y = lineH; y < H; y += lineH) {
    if (rng.next() > 0.35) continue;
    ctx.fillStyle = op(color, rng.float(0.04, 0.07));
    const addr = rng.int(0, 0xffffff).toString(16).toUpperCase().padStart(6, '0');
    let line = `${addr}:  `;
    for (let i = 0; i < Math.floor((W - 80) / 24); i++)
      line += rng.int(0, 255).toString(16).toUpperCase().padStart(2, '0') + ' ';
    ctx.fillText(line, 8, y);
  }
}

// ── Zone border (subtle dashed outline) ───────────────────────────────────────
function drawZoneBorder(ctx: CanvasRenderingContext2D, z: Zone, color: string) {
  ctx.save();
  ctx.strokeStyle = op(color, 0.12);
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 6]);
  ctx.strokeRect(z.x, z.y, z.w, z.h);
  ctx.setLineDash([]);
  ctx.restore();
}

// ── Zone label ────────────────────────────────────────────────────────────────
function drawZoneLabel(ctx: CanvasRenderingContext2D, z: Zone, label: string, color: string) {
  ctx.fillStyle = op(color, 0.35);
  ctx.font = 'bold 11px "Courier New", monospace';
  ctx.fillText(`// ${label}`, z.x + 8, z.y + 16);
}

// ── 1. Binary tree ────────────────────────────────────────────────────────────
function drawBinaryTree(ctx: CanvasRenderingContext2D, rng: RNG, z: Zone, theme: Theme) {
  drawZoneBorder(ctx, z, theme.secondary);
  drawZoneLabel(ctx, z, 'binary_tree.h', theme.secondary);

  const rootX = z.x + z.w / 2;
  const rootY = z.y + 42;
  const color = theme.secondary;

  function node(x: number, y: number, val: number, depth: number, span: number) {
    if (depth > 3 || y > z.y + z.h - 10) return;
    const R = 16;
    ctx.save();
    ctx.shadowColor = color; ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.arc(x, y, R, 0, Math.PI * 2);
    ctx.fillStyle = op(theme.bgDark, 0.92); ctx.fill();
    ctx.strokeStyle = op(color, 0.75); ctx.lineWidth = 2; ctx.stroke();
    ctx.restore();
    ctx.fillStyle = op(color, 0.9);
    ctx.font = 'bold 12px "Courier New", monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(String(val), x, y);
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    if (depth >= 3) return;
    const cy = y + 54, half = span / 2;
    [[x - half, rng.int(1, 99)], [x + half, rng.int(1, 99)]].forEach(([cx, cv]) => {
      if ((cx as number) < z.x + 4 || (cx as number) > z.x + z.w - 4) return;
      ctx.strokeStyle = op(color, 0.3); ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(x, y + R); ctx.lineTo(cx as number, cy - R); ctx.stroke();
      node(cx as number, cy, cv as number, depth + 1, half);
    });
  }
  node(rootX, rootY, rng.int(40, 80), 1, z.w * 0.4);
}

// ── 2. Hex dump block ─────────────────────────────────────────────────────────
function drawHexBlock(ctx: CanvasRenderingContext2D, rng: RNG, z: Zone, theme: Theme) {
  drawZoneBorder(ctx, z, theme.primary);
  drawZoneLabel(ctx, z, 'memory_dump.bin', theme.primary);

  const lineH = 19;
  let y = z.y + 28;
  ctx.font = '13px "Courier New", monospace';
  while (y < z.y + z.h - 4) {
    const addr = rng.int(0, 0xffffff).toString(16).toUpperCase().padStart(6, '0');
    ctx.fillStyle = op(theme.dim, 0.6);
    ctx.fillText(`${addr}:`, z.x + 8, y);
    let x = z.x + 80;
    while (x < z.x + z.w - 26) {
      const byte = rng.int(0, 255);
      const isHigh = byte > 200;
      ctx.fillStyle = op(isHigh ? theme.secondary : theme.primary, isHigh ? 0.7 : 0.45);
      ctx.fillText(byte.toString(16).toUpperCase().padStart(2, '0'), x, y);
      x += 28;
    }
    y += lineH;
  }
}

// ── 3. Stack diagram ──────────────────────────────────────────────────────────
function drawStack(ctx: CanvasRenderingContext2D, rng: RNG, z: Zone, theme: Theme) {
  drawZoneBorder(ctx, z, theme.accent);
  drawZoneLabel(ctx, z, 'call_stack.s', theme.accent);

  const color = theme.accent;
  const bW = Math.min(z.w - 20, 130);
  const bH = 29;
  const sx = z.x + (z.w - bW) / 2;
  let sy = z.y + 28;
  const items = Math.floor((z.h - 36) / bH);

  const labels = ['main()', 'render()', 'draw()', 'update()', 'tick()', 'loop()', 'init()'];

  for (let i = 0; i < items; i++) {
    const isTop = i === 0;
    ctx.save();
    if (isTop) { ctx.shadowColor = color; ctx.shadowBlur = 8; }
    ctx.strokeStyle = op(color, isTop ? 0.8 : 0.3);
    ctx.lineWidth = isTop ? 2 : 1;
    ctx.strokeRect(sx, sy, bW, bH);
    ctx.restore();
    ctx.fillStyle = op(theme.bgDark, 0.85);
    ctx.fillRect(sx + 1, sy + 1, bW - 2, bH - 2);
    ctx.fillStyle = op(color, isTop ? 0.9 : 0.45);
    ctx.font = `${isTop ? 'bold ' : ''}12px "Courier New", monospace`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(labels[i % labels.length], sx + bW / 2, sy + bH / 2);
    if (isTop) {
      ctx.textAlign = 'left';
      ctx.fillStyle = op(theme.secondary, 0.7);
      ctx.font = 'bold 11px "Courier New", monospace';
      ctx.fillText('← SP', sx + bW + 6, sy + bH / 2 + 3);
    }
    sy += bH;
  }
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
}

// ── 4 & 6. Network graph ──────────────────────────────────────────────────────
function drawNetworkGraph(ctx: CanvasRenderingContext2D, rng: RNG, z: Zone, theme: Theme, color: string) {
  drawZoneBorder(ctx, z, color);
  drawZoneLabel(ctx, z, 'graph.hpp', color);

  const cx = z.x + z.w / 2;
  const cy = z.y + z.h / 2 + 8;
  const r  = Math.min(z.w, z.h) * 0.35;
  const n  = rng.int(5, 8);
  const nodes: { x: number; y: number; label: string }[] = [];

  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    nodes.push({
      x: cx + Math.cos(angle) * r * rng.float(0.75, 1),
      y: cy + Math.sin(angle) * r * rng.float(0.75, 1),
      label: String(i + 1),
    });
  }

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (rng.next() > 0.5) continue;
      ctx.save();
      ctx.strokeStyle = op(color, 0.35);
      ctx.lineWidth = 1.5;
      ctx.shadowColor = color; ctx.shadowBlur = 3;
      ctx.beginPath();
      ctx.moveTo(nodes[i].x, nodes[i].y);
      ctx.lineTo(nodes[j].x, nodes[j].y);
      ctx.stroke();
      ctx.restore();
      ctx.fillStyle = op(theme.dim, 0.6);
      ctx.font = '10px "Courier New", monospace';
      ctx.fillText(String(rng.int(1, 15)),
        (nodes[i].x + nodes[j].x) / 2 + 3,
        (nodes[i].y + nodes[j].y) / 2 - 3);
    }
  }

  for (const nd of nodes) {
    ctx.save();
    ctx.shadowColor = color; ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.arc(nd.x, nd.y, 13, 0, Math.PI * 2);
    ctx.fillStyle = op(theme.bgDark, 0.9); ctx.fill();
    ctx.strokeStyle = op(color, 0.8); ctx.lineWidth = 2; ctx.stroke();
    ctx.restore();
    ctx.fillStyle = op(color, 0.9);
    ctx.font = 'bold 12px "Courier New", monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(nd.label, nd.x, nd.y);
  }
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
}

// ── 5. Formulas ───────────────────────────────────────────────────────────────
const FORMULAS = [
  ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)', 'O(n!)'],
  ['P ⊆ NP', 'P vs NP', 'NP-Hard', 'co-NP', 'PSPACE'],
  ['T(n) = 2T(n/2) + n', 'Σᵢ₌₁ⁿ i = n(n+1)/2', 'n! / k!(n-k)!'],
  ['∀ε>0 ∃δ>0', 'lim_{n→∞}', 'f = Θ(g)', '∅ ∈ P'],
  ['0xFF = 255', '2³² = 4,294,967,296', 'NaN ≠ NaN', 'sizeof(ptr) = 8'],
];

function drawFormulas(ctx: CanvasRenderingContext2D, rng: RNG, z: Zone, theme: Theme) {
  drawZoneBorder(ctx, z, theme.primary);
  drawZoneLabel(ctx, z, 'complexity.md', theme.primary);

  const colors = [theme.primary, theme.secondary, theme.accent];
  let y = z.y + 26;

  for (const group of FORMULAS) {
    if (y > z.y + z.h - 16) break;
    const color = rng.pick(colors as readonly string[]);
    for (const formula of group) {
      if (y > z.y + z.h - 16) break;
      const size = rng.float(14, 21);
      ctx.font = `bold ${size}px "Courier New", monospace`;
      ctx.fillStyle = op(color, rng.float(0.5, 0.75));
      ctx.fillText(formula, z.x + rng.float(8, 24), y);
      y += size + 7;
    }
    y += 10;
  }
}

// ── 7. Linked list ────────────────────────────────────────────────────────────
function drawLinkedList(ctx: CanvasRenderingContext2D, rng: RNG, z: Zone, theme: Theme) {
  drawZoneBorder(ctx, z, theme.accent);
  drawZoneLabel(ctx, z, 'linked_list.cpp', theme.accent);

  const color = theme.accent;
  const bW = 58, bH = 30, gap = 18;
  const count = Math.floor((z.w - 12) / (bW + gap));
  const startX = z.x + 8;
  const startY = z.y + z.h / 2;

  // Draw doubly-linked for variety
  for (let i = 0; i < count; i++) {
    const x = startX + i * (bW + gap);
    if (x + bW > z.x + z.w - 4) break;
    const y = startY - bH / 2;

    ctx.save();
    ctx.shadowColor = color; ctx.shadowBlur = 5;
    ctx.strokeStyle = op(color, 0.65); ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, bW, bH);
    ctx.restore();
    ctx.fillStyle = op(theme.bgDark, 0.85);
    ctx.fillRect(x + 1, y + 1, bW - 2, bH - 2);

    // Divider
    ctx.strokeStyle = op(color, 0.25); ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + bW * 0.58, y); ctx.lineTo(x + bW * 0.58, y + bH);
    ctx.stroke();

    ctx.fillStyle = op(color, 0.85);
    ctx.font = 'bold 12px "Courier New", monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(String(rng.int(1, 99)), x + bW * 0.27, y + bH / 2);
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';

    if (i < count - 1) {
      const ax = x + bW, ay = y + bH / 2;
      ctx.strokeStyle = op(color, 0.6); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax + gap - 4, ay); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(ax + gap - 7, ay - 4); ctx.lineTo(ax + gap, ay); ctx.lineTo(ax + gap - 7, ay + 4);
      ctx.stroke();
    } else {
      ctx.fillStyle = op(theme.dim, 0.65);
      ctx.font = '11px "Courier New", monospace';
      ctx.fillText('∅', x + bW * 0.62 + 3, y + bH / 2 + 3);
    }
  }

  // head label
  ctx.fillStyle = op(theme.dim, 0.45);
  ctx.font = '11px "Courier New", monospace';
  ctx.fillText('head →', z.x + 8, startY - bH / 2 - 6);
}

// ── 8 & 9. Code snippet ───────────────────────────────────────────────────────
const SNIPPETS: string[][] = [
  ['function quickSort(arr) {',
   '  if (arr.length <= 1) return arr;',
   '  const pivot = arr[arr.length >> 1];',
   '  const l = arr.filter(x => x < pivot);',
   '  const r = arr.filter(x => x > pivot);',
   '  return [',
   '    ...quickSort(l),',
   '    pivot,',
   '    ...quickSort(r)',
   '  ];',
   '}'],
  ['def bfs(graph, start):',
   '  visited = set()',
   '  queue = deque([start])',
   '  while queue:',
   '    v = queue.popleft()',
   '    visited.add(v)',
   '    for n in graph[v]:',
   '      if n not in visited:',
   '        queue.append(n)',
   '  return visited'],
  ['int binSearch(int[] a, int t) {',
   '  int lo = 0, hi = a.length-1;',
   '  while (lo <= hi) {',
   '    int mid = lo+(hi-lo)/2;',
   '    if (a[mid] == t) return mid;',
   '    if (a[mid] < t)  lo = mid+1;',
   '    else             hi = mid-1;',
   '  }',
   '  return -1;',
   '}'],
  ['// Dijkstra',
   'pq.push({dist:0, node:src});',
   'while (!pq.empty()) {',
   '  auto [d,u] = pq.top();',
   '  pq.pop();',
   '  for (auto [v,w] : adj[u])',
   '    if (dist[u]+w < dist[v]) {',
   '      dist[v] = dist[u]+w;',
   '      pq.push({dist[v],v});',
   '    }',
   '}'],
  ['fn merge_sort(a: &[i32])',
   '  -> Vec<i32> {',
   '  if a.len() <= 1 {',
   '    return a.to_vec();',
   '  }',
   '  let mid = a.len() / 2;',
   '  let l = merge_sort(&a[..mid]);',
   '  let r = merge_sort(&a[mid..]);',
   '  merge(l, r)',
   '}'],
];

function drawCodeSnippet(ctx: CanvasRenderingContext2D, rng: RNG, z: Zone, theme: Theme, snippetIdx: number) {
  const color = snippetIdx % 2 === 0 ? theme.primary : theme.secondary;
  drawZoneBorder(ctx, z, color);

  const snippet = SNIPPETS[snippetIdx % SNIPPETS.length];
  const filename = ['quicksort.js', 'bfs.py', 'search.java', 'dijkstra.cpp', 'sort.rs'][snippetIdx % 5];
  drawZoneLabel(ctx, z, filename, color);

  const lineH = 18;
  let y = z.y + 28;
  ctx.font = '12px "Courier New", monospace';

  const keywords = ['function', 'def', 'int', 'fn', 'const', 'let', 'if', 'while', 'for', 'return', 'auto', 'else'];
  const kws = new RegExp(`\\b(${keywords.join('|')})\\b`);

  for (const line of snippet) {
    if (y > z.y + z.h - 6) break;
    // Simple keyword highlight: draw whole line, overlay keywords brighter
    ctx.fillStyle = op(color, 0.45);
    ctx.fillText(line, z.x + 10, y);

    // Brighten keywords
    let match: RegExpExecArray | null;
    const re = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    while ((match = re.exec(line)) !== null) {
      const pre = line.slice(0, match.index);
      const kx = z.x + 10 + ctx.measureText(pre).width;
      ctx.fillStyle = op(theme.secondary, 0.85);
      ctx.fillText(match[0], kx, y);
    }
    void kws;
    y += lineH;
  }
}

// ── Gutter PCB traces ─────────────────────────────────────────────────────────
function drawGutterTraces(ctx: CanvasRenderingContext2D, rng: RNG, W: number, H: number,
                          cols: number[], rows: number[], theme: Theme) {
  const G = 10;
  ctx.lineCap = 'round';

  // Horizontal gutter lines
  for (const gy of rows) {
    const count = rng.int(3, 7);
    for (let i = 0; i < count; i++) {
      const x1 = rng.float(W * 0.05, W * 0.8);
      const len = rng.float(40, 140);
      ctx.save();
      ctx.strokeStyle = op(theme.primary, rng.float(0.2, 0.38));
      ctx.lineWidth = 1.5;
      ctx.shadowColor = theme.primary; ctx.shadowBlur = 4;
      ctx.beginPath(); ctx.moveTo(x1, gy); ctx.lineTo(x1 + len, gy); ctx.stroke();
      // Via
      ctx.strokeStyle = op(theme.primary, 0.45); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(x1 + len, gy, 4, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = op(theme.bgDark, 1);
      ctx.beginPath(); ctx.arc(x1 + len, gy, 2, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  }

  // Vertical gutter lines
  for (const gx of cols) {
    const count = rng.int(3, 6);
    for (let i = 0; i < count; i++) {
      const y1 = rng.float(H * 0.05, H * 0.8);
      const len = rng.float(30, 100);
      ctx.save();
      ctx.strokeStyle = op(theme.accent, rng.float(0.2, 0.35));
      ctx.lineWidth = 1.5;
      ctx.shadowColor = theme.accent; ctx.shadowBlur = 4;
      ctx.beginPath(); ctx.moveTo(gx, y1); ctx.lineTo(gx, y1 + len); ctx.stroke();
      ctx.strokeStyle = op(theme.accent, 0.45); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(gx, y1, 4, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = op(theme.bgDark, 1);
      ctx.beginPath(); ctx.arc(gx, y1, 2, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  }
  void G;
}

// ─────────────────────────────────────────────────────────────────────────────

export default function Wallpaper({ theme, onClick }: WallpaperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function draw() {
      if (!ctx || !canvas) return;

      const dpr = window.devicePixelRatio || 1;
      const W = window.innerWidth, H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
      ctx.scale(dpr, dpr);

      const rng = new RNG(W * 7919 + H);

      // Substrate
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, theme.bgDark);
      grad.addColorStop(0.5, theme.bg);
      grad.addColorStop(1, theme.bgDark);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Faint background hex texture
      drawBgTexture(ctx, rng, W, H, theme.primary);

      // ── 3×3 zone layout ──────────────────────────────────────────
      const pad = 10;   // gutter thickness
      const cw  = [0.33, 0.33, 0.34];  // column widths as fraction of W
      const rh  = [0.34, 0.33, 0.33];  // row heights as fraction of H

      const col0 = pad;
      const col1 = Math.round(W * cw[0]) + pad * 2;
      const col2 = Math.round(W * (cw[0] + cw[1])) + pad * 3;

      const row0 = pad;
      const row1 = Math.round(H * rh[0]) + pad * 2;
      const row2 = Math.round(H * (rh[0] + rh[1])) + pad * 3;

      const zW0 = col1 - col0 - pad;
      const zW1 = col2 - col1 - pad;
      const zW2 = W - col2 - pad;

      const zH0 = row1 - row0 - pad;
      const zH1 = row2 - row1 - pad;
      const zH2 = H - row2 - pad;

      const zones: Zone[][] = [
        [
          { x: col0, y: row0, w: zW0, h: zH0 },
          { x: col1, y: row0, w: zW1, h: zH0 },
          { x: col2, y: row0, w: zW2, h: zH0 },
        ],
        [
          { x: col0, y: row1, w: zW0, h: zH1 },
          { x: col1, y: row1, w: zW1, h: zH1 },
          { x: col2, y: row1, w: zW2, h: zH1 },
        ],
        [
          { x: col0, y: row2, w: zW0, h: zH2 },
          { x: col1, y: row2, w: zW1, h: zH2 },
          { x: col2, y: row2, w: zW2, h: zH2 },
        ],
      ];

      // Gutter centre lines (for PCB traces)
      const gutterCols = [col1 - pad, col2 - pad];
      const gutterRows = [row1 - pad, row2 - pad];
      drawGutterTraces(ctx, rng, W, H, gutterCols, gutterRows, theme);

      // Draw each zone's content
      drawBinaryTree  (ctx, rng, zones[0][0], theme);          // top-left
      drawHexBlock    (ctx, rng, zones[0][1], theme);          // top-center
      drawStack       (ctx, rng, zones[0][2], theme);          // top-right
      drawNetworkGraph(ctx, rng, zones[1][0], theme, theme.primary);   // mid-left
      drawFormulas    (ctx, rng, zones[1][1], theme);          // center
      drawNetworkGraph(ctx, rng, zones[1][2], theme, theme.secondary); // mid-right
      drawLinkedList  (ctx, rng, zones[2][0], theme);          // bottom-left
      drawCodeSnippet (ctx, rng, zones[2][1], theme, 0);       // bottom-center
      drawCodeSnippet (ctx, rng, zones[2][2], theme, 1);       // bottom-right

      // Light vignette
      const vig = ctx.createRadialGradient(W/2, H/2, H*0.25, W/2, H/2, Math.max(W,H) * 0.75);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(0,0,0,0.28)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);
    }

    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
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
