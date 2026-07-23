# Graph Retrieval Desk — findings

## Smoke (r1)

Paper claim descriptor green. Product scaffolded from 2607.11683.

## Workflow (r1)

- Lifecycle edges enforced; illegal jumps → `illegal_transition`
- Audit + CSV; version conflict on stale concurrent transition
- Batch job transitions independent (ok + reject siblings)
- Scenario: naive single-hop vs extract/consolidate/retrieve sketch
- Pages: lifecycle, scenario, audit (plus prior CRUD pages)
- Tests: smoke + crud + workflow suites green
