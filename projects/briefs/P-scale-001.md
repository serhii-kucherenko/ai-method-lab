# P-scale-001 — Pagination + rate limits

```yaml
id: P-scale-001
tier: P-scale
effort: 3–5 days
oracle: oracles/P-scale-001.md
```

## Goal

List endpoints that stay correct under larger datasets with cursor/offset pagination and basic rate limiting.

## In scope

- Seed ≥ 250 records; list with limit + cursor (or page)
- Stable ordering; no duplicate/missing pages in walk
- Per-token rate limit (e.g. N req/min) returning 429 with Retry-After
- Basic complexity note (why the query stays O(page) not O(n²))

## Out of scope

- Sharding, CDN, multi-region

## Success metric

Oracle green for full page walk + rate-limit trip.

## Stress focus

Correctness under volume; graceful limit enforcement.
