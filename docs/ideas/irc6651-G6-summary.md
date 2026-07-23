# irc6651 — G6 research summary (draft — still not ready)

Skeptical senior-eng bar. **State: adversarial / WAIT_HOURS.** Explicit decision: **do not build yet.**

## 1. Problem

Controllers forecast a flat “late fee,” but **26 U.S.C. § 6651** stacks failure-to-file (5%/mo, cap 25%) and failure-to-pay (0.5%/mo or 1% after levy-intent, cap 25%) on § 6651(b) net bases. Same-month dual application requires **(c)(1)** FTF←FTP reduction. >60-day late file adds an indexed **minimum** (lesser of floor or underpayment). Spreadsheets invent or hide literal IRS dollars.

## 2. Why prior lab products don’t cover it

Not drawback caps (lesserof), not AD deposit≠assessed (depositgap), not OSHA serial GBP (oshamult), not §4975 excise (ptax4975), not §1592 customs maxes (c1592). Not a dual-gate / capacity rename (kill pass 2026-07-23).

## 3. Unique claim + invariants

Month-fraction FTF+FTP walk; (c)(1); (b) bases; optional (d) bump; minimum lesser-of; FTF accrual stops after 5 months; reject flat-5.5%, dual-approver, interest-as-penalty, silent 0.25% installment.

## 4. Kill rounds

| Kill | Outcome |
|------|---------|
| A | Stands commercially (IRS/CPA/software). Survive only as forecast / method experiment. |
| B | Survive for research; spreadsheet-ignore-(c)(1) is a product falsifier. |
| C | Survive with abatement / §6601 / 0.25% / §6698–6699 fences. |

## 5. Falsifiers

See `irc6651-FALSIFIERS.md` — spreadsheet critical path; expert rejects stack vs “wait for the notice.”

## 6. Depth test outline

G5 paper outline A–Y sketched; dual toys **11** green; paper fixtures **25** green (`check-irc6651-fixtures.mjs`). Smoke outline met — anti-conveyor still requires hours hold before flip.

## 7. Decision

**do not build yet** — hours since `framing_started_at` still under `min_hours_research_before_ready` (4h); no matched IRS notice / interview for G1; Kill A honesty stands; no PM-GO.

When hours clear: write flip path only if value honesty still holds — else park.
