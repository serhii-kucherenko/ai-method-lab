# Migrations

| Version | Change | Rollback |
|---------|--------|----------|
| 001_initial | Core schema | Drop tables in reverse FK order |
| 002_indexes | List/audit indexes | Drop indexes |

Forward-only in tests (in-memory). Production: keep SQL files immutable once applied.
