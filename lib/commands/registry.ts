import { CommandDef, CommandResult } from './types';
import { portfolioCommands } from './portfolio';
import { filesystemCommands, makeLsHandler, makeCdHandler, makePwdHandler } from './filesystem';
import { utilityCommands } from './utility';
import { funCommands } from './fun';
import levenshtein from 'fast-levenshtein';

export const COMMAND_REGISTRY: CommandDef[] = [
  ...portfolioCommands,
  ...filesystemCommands,
  ...utilityCommands,
  ...funCommands,
];

export const COMMANDS_MAP: Record<string, CommandDef> = {};
for (const cmd of COMMAND_REGISTRY) {
  COMMANDS_MAP[cmd.name] = cmd;
}

// Multi-word command table
const MULTI_WORD_COMMANDS: Record<string, (args: string[], currentDir: string) => CommandResult> = {
  'sudo hire me': () => COMMANDS_MAP['sudo'].handler(['hire', 'me']),
  'sudo rm -rf /': () => COMMANDS_MAP['sudo'].handler(['rm', '-rf', '/']),
};

export function processInput(input: string, currentDir: string): CommandResult {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Check multi-word commands first
  const lowerTrimmed = trimmed.toLowerCase();
  for (const [key, handler] of Object.entries(MULTI_WORD_COMMANDS)) {
    if (lowerTrimmed === key) {
      return handler([], currentDir);
    }
  }

  const parts = trimmed.split(/\s+/);
  const name = parts[0].toLowerCase();
  const args = parts.slice(1);

  // Handle commands that need currentDir
  if (name === 'ls') return makeLsHandler(currentDir)(args);
  if (name === 'cd') return makeCdHandler(currentDir)(args);
  if (name === 'pwd') return makePwdHandler(currentDir)();

  // Handle help specially
  if (name === 'help') {
    return buildHelp();
  }

  // Handle man specially
  if (name === 'man') {
    const target = args[0];
    if (!target) return 'man: what manual page do you want?';
    const cmd = COMMANDS_MAP[target];
    if (!cmd) return `man: no manual entry for '${target}'`;
    return [
      `NAME`,
      `    ${cmd.name} — ${cmd.description}`,
      ``,
      `SYNOPSIS`,
      `    ${cmd.name}${cmd.args ? ' ' + cmd.args.join(' ') : ''}`,
      ``,
      `CATEGORY`,
      `    ${cmd.category}`,
    ].join('\n');
  }

  const cmdDef = COMMANDS_MAP[name];
  if (!cmdDef) {
    // Suggest closest command (Homebrew-style)
    const allNames = Object.keys(COMMANDS_MAP);
    let bestMatch = '';
    let bestDist = Infinity;
    for (const candidate of allNames) {
      const dist = levenshtein.get(name, candidate);
      if (dist < bestDist) { bestDist = dist; bestMatch = candidate; }
    }
    const suggestion = bestDist <= 3 ? `\nDid you mean '${bestMatch}'?` : '';
    return `Command not found: ${name}. Type 'help' for a list of commands.${suggestion}`;
  }

  return cmdDef.handler(args);
}

function buildHelp(): string {
  const categories: Record<string, CommandDef[]> = {
    Portfolio: [],
    Filesystem: [],
    Utility: [],
    Fun: [],
  };

  for (const cmd of COMMAND_REGISTRY) {
    if (cmd.appMenuMode !== 'hidden') {
      categories[cmd.category]?.push(cmd);
    }
  }

  const lines: string[] = [
    '',
    '  ╔══════════════════════════════════════════════════════╗',
    '  ║              AVAILABLE COMMANDS                     ║',
    '  ╚══════════════════════════════════════════════════════╝',
    '',
  ];

  for (const [cat, cmds] of Object.entries(categories)) {
    if (cmds.length === 0) continue;
    lines.push(`  ${cat.toUpperCase()}`);
    lines.push('  ' + '─'.repeat(48));
    for (const cmd of cmds) {
      const padded = cmd.name.padEnd(16);
      lines.push(`  ${padded} ${cmd.description}`);
    }
    lines.push('');
  }

  lines.push("  Type 'man <command>' for detailed usage.");
  lines.push('');

  return lines.join('\n');
}
