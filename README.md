# CPU Portfolio

A terminal-style desktop portfolio built with Next.js. It renders a fake OS desktop with draggable windows, a taskbar, and a fully functional terminal emulator — all themed after popular dev color schemes.

## Features

- **Terminal emulator** — run commands, navigate a virtual filesystem, tab-complete, and scroll command history
- **Windowed UI** — open, close, minimize, maximize, and drag windows like a real desktop
- **6 themes** — Dracula, Tokyo Night, Catppuccin, Nord, Matrix Green, Amber
- **Portfolio content** — About, Skills, Projects, Resume, Contact, Blog, and Achievements windows
- **Easter eggs** — `sudo hire me`, `matrix`, `snake`, and more

## Tech Stack

- **Framework**: Next.js 16 / React 19
- **Language**: TypeScript
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: NextAuth v5 (Auth.js)
- **Email**: Resend
- **Charting**: Recharts
- **Containerization**: Docker + Docker Compose

## Getting Started

### Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### With Docker (includes Postgres)

```bash
docker compose up
```

App runs on [http://localhost:3001](http://localhost:3001). The `migrate` service runs `prisma db push` and seeds the database automatically.

### Database commands

```bash
npm run db:generate   # Regenerate Prisma client
npm run db:migrate    # Apply migrations
npm run db:seed       # Seed the database
npm run db:studio     # Open Prisma Studio
```

## Terminal Commands

| Command       | Description                              |
|---------------|------------------------------------------|
| `help`        | List all available commands              |
| `man <cmd>`   | Show manual entry for a command          |
| `whoami`      | Display user info (`-v` for verbose)     |
| `about`       | Open the About window                    |
| `skills`      | Open the Skills window                   |
| `projects`    | Open the Projects window                 |
| `resume`      | Open the Resume window                   |
| `contact`     | Open the Contact window                  |
| `blog`        | Open the Blog window                     |
| `ls` / `cd` / `pwd` | Navigate the virtual filesystem   |
| `theme <name>`| Switch theme (dracula, tokyo, catppuccin, nord, green, amber) |
| `clear`       | Clear the terminal                       |
| `history`     | Show command history                     |
| `matrix`      | You know what this does                  |
| `snake`       | Play Snake in the terminal               |
| `sudo hire me`| Make an offer                            |

Type `help` in the terminal for the full list.

## Adding a Terminal Command

Add a `CommandDef` object to the appropriate file in `lib/commands/`:

```ts
// lib/commands/portfolio.ts (or utility.ts, fun.ts, filesystem.ts)
{
  name: 'mycommand',
  category: 'Portfolio',       // Portfolio | Filesystem | Utility | Fun
  description: 'Does something cool',
  appMenuMode: 'terminal',     // 'terminal' | 'gui' | 'hidden'
  handler: (args): CommandResult => {
    return 'Hello from mycommand';
  },
}
```

It auto-registers via the spread in `lib/commands/registry.ts`.

## Architecture

```
Desktop
├── Wallpaper           — themed background
├── DesktopIconGrid     — icons that open windows
├── WindowManager       — renders all open windows (switches on WindowType)
└── Taskbar             — clock, theme picker, open-window buttons
```

All window and theme state lives in `context/DesktopContext.tsx` (React Context + `useReducer`). The reducer is in `context/desktopReducer.ts`.

**Window types**: `terminal | about | skills | projects | contact | resume | blog | app-menu | achievements`

## Environment Variables

Create a `.env.local` (or `.env.test` for Docker) with:

```env
DATABASE_URL=
NEXTAUTH_SECRET=
RESEND_API_KEY=
```
