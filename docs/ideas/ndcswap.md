# ndcswap — idea dossier

**State:** `framed`  
**Framing:** method stress (not GTM vs First Databank / Medi-Span)  
**Opened:** 2026-07-21 after crewleg sustain

## Problem (G1 draft)

Pharmacies must substitute generics only when Orange Book therapeutic equivalence (TE) codes allow it for the brand NDC, subject to state “dispense as written” / brand medically necessary flags. Wrong substitution is a patient-safety and payer-reject failure. Workarounds: vendor drug DBs + tribal checklists.

**Named user:** pharmacy systems pharmacist / Rx claim edit author.  
**Frequency:** every fill with substitution candidate.

## Unique claim (G2 candidate)

**If we remove Orange Book TE-code matching + DAW/BMN override rules for NDC pairs, the remaining product is identical to a generic catalog/FSM.**

Non-isomorphic vs lotblast (DAG), amendwin (protocol windows), crewleg (FAR tables), dual-gate wave.

## Kill rounds (open)

1. Kill A — First Databank etc. exist → stands for GTM; method stress OK  
2. Kill B — niche regulated — soft  
3. Kill C — clinical judgment offline — TE table still software-checkable

## Decision

**`framed`** — research only. No `projects/ndcswap/` yet.
