# Grantlane Findings

## What we built

Multi-party grant program desk: programs (admin/officer/reviewer), applications (submitted→active→closed), dual-reviewer sign-off, milestone budgets with clawback, webhooks, pagination, UI.

## What we tested

24/24 green across rules, smoke, crud, workflow, integrate, scale, sustain. Zero flakes.

## What worked

- Domain rules (dual sign-off, milestone budget ceiling, close gate, clawback) are the method-stress signal — not the noun rename
- Same A03+A10 + harness loop as claimdesk/releasetrain reproduced cleanly (repeatability check)

## What failed

Nothing this run.

## Framework recommendations

Confirmed: multi-aggregate shape ([docs/FRAMEWORKS.md](../../docs/FRAMEWORKS.md) §2) + harness loop ([protocols/HARNESS_LOOP.md](../../protocols/HARNESS_LOOP.md)) produce comparable evidence across products.
