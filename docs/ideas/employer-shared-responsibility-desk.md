# Employer Shared Responsibility Desk — research dossier

**Display name:** Employer Shared Responsibility Desk  
**Slug:** `employer-shared-responsibility-desk`  
**Legacy research id (docs only):** `esrp4980h` — never the brand  
**State:** `framed`  
**Bar:** Correction 6 — mature name, ≥15 features before sustain, tutor guide required  
**Not:** `ready_to_build` · no product folder

## One-line pitch

Help benefits controllers forecast **employer shared-responsibility assessable payments** under the ACA — monthly full-time counts, offer-of-coverage gates, and the monthly payment-dollar cap — without claiming to replace IRS notices or commercial ACA software.

## Problem

Finance teams often budget a flat “penalty per employee.” Real assessable-payment math splits **(a)** vs **(b)** branches, counts **full-time employees by month**, applies an **offer-of-coverage gate**, subtracts the statutory **30-employee reduction** on the (a) path, and **caps (b)** against the monthly applicable-payment amount derived from (a). Spreadsheets invent cash by annualizing indexed dollars, skipping the month walk, or mixing (a) headcount math with (b) premium-tax-credit headcount.

**Evidence shape (G1 — deepen next ticks):** public IRS Q&A / Letter 226-J practice, benefits-controller war stories, and first-hand FP&A “we booked $X flat” vs notice surprises. Cite sources in a later G1 note before adversarial.

## Who

Controllers / benefits finance at **applicable large employers** (and their advisors) reconciling **projected** assessable payments before Form filings and after draft 226-J-style scenarios — not “every employer with a benefits portal.”

**Frequency:** monthly workforce / offer snapshots through the year; annual roll-up before filing; ad-hoc when coverage or headcount shifts.

## Workaround today

Vendor ACA / eligibility tools + tribal spreadsheets that:

1. Annualize indexed applicable payment amounts instead of **1/12 per month**  
2. Forget the **−30** reduction on the (a) path  
3. Skip the **(b) ≤ (a)** monthly cap  
4. Treat “offered coverage” as a year flag instead of a **month-level offer gate**

## Success metric

A skeptical benefits controller, given the same month facts as a paper toy, gets the **same dollar forecast** as the lab oracle (naive annualized / uncapped models diverge by a named fantasy error). Digests never claim IRS-notice identity.

## Unique claim

**If we remove monthly FTE counting + (a)/(b) branch + offer-of-coverage gate + (−30) reduction on (a) + (b) capped by monthly applicable payment from indexed APA, nothing domain-specific remains.**

Must stay distinct from:

| Existing | Why different |
| --- | --- |
| Filing Penalty Desk (`filing-penalty-desk` / legacy `irc6651`) | Late-file / late-pay additions on a return balance — not ACA assessable payments |
| ptax4975 | ERISA prohibited-transaction excise year-parts — not ACA FTE months |
| oshamult | OSHA gravity × serial reductions — not coverage-offer gates |
| Dual-gate / ceiling FSM wave | Not status rename + dual signer |

## Fences (explicit honesty)

1. **Not an IRS notice.** Letter 226-J / final assessments win; this is forecast / method stress.  
2. **Not commercial ACA software replacement.** Eligibility engines, Form 1094-C/1095-C filing suites, and counsel still own production truth.  
3. **Indexed APA are inputs.** Toy-year constants in paper toys are **illustrative** (labeled); live years require published indexed amounts — do not hard-code “the law” as a single eternal dollar.  
4. **No brand `esrp4980h` or “§ 4980H” as product name.** Mature display name only.  
5. **ALE determination, affordability safe harbors, and measurement-period elections** stay offline / explicit inputs in v0 — do not silently invent workforce classification.

## Paper kit (this deepen — tick 2 intent)

| Artifact | Path |
| --- | --- |
| Paper toys (expected $) | `docs/ideas/employer-shared-responsibility-desk-TOYS.md` |
| Hours / do-not-flip | `docs/ideas/employer-shared-responsibility-desk-HOUR-STATUS.md` |
| Toy checker (optional, research only) | `docs/ideas/check-employer-shared-responsibility-desk-toys.mjs` |

## Immediate research actions (not this tick’s flip)

1. G1 evidence note with cites (who / frequency / wrong cash)  
2. Kill rounds A–C with honesty that IRS / ACA vendors win commercially  
3. Paper algorithm: month walk, (a)/(b) branch, (b) cap  
4. Hold **≥4h** from `framing_started_at` + **≥3** research ticks before any `ready_to_build`

## Explicit non-actions

- No `projects/employer-shared-responsibility-desk/`  
- No `ready_to_build` this tick (or while hours/ticks incomplete)  
- No 25-fixture JSON farm yet (anti-conveyor — toys only)  
- Never brand the product `esrp4980h` or `§ 4980H`  
- Do not promote ROADMAP / open feature PRs from this research loop
