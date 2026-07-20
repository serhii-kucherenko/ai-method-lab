# Migrations

| Version | Change | Rollback |
|---------|--------|----------|
| 001_initial | users, tokens, loans | Drop tables (dev only) |
| 002_kits_rbac | kits, members, tasks (+ notes), comments | Drop new tables |
| 003_loan_workflow | loan version + audit; normalize statuses | Drop audit; ignore version |
| 004_integrate | payments + webhook_events | Drop tables |

Smoke/CRUD use SQLite file or `:memory:` in tests.
