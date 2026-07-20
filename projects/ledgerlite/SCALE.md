# Scale notes — Ledgerlite

`GET /entries` uses keyset pagination (`ORDER BY id ASC`, `id > cursor`, `LIMIT`).

- Per page O(limit); default 20, hard cap 50
- Stable order via zero-padded seeded ids in tests
