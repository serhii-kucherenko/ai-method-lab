---
phase: 03-studio-ui
plan: 03
subsystem: ui
tags: [scoreboard, renewals, leaderboard]

requires:
  - phase: 03-studio-ui
    provides: StudioShell and gap findings APIs
provides:
  - GET /api/scoreboard rollup ranked by gapUsd
  - Live /scoreboard leaderboard UI
  - Live /renewals renew-by queue from lock_end
  - Full seven-route IA smoke
affects: [04-commercial-platform]

actuals:
  tokens: 20000
  tasks: 3
  commits: 1

tech-stack:
  added: []
  patterns:
    - Scoreboard aggregates gap_findings + latest coverage_pct per account
    - Renewals API is read-only lock_end projection without Phase 4 packs

key-files:
  created:
    - projects/commitment-coverage-studio/src/services/scoreboard.ts
    - projects/commitment-coverage-studio/src/app/api/scoreboard/route.ts
    - projects/commitment-coverage-studio/src/app/api/renewals/route.ts
    - projects/commitment-coverage-studio/src/app/scoreboard/page.tsx
    - projects/commitment-coverage-studio/src/app/renewals/page.tsx
  modified:
    - projects/commitment-coverage-studio/test/domain-api.test.ts
    - projects/commitment-coverage-studio/test/smoke-ui.test.ts

key-decisions:
  - "Thin GET /api/renewals rather than client-only commitments aggregation"
  - "Empty org scoreboard returns [] not 500"

patterns-established:
  - "Phase 3 closes when all seven domain pages wrap StudioShell"

requirements-completed: [UI-02, UI-03]

coverage:
  - id: D1
    description: Scoreboard API + leaderboard ranked by gapUsd
    requirement: UI-02
    verification:
      - kind: unit
        ref: test/domain-api.test.ts#GET /api/scoreboard
        status: pass
    human_judgment: false
  - id: D2
    description: Renewals renew-by queue without recommendation packs
    requirement: UI-03
    verification:
      - kind: unit
        ref: test/smoke-ui.test.ts#renewals page
        status: pass
    human_judgment: false
  - id: D3
    description: All seven domain pages use StudioShell
    requirement: UI-03
    verification:
      - kind: unit
        ref: test/smoke-ui.test.ts#all seven domain pages
        status: pass
    human_judgment: false

duration: 15min
completed: 2026-08-07
status: complete
---

# Phase 03 Plan 03: Scoreboard and Renewals Summary

**Scoreboard leaderboard (UI-02) and renew-by queue ship; all seven domain routes live under StudioShell (UI-03).**

## Performance

- **Duration:** 15 min
- **Tasks:** 3/3
- **Commits:** 1 (`d5ab1f15`)

## Accomplishments

- Scoreboard service + Bearer GET API with empty-org [] behavior
- `/scoreboard` ranks by gap $ with provider/account filters
- `/renewals` ordered by lock_end; no buy/reduce/hold packs
- Full IA smoke + domain-api scoreboard tests; npm test and build green

## Deviations from Plan

None - plan executed as written.

## Self-Check: PASSED

- FOUND: scoreboard service/API/page, renewals API/page
- FOUND: commit d5ab1f15
- npm test 42/42; build pass
