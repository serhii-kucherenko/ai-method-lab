# tariffstep — how the math maps to real tariff language

This is a short guide for a skeptical reader. We take common, published billing rules and show which of our 25 scenarios exercise them. We are **not** claiming to replace a full utility billing system.

## Rule 1 — Stepped (tiered) energy charge

**What utilities say (plain words):** Usage is split into blocks. The first block of kilowatt-hours has one price; the next block has another; anything above the last breakpoint uses a final price.

**Where we saw it:** California commission training describes tiered volumetric rates (baseline then higher tiers). Industry rate-design surveys describe inclining and declining block rates.

**Which scenarios check it:**

| Scenario | What it proves |
|----------|----------------|
| A | Normal walk across three blocks |
| H / I | Exact hit on a breakpoint (no off-by-one) |
| C / J | Usage spills into the open-ended top block |
| N | Two-block custom schedule |
| O | Decimal usage and rates still round cleanly |
| Y | Very large usage still walks the ladder |

## Rule 2 — Demand ratchet (billing demand floor)

**What utilities say (plain words):** Billed demand is the larger of (a) this month’s peak kilowatts, or (b) a percentage of a past high peak. A common pattern is about 80% of a prior peak for many months afterward.

**Where we saw it:** Pacific Northwest National Laboratory’s Federal Energy Decision System FAQ describes this pattern, including the “80% of a past peak” example.

**Which scenarios check it:**

| Scenario | What it proves |
|----------|----------------|
| B | Ratchet binds — billed demand higher than this month’s peak |
| K | Ratchet equals current peak (tie case) |
| L | 100% ratchet (full prior peak floor) |
| M | Small percentage × large prior peak |
| W / X | Demand price sensitivity (high vs low $/kW) |

## Rule 3 — Reject bad tariff inputs

**Why it matters:** Spreadsheet mistakes often start with unsorted tiers, empty schedules, or illegal percentages.

| Scenario | Reject reason |
|----------|---------------|
| D | Empty block schedule |
| E / U / V | Broken / unsorted breakpoints |
| F / R / S | Illegal ratchet percentage |
| P / Q | Negative usage or peak |
| T | Negative block rate |

## What this mapping does *not* prove

- Full multi-season tariff books, time-of-use hours, or taxes
- That no commercial billing system already does this (they do)
- That analysts will stop using spreadsheets after a first prototype

Those gaps stay as falsifiers. This lab product is a **workflow experiment** on the checkable math core only.
