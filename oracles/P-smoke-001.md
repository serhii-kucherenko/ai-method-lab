# Oracle — P-smoke-001

Agents must not edit this file during a cell run. Harness / human grades against it.

## Required behaviors

1. Unauthenticated requests to todo routes are rejected
2. User A can create/list/update/delete their own todos
3. User B cannot read/update/delete User A’s todos
4. Register + login produce a credential usable for authenticated calls
5. Automated tests exist and pass for the above

## Pass

All required behaviors demonstrated via automated tests (preferred) or recorded harness script.

## Fail tags (use in metrics)

`auth-missing` · `idor` · `crud-broken` · `no-tests` · `approach-violation`
