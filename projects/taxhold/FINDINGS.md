# Taxhold Findings

## What we built
Desks (ACL) + periods (due + lateDays grace) + filings (`open→held→filed`) + dual tax officer for late filings + injectable clock + HMAC webhooks + pagination + rate limits + UI.

## What we tested
Rules + health/ACL/late dual-file/on-time file without dual/pagination/HMAC/rate-limit/UI + stale 409.

## What worked
- Late-days grace is a clear time-based cross-entity gate (due_at + lateDays vs now).
- Dual tax officer file reuses dual-control; on-time filings stay unblocked.

## What failed / was brittle
Nothing blocking sustain.

## Framework recommendation
Continue multi-aggregate + cross-entity gates (`docs/FRAMEWORKS.md`).
