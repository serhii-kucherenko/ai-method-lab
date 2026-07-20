# Adversarial review (A05) — crud

Reviewer: adversary-role  
Builder: implementer-role

## Checklist

- [x] RBAC matrix enforced (owner/member/viewer)
- [x] Negative non-member 404
- [x] Migration `002_task_severity` present
- [x] Smoke status isolation still green

## Findings

1. Severity is free-text — **waived** for crud tier (enum later).

## Decision

Approve.
