# c1592

## Unique claim

Forecast **19 U.S.C. § 1592(c) statutory maximum** as culpability × (lesser-of domestic value vs 2×/4× duty loss | 20%/40% of dutiable value when no loss); fraud = domestic value — against golden fixtures.

## Kill A honesty

Customs counsel and CBP already handle § 1592 cases. This product is a **statutory-maximum forecast / method experiment**, not a mitigated-guidelines engine or counsel replacement.

## Forecast shape

API returns `penalty_max` and `branch` (never a single flat-2× field as the happy path).

## Forbidden claims

1. Replaces CBP / counsel / assessed penalty letters
2. Flat “2× duties always” as the happy path
3. Silent mitigated-guideline parity (`c1592-MITIGATION-FENCE.md`)
4. Silent automatic prior disclosure / investigation-start (`c1592-PD-FENCE.md`)
5. Fixture pass counts as market proof
6. Dual-approval gates as the unique domain rule

## Worked toys (illustrative)

| Story | Result |
|-------|--------|
| Negligence, $100k loss, $500k domestic | max **$200k** (2× binds) |
| Negligence, $100k loss, $150k domestic | max **$150k** (domestic binds) |
| Negligence, no loss, $100k dutiable | max **$20k** (20%) |
| Fraud, $80k domestic | max **$80k** |

Label as forecast toys in digests — never as assessed CBP penalties.

## Method experiment

Standard build workflow ladder under `projects/c1592/`. Counsel / CBP still win commercially.
