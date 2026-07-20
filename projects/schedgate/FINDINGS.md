# Schedgate Findings

## What we built
Calendars (ACL) + bookings + overlap detection + dual admin override + HMAC webhooks + pagination + rate limits + UI.

## What we tested
Rules + health/ACL/overlap gate/dual-override path/pagination/HMAC/rate-limit/UI + stale 409.

## What worked
- Overlap gate is a clear cross-entity constraint (booking vs confirmed peers).
- Dual override only when conflicted mirrors the hot-path dual-control pattern.

## What failed / was brittle
Nothing blocking sustain.

## Framework recommendation
Continue multi-aggregate + cross-entity gates (`docs/FRAMEWORKS.md`).
