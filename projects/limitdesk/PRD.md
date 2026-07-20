# Limitdesk PRD

## Problem
Credit desks need draw requests that respect facility ceilings and require two credit officers before release.

## Scope
- Desks with ACL (credit_officer / analyst / viewer)
- Credit lines with utilization ceiling
- Draws: requested → held → released
- Gate: create draw only within available headroom
- Gate: release only after ≥2 distinct credit officer approvals
- HMAC webhooks, pagination, rate limits, minimal UI

## Non-goals
Interest accrual, covenants, external rating feeds.
