# PRD — Screenlane

Hiring boards screen candidates with weighted scorecards.

## Users

- Board **owner** / **recruiter**: manage jobs, candidates, applications, decide
- Board **reviewer**: read + score while screening; cannot create jobs

## Acceptance criteria

1. Auth register/login with bearer tokens; unauthenticated mutating routes → 401
2. Boards have membership ACL; outsiders → 403
3. Jobs + candidates belong to a board; applications cannot cross boards
4. Criteria required before `applied → screening`
5. Scores (0–5) only while `screening`; weighted average exposed
6. `screening → decided` requires `hired` | `rejected`; illegal transitions → 400; stale version → 409
7. Audit log records transitions; decision fires outbound dep notify + webhook record
8. Inbound webhooks verify HMAC; job lists paginate; rate limit → 429
9. UI shell + vertical path available for sustain

## Out of scope

OAuth, email, calendar interviews, PDF resumes, multi-region.
