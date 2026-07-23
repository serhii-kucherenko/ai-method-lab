# Graph Retrieval Desk — findings

## Smoke (r1)

Paper claim descriptor green. Product scaffolded from 2607.11683.

## CRUD (r1)

- In-memory store: orgs, projects, retrieval jobs
- Bearer register stub; roles admin / operator / viewer
- Schema migration v1→v2 adds `query_template` on projects
- HTML: index, jobs, honesty
- Honesty: method experiment, not authors' engine; display name only (no paper short-name branding on pages)

## Workflow (r1)

- Lifecycle edges enforced; illegal jumps → `illegal_transition`
- Audit + CSV; version conflict on stale concurrent transition
- Batch job transitions independent (ok + reject siblings)
- Scenario: naive single-hop vs extract/consolidate/retrieve sketch
- Pages: lifecycle, scenario, audit (plus prior CRUD pages)
- Tests: smoke + crud + workflow suites green

## Integrate (r1)

- HMAC inbound webhook for retrieval jobs (`x-grd-signature`) + idempotency replay
- Settings RBAC: secret admin-only; non-admin rotate → 403
- Projects/jobs list pagination + search; 429 + Retry-After when over limit
- Outbound corpus probe maps dependency response; 5xx → clear `dependency_failed`
- Settings page live; honesty fence unchanged
- Tests: smoke + crud + workflow + integrate green (9)

## Scale (r1)

- Seeded **250** retrieval jobs; full page walk (limit 20 default / cap 100)
- Concurrent disjoint batch transitions all ok
- Overlapping optimistic batches → one ok + one reject; in-batch duplicate → `duplicate_in_batch`
- Scale suite covers 429 + Retry-After
- Tests: prior suites + scale green (11)
