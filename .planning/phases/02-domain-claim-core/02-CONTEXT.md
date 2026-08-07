# Phase 2 Context: Domain claim core

**Mode:** Auto-generated (discuss skipped via workflow.skip_discuss)  
**Phase:** 2 — Domain claim core  
**Requirements:** DOM-01, DOM-02, DOM-03, DOM-04, DOM-05, DOM-06, DOM-07, DOM-08

## Goal

Coverage and gap dollars are computable from multi-cloud inventory + usage, with a falsifiable A vs B claim (commit-matched vs on-demand-blind), durable SQLite store, thin APIs, and ≥30 dual-impl goldens.

## Locked decisions

| ID | Decision | Choice | Source |
|----|----------|--------|--------|
| D-01 | Product root | Continue under `projects/commitment-coverage-studio/` (Phase 1 scaffold) | PROJECT.md / Phase 1 |
| D-02 | Persistence | SQLite file `data/coverage.db` (gitignored). Prefer `better-sqlite3`; if native build fails on Windows agent, fall back to `node:sqlite` `DatabaseSync` with the same schema. Never Postgres / in-memory-only for inventory/imports. | research/STACK.md · SUMMARY |
| D-03 | Dual scorers | Pure TypeScript in `src/domain/scoring.ts`: `scoreCommitMatched` (A) and `scoreOnDemandBlind` (B). No Python. No scoring math inside React pages or route bodies beyond calling domain/services. | ARCHITECTURE · SUMMARY |
| D-04 | Matching policy (A) | Window-bound match Commitment ↔ UsageSlice by overlapping lock/window and optional `family`. Covered $ = min(commit obligation in window, matched eligible spend). `unusedCommitUsd` = obligation not consumed. `ondemandSpillUsd` = eligible spend not covered. `coveragePct` = covered / eligible (0 if no eligible). | ARCHITECTURE Score I/O · PITFALLS #6 |
| D-05 | Baseline (B) | Ignore commitments: `unusedCommitUsd = 0`, `ondemandSpillUsd = sum(eligibleSpend)`, `coveredUsd = 0`, `coveragePct = 0`. Must diverge from A on under/over-cover fixtures. Never `return A()`. | ARCHITECTURE · PITFALLS #2 |
| D-06 | Gap kinds | Persist/materialize separate kinds: `unused_commit` and `ondemand_spill` (dollars). Do not collapse into one utilization %. CoverageEngine / GapMaterializer use **A only**. | ARCHITECTURE · PITFALLS #6 |
| D-07 | Compare | `CompareService` runs A+B on identical `ScoreInput`; persists `CompareResult` with `deltaUsd` and material divergence. Mode `commit_vs_ondemand`. | ARCHITECTURE · DOM-07 |
| D-08 | Multi-cloud | CloudAccount `provider` ∈ aws/gcp/azure-like; seed/import fixtures include ≥2 providers; keep instrument type provider-specific (do not pretend SP ≡ CUD). | PITFALLS #7 · SUMMARY |
| D-09 | Goldens | ≥30 fixtures in `src/goldens.ts` asserting expected A, expected B, and non-zero `deltaUsd` on under/over-cover cases (twin-equivalence harness forbidden). Expose `GET /api/goldens/sample` + `GET /api/features`. | DOM-08 · ARCHITECTURE |
| D-10 | API auth | Bearer on domain mutate routes (`Authorization: Bearer …`); org-scoped store. Public: `GET /api/health` only among new routes if needed. Soft-sim fence copy on validation errors. | API-CONTRACT · STACK |
| D-11 | Phase UI boundary | Phase 2 delivers store + domain scorers + Route Handlers (+ seed). Domain pages may stay thin stubs; full IA chrome is Phase 3. Do not add `/jobs` `/lifecycle` `/scenario` `/batch` as primary routes. | ROADMAP Phase 2 vs 3 · PITFALLS #1 |
| D-12 | Test runner | Keep `tsx --test` (Phase 1 + spend-cap sibling). Add `test/goldens.test.ts` + `test/domain-api.test.ts`. Prefer Vitest only if executor hits a hard runner gap — not required this phase. | STACK alternatives · Phase 1 |

## Discretion

- Exact SQLite repository file layout (`src/lib/db.ts` vs `src/store.ts`) as long as D-02 schema durability holds.
- Optional second coding file `scoring-independent.ts` for dual-impl discipline (lab pattern) — include if it clarifies A≠B without duplicating bugs.
- Zod vs hand validation for import bodies — Zod preferred per STACK when installing packages.

## Deferred (not this phase)

- Live cloud billing connectors / auto-purchase (PROJECT deferred / v2)
- Full domain page chrome, filters, empty/error UX (Phase 3)
- RenewalCase packs, commercial `/pricing` etc., org/members platform polish (Phase 4)
- README live screenshots / try.html sustain (Phase 5)

## Codebase notes

Phase 1 left runnable Next 16.3 app with DESIGN tokens, `/`, `/honesty`, stub `/commitments` + `/demo`, and `test/smoke-mkt.test.ts`. Extend that tree; do not re-scaffold.

## Out of scope this phase

Renewal workflow UI, commercial pages, Playwright e2e, screenshot capture, live provider SDKs.

---
*Generated 2026-08-07 for gsd-autonomous / skip_discuss*
