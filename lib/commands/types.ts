import { WindowType } from '../types';

export type CommandCategory = 'Portfolio' | 'Filesystem' | 'Utility' | 'Fun';

export type CommandResult =
  | string
  | Promise<string>
  | { type: 'CLEAR' }
  | { type: 'MATRIX' }
  | { type: 'SNAKE' }
  | { type: 'THEME'; name: string }
  | { type: 'OPEN_WINDOW'; windowType: WindowType; title: string; meta?: Record<string, unknown> }
  | { type: 'CHANGE_DIR'; dir: string }
  | null;

export interface CommandDef {
  name: string;
  category: CommandCategory;
  description: string;
  handler: (args: string[]) => CommandResult;
  appMenuMode: 'terminal' | 'gui' | 'hidden';
  guiWindowType?: WindowType;
  args?: string[];
}
