# oshamult — day-1 non-smoke contract

Use **after** hours + `oshamult-PREFLIP-CHECKLIST.md` pass (`oshamult-FLIP-WHEN-CLEAR.md`).

## First product commits must include

1. `PRODUCT.md` with unique claim (GBP × **serial** remaining-balance + classification gates) + Kill A + forecast-only language.  
2. Port of paper goldens (≥26) into product tests — dual-impl or cross-check plan.  
3. Forecast API that returns each serial step’s remaining balance (`steps[]` per `oshamult-API-CONTRACT.md`) — not a single “discount %”.  
4. Money-honesty surface early: serial ≠ additive; v0 order ≠ live FOM until versioned dual flip (`oshamult-SIZE-TABLE.md`).

## Instant abort / revert if day-1 looks like

- One discount calculator + dual approval  
- Additive percentage sum presented as FOM  
- Silent claim of OIS / OSHA parity while still on v0 order  
- Size reduction applied to willful/repeat  
- “Sustain” with <4 pages or <3 aggregates  

## Phase exits (from `oshamult-PHASE-BRIEFS.md`)

| Phase | Must exit with |
|-------|----------------|
| smoke | Goldens green; honesty + serial-order debt in PRODUCT |
| crud | Citations catalog + detail + money honesty |
| workflow | Batch + audit |
| integrate | Webhook + pagination + org settings |
| scale | Concurrent citation independence |
| sustain | ≥7 pages; sustain matrix; try artifact; Kill A in digests |

## Source of truth

`docs/COMPREHENSIVE_PRODUCT.md` + `oshamult-COMPREHENSIVE-BLUEPRINT.md` + `oshamult-PRODUCT-FRAMING.md`. Iso audit: `QUEUE-ISO-AUDIT.md`.
