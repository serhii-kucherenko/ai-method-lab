# irc6651 — paper toy examples (expected dollars)

**State:** `adversarial` research toys. Named scenarios with expected **§ 6651 addition** dollars. Not fixtures. Not product code.

Assumptions common to all toys unless noted:

- “Month” = any calendar month or **partial** month (full charge).
- FTF base = § 6651(b)(1) net amount due (tax required to be shown − timely payments/credits) — **fixed** after the payment due date.
- FTP base for a month = unpaid tax at the **beginning** of that month (§ 6651(b)(2)).
- When both (a)(1) and (a)(2) apply in a month: FTF for that month is reduced by that month’s FTP (§ 6651(c)(1)).
- § 6601 interest **excluded** from expected totals.

---

## Toy 1 — `SameMonth45` (IRS 4.5% + 0.5% shape)

**Facts:** Net amount due $10,000. Return unfiled and tax unpaid for **one** month (both penalties apply). No notice-of-levy bump. Not >60 days yet (or minimum not binding).

| Model | FTF | FTP | Combined |
|-------|-----|-----|----------|
| Naive 5% + 0.5% (no (c)(1)) | $500 | $50 | **$550** |
| **Correct (c)(1)** | $450 | $50 | **$500** |

**Expected (lab oracle):** combined additions **$500**. Fantasy error if naive: **+$50**.

---

## Toy 2 — `HalfPayMonth3` (mid-stream payment shrinks FTP only)

**Facts:** Net amount due $40,000. Unfiled months 1–3. Unpaid in full for months 1–2. On the first day of month 3, taxpayer pays **$20,000** (FTP base for month 3 = $20,000). Still unfiled through month 3. Rate 0.5% FTP; no (d) bump; aggregate under 25% caps.

| Month | FTF raw (5%) | FTP | FTF after (c)(1) |
|-------|--------------|-----|------------------|
| 1 | $2,000 | $200 | $1,800 |
| 2 | $2,000 | $200 | $1,800 |
| 3 | $2,000 | $100 | $1,900 |

| Model | Combined |
|-------|----------|
| Naive 5%+0.5% × 3 on $40k, ignore payment & (c)(1) | $6,600 |
| Payment-aware but no (c)(1) | $6,500 |
| **Correct** | FTF $5,500 + FTP $500 = **$6,000** |

**Expected (lab oracle):** **$6,000** combined § 6651 additions.

---

## Toy 3 — `MinFloor2025` (>60-day minimum, lesser of floor or underpayment)

**Facts:** TY with return due date in **2025** (IRS table minimum **$510**). Tax net due **$200**. Return filed **>60 days** late; tax paid with the late return (treat FTP months as 0 for this toy — focus on file minimum).

| Model | FTF |
|-------|-----|
| 5% × 1 month only | $10 |
| Flat table floor without lesser-of | $510 |
| **Correct** lesser of $510 or 100% of $200 underpayment | **$200** |

**Expected (lab oracle):** FTF **$200**; FTP **$0**; combined **$200**. Fantasy if flat floor: **+$310**.

---

## Toy 4 — `LevyBumpTwoPlusTwo` (§ 6651(d) 1% after levy-intent notice)

**Facts:** Return already filed on time. Unpaid tax constant **$8,000**. Two months at ordinary **0.5%**, then notice of intent to levy; after the statutory 10-day window, two further months at **1%**. No FTF.

| Segment | Rate | FTP |
|---------|------|-----|
| Months 1–2 | 0.5% | $80 |
| Months 3–4 | 1% | $160 |
| **Correct total** | | **$240** |

| Model | Combined |
|-------|----------|
| Always 0.5% for 4 months | $160 |
| **Correct with (d) bump** | **$240** |

**Expected (lab oracle):** FTP **$240**. Understate if bump ignored: **−$80**.

---

## Toy 5 — `FiveMonthFileCap` (FTF stops after 5 late-file months; FTP continues)

**Facts:** Net amount due $10,000 unpaid and unfiled for **8** months; file in month 8 (still unpaid). Dual (c)(1) months 1–5; months 6–8 FTF does not accrue further (IRS “maxes after 5 months”); FTP continues at 0.5%. No (d) bump; caps otherwise clear.

| Segment | FTF after (c)(1) | FTP |
|---------|------------------|-----|
| Months 1–5 | $450 × 5 = $2,250 | $50 × 5 = $250 |
| Months 6–8 | $0 | $50 × 3 = $150 |
| **Correct total** | **$2,250** | **$400** → combined **$2,650** |

| Model | Combined |
|-------|----------|
| Naive 5%+0.5% for 8 months, no (c)(1)/cap | $4,400 |
| **Correct** | **$2,650** |

**Expected (lab oracle):** **$2,650** combined § 6651 additions.

---

## Toy 6 — `FtpOnly`

**Facts:** Timely filed. Unpaid $10,000 for 3 months at 0.5%. No FTF.

**Expected:** FTF **$0**, FTP **$150**, combined **$150**.

---

## Toy 7 — `PaidOnTimeZero`

**Facts:** Net amount due **$0** (timely pay/withholding covers). Late file months irrelevant.

**Expected:** combined **$0**.

---

## Toy 8 — `MinFloorBinds`

**Facts:** 2025 minimum **$510**. Net due **$2,000**. >60 days; % FTF one month = $100 < floor.

**Expected:** FTF **$510** (floor binds), FTP **$0**.

---

## Toy 9 — `PartialMonthDual`

**Facts:** Same dollars as Toy 1; one partial month still charges a full month fraction.

**Expected:** combined **$500** (same as SameMonth45).

---

## Explicit non-actions

- No full 25-fixture JSON farm this tick (anti-conveyor)
- No `projects/irc6651/`
- Digests must not present these toys as IRS notice substitutes
