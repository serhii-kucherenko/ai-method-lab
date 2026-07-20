# Oracle — P-scale-001

Agents must not edit this file during a cell run.

## Required behaviors

1. Dataset of ≥ 250 items can be walked via pagination without duplicates or gaps
2. `limit` is respected; default limit is bounded
3. Rate limit returns 429 (with Retry-After or equivalent) after threshold
4. Ordering is stable across pages

## Fail tags

`pagination-corrupt` · `unbounded-list` · `rate-limit-missing` · `approach-violation`
