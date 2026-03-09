# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Next.js)
npm run build    # Production build
npm run lint     # Run ESLint
```

No test suite is configured.

## Architecture

This is a **CPU/terminal-style desktop portfolio** — a Next.js app that renders a fake OS desktop with draggable windows, a taskbar, and a functional terminal emulator.

### Layer structure (`components/desktop/Desktop.tsx`)
```
Desktop
├── Wallpaper          — themed background
├── DesktopIconGrid    — clickable icons that open windows
├── WindowManager      — renders all open, non-minimized windows
└── Taskbar            — bottom bar with clock, theme picker, open-window buttons
```

### State management
All window and theme state lives in `context/DesktopContext.tsx` (React Context + `useReducer`). The reducer is in `context/desktopReducer.ts`.

- **Actions**: `OPEN_WINDOW`, `CLOSE_WINDOW`, `FOCUS_WINDOW`, `MINIMIZE_WINDOW`, `MAXIMIZE_WINDOW`, `RESTORE_WINDOW`, `MOVE_WINDOW`, `RESIZE_WINDOW`, `SET_THEME`
- **`useDesktop()`** — the hook every component uses to read state and dispatch
- `executeInTerminal(cmd)` — opens the terminal window and runs a command programmatically; uses `terminalExecuteRef` (a mutable ref) to bridge context → terminal hook

### Window system
- `lib/types.ts` defines `WindowState`, `DesktopState`, `WindowType`, and `DesktopAction`
- `WindowType` values: `terminal | about | skills | projects | contact | resume | blog | app-menu | achievements`
- `WindowManager` switches on `windowState.type` to render the appropriate content component from `components/windows/content/`
- Windows are identified by `id`; re-opening an existing id just focuses/unminimizes it

### Terminal command system
Commands are defined in `lib/commands/` split by category:
- `portfolio.ts` — about, skills, projects, contact, resume, etc.
- `filesystem.ts` — `ls`, `cd`, `pwd` with a virtual directory tree
- `utility.ts` — clear, history, theme, echo, etc.
- `fun.ts` — matrix, snake, etc.
- `registry.ts` — combines all into `COMMAND_REGISTRY` and exports `processInput(input, currentDir)`

**To add a command**: add a `CommandDef` object to the appropriate category file. It auto-registers via the spread in `registry.ts`.

**`CommandResult` type** (discriminated union in `lib/commands/types.ts`):
- `string` / `Promise<string>` — text output
- `{ type: 'CLEAR' | 'MATRIX' | 'SNAKE' }` — side effects
- `{ type: 'THEME'; name: string }` — switch global theme
- `{ type: 'OPEN_WINDOW'; windowType, title, meta? }` — open a window
- `{ type: 'CHANGE_DIR'; dir }` — navigate virtual filesystem
- `null` — no output

The `useTerminal` hook (`components/terminal/useTerminal.ts`) handles terminal state: line history, command history (persisted to `localStorage`), tab completion, and dispatching `CommandResult` side effects.

### Theming
Six themes defined in `lib/themes.ts`: `dracula`, `tokyo`, `catppuccin`, `nord`, `green`, `amber`. The active theme is stored in `DesktopState.activeTheme` and also mirrored to `localStorage`. Theme objects are passed as props from `Desktop` down through `WindowManager` into each content window component.
