# 155 — Judge Reliability Studio lessons

## What shipped

A judge-reliability soft-sim for platform and eval engineering leads: version judge packs, run item-response diagnostics (ability, difficulty, discrimination), flag unreliable items and unstable judges, and compare IRT-aware reliability gates against agreement-only baselines.

## Category practices

Thirty dual-implementation golden cases verify the IRT and agreement-only paths independently. The platform surface includes bearer access, team members, signed idempotent webhooks, audit/export framing, search/pagination/rate-limit controls, and explicit method limits.

## What we learned

1. Pairwise agreement is a weak proxy for measurement stability — IRT diagnostics expose item-level failure modes agreement dashboards hide.
2. Flagging unreliable items is a product behavior, not an error state: reliability should control review load before release.
3. IRT claims need a visible honesty fence when the product is a soft-simulation.

## Deferred

Live judge write-back, certified psychometric validation, and production identity provisioning.
