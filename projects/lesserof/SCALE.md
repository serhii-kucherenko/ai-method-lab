# lesserof — scale notes

## Pagination

- Catalog `GET /orgs/:orgId/claim-lines` and audit `GET /orgs/:orgId/audit` default `limit=20`, hard cap `100`.
- Walk large orgs with `offset` — lists are O(page), not O(org).

## Rate limit

- Per bearer token (or remote address if anonymous).
- Over limit → `429` + `Retry-After: 1`.
- Configure via `createApp({ rateLimit: N })` (tests use a low N to trip the fence; default is 1000).

## Concurrent batch

- Overlapping `POST /orgs/:orgId/batch/recover` calls stay independent per claim line.
- Dual-impl goldens remain green under concurrent recover traffic.
