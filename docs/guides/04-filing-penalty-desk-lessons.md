# Guide 04 — Filing Penalty Desk: what we learned

**Product display name:** Filing Penalty Desk  
**Slug:** `filing-penalty-desk` (folder + cell ids only)  
**Never brand:** statute-code costumes (legacy research id stays paper-only)

## What we built

A multi-page cash-forecast desk for late-file and late-pay tax additions: month-walk engine with same-month file reduction, levy bump, caps, and minimum floor — plus scenario compare, batch, audit CSV, signed webhooks, and an offline try page.

## What worked

- Mature display name from day one (Correction 6)
- Paper dual goldens (≥25) before product UI
- Explicit reject paths for flat-fee and dual-approver cheats
- Full ladder through sustain with UI critical paths on all eight pages
- Tutor guide before product-complete email

## What to improve next time

1. **Scenario page early.** Naive vs correct dollars teaches the unique claim faster than catalog alone.
2. **Keep FTF and FTP separate** in every money surface — never one unlabeled “penalty.”
3. **Webhook HMAC + idempotency** in integrate, not bolted on at sustain.
4. **Offline try** must embed the month-walk toy ($450 / $50) without network deps.

## Reuse checklist

- [ ] Display name + slug chosen before fixtures dominate conversation
- [ ] Roadmap + PM go before `projects/`
- [ ] Blueprint lists ≥15 features mapped to ≥6 pages and ≥4 aggregates
- [ ] Kill A honesty on the honesty page and in digests
- [ ] No statute-code brand in UI strings or email subjects
- [ ] Guide filed under `docs/guides/` before product-complete email
