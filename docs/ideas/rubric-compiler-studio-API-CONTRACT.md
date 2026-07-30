# API-CONTRACT — Rubric Compiler Studio

Bearer auth on all `/api/*` unless noted. JSON request/response. Idempotent writes where marked. Soft-sim only — no live judge provider write-back.

## Auth / platform

| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/health` | Public liveness |
| GET | `/api/features` | Inventory of shipped features |
| GET | `/api/goldens/sample` | Sample dual-impl goldens (≥30 in store) |
| GET/PATCH | `/api/org` | Org settings |
| GET/POST | `/api/members` | List / invite |
| POST | `/api/webhooks/test` | HMAC-signed delivery; idempotent by `Idempotency-Key` |
| GET | `/api/export` | Query `kind=packs\|compares\|runs`; JSON or CSV |

## Rubrics / criteria / runs

| Method | Path | Notes |
|--------|------|-------|
| GET/POST | `/api/rubrics` | Pack list / create |
| GET/PATCH | `/api/rubrics/:id` | Detail; lock/unlock via `{ status }` |
| GET/POST | `/api/rubrics/:id/criteria` | Criteria CRUD subset |
| PATCH | `/api/criteria/:id` | Reorder / evidence flags |
| GET/POST | `/api/runs` | Score runs; body references `rubricPackId` |
| GET | `/api/runs/:id` | Scores + evidence anchors |
| POST | `/api/runs/:id/evidence` | Attach evidence per criterion |

## Calibration / escalate / compare

| Method | Path | Notes |
|--------|------|-------|
| GET/POST | `/api/calibration-sets` | Human reference sets |
| POST | `/api/runs/:id/calibrate` | Apply set → scale boundaries |
| GET/POST | `/api/escalations` | Selective-trust queue |
| PATCH | `/api/escalations/:id` | resolve / dismiss |
| POST | `/api/compares` | `{ mode: "compiled_vs_holistic" \| "rubric_vs_preference", runIds }` |
| GET | `/api/compares/:id` | Winner + rationale fields |
| GET | `/api/scoreboard` | Aggregates; `?metaEval=1` for criterion judge accuracy |

## ARS module APIs

| Method | Path | Notes |
|--------|------|-------|
| GET/POST | `/api/recipes` | Recipe templates |
| POST | `/api/rubrics/:id/apply-recipe` | Apply template → criteria |
| GET/POST | `/api/policy-locks` | Measurement-spec lock ledger |
| POST | `/api/policy-locks/:id/rollback` | Restore prior lock pointer |
| GET/POST | `/api/judge-health` | Snapshots for pack/window |
| GET/POST | `/api/bias-suites` | Order / score-ID / reference gates |
| GET/POST | `/api/validity-anchors` | Gold anchors + warnings feed |
| GET | `/api/validity-warnings` | Derived agreement≠validity flags |

## Errors

- `401` missing/invalid bearer  
- `403` role/org mismatch  
- `409` lock conflict / idempotency replay with different body  
- `422` validation (missing evidence when required, etc.)

## Non-goals

Live model-provider judge APIs, clinical assessment endpoints, RLVR training reward APIs.
