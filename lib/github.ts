const LANGUAGE_ICONS: Record<string, string> = {
  TypeScript: '🟦',
  JavaScript: '🟨',
  Python: '🐍',
  Rust: '🦀',
  Go: '🐹',
  Java: '☕',
  'C++': '⚙️',
  C: '⚙️',
  'C#': '💜',
  Ruby: '💎',
  Swift: '🍎',
  Kotlin: '🟣',
  Dart: '🎯',
  Shell: '🐚',
  HTML: '🌐',
  CSS: '🎨',
};

interface GithubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  language: string | null;
  fork: boolean;
  archived: boolean;
}

export interface MappedProject {
  title: string;
  description: string;
  icon: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string | null;
}

function toTitleCase(str: string) {
  return str
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function fetchGithubRepos(
  username: string,
  token?: string,
): Promise<MappedProject[]> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
    { headers, next: { revalidate: 0 } },
  );

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  const repos: GithubRepo[] = await res.json();

  return repos
    .filter((r) => !r.fork && !r.archived)
    .map((r) => ({
      title: toTitleCase(r.name),
      description: r.description ?? '',
      icon: LANGUAGE_ICONS[r.language ?? ''] ?? '💻',
      techStack: r.topics,
      githubUrl: r.html_url,
      liveUrl: r.homepage || null,
    }));
}
