# c1592 — algorithm (paper)

**v0 claim:** statutory maximum under 19 U.S.C. § 1592(c) for a single violation story.

## Inputs

| Field | Meaning |
|-------|---------|
| `culpability` | `negligence` \| `gross_negligence` \| `fraud` |
| `duty_loss` | Loss of duties, taxes, and fees (≥ 0). Treat `0` as **no duty-loss path**. |
| `domestic_value` | Domestic value of the merchandise (> 0) |
| `dutiable_value` | Dutiable value (> 0); used when duty_loss is 0 |
| `flat_2x_cheat` | If true → reject (forces 2× on all culpabilities) |
| `dual_approver_cheat` | If true → reject |
| `ignore_domestic_cap` | If true and duty-loss path would bind on domestic value → reject |

## Outputs

| Field | Meaning |
|-------|---------|
| `status` | `ok` \| `reject` |
| `penalty_max` | Statutory maximum (when ok) |
| `branch` | `fraud_domestic` \| `lesser_of_duty` \| `pct_dutiable` |
| `reason` | Reject reason |

## Rules

1. Reject cheats first.
2. If `culpability === fraud` → `penalty_max = domestic_value`, branch `fraud_domestic`.
3. Else if `duty_loss > 0`:
   - multiple = 2 (negligence) or 4 (gross_negligence)
   - candidate = multiple × duty_loss
   - if `ignore_domestic_cap` and domestic_value < candidate → reject
   - else `penalty_max = min(domestic_value, candidate)`, branch `lesser_of_duty`
4. Else (no duty loss):
   - pct = 0.20 (negligence) or 0.40 (gross_negligence)
   - `penalty_max = pct × dutiable_value`, branch `pct_dutiable`
5. Bad inputs (non-positive values where required, unknown culpability) → `bad_inputs`.

## Worked toys

| Story | Result |
|-------|--------|
| Negligence, duty_loss $100k, domestic $500k | max **$200k** (2× binds) |
| Negligence, duty_loss $100k, domestic $150k | max **$150k** (domestic binds) |
| Negligence, no duty loss, dutiable $100k | max **$20k** (20%) |
| Gross negligence, no duty loss, dutiable $100k | max **$40k** (40%) |
| Fraud, domestic $80k (even if 4× duty would be higher) | max **$80k** |
| Flat 2× cheat | reject |

## Prior disclosure (fence)

Not in v0 happy path. Optional later input must not silently invent investigation-start dates (`c1592-PD-FENCE.md`).
