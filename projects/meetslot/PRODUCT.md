# Meetslot

Meeting-room booking product experiment. Workflow: **A03 + A10**.

## Vision

Teams book rooms for time slots. Stresses conflict detection later; smoke is owned bookings CRUD.

## Scope by phase

| Phase | In scope |
|-------|----------|
| smoke | Auth, CRUD own bookings, isolation, `/health` |
| crud | Rooms + RBAC; notes migration |
| workflow | hold → confirmed → cancelled / completed |
| integrate | Payment/deposit webhook |
| scale | Pagination + rate limits |
| sustain | Minimal UI + production path |

## Sustain criteria

- [ ] API + minimal UI
- [ ] Authz + negatives
- [ ] `/health`, logs, THREATS.md
- [ ] Migrations + rollback notes
- [ ] README
- [ ] Vertical path: login → book → confirm
- [ ] FINDINGS

## Stack

Node + TypeScript, HTTP API, SQLite, node:test.
