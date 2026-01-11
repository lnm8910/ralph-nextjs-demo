# Project Context - Resume Here

## Quick Summary

Building a note-taking app using **Ralph** - a multi-agent autonomous coding loop for Claude Code.

## GitHub Repo

https://github.com/lnm8910/ralph-nextjs-demo

## What's Done

1. ✅ Created GitHub repo
2. ✅ Bootstrapped Next.js 16 + SQLite + Tailwind + Vitest + Playwright
3. ✅ Set up Ralph scripts with 15 user stories
4. ✅ Created 3 Claude Code agents in `~/.claude/agents/`:
   - `developer.md` - Implements features
   - `tester.md` - Verifies acceptance criteria
   - `product-manager.md` - Manages backlog

## What's Remaining

1. ⏳ Run Ralph to build the app
2. ⏳ Review and fix any issues
3. ⏳ Write article with setup guide + walkthrough
4. ⏳ Push final code and article

## To Run Ralph

```bash
cd /Users/lalitmishra/Workspace/ralph-nextjs-demo
./scripts/ralph/ralph.sh 25
```

## Key Files

- `scripts/ralph/ralph.sh` - Multi-agent orchestration (PM → Developer → Tester)
- `scripts/ralph/prd.json` - 15 user stories with status tracking
- `scripts/ralph/agents/` - Agent prompts for Ralph loop
- `~/.claude/agents/` - Claude Code agents (developer, tester, product-manager)

## Tech Stack

- Next.js 16 (App Router)
- SQLite + Drizzle ORM
- Tailwind CSS
- Vitest + Playwright
- Claude Opus for agents

## Article Plan

Located at: `/Users/lalitmishra/Workspace/the-engineers-lens/plans/ralph-nextjs-demo-plan.md`

Article will cover:
- Setup guide
- Results with screenshots
- Walkthrough of Ralph in action
