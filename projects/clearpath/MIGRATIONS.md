# Migrations — Clearpath

Applied in filename order by `src/db.ts`.

| Version | Purpose |
|---------|---------|
| `001_initial` | users, tokens, requests, projects, members, tasks, comments |
| `002_add_priority` | `tasks.priority` |
| `003_request_workflow` | `requests.version` + `request_audit` |
| `004_integrate` | `payments` + `webhook_events` |

## Rollback notes (lab)

SQLite `ALTER TABLE` drops are limited. For lab resets:

1. Stop the server
2. Delete the SQLite file (`CLEARPATH_DB` or `data/clearpath.db`)
3. Restart — migrations re-apply from empty

Do not hand-edit `schema_migrations` unless recreating the DB.
