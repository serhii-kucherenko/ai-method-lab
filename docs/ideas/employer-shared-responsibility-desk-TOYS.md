# Employer Shared Responsibility Desk — paper toy scenarios

**State:** `framed` research toys. Named scenarios with expected **assessable payment** dollars. Not fixtures. Not product code.  
**Display name only** — never brand `esrp4980h`.

## Illustrative toy-year constants (NOT live notice amounts)

These are **illustrative** APA shaped like a published calendar year for paper math only. They are **not** advice, **not** a substitute for the IRS indexed table for any real employer, and **must** be labeled whenever shown in digests.

| Constant | Illustrative value | Role |
| --- | --- | --- |
| `TOY_YEAR_APA_A_ANNUAL` | **$3,340** | Annual (a)-path applicable payment amount (toy year) |
| `TOY_YEAR_APA_B_ANNUAL` | **$5,010** | Annual (b)-path applicable payment amount (toy year) |
| `TOY_MONTHLY_A` | **$3,340 ÷ 12** | = **$278.333…** per FTE (after −30 on (a)) |
| `TOY_MONTHLY_B` | **$5,010 ÷ 12** | = **$417.50** per PTC-receiving FTE |

Common rules for all toys unless noted:

- One calendar **month** at a time; year total = sum of months.  
- **(a) path** (no adequate MEC offer that month, and ≥1 FTE receives PTC):  
  `max(0, FTE − 30) × TOY_MONTHLY_A`  
- **(b) path** (adequate offer that month, but some FTEs receive PTC):  
  `min( PTC_FTE × TOY_MONTHLY_B , max(0, FTE − 30) × TOY_MONTHLY_A )`  
- If no PTC-receiving FTE that month → **$0** for that month.  
- Dollars below keep exact twelfths (e.g. `$13,916.666…`); checker uses cents via float near-equality.

---

## Toy 1 — `NoOffer80` ((a) branch)

**Facts:** One month. FTE = **80**. No adequate MEC offer. At least one FTE receives PTC.

| Model | Dollars |
| --- | --- |
| Naive: 80 × $3,340 annual (forget /12 and −30) | $267,200 |
| Naive: 80 × monthly A (forget −30) | $22,266.666… |
| **Correct (a)** | `(80 − 30) × ($3,340 / 12)` = **$13,916.666…** |

**Expected (lab oracle):** **$13,916.666…**  
**Fantasy error (annualize):** invents ~**$253k**.

---

## Toy 2 — `OfferB10` ((b) branch, cap does not bind)

**Facts:** One month. FTE = **100**. Adequate MEC offer. PTC-receiving FTEs = **10**.

| Model | Dollars |
| --- | --- |
| Uncapped (b) | `10 × ($5,010 / 12)` = **$4,175** |
| (a)-shaped cap | `(100 − 30) × ($3,340 / 12)` = $19,483.333… |
| **Correct** | **min($4,175, $19,483.333…)** = **$4,175** |

**Expected (lab oracle):** **$4,175**

---

## Toy 3 — `CapBinds40` ((b) capped by (a) monthly)

**Facts:** One month. FTE = **50**. Adequate MEC offer. PTC-receiving FTEs = **40**.

| Model | Dollars |
| --- | --- |
| Uncapped (b) | `40 × ($5,010 / 12)` = **$16,700** |
| Cap (a) | `(50 − 30) × ($3,340 / 12)` = **$5,566.666…** |
| **Correct** | **$5,566.666…** |

**Expected (lab oracle):** **$5,566.666…**  
**Fantasy error (ignore cap):** **+$11,133.333…**

---

## Toy 4 — `SafeOfferZero`

**Facts:** One month. FTE = **90**. Adequate affordable MV offer. PTC-receiving FTEs = **0**.

**Expected (lab oracle):** **$0**

---

## Toy 5 — `MonthWalkMixed` (offer gate flips mid-year)

**Facts:** Two months, same FTE = **60**.

| Month | Offer | PTC FTEs | Branch | Dollars |
| --- | --- | --- | --- | --- |
| Jan | No | ≥1 | (a) | `(60 − 30) × ($3,340 / 12)` = **$8,350** |
| Feb | Yes | 8 | (b) | `min(8 × 417.50, $8,350)` = **$3,340** |
| **Total** | | | | **$11,690** |

| Model | Total |
| --- | --- |
| Year-flag “no offer” × 2 months of (a) | $16,700 |
| **Correct month walk** | **$11,690** |

**Expected (lab oracle):** **$11,690**

---

## Toy 6 — `ForgetMinus30` (common spreadsheet cheat)

**Facts:** Same as Toy 1 (FTE 80, no offer, PTC ≥1) but highlight the −30 miss alone.

| Model | Dollars |
| --- | --- |
| Forget −30: `80 × ($3,340 / 12)` | $22,266.666… |
| **Correct** | **$13,916.666…** |

**Expected (lab oracle):** **$13,916.666…**  
**Fantasy error:** **+$8,350**

---

## Explicit non-actions

- No full 25-fixture JSON farm this tick  
- No `projects/employer-shared-responsibility-desk/`  
- Digests must label APA as **illustrative toy-year constants**  
- Do not present toys as Letter 226-J substitutes
