import { CommandDef, CommandResult } from './types';
import { ThemeName } from '../types';

const THEME_NAMES: ThemeName[] = ['dracula', 'tokyo', 'catppuccin', 'nord', 'green', 'amber'];

const BOX = {
  tl: '╔', tr: '╗', bl: '╚', br: '╝',
  h: '═', v: '║',
  ml: '╠', mr: '╣',
};

function box(title: string, lines: string[]): string {
  const maxLen = Math.max(title.length + 4, ...lines.map(l => l.length + 4));
  const width = maxLen;
  const hr = BOX.h.repeat(width - 2);
  const top = `${BOX.tl}${hr}${BOX.tr}`;
  const mid = `${BOX.ml}${hr}${BOX.mr}`;
  const bot = `${BOX.bl}${hr}${BOX.br}`;
  const titleLine = `${BOX.v} ${title.padEnd(width - 3)} ${BOX.v}`;
  const bodyLines = lines.map(l => `${BOX.v} ${l.padEnd(width - 3)} ${BOX.v}`);
  return [top, titleLine, mid, ...bodyLines, bot].join('\n');
}

function stripProtocol(url: string): string {
  return url.replace(/^https?:\/\//, '');
}

async function fetchConfig(): Promise<Record<string, string>> {
  try {
    const res = await fetch('/api/content/config');
    if (!res.ok) return {};
    return res.json();
  } catch {
    return {};
  }
}

export const portfolioCommands: CommandDef[] = [
  {
    name: 'whoami',
    category: 'Portfolio',
    description: 'Display current user info. Use -v for verbose.',
    appMenuMode: 'terminal',
    handler: async (args: string[]): Promise<string> => {
      const cfg = await fetchConfig();
      const name = cfg.name || 'Ritinder Singh';
      const tagline = cfg.tagline || '';
      const location = cfg.location || '';
      const email = cfg.email || '';
      const github = cfg.github ? stripProtocol(cfg.github) : '';
      const linkedin = cfg.linkedin ? stripProtocol(cfg.linkedin) : '';

      if (args.includes('-v')) {
        return box('USER PROFILE', [
          `Name     : ${name}`,
          `Handle   : ${name.split(' ')[0].toLowerCase()}`,
          `Role     : ${tagline}`,
          `Location : ${location}`,
          `Email    : ${email}`,
          `GitHub   : ${github}`,
          `LinkedIn : ${linkedin}`,
        ]);
      }
      return name.split(' ')[0].toLowerCase();
    },
  },
  {
    name: 'about',
    category: 'Portfolio',
    description: 'Learn about Ritinder Singh',
    appMenuMode: 'gui',
    guiWindowType: 'about',
    handler: async (): Promise<string> => {
      const cfg = await fetchConfig();
      const name = cfg.name || 'Ritinder Singh';
      const tagline = cfg.tagline || '';
      const location = cfg.location || '';
      const bio = cfg.bio || '';

      const bioLines = bio.match(/.{1,52}/g) || [bio];

      return [
        '',
        `  ╔══════════════════════════════════════════════════════╗`,
        `  ║              ABOUT ${name.toUpperCase().padEnd(34)}║`,
        `  ╚══════════════════════════════════════════════════════╝`,
        '',
        `  Name     : ${name}`,
        `  Role     : ${tagline}`,
        `  Location : ${location}`,
        '',
        '  Bio:',
        '  ─────────────────────────────────────────────────────',
        ...bioLines.map(l => `  ${l}`),
        '  ─────────────────────────────────────────────────────',
        '',
        '  Type "skills" to see my tech stack.',
        '  Type "projects" to see what I\'ve built.',
        '',
      ].join('\n');
    },
  },
  {
    name: 'skills',
    category: 'Portfolio',
    description: 'View technical skills and stack',
    appMenuMode: 'gui',
    guiWindowType: 'skills',
    handler: async (): Promise<string> => {
      try {
        const res = await fetch('/api/content/skills');
        if (!res.ok) throw new Error();
        const skills: { category: string; name: string }[] = await res.json();

        const grouped: Record<string, string[]> = {};
        for (const skill of skills) {
          if (!grouped[skill.category]) grouped[skill.category] = [];
          grouped[skill.category].push(skill.name);
        }

        const lines: string[] = [
          '',
          '  ╔══════════════════════════════════════════════════════╗',
          '  ║                  TECHNICAL SKILLS                   ║',
          '  ╚══════════════════════════════════════════════════════╝',
          '',
        ];

        for (const [category, names] of Object.entries(grouped)) {
          lines.push(`  ${category}`);
          lines.push(`  ${'─'.repeat(category.length)}`);
          lines.push(`  ${names.join(' · ')}`);
          lines.push('');
        }

        return lines.join('\n');
      } catch {
        return 'Error loading skills. Please try again.';
      }
    },
  },
  {
    name: 'projects',
    category: 'Portfolio',
    description: 'View portfolio projects',
    appMenuMode: 'gui',
    guiWindowType: 'projects',
    handler: async (): Promise<string> => {
      try {
        const res = await fetch('/api/content/projects');
        if (!res.ok) throw new Error();
        const projects: { title: string; description: string; techStack: string[]; githubUrl?: string; icon?: string }[] = await res.json();

        if (projects.length === 0) return 'No projects found.';

        const lines: string[] = [
          '',
          '  ╔══════════════════════════════════════════════════════╗',
          '  ║                 PORTFOLIO PROJECTS                  ║',
          '  ╚══════════════════════════════════════════════════════╝',
          '',
        ];

        projects.forEach((p, i) => {
          lines.push(`  [${i + 1}] ${p.title}`);
          lines.push(`  ${'─'.repeat(p.title.length + 4)}`);
          lines.push(`  ${p.description}`);
          if (p.techStack?.length) lines.push(`  Tech: ${p.techStack.join(' · ')}`);
          if (p.githubUrl) lines.push(`  → ${stripProtocol(p.githubUrl)}`);
          lines.push('');
        });

        return lines.join('\n');
      } catch {
        return 'Error loading projects. Please try again.';
      }
    },
  },
  {
    name: 'contact',
    category: 'Portfolio',
    description: 'Get contact information',
    appMenuMode: 'gui',
    guiWindowType: 'contact',
    handler: async (): Promise<string> => {
      const cfg = await fetchConfig();
      const email = cfg.email || '';
      const github = cfg.github ? stripProtocol(cfg.github) : '';
      const linkedin = cfg.linkedin ? stripProtocol(cfg.linkedin) : '';
      const twitter = cfg.twitter ? stripProtocol(cfg.twitter) : '';

      return [
        '',
        '  ╔══════════════════════════════════════════════════════╗',
        '  ║                  CONTACT INFO                       ║',
        '  ╚══════════════════════════════════════════════════════╝',
        '',
        `  Email    : ${email}`,
        `  GitHub   : ${github}`,
        `  LinkedIn : ${linkedin}`,
        twitter ? `  Twitter  : ${twitter}` : '',
        '',
        '  I\'m always open to interesting projects and',
        '  conversations. Don\'t hesitate to reach out!',
        '',
      ].filter(l => l !== undefined).join('\n');
    },
  },
  {
    name: 'achievements',
    category: 'Portfolio',
    description: 'View achievements and certifications',
    appMenuMode: 'gui',
    guiWindowType: 'achievements',
    handler: async (): Promise<string> => {
      try {
        const res = await fetch('/api/content/achievements');
        if (!res.ok) throw new Error();
        const achievements: { icon: string; title: string; date: string; description: string }[] = await res.json();

        if (achievements.length === 0) return 'No achievements found.';

        const lines: string[] = [
          '',
          '  ╔══════════════════════════════════════════════════════╗',
          '  ║                   ACHIEVEMENTS                      ║',
          '  ╚══════════════════════════════════════════════════════╝',
          '',
        ];

        for (const a of achievements) {
          lines.push(`  ${a.icon} ${a.title}`);
          lines.push(`     ${a.description}`);
          lines.push(`     Year: ${a.date}`);
          lines.push('');
        }

        return lines.join('\n');
      } catch {
        return 'Error loading achievements. Please try again.';
      }
    },
  },
  {
    name: 'availability',
    category: 'Portfolio',
    description: 'Check current availability for work',
    appMenuMode: 'terminal',
    handler: async (): Promise<string> => {
      const cfg = await fetchConfig();
      const avail = cfg.availability ? JSON.parse(cfg.availability) : null;

      const status = avail?.status || 'OPEN TO OPPORTUNITIES';
      const looking = avail?.looking || '';
      const preference = avail?.preference || '';
      const notice = avail?.notice || '';
      const email = cfg.email || '';

      return [
        '',
        `  ┌─────────────────────────────────────────────────┐`,
        `  │  STATUS: ${status.padEnd(39)}│`,
        `  └─────────────────────────────────────────────────┘`,
        '',
        looking ? `  Looking for: ${looking}` : '',
        preference ? `  Preference : ${preference}` : '',
        notice ? `  Notice     : ${notice}` : '',
        '',
        email ? `  Interested? → ${email}` : '',
        '',
      ].filter(l => l !== undefined).join('\n');
    },
  },
  {
    name: 'now',
    category: 'Portfolio',
    description: 'What Ritinder is currently working on',
    appMenuMode: 'terminal',
    handler: async (): Promise<string> => {
      const cfg = await fetchConfig();
      const items: string[] = cfg.nowItems ? JSON.parse(cfg.nowItems) : [];
      const updated = cfg.nowUpdated || '';

      return [
        '',
        '  ╔══════════════════════════════════════════════╗',
        '  ║            CURRENTLY WORKING ON              ║',
        '  ╚══════════════════════════════════════════════╝',
        '',
        ...items.map(item => `  → ${item}`),
        '',
        updated ? `  Last updated: ${updated}` : '',
        '',
      ].filter(l => l !== undefined).join('\n');
    },
  },
  {
    name: 'testimonials',
    category: 'Portfolio',
    description: 'Read what people say about Ritinder',
    appMenuMode: 'terminal',
    handler: async (): Promise<string> => {
      const cfg = await fetchConfig();
      const testimonials: { quote: string; author: string; role: string }[] = cfg.testimonials
        ? JSON.parse(cfg.testimonials)
        : [];

      if (testimonials.length === 0) return 'No testimonials found.';

      const lines: string[] = [
        '',
        '  ╔══════════════════════════════════════════════════════╗',
        '  ║                   TESTIMONIALS                      ║',
        '  ╚══════════════════════════════════════════════════════╝',
        '',
      ];

      for (const t of testimonials) {
        const quoteLines = t.quote.match(/.{1,52}/g) || [t.quote];
        lines.push(`  "${quoteLines[0]}`);
        for (let i = 1; i < quoteLines.length; i++) {
          lines.push(`   ${quoteLines[i]}`);
        }
        lines.push(`  "${''}`);
        lines.push(`                            — ${t.author}, ${t.role}`);
        lines.push('');
      }

      return lines.join('\n');
    },
  },
  {
    name: 'resume',
    category: 'Portfolio',
    description: 'View or download resume',
    appMenuMode: 'gui',
    guiWindowType: 'resume',
    handler: async (): Promise<string> => {
      const cfg = await fetchConfig();
      const resumeUrl = cfg.resumeUrl || '/resume.pdf';
      const tagline = cfg.tagline || '';

      return [
        '',
        '  ┌─────────────────────────────────────────────────┐',
        `  │  RESUME — ${(cfg.name || 'Ritinder Singh').padEnd(37)}│`,
        '  └─────────────────────────────────────────────────┘',
        '',
        `  Download: ${resumeUrl}`,
        '  Or open the Resume window for the full view.',
        '',
        tagline ? `  ${tagline}` : '',
        '',
      ].filter(l => l !== undefined).join('\n');
    },
  },
  {
    name: 'blog',
    category: 'Portfolio',
    description: 'Read blog posts',
    appMenuMode: 'gui',
    guiWindowType: 'blog',
    handler: async (): Promise<string> => {
      try {
        const res = await fetch('/api/content/blog');
        if (!res.ok) throw new Error();
        const posts: { title: string; excerpt?: string; publishedAt?: string }[] = await res.json();

        const lines: string[] = [
          '',
          '  ╔══════════════════════════════════════════════════════╗',
          '  ║                    BLOG POSTS                       ║',
          '  ╚══════════════════════════════════════════════════════╝',
          '',
        ];

        if (posts.length === 0) {
          lines.push('  No posts published yet. Stay tuned!');
          lines.push('');
        } else {
          posts.forEach((p, i) => {
            lines.push(`  [${i + 1}] "${p.title}"`);
            if (p.excerpt) lines.push(`      ${p.excerpt}`);
            lines.push('');
          });
        }

        return lines.join('\n');
      } catch {
        return 'Error loading blog posts. Please try again.';
      }
    },
  },
  {
    name: 'date',
    category: 'Portfolio',
    description: 'Display current date',
    appMenuMode: 'terminal',
    handler: (): CommandResult => {
      return new Date().toDateString();
    },
  },
  {
    name: 'time',
    category: 'Portfolio',
    description: 'Display current time',
    appMenuMode: 'terminal',
    handler: (): CommandResult => {
      return new Date().toLocaleTimeString();
    },
  },
  {
    name: 'open',
    category: 'Portfolio',
    description: 'Open URL shortcuts (github, linkedin, resume)',
    appMenuMode: 'terminal',
    args: ['<target>'],
    handler: async (args: string[]): Promise<string> => {
      const cfg = await fetchConfig();
      const urls: Record<string, string> = {
        github: cfg.github || '',
        linkedin: cfg.linkedin || '',
        resume: cfg.resumeUrl || '/resume.pdf',
        email: cfg.email ? `mailto:${cfg.email}` : '',
        twitter: cfg.twitter || '',
      };

      const validUrls = Object.fromEntries(Object.entries(urls).filter(([, v]) => v));
      const target = (args[0] || '').toLowerCase();

      if (!target) {
        return [
          'open: opens a URL or shortcut',
          '',
          'Shortcuts: ' + Object.keys(validUrls).join(', '),
          '',
          'Usage: open <shortcut>',
        ].join('\n');
      }

      const url = validUrls[target];
      if (!url) return `open: unknown target '${target}'. Try: ${Object.keys(validUrls).join(', ')}`;
      if (typeof window !== 'undefined') {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
      return `Opening ${url} ...`;
    },
  },
  {
    name: 'clear',
    category: 'Portfolio',
    description: 'Clear terminal screen',
    appMenuMode: 'terminal',
    handler: (): CommandResult => {
      return { type: 'CLEAR' };
    },
  },
  {
    name: 'history',
    category: 'Portfolio',
    description: 'Show command history',
    appMenuMode: 'terminal',
    handler: (): CommandResult => {
      return '__HISTORY__';
    },
  },
  {
    name: 'theme',
    category: 'Portfolio',
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
];
