# tariffstep — block walk + demand ratchet (paper)

Docs-only. Method stress — not CIS/Lodestar replacement.

## Energy charge (v0)

Given sorted ascending blocks `{up_to_kwh, rate}` (last block may be open-ended):

```text
remaining = total_kwh
for each block:
  take = min(remaining, block.width)   # width = up_to - prev_up_to
  charge += take * block.rate
  remaining -= take
```

## Demand ratchet (v0)

```text
billing_demand = max(current_peak_kw, prior_peak_kw * ratchet_pct)
demand_charge = billing_demand * demand_rate
```

## Rejects

- Unsorted / overlapping blocks
- Negative kWh or peak
- ratchet_pct not in (0, 1]
- Empty block schedule

Still research. No product code.
