# ptax4975 — product vision

**Paper only.** `current_idea` under hours hold. Do not open `projects/ptax4975/` until `FLIP_PATH_READY`.

Sources: `ptax4975-PRODUCT-FRAMING.md`, `ptax4975-VALUE-STAKES.md`, `ptax4975-COMPREHENSIVE-BLUEPRINT.md`, `ptax4975-FMV-FENCE.md`, `ptax4975-TAXABLE-PERIOD-FENCE.md`, `ptax4975-algorithm.md`, `ptax4975-PAGE-SPECS.md`, `ptax4975-API-CONTRACT.md`, `ptax4975-G6-summary.md`.

---

## Who

Plan / fiduciary-tax **analysts** and FP&A partners at plan sponsors who today forecast IRC **§ 4975** prohibited-transaction excise as “15% once” — then get surprised when **year-parts** multiply the first tier and **uncorrected** status adds a **100%** second tier (plus optional greater-of FMV on the amount involved).

Secondary: **auditors** who need an append-only trail of amount / FMV / year-parts / corrected locks — not a dual-approver “counsel status” board.

Not the audience: counsel filing Form 5330, IRS / DOL systems of record, or teams that only need a one-field “15% once” widget.

---

## Why

26 U.S.C. § 4975(a)/(b)/(f) shapes first-tier tax as **15% of the amount involved for each year (or part year)** in the taxable period, then **100%** additional tax if not corrected. Amount involved under (f)(4) is a greater-of money/FMV rule; second-tier statute also points at **highest FMV during the period** — which v0 does **not** encode (`ptax4975-FMV-FENCE.md`).

Finance that models “flat 15% once” invents a cash number that never matches year-parts × tiers. Counsel and existing tax software already compute the tax (Kill A). Vision survives only as a **first-/second-tier excise-shape forecast honesty** experiment — not as “we file Form 5330.”

---

## What success looks like in 12 months

| Signal | Honest bar |
|--------|------------|
| Product | Comprehensive workflow (≥7 pages, smoke→sustain ladder) — not a one-page flat-excise calculator labeled sustain |
| Money | Every forecast surfaces **initial tax** and **additional tax** separately; year-parts visible; greater-of FMV optional and rejectable when understated |
| Toy honesty | Illustrative locks still tell the tier story: e.g. $10k × 2 years corrected → **$3,000**; same uncorrected → **$13,000**; greater-of FMV toys labeled **forecast toy**, never a filed Form 5330 |
| Ops | Batch independence; auditors export CSV; ≥25 goldens + dual-impl green; flat-excise / dual-approver / understate cheats reject |
| Claims | Digests still carry Kill A: counsel and tax software still win; v0 greater-of ≠ highest-FMV-during-period until versioned dual flip |

Success is **not** Form 5330 parity, IRS/DOL replacement, market proof from fixture counts, or silent “highest during period” FMV.

---

## What we refuse to become

1. **Not a Form 5330 / IRS / DOL / counsel replacement** — no claim to file or litigate.
2. **Not a dual-gate FSM** — no dual-approver status costume as “domain” (G2 fence).
3. **Not a naked “15% once” widget** — year-parts × first tier + second tier if uncorrected are required.
4. **Not silent highest-FMV-during-period parity** — v0 optional greater-of two inputs only (`ptax4975-FMV-FENCE.md`); flip only via versioned dual re-green.
5. **Not automatic taxable-period end dates** — v0 takes caller-supplied `year_parts`; notice/assessment/correction enum is fenced (`ptax4975-TAXABLE-PERIOD-FENCE.md`).
6. **Not smoke-as-sustain** — shipping a single calculator page fails `docs/COMPREHENSIVE_PRODUCT.md`.

---

## Money-honesty bar (year-parts × tiers)

Every user-facing forecast and digest must:

- Compute **initial_tax = 0.15 × amount × year_parts**, never flat once as the happy path.
- Show **additional_tax** (0 if corrected, else amount) separately from initial.
- Reject `flat_excise_cheat` and `dual_approver_cheat` (422) — not alternate answers.
- Reject understated amount vs greater-of FMV pair when that path is requested.
- Call fixture dollars illustrative — never claim filed Form 5330 savings from goldens.
- Never claim highest-FMV-during-period while v0 only does greater-of two inputs.

Illustrative stakes (VALUE-STAKES): **$3,000** / **$13,000** toys; flat-once understatement **$1,500** vs corrected two-year path. Digests say **forecast toy** + Kill A.

---

## Explicit non-action

Do not open `projects/ptax4975/` until `check-ptax4975-hour-status.mjs` → `FLIP_PATH_READY`. Walk `ptax4975-FLIP-WHEN-CLEAR.md`.
