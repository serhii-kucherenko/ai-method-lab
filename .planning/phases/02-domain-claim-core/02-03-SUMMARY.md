---
phase: 02-domain-claim-core
plan: 03
subsystem: domain
tags: [coverage, gaps, compare, dual-scorers, sqlite]

requires:
  - phase: 02-domain-claim-core
    provides: Inventory + import APIs and dual scorers from 02-01/02-02
provides:
  - CoverageEngine using scoreCommitMatched (A) only
  - GapMaterializer for unused_commit and ondemand_spill
  - CompareService A vs B with material deltaUsd
affects: [03 domain UI chrome]

actuals:
  tokens: 18000
  tasks: 3
  commits: 1

tech-stack:
  added: []
  patterns: [CoverageEngine A-only snapshots, GapMaterializer derived read models, CompareService shared ScoreInput]

key-files:
  created:
    - projects/commitment-coverage-studio/src/services/coverage.ts
    - projects/commitment-coverage-studio/src/services/gaps.ts
    - projects/commitment-coverage-studio/src/services/compare.ts
    - projects/commitment-coverage-studio/src/app/api/coverage/route.ts
    - projects/commitment-coverage-studio/src/app/api/gaps/route.ts
    - projects/commitment-coverage-studio/src/app/api/compares/route.ts
    - projects/commitment-coverage-studio/src/app/api/compares/[id]/route.ts
  modified:
    - projects/commitment-coverage-studio/test/domain-api.test.ts

key-decisions:
  - "Coverage snapshots persist A-only dollars; B never writes GapFinding"
  - "Missing usage for coverage/compare returns 422 with soft-sim copy"
  - "Compare mode commit_vs_ondemand only; unknown modes 422"

patterns-established:
  - "buildScoreInputForAccount shared by CoverageEngine and CompareService"
  - "Gap findings materialized atomically with coverage compute"

requirements-completed: [DOM-03, DOM-04, DOM-07]

coverage:
  - id: D1
    description: Coverage snapshot %/$ via scorer A; 422 without usage
    requirement: DOM-03
    verification:
      - kind: unit
        ref: test/domain-api.test.ts#POST coverage returns A-only snapshot
        status: pass
    human_judgment: false
  - id: D2
    description: Separate unused_commit and ondemand_spill gap findings
    requirement: DOM-04
    verification:
      - kind: unit
        ref: test/domain-api.test.ts#GET gaps exposes unused_commit and ondemand_spill
        status: pass
    human_judgment: false
  - id: D3
    description: Compare A vs B with material deltaUsd
    requirement: DOM-07
    verification:
      - kind: unit
        ref: test/domain-api.test.ts#POST compares returns material A vs B deltaUsd
        status: pass
    human_judgment: false

duration: 25min
completed: 2026-08-07
status: complete
---

# Phase 2 Plan 03: Coverage, gaps, and compare Summary

**CoverageEngine, GapMaterializer, and CompareService close the claim loop: inventory + usage become A-only coverage/gap dollars and material A vs B compare deltas.**

## Performance

- **Duration:** ~25 min
- **Tasks:** 3/3
- **Files:** 8 created/modified

## Accomplishments

- POST/GET `/api/coverage` computes and lists CoverageSnapshots from `scoreCommitMatched` only
- GET `/api/gaps` returns `unused_commit` and `ondemand_spill` findings with dollars
- POST/GET `/api/compares` runs A+B on identical ScoreInput with nonzero `deltaUsd`
- Full `npm test` green (smoke-mkt + goldens + domain-api) — 29 tests

## Deviations from Plan

None - plan executed as written (services drafted in parallel then routes/tests completed).

## Self-Check: PASSED

- FOUND: services/coverage.ts, gaps.ts, compare.ts
- FOUND: api/coverage, gaps, compares routes
- FOUND: commit 49e274f1
