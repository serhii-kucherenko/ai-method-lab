# c1592 — acceptance fences (paper)

**Paper only.** Hours hold. Paste into product ACCEPTANCE / honesty tests on flip.

## Must assert on honesty page + digests

1. Kill A — counsel/CBP win commercially; this is a ceiling forecast.
2. Mitigation fence — statutory max ≠ mitigated CBP starting point.
3. PD fence — no automatic prior disclosure / investigation-start.

## Must assert in API / goldens

1. Fraud → `penalty_max = domestic_value`, branch `fraud_domestic`.
2. Duty loss > 0 → lesser-of domestic vs 2×/4× loss, branch `lesser_of_duty`.
3. Duty loss = 0 → 20%/40% of dutiable, branch `pct_dutiable`.
4. Rejects: `flat_2x_cheat`, `dual_approver_cheat`, `ignore_domestic_cap` (when understating), `bad_inputs`.

## Fail acceptance if

- UI leads with “2× duties” as the only number
- Copy says “CBP will assess” or “mitigated amount”
- Prior disclosure toggles invent dates without a dual suite
- Dual-approver board is presented as the domain rule
