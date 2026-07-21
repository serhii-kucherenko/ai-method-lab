# ndcswap — idea dossier

**State:** `differentiated`  
**Framing:** method stress (not GTM vs First Databank / Medi-Span)  
**Opened:** 2026-07-21 after crewleg sustain

## Progress

- TE algorithm paper: `docs/ideas/ndcswap-te-algorithm.md` (FDA Orange Book preface)
- Fixtures A–Y (25) + checker; G5 + Challenge A + G6 draft (**do not build yet**)
- Next: DAW/NCPDP challenge; gate scorecard → possible ready_to_build next tick

## Problem (G1)

Pharmacies must substitute generics only when Orange Book TE codes allow it, subject to DAW / brand medically necessary flags.

**Named user:** pharmacy systems pharmacist / Rx claim edit author.  
**Frequency:** every fill with substitution candidate.

## Unique claim (G2)

**If we remove Orange Book TE-code matching + DAW/BMN override rules for NDC pairs, the remaining product is identical to a generic catalog/FSM.**

## Kill rounds (G3)

1. Kill A — FDB/Medi-Span exist → stands for GTM; method stress OK  
2. Kill B — niche regulated — soft  
3. Kill C — clinical judgment offline — TE table still software-checkable  

## Decision

**`differentiated`** — research only. No `projects/ndcswap/` until `ready_to_build`.
