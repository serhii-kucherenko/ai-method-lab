# Migrations — Signalboard

| Version | Purpose |
|---------|---------|
| `001_initial` | users, statuses, projects/RBAC, tasks, comments |
| `002_task_severity` | task severity |
| `003_status_workflow` | status version + audit |
| `004_integrate` | payments + webhook_events |

Rollback (lab): delete SQLite file and restart.
