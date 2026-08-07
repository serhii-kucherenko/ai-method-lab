# Phase 2 Research: Domain claim core

**Phase:** 02-domain-claim-core  
**Researched:** 2026-08-07  
**Mode:** Brief digest from `.planning/research/{SUMMARY,ARCHITECTURE,STACK,PITFALLS}.md` + depth pack (discuss skipped)  
**Confidence:** HIGH (lab artifacts) / MEDIUM (exact family/hour attribution — locked in CONTEXT D-04)

## Decision IDs (from CONTEXT)

| ID | Locked choice |
|----|---------------|
| D-01 | Product at `projects/commitment-coverage-studio/` |
| D-02 | SQLite `data/coverage.db`; better-sqlite3 with node:sqlite fallback |
| D-03 | Pure TS `scoreCommitMatched` / `scoreOnDemandBlind` |
| D-04 | A: window+family match; unused + spill dollars |
| D-05 | B: ignore commits; spill = all eligible; never alias A |
| D-06 | Gap kinds `unused_commit` \| `ondemand_spill`; A-only for snapshots |
| D-07 | CompareService A+B → CompareResult deltaUsd |
| D-08 | ≥2 cloud providers in seed/import |
| D-09 | ≥30 goldens with intentional A≠B |
| D-10 | Bearer on mutate APIs |
| D-11 | Store+API this phase; page chrome Phase 3 |
| D-12 | tsx --test runner continuity |

## Standard stack (phase-relevant)

- Next 16.3 App Router already scaffolded
- Add: `better-sqlite3` (+ `@types/better-sqlite3`), `zod`
- Domain: `src/domain/scoring.ts`, `src/domain/types.ts`, `src/goldens.ts`
- Persistence: `src/lib/db.ts` + repository helpers; gitignore `data/`
- Services: ImportOrchestrator, CoverageEngine, GapMaterializer, CompareService under `src/services/`
- APIs per `docs/ideas/commitment-coverage-studio-API-CONTRACT.md` domain section
- Tests: `test/goldens.test.ts`, `test/domain-api.test.ts` via `tsx --test`

## Package Legitimacy Audit

| Package | Role | Status | Notes |
|---------|------|--------|-------|
| `better-sqlite3` | SQLite sync driver | [VERIFIED] | STACK.md pin 13.x; CONTROLLER persistence sqlite; registry known |
| `@types/better-sqlite3` | Types | [VERIFIED] | Official DefinitelyTyped companion |
| `zod` | Import/CRUD body validation | [VERIFIED] | STACK.md; ubiquitous; no slop |
| `node:sqlite` | Fallback driver | [VERIFIED] | Node ≥22 built-in; only if better-sqlite3 native build fails |

No `[ASSUMED]` / `[SUS]` / `[SLOP]` installs. No human legitimacy checkpoint required.

## Architecture patterns for this phase

```text
projects/commitment-coverage-studio/
  data/coverage.db              # gitignored
  src/lib/db.ts                 # open + migrate schema
  src/lib/auth.ts               # bearer helper
  src/domain/types.ts           # ScoreInput/Output, gap kinds
  src/domain/scoring.ts         # A + B pure functions
  src/goldens.ts                # ≥30 fixtures
  src/services/import.ts
  src/services/coverage.ts
  src/services/gaps.ts
  src/services/compare.ts
  src/app/api/accounts/route.ts
  src/app/api/commitments/...
  src/app/api/imports/...
  src/app/api/coverage/route.ts
  src/app/api/gaps/route.ts
  src/app/api/compares/...
  src/app/api/goldens/sample/route.ts
  src/app/api/features/route.ts
  test/goldens.test.ts
  test/domain-api.test.ts
```

**Data flow:** Commitment + UsageSlice → scoreCommitMatched (A) → CoverageSnapshot → GapFinding; scoreOnDemandBlind (B) only via CompareService.

## Common pitfalls (phase-critical)

1. Dual-score emptiness — B aliases A (PITFALLS #2)
2. Coverage conflated with utilization — single gap metric (PITFALLS #6)
3. Single-cloud seed only (PITFALLS #7)
4. Isomorphic Idle Seat / True Up aggregates or desk IA (PITFALLS #1)
5. Scoring inside page.tsx (ARCHITECTURE anti-pattern #3)
6. better-sqlite3 native fail → switch to Postgres (forbidden; use node:sqlite)

## Out of scope (confirm)

RenewalCase packs, full domain UI chrome, commercial pages, Playwright, screenshots, live CUR connectors.

## Validation Architecture

Nyquist sampling:
- Wave 0 / Plan 01: goldens.test.ts RED→GREEN for A≠B on ≥1 fixture, then ≥30
- Plan 02: domain-api tests for commitments CRUD + import status
- Plan 03: coverage/gaps/compares API tests with multi-cloud seed

Map DOM-01..08 to automated asserts in those files. Keep smoke-mkt green.

## Sources

- `.planning/phases/02-domain-claim-core/02-CONTEXT.md`
- `.planning/research/{SUMMARY,ARCHITECTURE,STACK,PITFALLS}.md`
- `docs/ideas/commitment-coverage-studio-{API-CONTRACT,ERD,PHASE-BRIEFS}.md`
- Sibling `projects/spend-cap-studio/src/{domain/scoring.ts,goldens.ts}` (shape only — different claim)

---
*Brief phase research for Domain claim core*
