# Research summary — ptax4975 (G6)

Skeptical senior-eng bar. Seed-only memo. **Do not activate** while `htsroute` holds `current_idea`. Prefer **depositgap** → **lesserof** → **oshamult** ahead of this.

## 1. Problem

Plan sponsors model a flat “excise hit,” but IRC **§ 4975** taxes **15% of the amount involved per year (or part year)** in the taxable period, then **100%** additional tax if not corrected — and “amount involved” is a greater-of fair-value rule. Wrong year-part counting or understated amount invents or hides multi-year exposure.

## 2. Why prior lab products don’t cover it

Customs routing, AD deposit true-up, drawback lesser-of, OSHA serial penalties, and dual-gate timers do not encode **15% × year-parts + 100% second tier + greater-of amount**.

## 3. Unique claim + invariants

- `initial_tax = 0.15 × amount × year_parts` (fractional year-parts allowed when > 0)  
- `additional_tax = 0` if corrected, else `amount` (missing corrected → uncorrected)  
- Optional FMV pair: amount = max(a,b) when `use_fmv_greater_of`  
- Reject: flat-excise cheat; understate vs greater-of; non-positive amount; non-positive / non-finite year-parts  

## 4. Kill rounds

| Kill | Outcome |
|------|---------|
| A — incumbents | **Stands commercially.** ERISA counsel / Form 5330 preparers win. Survive as **workflow / FP&A honesty** experiment. |
| B — niche | Soft survive — plans with prohibited transactions only. |
| C — offline | Survive — correction / DOL-IRS processes stay offline; software holds excise arithmetic. |

See `ptax4975-challenge-ABC.md`.

## 5. Falsifiers

1. Domain experts say year-part counting is wrong in ≥2 real Form 5330 facts → abandon or re-version.  
2. After smoke, sponsors still book a single flat 15% cell → abandon.  
3. Digests claim Form 5330 / DOL replacement or omit Kill A → abandon as dishonest.  
4. Product collapses to dual-approver fee board → kill as isomorphic.

## 6. Depth test outline

- G5: `ptax4975-G5-cases.md` — **35** fixtures dual-green  
- Algorithm + greater-of: `ptax4975-algorithm.md`  
- Checkers: `check-ptax4975-fixtures.mjs`, `check-ptax4975-dual.mjs`

## 7. Decision

**Do not build / do not activate yet.**

Reasons: htsroute owns the slot; Kill A stands; activation priority is behind depositgap / lesserof / oshamult (`ACTIVATION_QUEUE.md`).

## Explicit non-actions

No `projects/ptax4975/`. Digests must say workflow experiment.
