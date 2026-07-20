# Clearpath

**Product experiment** in the Method Lab portfolio. Approvals and requests for small teams.

## Vision

Users submit requests; reviewers approve or reject with an audit trail. Grows into a durable FE+BE product, not a throwaway demo.

## Users

- Requester — creates and revises requests
- Reviewer — approves or rejects
- Owner — manages members and settings

## Scope by phase

| Phase | In scope |
|-------|----------|
| smoke | Register/login, create/list own requests, isolation |
| crud | Projects, requests, comments; owner/member/viewer RBAC; migrations |
| workflow | draft → submitted → approved/rejected → revise; audit; concurrency |
| integrate | Outbound notify webhook + inbound HMAC webhook; idempotency |
| scale | Paginated request lists; rate limits |
| **sustain** | See below |

## Sustain criteria (experiment “done”)

- [ ] Full-stack: API + minimal web UI for the happy path
- [ ] Authz + negative tests green
- [ ] `/health`, structured logs, THREATS.md
- [ ] Migrations with rollback notes
- [ ] README: how to run, test, deploy locally
- [ ] One vertical “production-shaped” path: login → submit → approve
- [ ] Product FINDINGS.md completed with promote/reuse notes

## Stack (defaults)

Node + TypeScript, HTTP API, SQLite, Vitest/node:test, simple HTML/TS UI or lightweight frontend.

## Out of scope (even at sustain)

SSO, multi-org billing, mobile apps, full BPM engine.
