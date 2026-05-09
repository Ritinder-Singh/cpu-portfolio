export type WallpaperName = 'linux' | 'hacker';

export const WALLPAPERS: Record<WallpaperName, { name: string; description: string; emoji: string }> = {
  linux: {
    name: 'Linux Terminal',
    description: 'htop, git log, neofetch, dmesg, ls -la — feels like home.',
    emoji: '🐧',
  },
  hacker: {
    name: 'Hacker',
    description: 'Binary trees, hex dumps, network graphs, PCB traces.',
    emoji: '💾',
  },
};

export const DEFAULT_WALLPAPER: WallpaperName = 'linux';
