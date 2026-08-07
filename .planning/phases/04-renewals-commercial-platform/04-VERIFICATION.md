---
phase: 04-renewals-commercial-platform
status: passed
verified: 2026-08-07
---

# Phase 4 Verification: Renewals, commercial, platform

## Goal

FinOps leads leave with a renewal action pack; strangers can price, demo, onboard, and run at least five flows; platform baselines (org/members, HMAC webhooks, export, audit, rate-limit feedback) work.

## Must-haves

| Truth | Status | Evidence |
|-------|--------|----------|
| Renewal packs buy/reduce/hold (UI-01) | pass | 04-01 SUMMARY + domain-api renewals pack |
| /pricing seats + connected accounts, no live checkout (COM-01) | pass | smoke-mkt commercial |
| Guided /demo Import → Match → Gap → Renew + A vs B (COM-02) | pass | smoke-mkt |
| /onboarding checklist + progress (COM-03) | pass | smoke-mkt |
| /flows ≥5 journeys (COM-04) | pass | smoke-mkt |
| Org/members Bearer APIs + /settings (PLT-01) | pass | domain-api org + smoke-ui settings |
| Audit under settings (PLT-04) | pass | domain-api audit + settings panel |
| Webhook HMAC + Idempotency-Key 409 (PLT-02) | pass | domain-api webhook |
| Export JSON/CSV (PLT-03) | pass | domain-api export + renewals/settings UX |
| Rate-limit 429 + headers on mutating /api (PLT-05) | pass | domain-api middleware + smoke-ui api 429 |
| Anti-desk IA (D-12) | pass | smoke-mkt/smoke-ui seven primary routes |

## Automated verification

```text
cd projects/commitment-coverage-studio && npm test && npm run build
```

- **Tests:** 66 passed (0 failed)
- **Build:** Next.js 16.3.0 green (middleware deprecation warning only; still active as Proxy)

## Pages shipped

`/pricing` `/demo` `/onboarding` `/flows` `/settings` (+ Phase 1-3 domain routes)

## Plans

| Plan | SUMMARY | Status |
|------|---------|--------|
| 04-01 | 04-01-SUMMARY.md | complete |
| 04-02 | 04-02-SUMMARY.md | complete |
| 04-03 | 04-03-SUMMARY.md | complete |
| 04-04 | 04-04-SUMMARY.md | complete |
| 04-05 | 04-05-SUMMARY.md | complete |

## Gaps / watch-outs for Phase 5

- Next.js 16 warns `middleware` → `proxy` rename; keep until sustain/codemod
- Live app-up smoke + README screenshots still Phase 5
- Feature bar count (≥25) and try.html dual-claim digest still Phase 5

## Verdict

**PASSED** — Phase 4 success criteria met. Next: plan Phase 5 sustain bar.
