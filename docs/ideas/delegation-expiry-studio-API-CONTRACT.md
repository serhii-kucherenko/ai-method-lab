# API-CONTRACT — Delegation Expiry Studio

Bearer auth. Soft-sim only.

| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/health` | Public |
| GET | `/api/features` | Inventory |
| GET | `/api/goldens/sample` | Dual-impl samples |
| GET/POST | `/api/agents` | Registry |
| GET/POST | `/api/grants` | TTL grants |
| PATCH | `/api/grants/:id` | Update / expire-now |
| GET | `/api/expiries` | Queue + history |
| GET/POST | `/api/policies` | TTL templates |
| GET | `/api/audit` | Grant ledger |
| POST | `/api/compares` | TTL vs permanent-scope |
| GET | `/api/scoreboard` | Rollups |
| POST | `/api/webhooks/test` | HMAC idempotent |
| GET | `/api/export` | grants/audit |
