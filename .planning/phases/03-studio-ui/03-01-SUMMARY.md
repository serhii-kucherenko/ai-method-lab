---
phase: 03-studio-ui
plan: 01
subsystem: ui
tags: [nextjs, studio-shell, bearer-api, commitments, imports]

requires:
  - phase: 02-domain-claim-core
    provides: Bearer-protected commitments and imports APIs
provides:
  - StudioShell with seven domain primary nav links
  - Bearer apiFetch/apiJson client
  - Live /commitments and /imports with loading/empty/error
affects: [03-02, 03-03]

actuals:
  tokens: 22000
  tasks: 3
  commits: 2

tech-stack:
  added: []
  patterns:
    - StudioShell wraps domain pages; marketing / stays shell-free
    - apiJson returns ok/data or ok/message for soft-sim error copy

key-files:
  created:
    - projects/commitment-coverage-studio/src/components/studio-shell.tsx
    - projects/commitment-coverage-studio/src/components/studio-states.tsx
    - projects/commitment-coverage-studio/src/lib/api.ts
    - projects/commitment-coverage-studio/src/app/imports/page.tsx
    - projects/commitment-coverage-studio/test/smoke-ui.test.ts
  modified:
    - projects/commitment-coverage-studio/src/app/commitments/page.tsx
    - projects/commitment-coverage-studio/package.json

key-decisions:
  - "Literal href strings in StudioShell so IA smoke can assert primary routes"
  - "Client-side provider filter on commitments; search hits API search param"

patterns-established:
  - "Domain pages: StudioShell + apiJson + LoadingState/EmptyState/ErrorState"
  - "smoke-ui reads source for IA and StudioShell wiring"

requirements-completed: [UI-03]

coverage:
  - id: D1
    description: StudioShell primary nav exposes seven commit-native domain routes
    requirement: UI-03
    verification:
      - kind: unit
        ref: test/smoke-ui.test.ts#studio-shell primary nav includes seven domain hrefs
        status: pass
    human_judgment: false
  - id: D2
    description: Live /commitments with Bearer fetch and loading/empty/error
    requirement: UI-03
    verification:
      - kind: unit
        ref: test/smoke-ui.test.ts#commitments page uses StudioShell
        status: pass
    human_judgment: false
  - id: D3
    description: Live /imports under StudioShell with batch status and failed detail
    requirement: UI-03
    verification:
      - kind: unit
        ref: test/smoke-ui.test.ts#imports page uses StudioShell
        status: pass
    human_judgment: false

duration: 25min
completed: 2026-08-07
status: complete
---

# Phase 03 Plan 01: StudioShell Tracer Summary

**StudioShell + Bearer client power live `/commitments` and `/imports` with honest empty/error states and anti-desk IA smoke.**

## Performance

- **Duration:** 25 min
- **Tasks:** 3/3
- **Commits:** 2

## Accomplishments

- Domain StudioShell with seven primary routes and soft-sim hint
- `apiFetch` / `apiJson` Bearer client aligned with demo token
- Commitments inventory with search/provider filters and DESIGN empty copy
- Imports batch list with failed-batch detail drawer
- smoke-ui enforces IA + StudioShell wiring; `npm run build` green

## Task Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 (tracer TDD RED) | `28c0eef6` | Failing smoke-ui for shell + commitments |
| 1–3 GREEN | `de6631d0` | StudioShell, API client, commitments, imports, anti-desk smoke |

## Deviations from Plan

None - plan executed as written (literal hrefs for smoke assertability; tasks 1–3 landed in one GREEN commit after RED).

## Auth Gates

None.

## Known Stubs

None that block 03-01 goals. Remaining domain routes (`/coverage`, `/gaps`, `/compare`, `/renewals`, `/scoreboard`) are Phase 3 plans 02–03.

## Self-Check: PASSED

- FOUND: studio-shell.tsx, api.ts, studio-states.tsx, commitments/page.tsx, imports/page.tsx, smoke-ui.test.ts
- FOUND: commits 28c0eef6, de6631d0
- VERIFY: `npx tsx --test test/smoke-ui.test.ts` — 5/5 pass
- VERIFY: `npm run build` — Next.js 16 compile + TypeScript green; `/commitments` and `/imports` routes present
