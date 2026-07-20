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

- [ ] API + minimal UI
- [ ] Authz + negatives + adversarial review trail
- [ ] `/health`, THREATS.md
- [ ] Migrations + rollback notes
- [ ] README
- [ ] Vertical path: login → post → publish
- [ ] FINDINGS with A05 reuse notes
