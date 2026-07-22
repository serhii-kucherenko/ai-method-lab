# Scale notes — oshamult

## Pagination

Citation catalog and audit events use `limit` + `offset`.

- Default `limit` is **20** (bounded — never dumps the full table).
- Hard cap is **100** even if the client asks for more.
- Ordering is stable: citations by `created_at` descending; audit by time descending.

List queries are **O(page)**: count for `total` plus one slice. They do not re-scan prior pages into memory beyond the page window.

## Rate limits

Per-token (or anon IP) counter on the process. When the count exceeds the configured ceiling, the API returns **429** with `Retry-After: 1`.

Configure via `createApp({ rateLimit: N })` (tests use a low N to trip the fence; production default is higher).

## Concurrent batch

`POST /orgs/:id/batch/forecast` forecasts each citation independently. Sibling failures do not rewrite good lines. Concurrent batch calls on overlapping slices stay safe because each forecast run is keyed per citation and appends its own audit row.
