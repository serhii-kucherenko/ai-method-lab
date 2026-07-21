# settlecut — imbalance settlement algorithm (paper)

Docs-only. Method-stress model — not a full ISO/RTO clone.

Working model (common industry shape): loss-adjust meter first, then difference vs schedule, then price.

```text
adjusted_kwh = meter_kwh * delivery_factor
imbalance_kwh = adjusted_kwh - schedule_kwh
charge = imbalance_kwh * imbalance_price   # signed: short (+) buy / long (−) sell in v0 scalar
```

## Inputs (per settlement interval)

| Field | Meaning |
|-------|---------|
| `interval_start` | ISO local start of interval (e.g. hour or 15-min) |
| `meter_kwh` | Raw metered energy for interval |
| `schedule_kwh` | Nominated / contracted quantity pinned for that interval |
| `delivery_factor` | Loss delivery factor δ (apply **once**, pre-imbalance) |
| `imbalance_price` | $/kWh for this interval (buy or sell collapsed to one signed price in v0) |

## Invariants

1. Delivery factor applied **exactly once** before imbalance (no double loss).
2. Interval alignment: meter and schedule must share the same `interval_start` (reject mismatch).
3. DST: intervals are absolute timestamps; do not invent a 25th hour by naive local clocks in fixtures.
4. Zero schedule with nonzero meter still produces imbalance.
5. Reject `delivery_factor <= 0`.

## Anti-patterns

- Dual-signer “settlement approve”
- Applying loss after price
- Generic ledger without interval math

Still research. No product code.
