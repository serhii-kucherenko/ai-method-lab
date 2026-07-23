# Employer Shared Responsibility Desk — G6 research summary (draft)

Skeptical senior-eng bar. **State: adversarial.** Explicit decision: **do not build yet.**

**Display name:** Employer Shared Responsibility Desk  
**Slug:** `employer-shared-responsibility-desk`  
**Never brand:** `esrp4980h` / bare statute codes

## 1. Problem

Benefits controllers at applicable large employers often budget a flat “penalty × headcount.” Real assessable-payment rules walk **months**, branch **(a) vs (b)** on the offer of coverage, trigger only when someone receives a premium tax credit, apply **−30** on the (a) path, and **cap (b)** at what (a) would have been that month — with **year-indexed** applicable payment amounts. Spreadsheets invent or hide literal cash.

## 2. Why prior lab products don’t cover it

| Prior | Their unique rule | This idea |
| --- | --- | --- |
| Filing Penalty Desk | Late-file / late-pay additions on a return balance | ACA monthly assessable payments, not IRC late additions |
| ptax4975 | Excise year-parts + amount-involved FMV | FTE months + offer gate, not prohibited-transaction excise |
| oshamult | Gravity base × serial % reductions | Fixed APA × count math, not OSHA serial discounts |
| depositgap | Deposit≠assessed + interest window | Not customs rates or § 1677g |
| bondstrip | Day-count accrue + coupon strip | Not fixed-income |

See `employer-shared-responsibility-desk-G2.md` — **pass**.

## 3. Unique claim + invariants

If we remove **monthly FTE walk + PTC trigger + offer-gate exclusivity ((a) xor (b)) + (a) −30 + (b)(2) cap + year-correct APA indexing**, nothing domain-specific remains.

Paper algorithm: `employer-shared-responsibility-desk-algorithm.md`.  
Rejects: flat annual cheat, stack both branches, wrong-year index, dual-approver costume.

## 4. Kill rounds

| Kill | Outcome |
| --- | --- |
| A — incumbents | Stands commercially (IRS / ACA vendors / Letter 226-J process). Survive only as **forecast / method experiment** with honesty fence. |
| B — niche | Annual filing cadence is real; lab cares about invariant depth. Spreadsheet-still-wins → G4 falsifier. |
| C — offline / legal | Affordability harbors, lookback ALE, 226-J advocacy, Form 1094-C filing stay fenced. Software holds **assessable-payment math** only. |

Detail: `employer-shared-responsibility-desk-KILL-ROUNDS.md`.

## 5. Falsifiers

See `employer-shared-responsibility-desk-FALSIFIERS.md` — spreadsheet owns critical path; experts reject invariants in ≥2 real patterns; dishonest statute-code / filing-replacement framing.

## 6. Depth test outline

- G5 paper cases: **38** named (`employer-shared-responsibility-desk-G5-cases.md`)
- Paper toys: **6** green (`check-employer-shared-responsibility-desk-toys.mjs`)
- Still need denser dual-impl / fixture farm before smoke if/when build clears hours

## 7. Decision

**do not build yet**

Blocking:

1. Hours since `framing_started_at` (`2026-07-23T16:30:00Z`) still under **4h**
2. Research ticks on idea need **≥3** (this pack is tick 2 deepen)
3. No PM go / architect pack / ≥15-feature blueprint yet
4. Kill A honesty must stay visible in any future digest

When hours + ticks clear: draft flip path only if G1 evidence and money honesty still hold — else park.
