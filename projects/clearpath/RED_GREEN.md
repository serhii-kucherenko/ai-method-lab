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
