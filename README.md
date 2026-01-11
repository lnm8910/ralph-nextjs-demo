# Ralph Next.js Demo

A note-taking application built autonomously by **Ralph** - an AI coding loop for Claude Code.

## What is Ralph?

Ralph is a bash loop that runs Claude Code repeatedly until all tasks are complete. Each iteration:

1. Claude reads the task list (`prd.json`)
2. Picks the highest priority incomplete story
3. Implements it
4. Runs typecheck + tests
5. Commits if passing
6. Marks story done
7. Logs learnings
8. Loop repeats

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
│   ├── ralph.sh       # Main loop script
│   ├── prompt.md      # Agent instructions
│   ├── prd.json       # Task list
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
