# Adversarial review (A05) — smoke

Reviewer: adversary-role (second pass)  
Builder: implementer-role

## Checklist

- [x] Correctness vs oracle AC
- [x] Security: authz on status routes; no IDOR (404 for non-owner)
- [x] Scope: no UI/OAuth creep
- [x] Tests: smoke suite present

## Findings

1. Passwords stored plaintext — **waived** for P-smoke (lab only).
2. Public list of all statuses not implemented — statuses are owner-scoped only this phase — **accepted**.

## Decision

Approve merge after waivers recorded.
