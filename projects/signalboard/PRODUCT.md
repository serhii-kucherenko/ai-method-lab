# Signalboard

Public status board product experiment. Workflow: **A03 + A05**.

## Vision

Teams post status updates; readers can see public signals; authors own their posts.

## Scope by phase

| Phase | In scope |
|-------|----------|
| smoke | Auth, CRUD own statuses, isolation, `/health`, adversarial review |
| crud | Projects/channels + roles |
| workflow | draft → published → archived |
| integrate | Outbound notify + inbound webhook |
| scale | Pagination + rate limits |
| sustain | Minimal UI + production path |

## Sustain criteria

- [x] API + minimal UI
- [x] Authz + negatives + adversarial review trail
- [x] `/health`, THREATS.md
- [x] Migrations + rollback notes
- [x] README
- [x] Vertical path: login → post → publish
- [x] FINDINGS with A05 reuse notes
