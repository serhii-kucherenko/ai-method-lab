# depositgap — day-1 non-smoke contract

Use **after** htsroute clears and `depositgap-POST-HTSROUTE-RUN.md` passes. Prevents smoke-as-sustain for the next activation.

## First product commits must include

1. `PRODUCT.md` with unique claim (deposit vs assessed + § 1677g interest) + Kill A + forecast-only language.  
2. Port of paper goldens (≥23) into product tests — dual-impl or cross-check plan.  
3. Forecast API that returns duty_delta, days, interest, true_up (not a status field).  
4. Money-honesty surface early: deposit ≠ final; delinquency ≠ deposit gap (`depositgap-DAY-COUNT.md` note Z).

## Instant abort / revert if day-1 looks like

- One rate calculator page + dual approval  
- Day-count-only accrual without deposit vs assessed  
- “Sustain” with <4 pages or <3 aggregates  
- Digests that claim ACE / CBP / broker replacement  
- Calling § 1505(d) delinquency “the deposit gap”

## Phase exits (from `depositgap-PHASE-BRIEFS.md`)

| Phase | Must exit with |
|-------|----------------|
| smoke | Goldens green; honesty in PRODUCT |
| crud | Catalog + entry detail + RBAC |
| workflow | Batch + cash-impact + audit |
| integrate | Webhook + pagination + settings |
| scale | Concurrent entry independence |
| sustain | ≥8 pages; sustain matrix; try artifact; Kill A in digests |

## Source of truth

`docs/COMPREHENSIVE_PRODUCT.md` + `depositgap-COMPREHENSIVE-BLUEPRINT.md` + `depositgap-PRODUCT-FRAMING.md`. Iso audit: `QUEUE-ISO-AUDIT.md`.
