# Migrations — Ledgerlite

| Version | Purpose |
|---------|---------|
| `001_initial` | users, entries, ledgers/memberships, tasks, comments |
| `002_task_notes` | `tasks.notes` |
| `003_entry_workflow` | entry status/version + audit |
| `004_integrate` | payments + webhook_events |

## Rollback (lab)

Delete the SQLite file and restart so migrations re-apply from empty.
