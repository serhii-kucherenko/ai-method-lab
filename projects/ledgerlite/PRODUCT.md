# Ledgerlite

Personal finance ledger product experiment. Workflow: **A03 + A10**.

## Vision

Users track income/expense entries with accounts over time. Schema-heavy cousin of Clearpath to stress migrations and ERD discipline.

## Scope by phase

| Phase | In scope |
|-------|----------|
| smoke | Register/login, CRUD own ledger entries, isolation, `/health` |
| crud | Accounts, categories, entries with RBAC-ish sharing later |
| workflow | Transfer / reconcile state machine |
| integrate | Bank-feed-like webhook stub |
| scale | Paginated entry lists + rate limits |
| sustain | Minimal UI + production path |

## Sustain criteria

- [ ] API + minimal UI happy path
- [ ] Authz + negative tests green
- [ ] `/health`, logs, THREATS.md
- [ ] Migrations + rollback notes
- [ ] README run/test/deploy
- [ ] Vertical path: login → add entry → list
- [ ] FINDINGS with reuse notes

## Stack

Node + TypeScript, HTTP API, SQLite, node:test.
