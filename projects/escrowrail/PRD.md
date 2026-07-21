# Escrowrail PRD

## Problem
Trust desks need to pay from escrow without dipping below a protected floor, and require two officers before release.

## Scope
- Workspaces with ACL (escrow_officer / clerk / viewer)
- Accounts with balance + floor
- Disbursements: requested → held → released
- Gate: create disbursement only within available-above-floor
- Gate: release only after ≥2 distinct escrow officer approvals
- HMAC webhooks, pagination, rate limits, minimal UI

## Non-goals
Bank rails, KYC, multi-currency FX.
