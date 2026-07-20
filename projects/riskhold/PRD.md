# Riskhold PRD

## Problem
Trading desks need to quarantine positions that breach risk limits and require two risk officers before clearing the hold.

## Scope
- Books with ACL (risk_officer / trader / viewer)
- Positions with exposure + risk limit
- States: open → held → cleared
- Gate: hold only if exposure > riskLimit
- Gate: dual risk officer clear when breached
- HMAC webhooks, pagination, rate limits, minimal UI

## Non-goals
Market data feeds, PnL, margin engines.
