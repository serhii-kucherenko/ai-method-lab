# c1592 — day-1 non-smoke contract

Use **after** `check-c1592-hour-status.mjs` → `FLIP_PATH_READY` and `c1592-FLIP-WHEN-CLEAR.md` / `c1592-FLIP-DAY-SCRIPT.md` are walked.

## First product commits must include

1. `PRODUCT.md` with unique claim (§ 1592(c) culpability × duty-loss / no-loss + lesser-of domestic) + Kill A + forecast-only language.
2. Port of paper goldens (≥30) into product tests — dual-impl green.
3. Forecast API that returns `penalty_max` + `branch` (not a flat 2× field).
4. Money-honesty surface early: not CBP assessed; not mitigated guidelines (`c1592-MITIGATION-FENCE.md`); prior disclosure not automatic (`c1592-PD-FENCE.md`).

## Instant abort / revert if day-1 looks like

- Flat “2× duties always” calculator + dual approval
- Claiming CBP / counsel / mitigated-guideline replacement
- Silently “fixing” v0 to mitigated starting points without dual suite bump
- Silently inventing investigation-start / PD dates without dual suite bump
- “Sustain” with <4 pages or <3 aggregates

## Phase exits

| Phase | Must exit with |
|-------|----------------|
| smoke | Goldens green; honesty + PD + mitigation fences in PRODUCT |
| crud | Violations catalog + detail + money honesty |
| workflow | Batch + audit |
| integrate | Webhook + pagination + org settings |
| scale | Concurrent run independence |
| sustain | ≥7 pages; try artifact; Kill A in digests |

## Source of truth

`docs/COMPREHENSIVE_PRODUCT.md` + `c1592-COMPREHENSIVE-BLUEPRINT.md` + `c1592-PRODUCT-FRAMING.md` + `c1592-PRODUCT-DRAFT.md` + `c1592-ACCEPTANCE.md`.
