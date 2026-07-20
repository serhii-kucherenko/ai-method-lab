# P-crud-001 — Multi-entity CRUD + roles

```yaml
id: P-crud-001
tier: P-crud
effort: 3–5 days
oracle: oracles/P-crud-001.md
```

## Goal

Projects, tasks, and comments with role-based access (owner / member / viewer).

## In scope

- Entities: Project, Task, Comment
- Roles and permission matrix
- Invite member by identity (email or username stub OK)
- Migrations for schema evolution at least once mid-project

## Out of scope

- Billing, realtime collab, file uploads

## Success metric

Oracle green including permission negatives; migration applied cleanly.

## Stress focus

ERD churn, permissions, incremental schema change.
