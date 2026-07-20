# P-smoke-001 — Todo API + auth

```yaml
id: P-smoke-001
tier: P-smoke
effort: 1–2 days
oracle: oracles/P-smoke-001.md
```

## Goal

Build a small Todo API with user auth so we can measure whether an approach completes the full idea→merge loop on a minimal realistic stack.

## In scope

- Register / login (token or session)
- CRUD todos owned by the authenticated user
- Users cannot access others’ todos
- README with how to run tests

## Out of scope

- UI, email, OAuth providers, admin panel, multi-tenancy orgs

## Success metric

Oracle suite green; at least one merged (or merge-ready) PR trail matching the approach card.

## Stress focus

Basics: PRD→merge discipline, auth boundary, testability.
