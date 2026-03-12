import { CommandDef, CommandResult } from './types';

type FileSystemNode =
  | { type: 'dir'; children: Record<string, FileSystemNode> }
  | { type: 'file'; content: string };

const FS: FileSystemNode = {
  type: 'dir',
  children: {
    about: {
      type: 'dir',
      children: {
        'README.md': {
          type: 'file',
          content: [
            'Ritinder Singh — Backend Developer · Flutter · Python',
            '',
            'I build scalable backend systems and cross-platform mobile apps.',
            'Open to remote Backend / Flutter roles.',
          ].join('\n'),
        },
      },
    },
    skills: {
      type: 'dir',
      children: {
        'languages.txt': {
          type: 'file',
          content: 'Python · Dart · JavaScript · SQL · Bash',
        },
        'backend.txt': {
          type: 'file',
          content: 'FastAPI · Flask · Django REST · PostgreSQL · Redis · Celery · Docker · Kubernetes',
        },
        'mobile.txt': {
          type: 'file',
          content: 'Flutter · Firebase · Bloc · Provider · REST APIs',
        },
        'devops.txt': {
          type: 'file',
          content: 'Docker · GitHub Actions · Nginx · Linux · AWS basics',
        },
      },
    },
    projects: {
      type: 'dir',
      children: {
        'quickmart-api.txt': {
          type: 'file',
          content: [
            'QuickMart Backend',
            'FastAPI + PostgreSQL e-commerce backend',
            'JWT auth, Redis caching, Celery async tasks',
            'github.com/ritinder/quickmart-api',
          ].join('\n'),
        },
        'taskflow.txt': {
          type: 'file',
          content: [
            'TaskFlow',
            'Flutter productivity app with offline sync',
            'Firebase backend, Bloc state management',
            'github.com/ritinder/taskflow',
          ].join('\n'),
        },
        'devmetrics.txt': {
          type: 'file',
          content: [
            'DevMetrics',
            'Real-time developer dashboard',
            'WebSocket streaming, PostgreSQL analytics',
            'github.com/ritinder/devmetrics',
          ].join('\n'),
        },
        'pybot.txt': {
          type: 'file',
          content: [
            'PyBot',
            'Telegram bot framework in Python',
            'Plugin system, Redis session storage',
            'github.com/ritinder/pybot',
          ].join('\n'),
        },
      },
    },
    contact: {
      type: 'dir',
      children: {
        'info.txt': {
          type: 'file',
          content: [
            'Email    : for.ritindersingh@gmail.com',
            'GitHub   : github.com/ritinder',
            'LinkedIn : linkedin.com/in/ritinder-singh',
            'Twitter  : @ritinder_dev',
          ].join('\n'),
        },
      },
    },
    blog: {
      type: 'dir',
      children: {
        'coming-soon.txt': {
          type: 'file',
          content: 'Blog is coming soon! Follow github.com/ritinder for updates.',
        },
      },
    },
  },
};

function resolvePath(currentDir: string, target: string): string {
  if (target === '~' || target === '') return '~';
  if (target === '..') {
    const parts = currentDir.split('/').filter(Boolean);
    if (parts.length <= 1) return '~';
    parts.pop();
    return '~/' + parts.slice(1).join('/');
  }
  if (target.startsWith('~/')) return target;
  if (currentDir === '~') return `~/${target}`;
  return `${currentDir}/${target}`;
}

function getNode(path: string): FileSystemNode | null {
  if (path === '~') return FS;
  const parts = path.replace('~/', '').split('/').filter(Boolean);
  let node: FileSystemNode = FS;
  for (const part of parts) {
    if (node.type !== 'dir') return null;
    const child = node.children[part];
    if (!child) return null;
    node = child;
  }
  return node;
}

export const filesystemCommands: CommandDef[] = [
  {
    name: 'ls',
    category: 'Filesystem',
    description: 'List files in current directory',
    appMenuMode: 'terminal',
    handler: (args: string[]): CommandResult => {
      const targetRaw = args[0] || '';
      const currentDir = '~'; // will be overridden by registry
      const target = targetRaw ? resolvePath(currentDir, targetRaw) : currentDir;
      const node = getNode(target);
      if (!node) return `ls: cannot access '${targetRaw}': No such file or directory`;
      if (node.type === 'file') return target.split('/').pop() || target;
      const entries = Object.entries(node.children);
      if (entries.length === 0) return '';
      return entries
        .map(([name, n]) => (n.type === 'dir' ? `\x1b[34m${name}/\x1b[0m` : name))
        .join('  ');
    },
  },
  {
    name: 'cat',
    category: 'Filesystem',
    description: 'Display file contents',
    appMenuMode: 'terminal',
    args: ['<file>'],
    handler: (args: string[]): CommandResult => {
      if (!args[0]) return 'cat: missing operand';
      const path = args[0].startsWith('~/') ? args[0] : `~/${args[0]}`;
      const node = getNode(path);
      if (!node) return `cat: ${args[0]}: No such file or directory`;
      if (node.type === 'dir') return `cat: ${args[0]}: Is a directory`;
      return node.content;
    },
  },
  {
    name: 'pwd',
    category: 'Filesystem',
    description: 'Print working directory',
    appMenuMode: 'terminal',
    handler: (): CommandResult => {
      return '~';
    },
  },
  {
    name: 'cd',
    category: 'Filesystem',
    description: 'Change directory',
    appMenuMode: 'terminal',
    args: ['<dir>'],
    handler: (args: string[]): CommandResult => {
      const target = args[0] || '~';
      const resolved = resolvePath('~', target);
      const node = getNode(resolved);
      if (!node) return `cd: ${target}: No such file or directory`;
      if (node.type === 'file') return `cd: ${target}: Not a directory`;
      return { type: 'CHANGE_DIR', dir: resolved };
    },
  },
  {
    name: 'mkdir',
    category: 'Filesystem',
    description: 'Create a directory (virtual)',
    appMenuMode: 'hidden',
    args: ['<dir>'],
    handler: (args: string[]): CommandResult => {
      if (!args[0]) return 'mkdir: missing operand';
      return `mkdir: cannot create directory '${args[0]}': Read-only filesystem`;
    },
  },
  {
    name: 'rm',
    category: 'Filesystem',
    description: 'Remove files (virtual)',
    appMenuMode: 'hidden',
    args: ['<file>'],
    handler: (args: string[]): CommandResult => {
      if (!args[0]) return 'rm: missing operand';
      return `rm: cannot remove '${args[0]}': Read-only filesystem`;
    },
  },
  {
    name: 'tree',
    category: 'Filesystem',
    description: 'Display directory tree',
    appMenuMode: 'terminal',
    handler: (): CommandResult => {
      return [
        '~',
        '├── about/',
        '│   └── README.md',
        '├── skills/',
        '│   ├── languages.txt',
        '│   ├── backend.txt',
        '│   ├── mobile.txt',
        '│   └── devops.txt',
        '├── projects/',
        '│   ├── quickmart-api.txt',
        '│   ├── taskflow.txt',
        '│   ├── devmetrics.txt',
        '│   └── pybot.txt',
        '├── contact/',
        '│   └── info.txt',
        '└── blog/',
        '    └── coming-soon.txt',
      ].join('\n');
    },
  },
];

// Version with currentDir param for registry use
export function makeLsHandler(currentDir: string) {
  return (args: string[]): CommandResult => {
    const targetRaw = args[0] || '';
    const target = targetRaw ? resolvePath(currentDir, targetRaw) : currentDir;
    const node = getNode(target);
    if (!node) return `ls: cannot access '${targetRaw}': No such file or directory`;
    if (node.type === 'file') return target.split('/').pop() || target;
    const entries = Object.entries(node.children);
    if (entries.length === 0) return '';
    return entries
      .map(([name, n]) => (n.type === 'dir' ? `${name}/` : name))
      .join('  ');
  };
}

export function makeCdHandler(currentDir: string) {
  return (args: string[]): CommandResult => {
    const target = args[0] || '~';
    const resolved = resolvePath(currentDir, target);
    const node = getNode(resolved);
    if (!node) return `cd: ${target}: No such file or directory`;
    if (node.type === 'file') return `cd: ${target}: Not a directory`;
    return { type: 'CHANGE_DIR', dir: resolved };
  };
}

export function makePwdHandler(currentDir: string) {
  return (): CommandResult => currentDir;
}
