# htsroute — G1 evidence notes

Pain evidence for framing. Not a build ticket. Sources cited for skepticism, not marketing.

## Named user + frequency

- **User:** trade-compliance / customs classification analyst (importer or broker) handling pharma SKUs.
- **Frequency:** continuous — new SKUs, supplier changes, catalog backfills (vendor literature cites specialty catalogs of thousands of APIs/excipients/finished forms).
- **Painful workaround:** broker email + CROSS search + spreadsheets that key off molecule name rather than form/packaging facts.

## Primary / near-primary sources

1. **HTSUS heading 3004 text** (USITC chapter publications / HTS): medicaments for therapeutic or prophylactic uses, put up in **measured doses** (including transdermal systems) **or** in forms/packings for **retail sale**.  
   - USITC chapter PDF trail: https://www.usitc.gov/publications/docs/tata/hts/bychapter/1000c30.pdf

2. **Chapter 30 Note 1(a)** exclusion (foods/beverages/supplements vs medicaments) — litigated; see Federal Circuit discussion of medical foods vs heading 3004 (opinion on file in research fetch cache for this tick; cite: CAFC 24-1436, Nov 2025).

3. **CBP CROSS practice:** bulk APIs classified under Chapter 29 chemical headings, not 3004 — e.g. NY I89619, NY L82483 (bulk pharmaceutical actives from various origins → Chapter 29 paths). HQ 964350 (bulk clinical-trial API → Chapter 29 heterocyclic provision).

4. **CBP Reasonable Care** (Informed Compliance Publication, revised Sep 2017): importers must exercise reasonable care in classification — consulting rulings/experts is part of the evidence trail, not optional decoration.

5. **Industry articulation of the form mistake** (secondary, use cautiously): GingerControl pharma HS note (May 2026) — common error is classifying finished dosage (Ch 30) as bulk API (Ch 29) or the reverse; same molecule, different chapter; duty / Section 301 stack shifts. Treat as problem statement corroboration, not as oracle.

6. **Penalty path (secondary legal commentary):** Misclassification can lead to CF-29 Notices of Action and, if reasonable care fails, 19 U.S.C. § 1592 penalty exposure; prior disclosure is a separate mitigation path. Sources: customs-bar commentary on CF-29 / § 1592 (not a substitute for primary CBP guidance). Strengthens “why pain matters” without claiming a specific public penalty docket for pharma 29/30 this tick.

## Ruling pair (chapter gate contrast)

| Card | Facts | Route | Source |
|------|-------|-------|--------|
| Bulk APIs with therapeutic indications | Colchicine, Oxaprozin, … **imported in bulk form** | **Chapter 29** | CROSS **NY I89619** (13 Jan 2003) |
| Dosage-form medicaments | Isotretinoin capsules, Ivermectin tablets, Venlafaxine ER tablets **in dosage form** | **Heading 3004** | CROSS **NY N325050** (22 Apr 2022) |

## Same-molecule chain (omeprazole) — closes prior G1 gap

| Form | Route | Source |
|------|-------|--------|
| Omeprazole **in bulk form** (API) | **Chapter 29** | NY **L82483** / NY **A89236** |
| Omeprazole **pellets + enteric coating**, imported bulk (mixed constituents, not measured dose) | **Heading 3003** | NY **A88482** / NY **864623** |
| Peer dosage-form medicaments (measured doses) | **Heading 3004** | NY **N325050** (family practice; finished omeprazole capsules follow 3004 in trade/HTS practice) |

**Why this matters:** A binary “29 vs 3004” idea would mis-route the pellet intermediate. Challenge B forced the algorithm to add `heading_3003_bulk_medicament`. This is the first depth artifact that would fail a shallow keyword product.

## Same-molecule reinforcement (pantoprazole) — closed

| Form | Route | Source |
|------|-------|--------|
| Pantoprazole Sodium **imported in bulk form** | **Chapter 29** (2933.39.4100), Free | CROSS **NY I89619**; **NY N055248** |
| Pantoprazole sodium **delayed-release tablets** (Protonix®) | **Heading 3004** (3004.90.9160), **Free** | CROSS **NY N003244** (16 Nov 2006) — dedicated finished-PPI letter |

Encoded: `htsroute-26-pantoprazole-tablets-3004.json` (source updated to N003244).

**Value honesty:** both legs Free MFN → see `htsroute-VALUE-STAKES.md` and Challenge D. Closing the letter residual does **not** create a duty-savings product story.

## What G1 still lacks (honest)

- First-hand interview notes from an importer desk (not obtained).
- A single public CF-29 / § 1592 docket specifically about 29↔30 pharma misclass — **searched 2026-07-21; not found.** General Form 29 + § 1592 path remains secondary (customs-bar explainers + 19 U.S.C. § 1592 text). Do not invent a docket.
- Dedicated finished **omeprazole** capsule/tablet CROSS letter (optional; pantoprazole finished letter now on file).
- Named entry scenario with **proven** China Section 301 delta by HTS line for a showcase SKU (secondary vendors claim it; not encoded as golden without a primary cite).

## G1 provisional grade

**Strong pass for form-gate framing + ruling chains** (including finished pantoprazole). **Commercial MFN-value bar: weak** for showcase PPIs. **Still not ready_to_build this calendar day.**
