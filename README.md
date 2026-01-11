# Ralph Next.js Demo

A note-taking application built autonomously by **Ralph** - an AI coding loop for Claude Code.

## What is Ralph?

Ralph is an autonomous coding loop that runs Claude Code repeatedly until all tasks are complete. It reads a PRD (Product Requirements Document) with user stories, implements them one by one, and commits each completed feature.

### How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                        Ralph Loop                               │
├─────────────────────────────────────────────────────────────────┤
│  1. Read prd.json → Find highest priority story (passes: false) │
│  2. Read progress.txt → Understand codebase patterns            │
│  3. Implement the story                                         │
│  4. Run typecheck + tests                                       │
│  5. Commit changes                                              │
│  6. Mark story as passes: true                                  │
│  7. Log learnings to progress.txt                               │
│  8. Repeat until all stories pass                               │
└─────────────────────────────────────────────────────────────────┘
```

### Stuck Handling

Ralph tracks `failedAttempts` per story. After 3 failures:
- Documents the blocker
- Marks story as BLOCKED
- Moves to next story
- Exits with `<ralph>STUCK</ralph>` if all stories blocked

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** SQLite + Drizzle ORM
- **Styling:** Tailwind CSS
- **Testing:** Vitest + Playwright

## Features Built by Ralph

Ralph autonomously implemented **20 user stories** in 20 iterations:

### Core Features (US-001 to US-015)
1. Database schema for notes
2. API: Create note
3. API: List notes
4. API: Update note
5. API: Delete note
6. Note card component with colors
7. Notes grid layout (responsive)
8. Create note form (expandable)
9. Edit note modal
10. Pin/unpin functionality
11. Archive functionality
12. Search notes (debounced)
13. Delete with confirmation
14. E2E test: Create and view note
15. Polish and responsive design

### Checklist Feature (US-016 to US-020)
16. Database schema for checklist items
17. API support for checklist notes
18. Checklist display in NoteCard
19. Create checklist note (toggle mode)
20. Edit checklist in modal

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

Ralph will:
- Pick stories in priority order
- Implement and test each one
- Commit with `feat: [ID] - [Title]`
- Exit when all stories pass (or get stuck)

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
│   ├── app/           # Next.js App Router (pages, API routes)
│   ├── components/    # React components
│   └── db/            # Database schema and connection
├── e2e/               # Playwright E2E tests
├── scripts/ralph/     # Ralph automation
│   ├── ralph.sh       # Main loop script
│   ├── prompt.md      # Agent instructions
│   ├── prd.json       # User stories with status
│   └── progress.txt   # Accumulated learnings
├── drizzle/           # Database migrations
└── data/              # SQLite database (gitignored)
```

## License

MIT
