import { CommandDef, CommandResult } from './types';

const JOKES = [
  "Why do programmers prefer dark mode?\nBecause light attracts bugs!",
  "How many programmers does it take to change a light bulb?\nNone — that's a hardware problem.",
  "A SQL query walks into a bar, walks up to two tables and asks...\n'Can I join you?'",
  "Why do Python devs wear glasses?\nBecause they can't C#.",
  "There are only 10 types of people in the world:\nThose who understand binary and those who don't.",
  "I would tell you a joke about UDP...\nbut you might not get it.",
  "Why did the developer go broke?\nBecause he used up all his cache.",
  "A programmer's wife says: 'Go to the store and buy a gallon of milk,\nand if they have eggs, buy a dozen.'\nThe programmer comes back with 12 gallons of milk.",
  "Why do backend devs make good friends?\nThey're always there to serve you.",
  "What's a computer's favorite snack?\nMicrochips!",
];

const QUOTES = [
  '"The best code is no code at all." — Jeff Atwood',
  '"Make it work, make it right, make it fast." — Kent Beck',
  '"Programs must be written for people to read, and only incidentally for machines to execute." — SICP',
  '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." — Martin Fowler',
  '"Simplicity is the soul of efficiency." — Austin Freeman',
  '"First, solve the problem. Then, write the code." — John Johnson',
  '"Code is like humor. When you have to explain it, it\'s bad." — Cory House',
  '"In programming, the hard part isn\'t solving problems, but deciding what problems to solve." — Paul Graham',
];

const FORTUNES = [
  'You will find a bug you introduced three months ago. It will be obvious.',
  'A merge conflict approaches. Stay calm, it is only code.',
  'Your next side project will actually get finished. Eventually.',
  'The documentation you write today will confuse future-you.',
  'Rubber duck debugging will save the day.',
  'You are one Stack Overflow answer away from success.',
  'A great refactor is in your future. Followed by a great regression.',
  'The ticket you marked "won\'t fix" will become a critical bug.',
];

export const funCommands: CommandDef[] = [
  {
    name: 'joke',
    category: 'Fun',
    description: 'Tell a random coding joke',
    appMenuMode: 'terminal',
    handler: (): CommandResult => {
      return JOKES[Math.floor(Math.random() * JOKES.length)];
    },
  },
  {
    name: 'quote',
    category: 'Fun',
    description: 'Show an inspirational quote',
    appMenuMode: 'terminal',
    handler: (): CommandResult => {
      return QUOTES[Math.floor(Math.random() * QUOTES.length)];
    },
  },
  {
    name: 'fortune',
    category: 'Fun',
    description: 'Get your fortune',
    appMenuMode: 'terminal',
    handler: (): CommandResult => {
      const fortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
      return [
        '  ╭──────────────────────────────────────────────╮',
        `  │ ${fortune.padEnd(44)} │`,
        '  ╰──────────────────────────────────────────────╯',
      ].join('\n');
    },
  },
  {
    name: 'coffee',
    category: 'Fun',
    description: 'Display ASCII coffee art',
    appMenuMode: 'terminal',
    handler: (): CommandResult => {
      return [
        '',
        '        ) ) )',
        '       ( ( (',
        '     .______.',
        '     |      |]',
        '     \\      /',
        '      `----\'',
        '',
        '  Here is your coffee ☕',
        '  Fuel for the next feature.',
        '',
      ].join('\n');
    },
  },
  {
    name: 'ascii',
    category: 'Fun',
    description: 'Display ASCII art of name',
    appMenuMode: 'terminal',
    handler: (): CommandResult => {
      return [
        '',
        ' ██████╗ ██╗████████╗██╗███╗   ██╗██████╗ ███████╗██████╗ ',
        ' ██╔══██╗██║╚══██╔══╝██║████╗  ██║██╔══██╗██╔════╝██╔══██╗',
        ' ██████╔╝██║   ██║   ██║██╔██╗ ██║██║  ██║█████╗  ██████╔╝',
        ' ██╔══██╗██║   ██║   ██║██║╚██╗██║██║  ██║██╔══╝  ██╔══██╗',
        ' ██║  ██║██║   ██║   ██║██║ ╚████║██████╔╝███████╗██║  ██║',
        ' ╚═╝  ╚═╝╚═╝   ╚═╝   ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚═╝  ╚═╝',
        '',
      ].join('\n');
    },
  },
  {
    name: 'banner',
    category: 'Fun',
    description: 'Display a banner',
    appMenuMode: 'terminal',
    args: ['<text>'],
    handler: (args: string[]): CommandResult => {
      const text = args.join(' ') || 'RITINDER';
      const border = '═'.repeat(text.length + 4);
      return [
        `╔${border}╗`,
        `║  ${text}  ║`,
        `╚${border}╝`,
      ].join('\n');
    },
  },
  {
    name: 'hack',
    category: 'Fun',
    description: 'Initiate hacking sequence (fake)',
    appMenuMode: 'terminal',
    handler: (): CommandResult => {
      return [
        '',
        '  [*] Initializing hack sequence...',
        '  [*] Scanning network topology...',
        '  [+] Found 2,847 open ports',
        '  [*] Bypassing firewall... ████████░░ 80%',
        '  [+] Firewall bypassed',
        '  [*] Injecting payload into mainframe...',
        '  [+] Payload injected successfully',
        '  [*] Accessing root database...',
        '  WARNING: Tripwire detected! Rerouting...',
        '  [+] Rerouted through 7 proxies',
        '  [*] Downloading all files...',
        '  [+] 13.7 GB transferred',
        '  [+] HACK COMPLETE. Just kidding 😄',
        '  [*] I\'m a backend dev, not a hacker.',
        '',
      ].join('\n');
    },
  },
  {
    name: 'matrix',
    category: 'Fun',
    description: 'Enter the Matrix',
    appMenuMode: 'terminal',
    handler: (): CommandResult => {
      return { type: 'MATRIX' };
    },
  },
  {
    name: 'snake',
    category: 'Fun',
    description: 'Play Snake game',
    appMenuMode: 'terminal',
    handler: (): CommandResult => {
      return { type: 'SNAKE' };
    },
  },
  {
    name: 'iam',
    category: 'Fun',
    description: 'Set your display name',
    appMenuMode: 'terminal',
    args: ['<name>'],
    handler: (args: string[]): CommandResult => {
      const name = args.join(' ');
      if (!name) return 'iam: please provide a name. Usage: iam <name>';
      return `Hello, ${name}! Welcome to Ritinder's portfolio terminal.`;
    },
  },
  {
    name: 'sudo',
    category: 'Fun',
    description: 'Run command as superuser',
    appMenuMode: 'hidden',
    args: ['<command>'],
    handler: (args: string[]): CommandResult => {
      const cmd = args.join(' ');
      if (cmd === 'hire me') {
        return [
          '',
          '  ╔════════════════════════════════════════════════════╗',
          '  ║         sudo: HIRE REQUEST GRANTED ✅              ║',
          '  ╠════════════════════════════════════════════════════╣',
          '  ║                                                    ║',
          '  ║  Congratulations! You have root access to hiring   ║',
          '  ║  Ritinder Singh for your team.                     ║',
          '  ║                                                    ║',
          '  ║  Next step: ritinder@example.com                   ║',
          '  ║             linkedin.com/in/ritinder-singh          ║',
          '  ║                                                    ║',
          '  ╚════════════════════════════════════════════════════╝',
          '',
        ].join('\n');
      }
      if (cmd === 'rm -rf /') {
        return [
          '',
          '  [sudo] password for ritinder: ••••••••',
          '  rm: it\'s not possible to remove \'/\': Permission denied',
          '  (Nice try. The portfolio is safe.)',
          '  Besides, I need this job.',
          '',
        ].join('\n');
      }
      return `sudo: ${cmd}: command not found (and you're not root anyway)`;
    },
  },
  {
    name: 'exit',
    category: 'Fun',
    description: 'Exit the terminal (not really)',
    appMenuMode: 'hidden',
    handler: (): CommandResult => {
      return "There is no escape. The terminal is your home now. 🏠";
    },
  },
];
