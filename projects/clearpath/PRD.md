# PRD — Clearpath smoke phase

## Goal

Authenticated users can create and manage their own requests. Others cannot see or change them.

## Acceptance criteria

1. Register + login return a bearer token usable on request routes
2. Unauthenticated request routes return 401
3. Owner can create, list, update, delete own requests
4. User B cannot read/update/delete User A’s requests
5. Automated tests cover the above
6. `/health` returns ok (A10)
7. THREATS.md notes auth surface (A10)

## Out of scope (this phase)

Projects, roles, approval state machine, UI, webhooks.
