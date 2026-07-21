# Safecase Findings

## What we built
Firms (ACL) + matters (retention days) + evidence + dual counsel archive + injectable clock + HMAC webhooks + pagination + rate limits + UI.

## What we tested
Rules + health/ACL/retention gate/dual-archive path/pagination/HMAC/rate-limit/UI + stale 409.

## What worked
- Retention days are a clear time-based cross-entity gate (opened_at + days vs now).
- Dual counsel archive reuses dual-control; injectable `nowIso` keeps tests deterministic.

## What failed / was brittle
Nothing blocking sustain.

## Framework recommendation
Continue multi-aggregate + cross-entity gates (`docs/FRAMEWORKS.md`).
