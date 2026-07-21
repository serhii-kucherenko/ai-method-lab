# htsroute — idea dossier

**State:** `differentiated`  
**Framing:** workflow experiment (not a commercial pitch against customs classification vendors)  
**Opened:** 2026-07-21 after lanehold G2 kill  
**Research ticks on this idea:** 3  
**Policy:** slow depth — **no fixture corpus yet**, no product folder, no ready_to_build

## Start here

1. Dossier (this file)
2. G1 evidence: `htsroute-G1-evidence.md` (includes omeprazole same-molecule chain)
3. Challenge A: `htsroute-challenge-A.md`
4. Challenge B: `htsroute-challenge-B.md`
5. Algorithm draft: `htsroute-algorithm.md` (29 / 3003 / 3004 — not binary)

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

## Depth test outline (G5 — not encoded)

Challenge B lists required fixture shapes (therapeutic bulk, dosage 3004, mixture→3003, Note 1(a), GRI3 reject, insufficient facts reject, tablet-enum cheat). **JSON fixtures deferred** to a later tick on purpose.

## Decision

**Differentiated — do not build.** Next tick may begin a *small* fixture set (not a 25-farm dump) only after writing G5 case names; still no product.
