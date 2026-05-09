'use client';

import React, { useEffect, useRef } from 'react';
import { Theme } from '@/lib/themes';

interface Props { theme: Theme; onClick?: () => void; }

class RNG {
  private s: number;
  constructor(seed: number) { this.s = (seed ^ 0xDEADBEEF) >>> 0; }
  next() { this.s ^= this.s << 13; this.s ^= this.s >>> 17; this.s ^= this.s << 5; return (this.s >>> 0) / 0x100000000; }
  int(lo: number, hi: number) { return lo + Math.floor(this.next() * (hi - lo)); }
  float(lo: number, hi: number) { return lo + this.next() * (hi - lo); }
  pick<T>(arr: readonly T[]): T { return arr[this.int(0, arr.length)]; }
}

function op(color: string, alpha: number) {
  return color + Math.round(Math.min(1, Math.max(0, alpha)) * 255).toString(16).padStart(2, '0');
}

interface Zone { x: number; y: number; w: number; h: number }

function border(ctx: CanvasRenderingContext2D, z: Zone, color: string) {
  ctx.save();
  ctx.strokeStyle = op(color, 0.14);
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 6]);
  ctx.strokeRect(z.x, z.y, z.w, z.h);
  ctx.setLineDash([]);
  ctx.restore();
}

function label(ctx: CanvasRenderingContext2D, z: Zone, text: string, color: string) {
  ctx.fillStyle = op(color, 0.4);
  ctx.font = 'bold 13px "Courier New", monospace';
  ctx.fillText(text, z.x + 8, z.y + 16);
}

// ── 1. Neofetch ───────────────────────────────────────────────────────────────
function drawNeofetch(ctx: CanvasRenderingContext2D, z: Zone, theme: Theme) {
  border(ctx, z, theme.secondary);
  label(ctx, z, 'neofetch', theme.secondary);

  const lx = z.x + 10;
  const rx = z.x + z.w * 0.46;
  const lineH = 18;
  let y = z.y + 32;

  // ASCII Tux (simplified)
  const tux = [
    '   .--.',
    '  |o_o |',
    '  |:_/ |',
    ' //   \\ \\',
    '(|     | )',
    " /'\\___/'\\",
    '\\___)=(___/',
  ];
  ctx.font = '13px "Courier New", monospace';
  for (const line of tux) {
    if (y > z.y + z.h - 8) break;
    ctx.fillStyle = op(theme.primary, 0.55);
    ctx.fillText(line, lx, y);
    y += lineH;
  }

  // System info
  const user = op(theme.secondary, 0.85);
  const sep  = op(theme.dim, 0.5);
  const val  = op(theme.primary, 0.65);

  const info: [string, string][] = [
    ['user@arch', ''],
    ['--------', ''],
    ['OS', 'Arch Linux x86_64'],
    ['Kernel', '6.7.4-arch1-1'],
    ['Uptime', '12 days, 4 hrs'],
    ['Packages', '1247 (pacman)'],
    ['Shell', 'zsh 5.9'],
    ['Terminal', 'portfolio-cpu'],
    ['CPU', 'Ryzen 9 5900X'],
    ['Memory', '7.2G / 16.0G'],
  ];

  let iy = z.y + 32;
  ctx.font = '13px "Courier New", monospace';
  for (const [k, v] of info) {
    if (iy > z.y + z.h - 8) break;
    if (k === 'user@arch') {
      ctx.fillStyle = user;
      ctx.font = 'bold 13px "Courier New", monospace';
      ctx.fillText(k, rx, iy);
      ctx.font = '13px "Courier New", monospace';
    } else if (k === '--------') {
      ctx.fillStyle = sep;
      ctx.fillText('─'.repeat(18), rx, iy);
    } else {
      ctx.fillStyle = user;
      ctx.font = 'bold 13px "Courier New", monospace';
      ctx.fillText(k + ': ', rx, iy);
      const kw = ctx.measureText(k + ': ').width;
      ctx.fillStyle = val;
      ctx.font = '13px "Courier New", monospace';
      ctx.fillText(v, rx + kw, iy);
    }
    iy += lineH;
  }

  // Color swatches
  const colors = [theme.bgDark, theme.bg, theme.dim, theme.primary, theme.secondary, theme.accent, theme.caret, '#ffffff'];
  const sw = 13;
  const swY = z.y + z.h - 18;
  colors.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.fillRect(rx + i * (sw + 2), swY, sw, sw);
  });
}

// ── 2. git log --graph ────────────────────────────────────────────────────────
const GIT_LOG = [
  { graph: '* ', hash: 'a1b2c3d', msg: 'feat: add terminal emulator', author: 'ritinder', age: '2h' },
  { graph: '* ', hash: '3f4e5d6', msg: 'fix: resolve auth callback', author: 'ritinder', age: '5h' },
  { graph: '|\\  ', hash: '', msg: '', author: '', age: '' },
  { graph: '| * ', hash: '7890abc', msg: 'chore: update dependencies', author: 'bot', age: '1d' },
  { graph: '* | ', hash: 'bcd1234', msg: 'refactor: window manager', author: 'ritinder', age: '1d' },
  { graph: '|/  ', hash: '', msg: '', author: '', age: '' },
  { graph: '* ', hash: 'ef56789', msg: 'feat: draggable windows', author: 'ritinder', age: '2d' },
  { graph: '* ', hash: '1234abc', msg: 'fix: mobile layout overflow', author: 'ritinder', age: '3d' },
  { graph: '|\\  ', hash: '', msg: '', author: '', age: '' },
  { graph: '| * ', hash: 'dead123', msg: 'style: catppuccin theme', author: 'ritinder', age: '4d' },
  { graph: '* | ', hash: 'cafe456', msg: 'feat: blog window', author: 'ritinder', age: '4d' },
  { graph: '|/  ', hash: '', msg: '', author: '', age: '' },
  { graph: '* ', hash: '0000001', msg: 'init: project setup', author: 'ritinder', age: '7d' },
];

function drawGitLog(ctx: CanvasRenderingContext2D, z: Zone, theme: Theme) {
  border(ctx, z, theme.primary);
  label(ctx, z, 'git log --oneline --graph', theme.primary);

  const lineH = 19;
  let y = z.y + 28;
  ctx.font = '13px "Courier New", monospace';

  for (const entry of GIT_LOG) {
    if (y > z.y + z.h - 6) break;

    const gx = z.x + 10;
    // Graph chars
    ctx.fillStyle = op(theme.secondary, 0.7);
    ctx.fillText(entry.graph, gx, y);
    const gw = ctx.measureText(entry.graph).width;

    if (entry.hash) {
      // Hash
      ctx.fillStyle = op(theme.accent, 0.8);
      ctx.fillText(entry.hash, gx + gw, y);
      const hw = ctx.measureText(entry.hash).width;
      // Message
      ctx.fillStyle = op(theme.primary, 0.6);
      ctx.fillText(' ' + entry.msg, gx + gw + hw, y);
      // Author + age (right-aligned)
      const meta = `${entry.author} · ${entry.age}`;
      const mw = ctx.measureText(meta).width;
      ctx.fillStyle = op(theme.dim, 0.45);
      ctx.fillText(meta, z.x + z.w - mw - 8, y);
    }
    y += lineH;
  }
}

// ── 3. htop ───────────────────────────────────────────────────────────────────
const PROCESSES = [
  { pid: 1247, cpu: 23.4, mem: 4.2, cmd: 'node server.js' },
  { pid:  891, cpu:  8.1, mem: 2.1, cmd: 'postgres: main' },
  { pid:  456, cpu:  4.2, mem: 1.8, cmd: 'nginx: worker' },
  { pid:  123, cpu:  2.8, mem: 0.9, cmd: 'dockerd' },
  { pid:  789, cpu:  1.2, mem: 0.4, cmd: 'sshd: session' },
  { pid: 3421, cpu:  0.8, mem: 0.3, cmd: 'zsh' },
  { pid: 5678, cpu:  0.4, mem: 0.2, cmd: 'htop' },
];

function drawHtop(ctx: CanvasRenderingContext2D, z: Zone, theme: Theme) {
  border(ctx, z, theme.accent);
  label(ctx, z, 'htop — system monitor', theme.accent);

  let y = z.y + 24;
  const lineH = 20;
  const lx = z.x + 8;

  // CPU / MEM bars
  const barW = Math.min(z.w - 80, 120);
  const cpuPct = 41.9;
  const memPct = 45.0;

  ctx.font = 'bold 13px "Courier New", monospace';
  ctx.fillStyle = op(theme.secondary, 0.7);
  ctx.fillText(`CPU[`, lx, y);
  const cpuLabelW = ctx.measureText('CPU[').width;
  ctx.fillStyle = op(theme.primary, 0.25);
  ctx.fillRect(lx + cpuLabelW, y - 10, barW, 12);
  ctx.fillStyle = op(theme.primary, 0.7);
  ctx.fillRect(lx + cpuLabelW, y - 10, barW * (cpuPct / 100), 12);
  ctx.fillStyle = op(theme.secondary, 0.7);
  ctx.fillText(`]${cpuPct.toFixed(1)}%`, lx + cpuLabelW + barW + 2, y);

  y += lineH;
  ctx.fillStyle = op(theme.secondary, 0.7);
  ctx.fillText(`Mem[`, lx, y);
  const memLabelW = ctx.measureText('Mem[').width;
  ctx.fillStyle = op(theme.accent, 0.25);
  ctx.fillRect(lx + memLabelW, y - 10, barW, 12);
  ctx.fillStyle = op(theme.accent, 0.65);
  ctx.fillRect(lx + memLabelW, y - 10, barW * (memPct / 100), 12);
  ctx.fillStyle = op(theme.secondary, 0.7);
  ctx.fillText(`]7.2G/16G`, lx + memLabelW + barW + 2, y);

  y += lineH + 4;

  // Header
  ctx.font = 'bold 12px "Courier New", monospace';
  ctx.fillStyle = op(theme.dim, 0.7);
  ctx.fillText('  PID   CPU%  MEM%  Command', lx, y);
  y += 14;

  ctx.font = '13px "Courier New", monospace';
  for (let i = 0; i < PROCESSES.length; i++) {
    if (y > z.y + z.h - 6) break;
    const p = PROCESSES[i];
    const isTop = i === 0;
    ctx.fillStyle = op(isTop ? theme.secondary : theme.primary, isTop ? 0.85 : 0.55);
    const line = `${String(p.pid).padStart(5)}  ${p.cpu.toFixed(1).padStart(5)}  ${p.mem.toFixed(1).padStart(4)}  ${p.cmd}`;
    ctx.fillText(line, lx, y);

    // Mini inline bar
    const barX = z.x + z.w - 44;
    const bW = 36;
    ctx.fillStyle = op(theme.primary, 0.15);
    ctx.fillRect(barX, y - 10, bW, 10);
    ctx.fillStyle = op(isTop ? theme.secondary : theme.primary, 0.5);
    ctx.fillRect(barX, y - 10, bW * (p.cpu / 30), 10);

    y += lineH;
  }
}

// ── 4. ls -la ─────────────────────────────────────────────────────────────────
const LS_ENTRIES = [
  { perm: 'drwxr-xr-x', n: '8', user: 'ritinder', size: '4096', date: 'May  9 22:31', name: '.' },
  { perm: 'drwxr-xr-x', n: '42', user: 'ritinder', size: '4096', date: 'May  9 18:20', name: '..' },
  { perm: '-rw-------', n: '1', user: 'ritinder', size: '1024', date: 'May  9 22:31', name: '.env' },
  { perm: '-rw-r--r--', n: '1', user: 'ritinder', size: '2134', date: 'May  9 22:28', name: '.gitignore' },
  { perm: 'drwxr-xr-x', n: '3', user: 'ritinder', size: '4096', date: 'May  9 22:30', name: 'app/' },
  { perm: 'drwxr-xr-x', n: '5', user: 'ritinder', size: '4096', date: 'May  8 14:22', name: 'components/' },
  { perm: '-rw-r--r--', n: '1', user: 'ritinder', size: '4521', date: 'May  7 09:15', name: 'package.json' },
  { perm: 'drwxr-xr-x', n: '4', user: 'ritinder', size: '4096', date: 'May  6 16:45', name: 'prisma/' },
  { perm: '-rw-r--r--', n: '1', user: 'ritinder', size: ' 892', date: 'May  5 11:30', name: 'README.md' },
];

function drawLsLa(ctx: CanvasRenderingContext2D, z: Zone, theme: Theme) {
  border(ctx, z, theme.primary);
  label(ctx, z, 'ls -la ~/projects/portfolio', theme.primary);

  const lineH = 18;
  let y = z.y + 28;
  const lx = z.x + 8;

  ctx.font = 'bold 12px "Courier New", monospace';
  ctx.fillStyle = op(theme.dim, 0.5);
  ctx.fillText('total 96', lx, y);
  y += lineH;

  ctx.font = '12px "Courier New", monospace';
  for (const e of LS_ENTRIES) {
    if (y > z.y + z.h - 6) break;
    const isDir = e.perm.startsWith('d');
    const isHidden = e.name.startsWith('.');

    // permissions
    ctx.fillStyle = op(theme.dim, 0.5);
    ctx.fillText(e.perm + ' ' + e.n.padStart(2), lx, y);
    const pw = ctx.measureText(e.perm + ' ' + e.n.padStart(2) + ' ').width;

    // user
    ctx.fillStyle = op(theme.accent, 0.6);
    ctx.fillText(e.user.padEnd(9), lx + pw, y);
    const uw = ctx.measureText(e.user.padEnd(9)).width;

    // size
    ctx.fillStyle = op(theme.dim, 0.5);
    ctx.fillText(e.size.padStart(5) + ' ', lx + pw + uw, y);
    const sw = ctx.measureText(e.size.padStart(5) + ' ').width;

    // date
    ctx.fillStyle = op(theme.dim, 0.45);
    ctx.fillText(e.date + ' ', lx + pw + uw + sw, y);
    const dw = ctx.measureText(e.date + ' ').width;

    // name
    ctx.fillStyle = isDir
      ? op(theme.primary, 0.85)
      : isHidden
        ? op(theme.accent, 0.65)
        : op(theme.secondary, 0.6);
    ctx.font = isDir ? 'bold 12px "Courier New", monospace' : '12px "Courier New", monospace';
    ctx.fillText(e.name, lx + pw + uw + sw + dw, y);
    ctx.font = '12px "Courier New", monospace';

    y += lineH;
  }
}

// ── 5. Terminal history ───────────────────────────────────────────────────────
const HISTORY = [
  { ps: '~', cmd: 'git status' },
  { ps: '~', cmd: 'git add -A && git commit -m "feat: linux wallpaper"' },
  { ps: '~', cmd: 'docker compose up -d' },
  { ps: '~/projects', cmd: 'npm run dev' },
  { ps: '~/projects', cmd: 'sudo systemctl restart nginx' },
  { ps: '~', cmd: 'ssh ritinder@vps.server.com' },
  { ps: '~', cmd: 'vim ~/.bashrc' },
  { ps: '~/projects', cmd: 'curl -s localhost:3000/api/health | jq' },
  { ps: '~', cmd: 'htop' },
  { ps: '~', cmd: 'df -h' },
  { ps: '~/projects', cmd: 'grep -r "TODO" ./src --include="*.ts"' },
  { ps: '~', cmd: 'cat /var/log/nginx/error.log | tail -20' },
];

function drawTerminalHistory(ctx: CanvasRenderingContext2D, z: Zone, theme: Theme) {
  border(ctx, z, theme.secondary);
  label(ctx, z, '~/.zsh_history', theme.secondary);

  const lineH = 19;
  let y = z.y + 28;
  const lx = z.x + 10;

  ctx.font = '13px "Courier New", monospace';
  for (const entry of HISTORY) {
    if (y > z.y + z.h - 6) break;
    // prompt
    ctx.fillStyle = op(theme.secondary, 0.75);
    const ps = `${entry.ps} $ `;
    ctx.fillText(ps, lx, y);
    const psW = ctx.measureText(ps).width;
    // command — highlight first word
    const parts = entry.cmd.split(' ');
    ctx.fillStyle = op(theme.primary, 0.8);
    ctx.font = 'bold 13px "Courier New", monospace';
    ctx.fillText(parts[0], lx + psW, y);
    const p0w = ctx.measureText(parts[0]).width;
    ctx.fillStyle = op(theme.primary, 0.55);
    ctx.font = '13px "Courier New", monospace';
    ctx.fillText(' ' + parts.slice(1).join(' '), lx + psW + p0w, y);
    y += lineH;
  }

  // blinking cursor at end
  ctx.fillStyle = op(theme.primary, 0.7);
  const ps = `~ $ `;
  ctx.fillText(ps, lx, y);
  ctx.fillStyle = op(theme.caret, 0.8);
  ctx.fillRect(lx + ctx.measureText(ps).width, y - 11, 7, 13);
}

// ── 6. systemctl status ───────────────────────────────────────────────────────
const SERVICES = [
  { name: 'nginx.service', active: true, sub: 'running', pid: 892, mem: '12.4M' },
  { name: 'postgresql.service', active: true, sub: 'running', pid: 456, mem: '48.2M' },
  { name: 'docker.service', active: true, sub: 'running', pid: 234, mem: '82.1M' },
  { name: 'sshd.service', active: true, sub: 'running', pid: 123, mem: '4.1M' },
  { name: 'ufw.service', active: true, sub: 'exited', pid: 0, mem: '—' },
];

function drawSystemctl(ctx: CanvasRenderingContext2D, z: Zone, theme: Theme) {
  border(ctx, z, theme.accent);
  label(ctx, z, 'systemctl status', theme.accent);

  const lineH = 19;
  const lx = z.x + 10;
  let y = z.y + 28;

  ctx.font = '13px "Courier New", monospace';
  for (const svc of SERVICES) {
    if (y > z.y + z.h - 6) break;

    // Bullet
    ctx.fillStyle = svc.sub === 'running' ? op('#50fa7b', 0.85) : op(theme.dim, 0.6);
    ctx.fillText('●', lx, y);

    // Service name
    ctx.fillStyle = op(theme.primary, 0.8);
    ctx.font = 'bold 13px "Courier New", monospace';
    ctx.fillText(' ' + svc.name, lx + 12, y);
    const nw = ctx.measureText(' ' + svc.name).width;

    // Status badge
    ctx.font = '12px "Courier New", monospace';
    const badge = svc.active ? 'active (' + svc.sub + ')' : 'inactive';
    ctx.fillStyle = svc.active ? op('#50fa7b', 0.65) : op('#ff5555', 0.65);
    ctx.fillText(' — ' + badge, lx + 12 + nw, y);

    y += lineH;

    // Detail line
    if (y < z.y + z.h - 6) {
      ctx.font = '12px "Courier New", monospace';
      ctx.fillStyle = op(theme.dim, 0.45);
      const detail = svc.pid > 0
        ? `  └─ PID: ${svc.pid}  Mem: ${svc.mem}  since Mon 2026-05-09`
        : `  └─ (no process)  since Mon 2026-05-09`;
      ctx.fillText(detail, lx, y);
      y += lineH;
    }
  }
}

// ── 7. dmesg ─────────────────────────────────────────────────────────────────
const DMESG = [
  '[    0.000000] Linux version 6.7.4-arch1-1 (gcc 13.2.1)',
  '[    0.000000] Command line: BOOT_IMAGE=/boot/vmlinuz-linux',
  '[    0.124813] ACPI: 8 ACPI AML tables successfully acquired',
  '[    0.235813] ACPI: IRQ0 used by override',
  '[    0.890234] PCI: Using configuration type 1 for base access',
  '[    1.234567] eth0: renamed from ens3',
  '[    1.891023] EXT4-fs (sda1): mounted filesystem',
  '[    2.014500] systemd[1]: systemd 255.4-1-arch running',
  '[    2.345678] docker0: port 1 entered disabled state',
  '[    3.120891] audit: type=1400 avc: denied { read }',
  '[   12.456789] IPv6: ADDRCONF(NETDEV_CHANGE): eth0',
  '[ 1024.109234] usb 1-1: new full-speed USB device',
];

function drawDmesg(ctx: CanvasRenderingContext2D, z: Zone, theme: Theme) {
  border(ctx, z, theme.primary);
  label(ctx, z, 'dmesg | tail -20', theme.primary);

  const lineH = 18;
  let y = z.y + 28;
  const lx = z.x + 8;

  ctx.font = '12px "Courier New", monospace';
  for (const line of DMESG) {
    if (y > z.y + z.h - 6) break;
    const bracket = line.match(/^\[.*?\]/)?.[0] ?? '';
    const rest = line.slice(bracket.length);
    const isWarn = rest.toLowerCase().includes('denied') || rest.toLowerCase().includes('error');

    ctx.fillStyle = op(theme.dim, 0.45);
    ctx.fillText(bracket, lx, y);
    const bw = ctx.measureText(bracket).width;

    ctx.fillStyle = isWarn ? op('#ff5555', 0.7) : op(theme.primary, 0.55);
    ctx.fillText(rest, lx + bw, y);
    y += lineH;
  }
}

// ── 8. .bashrc ────────────────────────────────────────────────────────────────
const BASHRC = [
  '# ~/.bashrc',
  '',
  'export PATH="$HOME/.local/bin:$PATH"',
  'export EDITOR=vim',
  'export PAGER=less',
  'export HISTSIZE=10000',
  '',
  '# Aliases',
  "alias ll='ls -la --color=auto'",
  "alias gs='git status'",
  "alias gp='git push'",
  "alias dc='docker compose'",
  "alias k='kubectl'",
  '',
  '# Prompt',
  "PS1='\\[\\033[01;32m\\]\\u@\\h\\[\\033[00m\\]:\\[\\033[01;34m\\]\\w\\[\\033[00m\\]\\$ '",
  '',
  '[ -f ~/.fzf.bash ] && source ~/.fzf.bash',
  'eval "$(zoxide init bash)"',
];

function drawBashrc(ctx: CanvasRenderingContext2D, z: Zone, theme: Theme) {
  border(ctx, z, theme.secondary);
  label(ctx, z, '~/.bashrc', theme.secondary);

  const lineH = 20;
  let y = z.y + 28;
  const lx = z.x + 10;

  ctx.font = '12px "Courier New", monospace';
  for (const line of BASHRC) {
    if (y > z.y + z.h - 6) break;
    if (!line) { y += lineH * 0.5; continue; }

    if (line.startsWith('#')) {
      ctx.fillStyle = op(theme.dim, 0.5);
      ctx.font = 'italic 12px "Courier New", monospace';
      ctx.fillText(line, lx, y);
      ctx.font = '12px "Courier New", monospace';
    } else if (line.startsWith('export ')) {
      ctx.fillStyle = op(theme.accent, 0.7);
      ctx.fillText('export ', lx, y);
      const ew = ctx.measureText('export ').width;
      ctx.fillStyle = op(theme.primary, 0.65);
      ctx.fillText(line.slice(7), lx + ew, y);
    } else if (line.startsWith('alias ')) {
      ctx.fillStyle = op(theme.secondary, 0.7);
      ctx.fillText('alias ', lx, y);
      const aw = ctx.measureText('alias ').width;
      const eqIdx = line.indexOf('=');
      ctx.fillStyle = op(theme.primary, 0.7);
      ctx.fillText(line.slice(6, eqIdx + 1), lx + aw, y);
      const kw = ctx.measureText(line.slice(6, eqIdx + 1)).width;
      ctx.fillStyle = op(theme.secondary, 0.5);
      ctx.fillText(line.slice(eqIdx + 1), lx + aw + kw, y);
    } else if (line.startsWith('PS1=')) {
      ctx.fillStyle = op(theme.accent, 0.6);
      ctx.fillText(line, lx, y);
    } else if (line.startsWith('[') || line.startsWith('eval')) {
      ctx.fillStyle = op(theme.dim, 0.55);
      ctx.fillText(line, lx, y);
    } else {
      ctx.fillStyle = op(theme.primary, 0.55);
      ctx.fillText(line, lx, y);
    }
    y += lineH;
  }
}

// ── 9. man page ───────────────────────────────────────────────────────────────
const MAN_PAGE = [
  { bold: true,  text: 'NAME' },
  { bold: false, text: '       ssh – OpenSSH remote login client' },
  { bold: false, text: '' },
  { bold: true,  text: 'SYNOPSIS' },
  { bold: false, text: '       ssh [options] [user@]hostname [cmd]' },
  { bold: false, text: '' },
  { bold: true,  text: 'DESCRIPTION' },
  { bold: false, text: '       ssh is a program for logging into a' },
  { bold: false, text: '       remote machine and executing commands.' },
  { bold: false, text: '' },
  { bold: true,  text: 'OPTIONS' },
  { bold: false, text: '  -p port  Specifies the port.' },
  { bold: false, text: '  -i file  Selects an identity file.' },
  { bold: false, text: '  -L local:host:remote' },
  { bold: false, text: '           Specifies local port forwarding.' },
  { bold: false, text: '  -N       Do not execute a remote command.' },
  { bold: false, text: '  -v       Verbose mode.' },
  { bold: false, text: '' },
  { bold: true,  text: 'EXIT STATUS' },
  { bold: false, text: '       0 on success, >0 on failure.' },
];

function drawManPage(ctx: CanvasRenderingContext2D, z: Zone, theme: Theme) {
  border(ctx, z, theme.accent);
  label(ctx, z, 'man ssh', theme.accent);

  const lineH = 20;
  let y = z.y + 28;
  const lx = z.x + 10;

  ctx.font = '12px "Courier New", monospace';
  for (const line of MAN_PAGE) {
    if (y > z.y + z.h - 6) break;
    if (!line.text) { y += lineH * 0.4; continue; }

    if (line.bold) {
      ctx.font = 'bold 12px "Courier New", monospace';
      ctx.fillStyle = op(theme.secondary, 0.8);
    } else {
      ctx.font = '12px "Courier New", monospace';
      ctx.fillStyle = op(theme.primary, 0.55);
    }
    ctx.fillText(line.text, lx, y);
    y += lineH;
  }
}

// ── Gutter separator lines ────────────────────────────────────────────────────
function drawGutters(ctx: CanvasRenderingContext2D, cols: number[], rows: number[], theme: Theme) {
  ctx.save();
  ctx.lineCap = 'round';
  for (const gx of cols) {
    ctx.strokeStyle = op(theme.primary, 0.08);
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, 9999); ctx.stroke();
  }
  for (const gy of rows) {
    ctx.strokeStyle = op(theme.secondary, 0.08);
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(90, gy); ctx.lineTo(99999, gy); ctx.stroke();
  }
  ctx.restore();
}

// ── Main component ────────────────────────────────────────────────────────────
export default function LinuxWallpaper({ theme, onClick }: Props) {
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

      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, theme.bgDark);
      grad.addColorStop(0.5, theme.bg);
      grad.addColorStop(1, theme.bgDark);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Subtle scanline texture
      const rng = new RNG(W * 1337 + H);
      ctx.save();
      ctx.beginPath(); ctx.rect(90, 0, W - 90, H); ctx.clip();
      ctx.font = '12px "Courier New", monospace';
      for (let y = 14; y < H; y += 14) {
        if (rng.next() > 0.3) continue;
        ctx.fillStyle = op(theme.primary, rng.float(0.02, 0.04));
        ctx.fillText('─'.repeat(Math.floor((W - 90) / 7)), 90, y);
      }
      ctx.restore();

      // Zone layout (3×3, offset by icon strip)
      const pad = 10;
      const iconStrip = 90;
      const UW = W - iconStrip;
      const cw = [0.33, 0.33, 0.34];
      const rh = [0.34, 0.33, 0.33];

      const col0 = iconStrip + pad;
      const col1 = iconStrip + Math.round(UW * cw[0]) + pad * 2;
      const col2 = iconStrip + Math.round(UW * (cw[0] + cw[1])) + pad * 3;

      const row0 = pad;
      const row1 = Math.round(H * rh[0]) + pad * 2;
      const row2 = Math.round(H * (rh[0] + rh[1])) + pad * 3;

      const zones: Zone[][] = [
        [
          { x: col0, y: row0, w: col1 - col0 - pad, h: row1 - row0 - pad },
          { x: col1, y: row0, w: col2 - col1 - pad, h: row1 - row0 - pad },
          { x: col2, y: row0, w: W - col2 - pad,    h: row1 - row0 - pad },
        ],
        [
          { x: col0, y: row1, w: col1 - col0 - pad, h: row2 - row1 - pad },
          { x: col1, y: row1, w: col2 - col1 - pad, h: row2 - row1 - pad },
          { x: col2, y: row1, w: W - col2 - pad,    h: row2 - row1 - pad },
        ],
        [
          { x: col0, y: row2, w: col1 - col0 - pad, h: H - row2 - pad },
          { x: col1, y: row2, w: col2 - col1 - pad, h: H - row2 - pad },
          { x: col2, y: row2, w: W - col2 - pad,    h: H - row2 - pad },
        ],
      ];

      drawGutters(ctx, [col1 - pad, col2 - pad], [row1 - pad, row2 - pad], theme);

      drawNeofetch      (ctx, zones[0][0], theme);
      drawGitLog        (ctx, zones[0][1], theme);
      drawHtop          (ctx, zones[0][2], theme);
      drawLsLa          (ctx, zones[1][0], theme);
      drawTerminalHistory(ctx, zones[1][1], theme);
      drawSystemctl     (ctx, zones[1][2], theme);
      drawDmesg         (ctx, zones[2][0], theme);
      drawBashrc        (ctx, zones[2][1], theme);
      drawManPage       (ctx, zones[2][2], theme);

      // Vignette
      const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, Math.max(W, H) * 0.75);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(0,0,0,0.3)');
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
      style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: 0, cursor: 'default' }}
    />
  );
}
