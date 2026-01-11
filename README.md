# Ralph Next.js Demo

A note-taking application built autonomously by **Ralph** - an AI coding loop for Claude Code.

## What is Ralph?

Ralph is a multi-agent system that runs Claude Code (Opus) repeatedly until all tasks are complete. It uses three specialized agents:

### Agents

| Agent | Role | Responsibilities |
|-------|------|------------------|
| 📋 **Product Manager** | Manages backlog | Writes stories, sets priorities, marks stories "ready" |
| 💻 **Developer** | Implements features | Writes code, runs typecheck, commits changes |
| 🧪 **Tester** | Verifies quality | Tests acceptance criteria, marks stories pass/fail |

### Workflow

Each cycle runs all three agents in sequence:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Product Manager │ → │    Developer    │ → │     Tester      │
│  (prepare work)  │    │  (implement)    │    │   (verify)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ↑                                              │
         └──────────────── (next cycle) ────────────────┘
```

### Story Status Flow

```
pending → ready → in_progress → testing → done
              ↑                      |
              └──── (if fails) ──────┘
```

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** SQLite + Drizzle ORM
- **Styling:** Tailwind CSS
- **Testing:** Vitest + Playwright

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Running Ralph

To let Ralph build features autonomously:

```bash
# Make ralph.sh executable (if not already)
chmod +x scripts/ralph/ralph.sh

# Run Ralph with max 25 iterations
./scripts/ralph/ralph.sh 25
```

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run typecheck    # TypeScript check
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests
npm run db:generate  # Generate Drizzle migrations
npm run db:migrate   # Apply migrations
```

## Project Structure

```
├── src/
│   ├── app/           # Next.js App Router
│   ├── db/            # Database schema and connection
│   └── test/          # Test setup
├── e2e/               # Playwright E2E tests
├── scripts/ralph/     # Ralph automation scripts
│   ├── ralph.sh       # Main orchestration loop
│   ├── agents/        # Specialized agent prompts
│   │   ├── developer.md
│   │   ├── tester.md
│   │   └── product-manager.md
│   ├── prd.json       # Task list with status
│   └── progress.txt   # Learnings log
└── data/              # SQLite database (gitignored)
```

## User Stories

See `scripts/ralph/prd.json` for the full list of features Ralph will implement:

1. Database schema for notes
2. CRUD APIs (create, list, update, delete)
3. Note card component with colors
4. Notes grid layout
5. Create note form
6. Edit note modal
7. Pin/unpin functionality
8. Archive functionality
9. Search notes
10. Delete confirmation
11. E2E tests
12. Polish and responsive design

## License

MIT
