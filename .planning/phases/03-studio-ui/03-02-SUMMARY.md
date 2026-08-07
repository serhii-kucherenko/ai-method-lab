---
phase: 03-studio-ui
plan: 02
subsystem: ui
tags: [coverage, gaps, compare, motion, nextjs]

requires:
  - phase: 03-studio-ui
    provides: StudioShell, apiJson Bearer client, studio-states
provides:
  - Live /coverage with CoverageBar motion, filters, compute POST
  - Live /gaps findings table with kind/account filters
  - Live /compare commit_vs_ondemand A vs B with deltaUsd and highlight
affects: [03-03]

actuals:
  tokens: 22000
  tasks: 3
  commits: 1

tech-stack:
  added: []
  patterns:
    - CoverageBar rAF + CSS width transition on --color-accent fill
    - compare-result-highlight flash when A/B result loads
    - Domain pages: StudioShell + apiJson + Loading/Empty/Error (no scoring.ts)

key-files:
  created:
    - projects/commitment-coverage-studio/src/components/coverage-bar.tsx
  modified:
    - projects/commitment-coverage-studio/src/app/coverage/page.tsx
    - projects/commitment-coverage-studio/src/app/gaps/page.tsx
    - projects/commitment-coverage-studio/src/app/compare/page.tsx
    - projects/commitment-coverage-studio/src/app/globals.css
    - projects/commitment-coverage-studio/test/smoke-ui.test.ts

key-decisions:
  - "Client-side kind filter for gaps; account filter hits API cloudAccountId"
  - "Compare empty state uses Need inventory + usage until a run succeeds"
  - "Coverage empty copy is Need usage import (D-02); POST surfaces 422 missing_usage message"

patterns-established:
  - "Claim pages never import scoring.ts; dollars come from APIs only"
  - "soft-sim honesty copy on compare delta and StudioShell hint"

requirements-completed: [UI-03]

coverage:
  - id: D1
    description: Coverage workspace with bar motion and Need usage import empty
    requirement: UI-03
    verification:
      - kind: unit
        ref: test/smoke-ui.test.ts#coverage page uses StudioShell, api/coverage, and CoverageBar motion
        status: pass
    human_judgment: false
  - id: D2
    description: Gaps findings with unused_commit and ondemand_spill filters
    requirement: UI-03
    verification:
      - kind: unit
        ref: test/smoke-ui.test.ts#gaps page uses StudioShell and unused_commit / ondemand_spill
        status: pass
    human_judgment: false
  - id: D3
    description: Compare A vs B commit_vs_ondemand with deltaUsd
    requirement: UI-03
    verification:
      - kind: unit
        ref: test/smoke-ui.test.ts#compare page uses StudioShell and commit_vs_ondemand
        status: pass
      - kind: other
        ref: npm run build
        status: pass
    human_judgment: false

duration: 20min
completed: 2026-08-07
status: complete
---

# Phase 03 Plan 02: Coverage Gaps Compare Summary

**Live coverage, gaps, and A/B compare workspaces under StudioShell with DESIGN motion and honest empty/error paths.**

## Performance

- **Duration:** 20 min
- **Tasks:** 3/3
- **Commits:** 1 (`c5720b12`)

## Accomplishments

- `/coverage` lists snapshots, account/window filters, optional POST compute, CoverageBar fill animation, empty “Need usage import”
- `/gaps` filters unused_commit vs ondemand_spill with account query; empty “No gaps in window”; CTAs to renewals/compare
- `/compare` POSTs `commit_vs_ondemand`, shows A/B/deltaUsd, loads prior by id, highlight motion; empty “Need inventory + usage”

## Task Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1–3 | `c5720b12` | Live coverage, gaps, compare + CoverageBar + smoke-ui |

## Deviations from Plan

None - plan executed as written (kind filter client-side because gaps API has no kind param).

## Auth Gates

None.

## Known Stubs

None that block 03-02 goals. Scoreboard/renewals belong to 03-03.

## Threat Flags

None beyond plan register (soft-sim dollars from API only; soft-sim copy on compare).

## Self-Check: PASSED

- FOUND: coverage/page.tsx, gaps/page.tsx, compare/page.tsx, coverage-bar.tsx
- FOUND: commit `c5720b12`
- VERIFY: `npx tsx --test test/smoke-ui.test.ts` — 11/11 pass
- VERIFY: `npm run build` — Next.js 16 compile + TypeScript green; `/coverage` `/gaps` `/compare` routes present
