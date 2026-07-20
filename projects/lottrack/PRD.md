# Lottrack PRD

## Problem
Warehouses need lot quarantine when inspections spike severity, with two QA leads before clearing hold.

## Scope
- Warehouses with ACL (qa_lead / inspector / clerk)
- Lots with severity threshold
- Inspections while open
- States: open → held → cleared
- Gate: hold only if hot (max severity ≥ threshold)
- Gate: clear only after ≥2 distinct QA clears when hot
- HMAC webhooks, pagination, rate limits, minimal UI

## Non-goals
WMS putaway, barcode hardware, ERP sync.
