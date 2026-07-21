# Captable PRD

## Problem
Firms need to allocate round shares without oversubscribing authorization and require two counsel sign-offs before close.

## Scope
- Firms with ACL (counsel / clerk / viewer)
- Rounds with authorized share pool
- Allocations: proposed → held → closed
- Gate: create allocation only within share headroom
- Gate: close only after ≥2 distinct counsel approvals
- HMAC webhooks, pagination, rate limits, minimal UI

## Non-goals
Option vesting schedules, 409A valuation, board consents UI.
