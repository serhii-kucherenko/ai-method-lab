# Phase 3 Research: Studio UI

**Depth:** Level 1 (existing Phase 2 APIs + DESIGN/PAGE-SPECS; no new external services)

## Standard stack

- Next.js App Router pages under `projects/commitment-coverage-studio/src/app/`
- Tailwind + existing DESIGN CSS variables; shadcn Button already present — add Input/Table/Select/Badge as needed
- Bearer domain APIs from Phase 2 (`requireBearer`, `DEMO_BEARER_TOKEN`)
- Tests: `tsx --test` (no Vitest required)

## Architecture patterns

| Layer | Responsibility |
|-------|----------------|
| `components/studio-shell.tsx` | Primary domain nav (D-01) + page chrome |
| `lib/api.ts` | Fetch helper + Bearer (D-03) |
| `app/<route>/page.tsx` | Filters, empty/error, tables — call APIs only |
| `services/*` + `api/*` | Unchanged except new `scoreboard` (+ optional renewals list) |

## Don't hand-roll

- Scoring in the UI — call coverage/gaps/compares APIs
- Desk-shell nav labels (UI-03)
- Fake KPI museums on domain pages

## Package legitimacy

No new npm packages required for Phase 3. If shadcn CLI adds local UI files only, no registry install audit needed. Any unexpected dependency → stop and re-audit.

## Common pitfalls

1. Stub pages that never call APIs (fails ROADMAP success #1)
2. Primary nav linking forbidden desk routes (UI-03)
3. Scoreboard as static copy without account/gap rollup (UI-02)
4. Putting buy/reduce/hold recommendation engine into Phase 3 renewals (belongs UI-01 / Phase 4)
5. Breaking landing brand layout by wrapping `/` in StudioShell

## Out of scope (research)

Phase 4 commercial + RenewalCase packs; Phase 5 sustain screenshots.

## Validation Architecture

| Dimension | Method | Command / artifact |
|-----------|--------|--------------------|
| IA smoke | Static source asserts | `npx tsx --test test/smoke-ui.test.ts` |
| Domain APIs | Integration | `npx tsx --test test/domain-api.test.ts` |
| Prior suites | Goldens + mkt | `npm test` |
| Build | Next production | `npm run build` |

Nyquist sampling: after each plan wave, run the plan’s `<automated>` verify; after 03-03 run full `npm test` + build. No Playwright this phase.
