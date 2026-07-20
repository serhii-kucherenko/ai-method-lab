# Scale notes — Clearpath

`GET /requests` uses keyset pagination (`ORDER BY id ASC`, `id > cursor`, `LIMIT`).

- Per page: O(limit) via index-friendly range scan — not O(n²) re-sort of the full set
- Default limit 20, hard cap 50
- Stable order: lexicographic id (seeded ids are zero-padded)
