# settlecut — Challenge A (loss once)

## Claim

`adjusted = meter × delivery_factor` must happen before imbalance; applying loss after pricing would over/under settle.

## Attacks

1. Fixture A: 100 × 0.98 = 98 vs schedule 98 → zero imbalance. Held.
2. Double-apply loss → not in v0 API; anti-pattern documented.
3. Kill A (ISO vendors exist) — stands for GTM; method stress OK.

## Outcome

Loss-once invariant is the non-isomorphic core vs ledger FSMs. Continue expanding fixtures.
