# Payclaw PRD

## Problem
HR needs to recover payroll overpayments within overpay headroom and require two HR leads before release.

## Scope
- Firms with ACL (hr_lead / payroll / viewer)
- Payroll runs with owed + paid
- Clawbacks: requested → held → released
- Gate: create clawback only within overpay headroom
- Gate: release only after ≥2 distinct HR lead approvals
- HMAC webhooks, pagination, rate limits, minimal UI

## Non-goals
Tax filing, bank ACH, benefits.
