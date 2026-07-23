# Drug Discovery Desk — findings

## Smoke (r1)

Paper claim descriptor green. Product scaffolded from 2607.08404.

## CRUD (r1)

- In-memory store: orgs, projects, discovery jobs
- Bearer register stub; roles admin / operator / viewer
- Schema migration v1→v2 adds `disease_prompt` on projects
- HTML: index, jobs, honesty
- Honesty: method experiment, not authors' model; not wet-lab/regulatory; display name only (no paper short-name branding on pages)

## Workflow (r1)

- Lifecycle edges enforced; illegal jumps → `illegal_transition`
- Audit + CSV; version conflict on stale concurrent transition
- Batch job transitions independent (ok + reject siblings)
- Scenario: naive unconditioned vs disease-conditioned sketch
- Pages: lifecycle, scenario, audit (plus prior CRUD pages)
- Tests: smoke + crud + workflow suites green

## Integrate (r1)

- HMAC inbound webhook for discovery jobs (`x-ddd-signature`) + idempotency replay
- Settings RBAC: secret admin-only; non-admin rotate → 403
- Projects/jobs list pagination + search; 429 + Retry-After when over limit
- Outbound library probe maps dependency response; 5xx → clear `dependency_failed`
- Settings page live; honesty fence unchanged
- Tests: smoke + crud + workflow + integrate green

## Scale (r1)

- Seeded **250** discovery jobs; full page walk (limit 20 default / cap 100)
- Concurrent disjoint batch transitions all ok
- Overlapping optimistic batches → one ok + one reject; in-batch duplicate → `duplicate_in_batch`
- Scale suite covers 429 + Retry-After
- Tests: prior suites + scale green

## Sustain (r1)

- ≥15 features / 9 pages / ≥4 aggregates documented in PRODUCT.md + README
- Goldens ≥25 dual-impl disease-fit fixtures; browser page + API
- Offline `try.html` (no fetch); tutor guide `docs/guides/07-drug-discovery-desk-lessons.md`
- UI critical path on every page; honesty fence; never brand paper short name
- Tests: prior + sustain + sustain-matrix + ui-critical green
