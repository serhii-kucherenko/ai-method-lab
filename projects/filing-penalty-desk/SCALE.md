# Filing Penalty Desk — scale notes

## Rate limits

- Default in-memory limit: 1000 requests per process key (bearer token or IP)
- Over limit → HTTP **429** with `Retry-After: 1` and body `{ "error": "rate_limit_exceeded" }`
- Batch UI surfaces 429 copy so controllers retry instead of assuming silent failure

## Concurrent batch

- Multiple `/orgs/:id/batch/forecast` calls may run in parallel
- Each timeline forecast is independent; rejects do not rewrite sibling lines

## Dual-impl

- Impl A (`forecast`) and Impl B (`forecastB`) must agree on goldens and scale smoke toys
- Drift fails the scale cell
