import { getFilesystemCompletions } from '@/lib/commands/filesystem';

const FS_COMMANDS = new Set(['cat', 'ls', 'cd']);

export function getCompletions(partial: string, commandNames: string[]): string[] {
  if (!partial) return [];
  return commandNames.filter(name => name.startsWith(partial.toLowerCase()));
}

function applyLongestPrefix(partial: string, completions: string[]): string | null {
  if (completions.length === 0) return null;
  if (completions.length === 1) return completions[0];

  let prefix = completions[0];
  for (const c of completions.slice(1)) {
    let i = 0;
    while (i < prefix.length && i < c.length && prefix[i] === c[i]) i++;
    prefix = prefix.slice(0, i);
  }

  return prefix.length > partial.length ? prefix : null;
}

export function completeInput(input: string, commandNames: string[], currentDir: string = '~'): string {
  const parts = input.split(' ');
  const partial = parts[parts.length - 1];

  // Complete filesystem paths when typing arguments to fs commands
  if (parts.length > 1 && FS_COMMANDS.has(parts[0].toLowerCase())) {
    const completions = getFilesystemCompletions(partial, currentDir);
    const completed = applyLongestPrefix(partial, completions);
    if (completed !== null) {
      parts[parts.length - 1] = completed;
      return parts.join(' ');
    }
    return input;
  }

  // Complete command names
  const completions = getCompletions(partial, commandNames);
  const completed = applyLongestPrefix(partial, completions);
  if (completed !== null) {
    parts[parts.length - 1] = completed;
    return parts.join(' ');
  }

  return input;
}
