# Model Compiler Desk — findings

## Smoke (r1)

Paper claim descriptor green. Product scaffolded from 2607.15865.

## CRUD (r1)

- In-memory store: orgs, projects, compile jobs
- Bearer register stub; roles admin / operator / viewer
- HTML: index, jobs, honesty
- Honesty: method experiment, not authors' compiler

## Workflow (r1)

- Lifecycle edges enforced; illegal jumps → `illegal_transition`
- Audit + CSV; version conflict on stale concurrent transition
- Batch job transitions independent (ok + reject siblings)
- Scenario: naive monolith vs MLIR layered modularity sketch
- Pages: lifecycle, scenario, audit (plus prior CRUD pages)
- Tests: smoke + crud + workflow suites green

## Integrate (r1)

- HMAC inbound webhook for compile jobs (`x-mcd-signature`) + idempotency replay
- Settings RBAC: secret admin-only; non-admin rotate → 403
- Projects/jobs list pagination + search; 429 + Retry-After when over limit
- Settings page live; honesty fence unchanged
- Tests: smoke + crud + workflow + integrate green (7)

## Scale (r1)

- Seeded **250** compile jobs; full page walk (limit 20 default / cap 100)
- Concurrent disjoint batch transitions all ok
- Overlapping optimistic batches → one ok + one reject; in-batch duplicate → `duplicate_in_batch`
- Scale suite covers 429 + Retry-After
- Tests: prior suites + scale green

## Sustain (r1)

- 9 pages with UI critical paths; 18 features; ≥4 aggregates
- Goldens ≥25 dual-impl (modularity A/B); all_pass
- Offline `try.html` (no fetch); tutor guide `docs/guides/05-model-compiler-desk-lessons.md`
- README + PRODUCT maturity checklist; StackBlitz URL
- Cell: `A03__P-sustain-001__model-compiler-desk__r1`
- Honesty: method experiment, not authors' compiler
