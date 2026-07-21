# htsroute — stacked-tariff honesty fence (seed paper)

**Updated:** 2026-07-21 (30m tick 21). Research only. Does **not** encode stacked-duty goldens or annex membership.

## Primary source

White House proclamation, **2026-04-02**, “Adjusting Imports of Pharmaceuticals and Pharmaceutical Ingredients into the United States” (Section **232**, 19 U.S.C. § 1862):  
https://www.whitehouse.gov/presidential-actions/2026/04/adjusting-imports-of-pharmaceuticals-and-pharmaceutical-ingredients-into-the-united-states/

Annex PDF (I–IV), same action:  
https://www.whitehouse.gov/wp-content/uploads/2026/04/Pharmaceuticals-Imports-ANNEXES-I-II-III-IV.pdf

Secondary firm alerts (Crowell, McDermott, etc.) are **pointers only**. Where they disagree on annex timing, prefer the proclamation text below. Example anti-pattern: at least one secondary alert swaps Annex III vs “other” effective dates — **clause (4) controls** (Annex III **2026-07-31**; others **2026-09-29**).

## Effective dates (proclamation clause (4) — quote shape)

Tariffs / tariff treatment apply to goods entered for consumption (or withdrawn from warehouse for consumption) on or after **12:01 a.m. EDT**:

| Cohort | Effective |
|--------|-----------|
| Companies listed in **Annex III** | **2026-07-31** |
| **Other** companies | **2026-09-29** |

Continue until expressly reduced, modified, or terminated.

## Rate shape (proclamation clause (3) — not goldens)

| Treatment | Rate (ad valorem) |
|-----------|-------------------|
| Default (Annex I patented pharma / associated ingredients) | **100%** |
| Onshoring plans approved by Commerce (3)(b) | **20%** (rises to **100%** on **2030-04-02**) |
| Japan / EU / Korea / Switzerland–Liechtenstein jointly (3)(c) | **15%** unless a lower clause (3) rate applies |
| United Kingdom (3)(c) | **10%** (may later reduce to zero via FR notice) |
| MFN pricing + onshoring agreements (3)(e); Annex II terms | **0%** until **2029-01-20** (and per Annex II) |
| Orphan-only / nuclear / plasma / fertility / CGT / ADC / certain MCM / animal health under (3)(d) conditions | **0%** when Secretary determinations publish |
| **Generic** pharmaceuticals and associated ingredients (clause (5); also ¶11) | **Not** subject to these 232 tariffs **at this time** |
| United States–origin pharmaceutical products (clause (11)) | **Not** subject at this time |
| Annex IV zero-tariff list (¶7) | Zero under 232 as listed |

Clause (7): for most origins, 232 + Column 1 are structured so the **sum equals** the clause (3) rate unless Column 1 alone is higher (UK treatment excepted). Clause (8): if multiple rates under the proclamation apply, **lowest** wins.

Clause (5) also requires Commerce to report within **1 year** whether generics should later be adjusted — so the carve-out is **not permanent**, but digests must not invent a generic 232 rate today.

## Annex III early cohort (pointer only — not goldens)

Annex III names **17** companies whose tariff treatment starts **2026-07-31** (list in annex PDF). Others start **2026-09-29**. v0 does **not** encode company membership or HTS annex rows into fixtures.

## Teaching-SKU honesty (generics vs patented)

| Teaching pair | Base MFN story | 232 story for digests |
|---------------|----------------|------------------------|
| Acetaminophen / ibuprofen / aspirin | Honest letter MFN ↔ Free finished | Treat as **likely generic / off-exclusivity** teaching toys — clause (5) says generics are **not** under these 232 tariffs **at this time**. Do **not** say “232 dwarfs the 6.5% letter.” |
| Eluxadoline / Viberzi; Vericiguat / Verquvo | Honest same-letter MFN ↔ Free | **Brand / Orange Book candidates** — 232 *may* apply if patented + Annex I HTS + company cohort, but only with a named entry + annex/FR cite. Still out of v0 goldens. |
| Pantoprazole PPI showcase | Free / Free | No MFN dollar pitch; 232 still needs patented + annex proof (not assumed). |

Annex I note defines “patented” via valid unexpired U.S. patent + Orange Book / Purple Book listing; “generic” via ANDA / 505(b)(2) TE / biosimilar / authorized generic path. We do **not** run Orange Book lookups in checkers this tick.

## What v0 proves

Heading-family form/mixing gate (29 / 3003 / 3004 / Note 1(a) / reject) against CROSS-backed fact cards. Honest **base MFN** contrasts only where a ruling states them (acetaminophen, ibuprofen, aspirin, eluxadoline, vericiguat).

## What v0 / digests must not claim

1. A fixed Section 301 or Section 232 dollar delta for any showcase SKU without a **named entry scenario** + current **Annex I–IV** / FR cite.  
2. That “base MFN 6% → Free finished” is the **landed** savings story once a patented SKU is 232-covered (Annex III from **2026-07-31**; others from **2026-09-29**).  
3. That Pharmaceutical Appendix “K” / GN 13 erasures are modeled in the router.  
4. That annex company / HTS membership is encoded in goldens.  
5. Trusting a secondary alert that **reverses** Annex III vs “other” timing — primary clause (4) controls.  
6. That acetaminophen / ibuprofen / aspirin teaching pairs are already under Section 232 (generics carve-out clause (5)).

## Digests / PRODUCT language

Say **form-gate workflow / forecast experiment**. Money notes cite **base MFN in CROSS letters**. Stacked 232/301 = **out-of-scope callouts**, and only for **patented** entry scenarios — never as a blanket scare story over generic OTC teaching SKUs. Flip-day digests must not sell MFN contrasts as guaranteed landed-duty wins.

## Explicit non-actions

No product folder. No annex scraping into fixtures this tick. Revisit only with Federal Register HTS notes / annex tables + dual-suite bump.
