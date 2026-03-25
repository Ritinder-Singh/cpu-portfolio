export function getCompletions(partial: string, commandNames: string[]): string[] {
  if (!partial) return [];
  return commandNames.filter(name => name.startsWith(partial.toLowerCase()));
}

export function completeInput(input: string, commandNames: string[]): string {
  const parts = input.split(' ');
  const partial = parts[parts.length - 1];
  const completions = getCompletions(partial, commandNames);

  if (completions.length === 0) return input;
  if (completions.length === 1) {
    parts[parts.length - 1] = completions[0];
    return parts.join(' ');
  }

  // Find longest common prefix
  let prefix = completions[0];
  for (const c of completions.slice(1)) {
    let i = 0;
    while (i < prefix.length && i < c.length && prefix[i] === c[i]) i++;
    prefix = prefix.slice(0, i);
  }

  if (prefix.length > partial.length) {
    parts[parts.length - 1] = prefix;
    return parts.join(' ');
  }

  return input;
}
