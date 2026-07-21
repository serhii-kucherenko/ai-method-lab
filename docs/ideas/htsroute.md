# htsroute — idea dossier

**State:** `testable`  
**Framing:** workflow experiment (not a commercial pitch against customs classification vendors)  
**Opened:** 2026-07-21 after lanehold G2 kill  
**Research ticks on this idea:** 4  
**Policy:** slow depth — **no product folder**, no ready_to_build this calendar day

## Start here

1. Dossier (this file)
2. G1 evidence: `htsroute-G1-evidence.md` (includes omeprazole same-molecule chain)
3. Challenge A: `htsroute-challenge-A.md`
4. Challenge B: `htsroute-challenge-B.md`
5. Algorithm draft: `htsroute-algorithm.md` (29 / 3003 / 3004 — not binary)
6. G5 cases: `htsroute-G5-cases.md`
7. Golden cards: `fixtures/htsroute-{1,2,3,5,6,7,8}-*.json`
8. Checker: `node docs/ideas/check-htsroute-fixtures.mjs`

## Problem (G1)

Specialty pharma importers / trade-compliance analysts must classify SKUs across **Chapter 29 bulk chemicals**, **heading 3003 mixed bulk medicaments**, and **heading 3004 measured-dose / retail medicaments**. Spreadsheet molecule-name matching fails the form/mixing test. Pain: misclassification shifts duty and raises reasonable-care / penalty risk.

## Unique claim (G2)

**If we remove the 29 / 3003 / 3004 form-and-mixing gate (separately defined vs mixed; measured dose/retail vs not; Note 1(a) exclusion), the remaining product is a generic catalog labeler.**

The omeprazole chain is the non-isomorphism proof: bulk API → 29; coated pellets bulk → 3003; measured dosage forms → 3004. Binary 29/3004 clones fail the middle.

| Prior product | Why different |
|---------------|---------------|
| `ndcswap` | TE/DAW ≠ HS heading families |
| `tariffstep` | Utility blocks ≠ customs Notes |
| Dual-gate / killed `lanehold` | Not capacity + timer |

## Challenge rounds

| Kill | Status |
|------|--------|
| A — incumbents | Stands commercially; workflow experiment OK |
| B — keyword gate | Conditional survive — binding rules in challenge-B; algorithm revised to include 3003 |
| C — offline/legal | Survive with v0 scope fence (no GRI 3) |

## Falsifiers (G4 draft)

1. Published rulings contradict ≥2 golden heading-route fixtures → abandon.
2. After any future smoke, analysts still need a spreadsheet for the happy-path form gate → abandon.

## Depth test outline (G5)

Paper cases 1–25 named in `htsroute-G5-cases.md`. Encoded: **#1–#3** (omeprazole chain), **#5** (tablet enum cheat), **#6** Note 1(a), **#7** GRI 3 reject, **#8** missing chemical form. Still missing critical **#4** (I89619-shape other molecule). Boundaries #9–#25 stay paper.

## Decision

**Testable + seven golden cards — do not build.** Same-day research→build is blocked. Next: add case #4, then a skeptical research summary memo — still no product folder.
