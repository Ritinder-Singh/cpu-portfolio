import { CommandDef, CommandResult } from './types';
import { ThemeName } from '../types';

const THEME_NAMES: ThemeName[] = ['dracula', 'tokyo', 'catppuccin', 'nord', 'green', 'amber'];

export const utilityCommands: CommandDef[] = [
  {
    name: 'date',
    category: 'Utility',
    description: 'Display current date',
    appMenuMode: 'terminal',
    handler: (): CommandResult => {
      return new Date().toDateString();
    },
  },
  {
    name: 'time',
    category: 'Utility',
    description: 'Display current time',
    appMenuMode: 'terminal',
    handler: (): CommandResult => {
      return new Date().toLocaleTimeString();
    },
  },
  {
    name: 'echo',
    category: 'Utility',
    description: 'Print arguments to terminal',
    appMenuMode: 'terminal',
    args: ['<text>'],
    handler: (args: string[]): CommandResult => {
      return args.join(' ');
    },
  },
  {
    name: 'clear',
    category: 'Utility',
    description: 'Clear terminal screen',
    appMenuMode: 'terminal',
    handler: (): CommandResult => {
      return { type: 'CLEAR' };
    },
  },
  {
    name: 'theme',
    category: 'Utility',
    description: 'Change color theme. Usage: theme <name>',
    appMenuMode: 'terminal',
    args: ['<theme>'],
    handler: (args: string[]): CommandResult => {
      if (!args[0]) {
        return [
          'Available themes:',
          '  dracula    — Purple dark theme',
          '  tokyo      — Tokyo Night blue theme',
          '  catppuccin — Catppuccin mauve theme',
          '  nord       — Nord ice blue theme',
          '  green      — Matrix green theme',
          '  amber      — Amber retro theme',
          '',
          'Usage: theme <name>',
        ].join('\n');
      }
      const name = args[0].toLowerCase();
      if (!THEME_NAMES.includes(name as ThemeName)) {
        return `theme: unknown theme '${name}'. Try: ${THEME_NAMES.join(', ')}`;
      }
      return { type: 'THEME', name };
    },
  },
  {
    name: 'help',
    category: 'Utility',
    description: 'Show all available commands',
    appMenuMode: 'terminal',
    handler: (): CommandResult => {
      return '__HELP__';
    },
  },
  {
    name: 'man',
    category: 'Utility',
    description: 'Show manual for a command',
    appMenuMode: 'terminal',
    args: ['<command>'],
    handler: (args: string[]): CommandResult => {
      if (!args[0]) return 'man: what manual page do you want?';
      return `__MAN__:${args[0]}`;
    },
  },
  {
    name: 'open',
    category: 'Utility',
    description: 'Open URL shortcuts (github, linkedin, resume)',
    appMenuMode: 'terminal',
    args: ['<target>'],
    handler: (args: string[]): CommandResult => {
      const target = (args[0] || '').toLowerCase();
      const urls: Record<string, string> = {
        github: 'https://github.com/ritinder',
        linkedin: 'https://linkedin.com/in/ritinder-singh',
        resume: '/resume.pdf',
        email: 'mailto:ritinder@example.com',
        twitter: 'https://twitter.com/ritinder_dev',
      };
      if (!target) {
        return [
          'open: opens a URL or shortcut',
          '',
          'Shortcuts: ' + Object.keys(urls).join(', '),
          '',
          'Usage: open <shortcut>',
        ].join('\n');
      }
      const url = urls[target];
      if (!url) return `open: unknown target '${target}'. Try: ${Object.keys(urls).join(', ')}`;
      if (typeof window !== 'undefined') {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
      return `Opening ${url} ...`;
    },
  },
  {
    name: 'ping',
    category: 'Utility',
    description: 'Ping a host (simulated)',
    appMenuMode: 'terminal',
    args: ['<host>'],
    handler: (args: string[]): CommandResult => {
      const host = args[0] || 'ritinder.dev';
      const times = Array.from({ length: 4 }, () => (Math.random() * 20 + 5).toFixed(3));
      return [
        `PING ${host} (127.0.0.1): 56 data bytes`,
        ...times.map(
          (t, i) =>
            `64 bytes from 127.0.0.1: icmp_seq=${i} ttl=64 time=${t} ms`
        ),
        '',
        `--- ${host} ping statistics ---`,
        `4 packets transmitted, 4 received, 0% packet loss`,
        `round-trip min/avg/max = ${Math.min(...times.map(Number)).toFixed(3)}/${(
          times.reduce((a, b) => a + Number(b), 0) / 4
        ).toFixed(3)}/${Math.max(...times.map(Number)).toFixed(3)} ms`,
      ].join('\n');
    },
  },
  {
    name: 'weather',
    category: 'Utility',
    description: 'Get current weather (fetches wttr.in)',
    appMenuMode: 'terminal',
    handler: (): CommandResult => {
      return fetch('https://wttr.in/?format=3')
        .then(r => r.text())
        .then(text => text.trim())
        .catch(() => 'weather: unable to fetch weather data. Check your connection.');
    },
  },
  {
    name: 'history',
    category: 'Utility',
    description: 'Show command history',
    appMenuMode: 'terminal',
    handler: (): CommandResult => {
      return '__HISTORY__';
    },
  },
  {
    name: 'neofetch',
    category: 'Utility',
    description: 'Display system information',
    appMenuMode: 'terminal',
    handler: (): CommandResult => {
      return [
        '',
        '         ██████╗  ██████╗ ██████╗ ████████╗',
        '         ██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝',
        '         ██████╔╝██║   ██║██████╔╝   ██║   ',
        '         ██╔═══╝ ██║   ██║██╔══██╗   ██║   ',
        '         ██║     ╚██████╔╝██║  ██║   ██║   ',
        '         ╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ',
        '',
        '  ritinder@portfolio',
        '  ──────────────────',
        '  OS     : Portfolio OS v1.0',
        '  Host   : ritinder.dev',
        '  Shell  : portfolio-sh 1.0.0',
        '  Theme  : dracula',
        '  Stack  : Python · FastAPI · Flutter',
        '  Uptime : Since you opened this tab',
        '',
      ].join('\n');
    },
  },
];
