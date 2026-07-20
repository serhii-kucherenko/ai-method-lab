# PRD — Policyforge

Policy packs enforce rules; violations need dual approval to waive.

## Acceptance criteria

1. Auth register/login; unauthenticated mutating routes → 401
2. Pack membership ACL (owner/author/auditor); outsiders → 403
3. Rules under packs; severity threshold gate on violation create
4. Violations: `open → waived|enforced`; `waived → enforced`
5. Dual distinct waive approvals required before `open → waived`
6. Optimistic concurrency on transition → 409
7. HMAC inbound webhooks; rule lists paginate; rate limit → 429
8. UI shell + vertical path
