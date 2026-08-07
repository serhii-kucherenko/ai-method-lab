---
phase: 02-domain-claim-core
plan: 01
subsystem: domain
tags: [scoring, goldens, sqlite, better-sqlite3, zod, dual-impl]

requires:
  - phase: 01-product-foundation
    provides: Next.js scaffold at projects/commitment-coverage-studio/
provides:
  - Pure scoreCommitMatched (A) and scoreOnDemandBlind (B)
  - ≥30 GOLDENS with intentional A≠B deltaUsd
  - SQLite data/coverage.db migrate schema
  - GET /api/goldens/sample and GET /api/features
affects: [02-02 inventory APIs, 02-03 coverage/gaps/compare]

actuals:
  tokens: 12000
  tasks: 3
  commits: 3

tech-stack:
  added: [better-sqlite3, @types/better-sqlite3, zod]
  patterns: [pure dual scorers, twin-forbidden goldens, SQLite file under data/]

key-files:
  created:
    - projects/commitment-coverage-studio/src/domain/types.ts
    - projects/commitment-coverage-studio/src/domain/scoring.ts
    - projects/commitment-coverage-studio/src/goldens.ts
    - projects/commitment-coverage-studio/src/lib/db.ts
    - projects/commitment-coverage-studio/src/app/api/goldens/sample/route.ts
    - projects/commitment-coverage-studio/src/app/api/features/route.ts
    - projects/commitment-coverage-studio/test/goldens.test.ts
  modified:
    - projects/commitment-coverage-studio/package.json
    - projects/commitment-coverage-studio/.gitignore

key-decisions:
  - "better-sqlite3 native build succeeded on Windows agent — no node:sqlite fallback needed"
  - "Scorer A prorates obligation by lock/window overlap and buckets by family"
  - "Scorer B never aliases A — unused=0, covered=0, spill=all eligible"

patterns-established:
  - "Dual-impl goldens: recompute A/B in tests; assert divergence, never twin-equivalence"
  - "Soft-sim API responses include softSim + note fencing live billing SOR"

requirements-completed: [DOM-05, DOM-06, DOM-08]

coverage:
  - id: D1
    description: Dual scorers A/B diverge on under/over-cover fixtures
    requirement: DOM-05
    verification:
      - kind: unit
        ref: test/goldens.test.ts#tracer: dual scorers diverge
        status: pass
    human_judgment: false
  - id: D2
    description: ≥30 goldens with material A≠B gap dollars
    requirement: DOM-08
    verification:
      - kind: unit
        ref: test/goldens.test.ts#goldens catalog ≥30 dual-impl fixtures
        status: pass
    human_judgment: false
  - id: D3
    description: Goldens sample and features APIs expose dual-path inventory
    requirement: DOM-08
    verification:
      - kind: unit
        ref: test/goldens.test.ts#goldens/features API modules
        status: pass
    human_judgment: false
  - id: D4
    description: SQLite schema migrates and round-trips a commitment row
    requirement: DOM-06
    verification:
      - kind: unit
        ref: test/goldens.test.ts#tracer: sqlite migrate round-trip
        status: pass
    human_judgment: false

duration: 25min
completed: 2026-08-07
status: complete
---

# Phase 02 Plan 01: Dual scorers, goldens, SQLite Summary

**Pure A/B coverage scorers with 30 dual-path goldens, SQLite migrate, and soft-sim sample/features APIs.**

## Performance

- **Duration:** ~25 min
- **Tasks:** 3/3
- **Commits:** 3

## Accomplishments

- Locked falsifiable `scoreCommitMatched` vs `scoreOnDemandBlind` on shared `ScoreInput`
- Catalogued 30 goldens spanning under/over/full/multi-family/multi-window with non-zero deltaUsd cases
- Bootstrapped `data/coverage.db` schema for accounts, commitments, imports, coverage, gaps, compares
- Wired `GET /api/goldens/sample` and `GET /api/features` with soft-sim honesty fencing

## Task Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | e6aaf57a | Dual scorers A/B with SQLite migrate |
| 2 | 94ec63e7 | Expand to 30 dual-path golden fixtures |
| 3 | a0d66abd | Wire goldens sample and features APIs |

## Deviations from Plan

None - plan executed as written (better-sqlite3 compiled successfully; no fallback).

## Self-Check: PASSED

- FOUND: scoring.ts, goldens.ts, db.ts, sample/features routes, goldens.test.ts
- FOUND: commits e6aaf57a, 94ec63e7, a0d66abd
- `npx tsx --test test/goldens.test.ts` → 8 pass
