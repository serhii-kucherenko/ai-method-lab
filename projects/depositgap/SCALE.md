# Scale notes — depositgap

## Pagination

Entry catalog, cash-impact POR lines, and audit events use `limit` + `offset`.

- Default `limit` is **20** (bounded — never dumps the full table).
- Hard cap is **100** even if the client asks for more.
- Ordering is stable: entries by `created_at ASC, id ASC`; cash lines by POR; audit by time/id.

List queries are **O(page)**: `COUNT(*)` for `total` plus one `LIMIT/OFFSET` select. They do not re-scan prior pages into memory.

## Rate limits

Per-token (or anon IP) counter on the process. When the count exceeds the configured ceiling, the API returns **429** with `Retry-After: 1`.

Configure via `createApp({ rateLimit: N })` (tests use a low N to trip the fence; production default is higher).

## Concurrent batch

`POST /orgs/:id/batch/forecast` forecasts each entry independently. Sibling failures do not rewrite good lines. Concurrent batch calls on overlapping slices stay safe because each forecast run is keyed per entry.
