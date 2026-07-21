# bondstrip — day-count + accrued + cashflow strip (paper)

Docs-only. Method stress — not Bloomberg/Yield Book.

## Accrued (v0)

```text
periodic_coupon = face * coupon_rate / freq
accrued = periodic_coupon * (days_elapsed / days_in_period)
```

### 30/360 US (NASD simplified v0)

```text
days = (Y2-Y1)*360 + (M2-M1)*30 + (D2'-D1')
```

v0 rules before counting:

1. If D1 is 31 → D1' = 30  
2. If D2 is 31 and D1' is 30 or 31 → D2' = 30  

Semiannual period denominator = **180**.

### ACT/ACT (period)

`days_elapsed` = actual calendar days from previous coupon to settlement (exclusive end or inclusive per fixture — **exclusive end** v0: date diff in UTC midnights).  
`days_in_period` = actual days from previous coupon to next coupon.

## Cashflow strip (v0)

Given remaining coupon dates + maturity:

- One cashflow per coupon date: `amount = periodic_coupon`
- Final maturity also adds `face` (principal)
- Settlement before first remaining coupon: accrued uses previous→settle; strip starts at next coupon

## Rejects

- Unknown day-count
- `freq` not in `{1,2,4}`
- Settlement after maturity
- Settlement on coupon date → accrued = 0 (ex-coupon v0)

Still research. No product code.
