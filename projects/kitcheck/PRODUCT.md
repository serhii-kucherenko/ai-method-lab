# Kitcheck

Equipment checkout product experiment. Workflow: **A03 + A10**.

## Vision

Small teams loan gear (laptops, kits, tools). Requesters open loans; owners track return. Stresses availability and return cycles — distinct from approvals-only Clearpath.

## Users

- Requester — creates and revises loans
- Kit owner / member — manages kits and approvals (later phases)
- Viewer — read-only on shared kits

## Scope by phase

| Phase | In scope |
|-------|----------|
| smoke | Register/login, CRUD own loans, isolation, `/health` |
| crud | Kits + members RBAC; notes migration |
| workflow | requested → checked_out → returned / cancelled; audit; concurrency |
| integrate | Outbound notify + inbound HMAC webhook; idempotency |
| scale | Paginated loan lists; rate limits |
| **sustain** | See below |

## Sustain criteria (experiment “done”)

- [ ] Full-stack: API + minimal web UI for the happy path
- [ ] Authz + negative tests green
- [ ] `/health`, structured logs, THREATS.md
- [ ] Migrations with rollback notes
- [ ] README: how to run, test, deploy locally
- [ ] One vertical path: login → request loan → check out → return
- [ ] Product FINDINGS.md with promote/reuse notes

## Stack

Node + TypeScript, HTTP API, SQLite, node:test, simple HTML UI at sustain.

## Out of scope

Barcode scanners, RFID, multi-warehouse ERP, billing.
