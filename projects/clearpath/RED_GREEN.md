# RED → GREEN — Clearpath

## Smoke
1. RED — `test/oracle.test.ts`
2. GREEN — auth + request CRUD + `/health`

## CRUD
1. RED — `test/crud.test.ts`
2. GREEN — SQLite migrations + projects/tasks/comments RBAC

## Workflow
1. RED — `test/workflow.test.ts`
2. GREEN — `003_request_workflow` + transition/audit + optimistic version

## Integrate
1. RED — `test/integrate.test.ts`
2. GREEN — mock DepClient, HMAC webhook, idempotent events, 502 on dependency failure

## Scale
1. RED — `test/scale.test.ts`
2. GREEN — keyset pagination + per-token rate limit + SCALE.md

## Sustain
1. RED — `test/sustain.test.ts` (UI shell + login→submit→approve)
2. GREEN — `public/` UI, structured logs, MIGRATIONS.md, README
