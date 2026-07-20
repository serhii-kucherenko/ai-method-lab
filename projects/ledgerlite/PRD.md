# PRD — Ledgerlite smoke

## Goal

Authenticated users manage their own ledger entries. Others cannot see or change them.

## Acceptance criteria

1. Register + login return a bearer token usable on entry routes
2. Unauthenticated entry routes return 401
3. Owner can create, list, update, delete own entries
4. User B cannot read/update/delete User A’s entries
5. Automated tests cover the above
6. `/health` returns ok
7. THREATS.md notes auth surface

## Out of scope

Accounts graph, categories taxonomy, UI, transfers.
