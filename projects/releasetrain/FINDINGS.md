# Releasetrain Findings

## What we built

Multi-party release train: trains (lead/engineer/approver), services, releases (planned→staging→prod→rolled_back), checklist gates, dual approval, rollback endpoint, webhooks, pagination, UI.

## What we tested

19/19 green across rules, smoke, crud, workflow, integrate, scale, sustain. Zero flakes.

## What worked

- Domain rules (checklist-before-staging, dual-approval-before-prod, rollback-only-from-prod) are the method-stress signal — not a noun rename
- Same A03+A10 + harness loop as claimdesk/screenlane reproduced cleanly (repeatability check)

## What failed

Nothing this run.

## Framework recommendations

Confirmed: multi-aggregate shape (`docs/FRAMEWORKS.md` §2) + harness loop (`protocols/HARNESS_LOOP.md`) produce comparable evidence across products.
