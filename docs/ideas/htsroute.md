# htsroute — idea dossier

**State:** `framed`  
**Framing:** workflow experiment (not a commercial pitch against customs classification vendors)  
**Opened:** 2026-07-21 after lanehold G2 kill  
**Policy this tick:** deepen framing + evidence only — **no fixture corpus, no product folder**

## Problem (G1 draft)

Specialty pharma importers / trade-compliance analysts must classify SKUs at the **Chapter 29 (organic chemicals / bulk API) vs Chapter 30 (pharmaceutical products / medicaments)** boundary. The same molecule in a bulk drum vs a measured-dose tablet routes to different chapters, duty stacks, and often different Section 301 exposure. Spreadsheet “metformin → popular code” matching fails the form test. Pain: misclassification shifts duty by several points and creates under/over-payment risk on audit.

**Who:** trade-compliance / customs analyst at a specialty pharma importer or broker desk  
**How often:** every new SKU, supplier change, and catalog backfill  
**Workaround today:** broker judgment + CROSS ruling search + vendor classification tools; tribal spreadsheets for bulk-vs-dose checks

Evidence notes: `docs/ideas/htsroute-G1-evidence.md`

## Unique claim (G2 candidate — under challenge)

**If we remove the Chapter 29 separately-defined-chemical vs Chapter 30 heading 3004 form test (therapeutic/prophylactic intent ∧ (measured dose ∨ retail packing) ∧ dosage form), the remaining product is a generic product-catalog labeler.**

Non-isomorphic vs (draft):

| Prior product | Why different |
|---------------|---------------|
| `ndcswap` | Orange Book TE/DAW substitution ≠ HS chapter routing |
| `tariffstep` | Utility block walk + demand ratchet ≠ customs chapter notes |
| `lotblast` | Genealogy DAG ≠ tariff classification |
| Dual-gate / `loadbay` / `lanehold` (killed) | Not capacity ceiling + timer |

**Open G2 risk:** if we only implement “if tablet → 3004 else → 2924” string heuristics without Notes / exclusions (e.g. Chapter 30 Note 1(a) foods/supplements), it collapses to a shallow keyword gate — kill that implementation shape before any build.

## Challenge rounds (G3 — draft, not closed)

1. **Kill A — incumbents:** Classification engines and brokers already exist (e.g. commercial HS APIs, broker desks). **Stands for commercial novelty.** Survive only as workflow experiment if digests do not claim vendor replacement.
2. **Kill B — niche:** Pharma import desks are niche but SKU volume and reclass frequency are high — soft, not instant kill for method stress.
3. **Kill C — offline/legal:** CROSS rulings and counsel judgment matter for edge cases; core 29/30 form test is still software-checkable for unambiguous SKUs. Scope must refuse GRI 3 combination guessing as v0.

## Falsifiers (G4 draft)

1. Domain experts / published rulings contradict ≥2 golden chapter-route fixtures → abandon.
2. After any future smoke, analysts still need a spreadsheet for the happy-path bulk-vs-dose question → abandon.

## Depth test outline (G5 — paper only this tick)

Named cases to design later (not encoded yet):

- Bulk pure API drum → Chapter 29 path
- Same molecule, measured-dose tablets → heading 3004 path
- Therapeutic bulk powder without measured dose / retail packing → not 3004
- Reference standard / non-therapeutic use → not 3004
- Chapter 30 Note 1(a) food-supplement style exclusion
- Mixture / formulation that fails separately-defined chemical
- Reject: keyword-only “metformin → always 3004”
- Concurrent catalog import with conflicting form flags
- Expert cheat: relabel bulk drum as “medicament” without dose/retail evidence → reject

**Estimated smoke suite target ≥25** — deferred until adversarial rounds close and algorithm paper exists. **Do not invent 25 green fixtures this tick.**

## Decision

**Framed only.** Research continues. No `projects/htsroute/`. No ready-to-build claim.
