---
phase: 02-domain-claim-core
verified: 2026-08-07
status: passed
---

# Phase 2 Verification: Domain claim core

## Goal truths

| Truth | Status | Evidence |
|-------|--------|----------|
| Dual scorers A/B diverge on under/over fixtures | PASS | `test/goldens.test.ts` tracer + catalog |
| ≥30 goldens with material A≠B deltaUsd | PASS | `GOLDENS.length === 30`; ≥10 dollar-divergent |
| Multi-cloud inventory + lock-window commitments | PASS | accounts/commitments APIs + domain-api tests |
| Usage import batches with status/failure detail | PASS | imports API + UsageSlice persistence |
| Coverage %/$ from scorer A; 422 without usage | PASS | `/api/coverage` + domain-api coverage suite |
| Separate unused_commit / ondemand_spill gaps | PASS | `/api/gaps` after coverage compute |
| Compare A vs B material deltaUsd | PASS | `/api/compares` mode `commit_vs_ondemand` |
| SQLite durable under `data/coverage.db` | PASS | migrate + repos; `data/` gitignored |

## Requirements

| ID | Status |
|----|--------|
| DOM-01 | complete |
| DOM-02 | complete |
| DOM-03 | complete |
| DOM-04 | complete |
| DOM-05 | complete |
| DOM-06 | complete |
| DOM-07 | complete |
| DOM-08 | complete |

## Automated verification

```text
cd projects/commitment-coverage-studio && npm test
# 29 pass / 0 fail (smoke-mkt + goldens + domain-api)
```

## APIs shipped

- `GET /api/goldens/sample`, `GET /api/features`
- `GET/POST /api/accounts`
- `GET/POST /api/commitments`, `GET/PATCH /api/commitments/:id`
- `GET/POST /api/imports`, `GET /api/imports/:id`
- `GET/POST /api/coverage`
- `GET /api/gaps`
- `POST /api/compares`, `GET /api/compares/:id`

## Goldens

30 fixtures in `src/goldens.ts` (under / over / full / multi-family / multi-window).

## Phase 1 preservation

Landing honesty fence and smoke-mkt brand checks remain green.

## Next

`/gsd-discuss-phase 3` or `/gsd-plan-phase 3` — Domain UI chrome (Phase 3).
