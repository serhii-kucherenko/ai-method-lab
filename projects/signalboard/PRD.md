# PRD — Signalboard smoke

## Goal

Authenticated users manage their own status posts. Others cannot mutate them.

## Acceptance criteria

1. Register + login return bearer token
2. Unauthenticated status routes return 401
3. Owner CRUD on own statuses
4. User B cannot read/update/delete User A private statuses (404)
5. Tests cover the above
6. `/health` ok
7. ADVERSARIAL_REVIEW.md from a distinct reviewer role

## Out of scope

UI, realtime, OAuth.
