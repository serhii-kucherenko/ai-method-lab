# Claimdesk Findings

## What we built

Multi-party insurance claims desk: desks (supervisor/adjuster/claimant), policies, claims (filed→review→settled), evidence, reserve/payout rules, webhooks, pagination, UI.

## What we tested

17/17 green across rules, smoke, crud, workflow, integrate, scale, sustain. Zero flakes.

## What worked

- Domain rules (reserve-before-review, evidence-before-settle, payout≤reserve) are the method-stress signal — not the noun rename
- Same A03+A10 + harness loop as screenlane reproduced cleanly (repeatability check)

## What failed

Nothing this run.

## Framework recommendations

Confirmed: multi-aggregate shape (`docs/FRAMEWORKS.md` §2) + harness loop (`protocols/HARNESS_LOOP.md`) produce comparable evidence across products.
