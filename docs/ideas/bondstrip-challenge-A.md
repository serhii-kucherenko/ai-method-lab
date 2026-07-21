# bondstrip — Challenge A (30/360 mid-period)

## Claim

Semiannual 6% on 1000 → $30 coupon; settle exactly mid 30/360 period → accrued $15.

## Attacks

1. Using ACT days mid-year would still be ~90/181 — different. Fixture A forces 30/360. Held.
2. Dual-signer approve accrued — anti-pattern. Held.
3. Kill A (Bloomberg) stands commercially — method stress OK.

## Outcome

Day-count choice is the non-isomorphic core vs calendar FSMs. Continue expanding fixtures.
