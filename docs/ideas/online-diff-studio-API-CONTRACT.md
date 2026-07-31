# API-CONTRACT — Online Diff Studio

Bearer auth. Soft-sim only.

| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/health` | Public |
| GET | `/api/features` | Inventory |
| GET | `/api/goldens/sample` | Dual-impl samples |
| GET/POST | `/api/programs` | Approved revisions |
| GET/POST | `/api/online-snapshots` | Online artifacts |
| GET/POST | `/api/imports` | Batches |
| GET/POST | `/api/diffs` | Diff runs |
| GET | `/api/diffs/:id` | Hunks |
| GET/POST | `/api/moc-packs` | Evidence packs |
| POST | `/api/compares` | drift vs trust-last-download |
| GET | `/api/scoreboard` | Rollups |
| POST | `/api/webhooks/test` | HMAC idempotent |
| GET | `/api/export` | packs/diffs |
