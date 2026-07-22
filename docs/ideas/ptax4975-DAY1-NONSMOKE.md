# ptax4975 — day-1 non-smoke contract

Use **after** `check-ptax4975-hour-status.mjs` → `FLIP_PATH_READY` and `ptax4975-FLIP-WHEN-CLEAR.md` is walked.

## First product commits must include

1. `PRODUCT.md` with unique claim (§ 4975 15% × year-parts + 100% if uncorrected + greater-of FMV) + Kill A + forecast-only language.
2. Port of paper goldens (≥35) into product tests — dual-impl or cross-check plan.
3. Forecast API that returns initial_tax, additional_tax, total (not a flat once-excise field).
4. Money-honesty surface early: not Form 5330; highest-during-period FMV still fenced (`ptax4975-FMV-FENCE.md`); taxable-period end dates still fenced (`ptax4975-TAXABLE-PERIOD-FENCE.md`).

## Instant abort / revert if day-1 looks like

- One “15% once” calculator + dual approval
- Claiming IRS / DOL / Form 5330 filing replacement
- Silently “fixing” v0 to highest-FMV-during-period without dual suite bump
- Claiming automatic (f)(2) notice/assessment/correction year-parts without dual suite bump
- “Sustain” with <4 pages or <3 aggregates

## Phase exits (from `ptax4975-PHASE-BRIEFS.md`)

| Phase | Must exit with |
|-------|----------------|
| smoke | Goldens green; honesty + FMV + taxable-period fences in PRODUCT |
| crud | Transactions catalog + detail + money honesty |
| workflow | Batch + audit |
| integrate | Webhook + pagination + org settings |
| scale | Concurrent PT independence |
| sustain | ≥7 pages; sustain matrix; try artifact; Kill A in digests |

## Source of truth

`docs/COMPREHENSIVE_PRODUCT.md` + `ptax4975-COMPREHENSIVE-BLUEPRINT.md` + `ptax4975-PRODUCT-FRAMING.md`.
