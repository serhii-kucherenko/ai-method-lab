# Graph Retrieval Desk — findings

## Smoke (r1)

Paper claim descriptor green. Product scaffolded from 2607.11683.

## Scale (r1)

- Seeded **250** retrieval jobs; full page walk (limit 20 default / cap 100)
- Concurrent disjoint batch transitions all ok
- Overlapping optimistic batches → one ok + one reject; in-batch duplicate → `duplicate_in_batch`
- Scale suite covers 429 + Retry-After
- Tests: prior suites + scale green (11)
