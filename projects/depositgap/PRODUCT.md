# Depositgap

Workflow / FP&A **forecast** experiment: model AD/CVD **cash deposit vs final assessed** duty delta **plus** § 1677g interest over a publication→liquidation window — against golden fixtures.

## Unique claim

Deposit→assessed rate assignment + duty delta + statutory interest window (simple 365-day toy) + rate-class labels. Rejects deposit-as-final / skip-interest cheats.

## Kill A (required)

Brokers and customs still own liquidation. This product is a **forecast / method experiment**, not an ACE / CBP / broker replacement.

## Forbidden claims

- Replaces broker / ACE / CBP liquidation
- Deposit rate as final landed cost
- Calling post-liquidation delinquency (§ 1505(d)) “the deposit gap”
- Fixture pass counts as market proof
- Dual-approval gates as the domain rule
- CBP day-count / ACE bill parity (v0 uses a simple calendar toy)

## Money honesty

Every forecast returns **duty_delta**, **days**, **interest**, and **true_up** separately. `skip_interest=true` with days > 0 → reject.

## UI harness

Static multi-page HTML under `public/` served by the Node HTTP app. Smoke UI critical path: GET `money-honesty.html` and assert Kill A / deposit≠final copy. Catalog and entry-detail pages ship as stubs in smoke; full critical paths unlock in crud+.

## Smoke exit

- ≥23 paper goldens green (dual-impl A/B)
- Forecast API returns duty_delta / days / interest / true_up
- Kill A + forecast-only language in this file and honesty page
