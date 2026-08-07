---
phase: 03-studio-ui
plan: 02
subsystem: ui
tags: [coverage, gaps, compare, motion]

requires:
  - phase: 03-studio-ui
    provides: StudioShell and apiJson client
provides:
  - Live /coverage with CoverageBar motion
  - Live /gaps findings table
  - Live /compare commit_vs_ondemand A vs B
affects: [03-03]

actuals:
  tokens: 22000
  tasks: 3
  commits: 1

tech-stack:
  added: []
  patterns:
    - CoverageBar CSS width transition on accent fill
    - compare-result-highlight flash when A/B result loads

key-files:
  created:
    - projects/commitment-coverage-studio/src/app/coverage/page.tsx
    - projects/commitment-coverage-studio/src/app/gaps/page.tsx
    - projects/commitment-coverage-studio/src/app/compare/page.tsx
    - projects/commitment-coverage-studio/src/components/coverage-bar.tsx
  modified:
    - projects/commitment-coverage-studio/src/app/globals.css
    - projects/commitment-coverage-studio/test/smoke-ui.test.ts

key-decisions:
  - "Client-side kind filter for gaps; account filter hits API cloudAccountId"
  - "Compare empty state uses Need inventory + usage until a run succeeds"

patterns-established:
  - "Claim pages never import scoring.ts; dollars come from APIs only"

requirements-completed: [UI-03]

coverage:
  - id: D1
    description: Coverage workspace with bar motion and Need usage import empty
    requirement: UI-03
    verification:
      - kind: unit
        ref: test/smoke-ui.test.ts#coverage page
        status: pass
    human_judgment: false
  - id: D2
    description: Gaps findings with unused_commit and ondemand_spill
    requirement: UI-03
    verification:
      - kind: unit
        ref: test/smoke-ui.test.ts#gaps page
        status: pass
    human_judgment: false
  - id: D3
    description: Compare A vs B commit_vs_ondemand with deltaUsd
    requirement: UI-03
    verification:
      - kind: unit
        ref: test/smoke-ui.test.ts#compare page
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

- `/coverage` lists snapshots, optional POST compute, CoverageBar fill animation
- `/gaps` filters unused_commit vs ondemand_spill
- `/compare` runs commit_vs_ondemand and loads prior results with highlight motion

## Deviations from Plan

None - plan executed as written.

## Self-Check: PASSED

- FOUND: coverage/gaps/compare pages, coverage-bar.tsx
- FOUND: commit c5720b12
- smoke-ui + build pass
