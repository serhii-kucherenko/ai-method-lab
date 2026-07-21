# bondstrip — idea dossier

**State:** `ready_to_build` (method stress)  
**Framing:** method stress (not GTM vs Bloomberg/Yield Book)  
**Opened:** 2026-07-21 after settlecut sustain

## Progress

- Algorithm: `docs/ideas/bondstrip-algorithm.md`
- Fixtures A–Y + checker green (25)
- Challenges A–B; G5/G6; gate scorecard → **ready_to_build**

## Problem (G1)

Fixed-income desks strip coupon bonds and compute accrued with day-count conventions. Wrong convention → wrong dirty price.

**Named user:** FI ops / middle-office trade support.  
**Frequency:** every secondary-market settle.

## Unique claim (G2)

**If we remove day-count + accrued + cashflow-strip math, the remaining product is a generic calendar FSM.**

## Kill rounds (G3)

1. Kill A — Bloomberg/Yield Book exist → stands for GTM; method stress OK  
2. Kill B — niche desk tooling — soft  
3. Kill C — legal docs offline — math still checkable  

## Falsifiers (G4)

- Practitioner rejects v0 day-count vs live NASD/ICMA in ≥2 scenarios  
- Spreadsheet still required for happy-path accrued after smoke  

## Decision

**`ready_to_build`** — method stress. Digests must not claim commercial novelty vs Bloomberg. Open `projects/bondstrip/`.
