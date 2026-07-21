# htsroute — chapter route algorithm (paper draft)

**Status:** draft for research. Not an implementation brief. Not an oracle.  
**Revised after Challenge B + omeprazole ruling chain.**

## Goal

Given a SKU fact card, decide a **heading-family route** (not a full 10-digit HTS):

| Route | Meaning |
|-------|---------|
| `chapter_29_chemical` | Separately defined chemical / unmixed bulk API (293x family) |
| `heading_3003_bulk_medicament` | Mixed constituents for therapeutic use, **not** measured dose / retail packing |
| `heading_3004_medicament` | Therapeutic/prophylactic + measured dose and/or retail packing |
| `excluded_note_1a` | Chapter 30 Note 1(a) food/supplement exclusion |
| `reject` | Insufficient facts or out-of-scope (GRI 3 combination) |

v0 proves the **form / mixing gate**. Full statistical suffixes are out of scope.

## Why not binary 29 vs 3004

Same-molecule **omeprazole** public trail:

| Form | Route | Ruling |
|------|-------|--------|
| Omeprazole in bulk (API) | Chapter 29 | NY L82483 / NY A89236 |
| Omeprazole pellets + enteric coating, bulk (mixed, not measured dose) | **Heading 3003** | NY A88482 / NY 864623 |
| Dosage-form capsules/tablets (measured doses) | Heading 3004 | (family practice; see NY N325050 for peer dosage forms) |

A binary 29/3004 product would mis-route intermediate pellets — that is a depth filter, not a complication to ignore.

## Required facts (explicit — no inventing)

| Field | Meaning |
|-------|---------|
| `chemical_form` | `separately_defined` \| `mixture` \| `unknown` |
| `therapeutic_or_prophylactic` | boolean |
| `measured_dose` | boolean |
| `retail_packing` | boolean |
| `dosage_form_signal` | `bulk_drum` \| `bulk_pellets` \| `tablet` \| `capsule` \| `injectable_vial` \| `transdermal` \| `powder_bulk` \| `other` \| `unknown` |
| `note_1a_food_or_supplement` | boolean |
| `gri3_combination` | boolean — if true → `reject` |

## Decision procedure

1. If `gri3_combination` → **reject**.
2. If `note_1a_food_or_supplement` → **excluded_note_1a**.
3. If `dosage_form_signal` ∈ {tablet, capsule, injectable_vial, transdermal} AND NOT `measured_dose` AND NOT `retail_packing` → **reject** (inconsistent dose-form signal — Challenge B cheat).
4. Else if `therapeutic_or_prophylactic` AND (`measured_dose` OR `retail_packing`):
   - If `dosage_form_signal` ∈ {bulk_drum, powder_bulk, bulk_pellets} → **reject** (inconsistent bulk + dose/retail claim)
   - Else → **heading_3004_medicament** (HTS: measured doses **or** retail packing)
5. Else if `therapeutic_or_prophylactic` AND `chemical_form` = `mixture` AND NOT `measured_dose` AND NOT `retail_packing` AND `dosage_form_signal` ∈ {bulk_pellets, powder_bulk, bulk_drum, other, unknown} → **heading_3003_bulk_medicament**.
6. Else if `chemical_form` = `separately_defined` AND `dosage_form_signal` ∈ {bulk_drum, powder_bulk} → **chapter_29_chemical**.
7. Else if therapeutic true but facts insufficient to choose among 29 / 3003 / 3004 → **reject**.
8. Else → **reject**.

## Invariants

- Therapeutic indication alone does **not** create 3004.
- Mixture + therapeutic + not measured/retail + bulk/other/unknown shape → **3003**, not 29 and not 3004 (HTS 3003 text; pellets CROSS is one worked example, not the only shape).
- Separately defined + powder/drum → **29** (same physical shape, different chemical_form).
- Molecule name is **not** an input.
- `dosage_form_signal=tablet` with `measured_dose=false` and `retail_packing=false` → **not** 3004 (Challenge B item 7).

## Anti-patterns

| Anti-pattern | Why |
|--------------|-----|
| Binary only 29 vs 3004 | Fails omeprazole pellet intermediate |
| Keyword `tablet` → 3004 | Enum theater |
| Dual approver on classification | Dual-gate clone |
| Full HTS autocomplete | Unfalsifiable |

## Mapping to published language

| Piece | Source |
|-------|--------|
| 3004 conjunction | HTSUS heading 3004 text |
| Bulk API → 29 | NY I89619; omeprazole NY L82483 |
| Mixed bulk medicament → 3003 | HTSUS heading 3003 text; worked CROSS: omeprazole pellets NY A88482 / NY 864623; v0 also encodes mixture powder/drum (#38/#39) |
| Dosage form → 3004 | NY N325050 (peer); **Protonix pantoprazole tablets NY N003244**; **same-letter** Eluxadoline/Viberzi NY **N302614** (bulk 6% ↔ tablets Free) |
| Note 1(a) | Chapter 30 Note 1(a) |
| Value honesty | MFN often Free both sides — see `htsroute-VALUE-STAKES.md`; same-letter non-Free bulk pairs: ibuprofen, aspirin, **eluxadoline N302614** |

## Deliberately omitted

Section 301 stacks, Pharmaceutical Appendix “K”, excipient chapters, GRI 3 questionnaires, heading **3002** immunological / toxin fights (Linzess HQ H250309 etc. — adjacent, not form-mixing; see `htsroute-G1-CF29-SEARCH.md`).
