# Idea: lotblast (FSMA lot genealogy + recall blast radius)

**State:** `adversarial` (G1–G2 pass; G3 in progress — not ready_to_build)  
**Decision:** Continue research. Do **not** build yet.

## 1. Problem

Recall coordinators at mid-size food brands (specialty / co-pack) get a suspect ingredient lot and must answer within hours: which finished lots, shipments, DCs, and retailers are in the blast radius — with units still in channel. Today the honest answer is often “give us three days” while FDA FSMA 204 expects lot-level sortable electronic records within 24 hours and product keeps selling through.

Sources (primary first):

- FDA Food Traceability Final Rule (FSMA 204): CTE/KDE records + electronic sortable spreadsheet within 24 hours of FDA request — https://www.fda.gov/food/food-safety-modernization-act-fsma/fsma-final-rule-requirements-additional-traceability-records-certain-foods
- Failure to comply is a prohibited act; warning letters / further enforcement described in rule presentations citing 21 CFR 1.1460 — e.g. UW Food Science summary of Roberta Wagner (FDA) Traceability Final Rule talk — https://foodsci.wisc.edu/wp-content/uploads/2024/10/Roberta-Wagner-Traceability-Final-Rule-PresentationRW.pdf
- FDA published an **example** electronic sortable spreadsheet template (not mandatory format, but shapes oracle columns) — covered in industry explainers pointing back to fda.gov “Electronic Sortable Spreadsheet”
- Practitioner framing of blast-radius vs shared-ingredient genealogy: https://recall.lailarallc.com/
- Competitive landscape (G3): Nulogy, inecta, ERP modules — existence noted, not used as G1 proof

## 2. Why prior lab products don’t cover it

| Prior | What it proved | Missing for lotblast |
|-------|----------------|----------------------|
| lottrack | Warehouse lots + inspection quarantine + dual QA clear | Flat lot records; no transformation DAG; no forward blast radius |
| farmshare / pantrybox / seedbank | Status FSMs on shares/stocks/packets | No multi-hop genealogy |
| datacontract | SLO breach remediate/waive | Not a physical lot graph |

**Isomorphism test:** If we remove “recursive forward/backward genealogy + blast-radius scope (units in channel, notify list) + mock-recall drill producing sortable CTE/KDE export,” the remainder collapses toward lottrack. That unique rule is **not** a renamed ceiling + dual signer.

## 3. Unique claim + invariants (draft)

1. Lots form a **DAG**: consume edges (input lot → output lot) with quantities; cycles illegal.
2. **Forward blast** from a suspect lot returns every reachable finished lot + open shipments; scope is deterministic given the graph.
3. **Backward trace** from finished lot returns all input lots (for supplier notification).
4. **Mock recall** locks a snapshot audit trail and emits a sortable export with required KDE columns for exercised CTEs (lab-scoped subset of FSMA 204 — not full regulatory product).
5. Shared ingredient lot across N batches **must** expand blast radius vs isolated lots (regression fixture).

## 4. Kill rounds

### Kill A — Existing tools already solve this

**Standing:** Yes for enterprise buyers. Nulogy, inecta, ERP/MES modules, and open demos exist.  
**Honest lab answer (locked this tick):** lotblast is a **method stress product**, not a GTM bet. Success = A03+A10 can hold DAG genealogy + blast determinism + mock-recall sortable export against a hard oracle. Failure mode we care about = agent ships another dual-gate FSM and calls it “traceability.”  
**Commercial novelty:** fails Kill A. Do not claim undiscovered market in digests.  
**Status:** Survive **only** under method-stress framing.

### Kill B — Too niche / infrequent

**Standing:** Recalls are rare; mock recalls and audit drills are periodic.  
**Answer:** Value accrues on **readiness drills + continuous genealogy capture during production**, not only live recalls. Pain is continuous if co-mans and transformations aren’t linked.  
**Status:** Conditional survive — product must center mock-recall + genealogy integrity, not “incident app.”

### Kill C — Hard part is offline / social / legal

**Standing:** Supplier calls, retailer politics, and counsel drive real recalls.  
**Answer:** Software still owns the **scope computation + record pack**; offline work starts from that pack. If scope is wrong, offline work fails.  
**Status:** Survive if we refuse to fake “full recall management” and stay on genealogy + blast + export.

## 5. Falsifiers (if we ever build)

1. Domain experts (food QA / recall coord) reject blast-radius results on ≥2 realistic shared-ingredient fixtures.
2. After sustain, critical path still requires a spreadsheet to answer “who to notify” for the happy mock-recall.

## 6. Depth test outline (paper — G5 progressing)

Named cases for a future smoke oracle (must all exist before `ready_to_build`):

| # | Case | Expect |
|---|------|--------|
| 1 | receive ingredient lot with KDEs | lot created; CTE=receive recorded |
| 2 | transform 2 inputs → 1 output lot | consume edges + output lot |
| 3 | pack output → finished lot | genealogy links preserved |
| 4 | ship finished lot to partner | shipment node; partner on notify path |
| 5 | forward blast from ingredient | reaches finished + shipment |
| 6 | backward trace from finished | returns both inputs |
| 7 | shared ingredient across 2 batches | blast includes both finished lots |
| 8 | isolated control ingredient | blast does not include unrelated SKU |
| 9 | insert cycle A→B→A | rejected |
| 10 | over-consume input qty | rejected; graph unchanged |
| 11 | zero/negative qty edge | rejected |
| 12 | split ship (partial qty) | blast qty = remaining in channel + shipped |
| 13 | mock recall lock | further mutations on scoped lots fail |
| 14 | mock recall export | sortable CSV/JSON with lab KDE columns |
| 15 | missing required KDE on CTE | export blocked or gap row flagged |
| 16 | concurrent transforms same input | one wins; no double-consume |
| 17 | plant B token reads plant A lot | 403 |
| 18 | webhook on recall.opened | HMAC + idempotent delivery |
| 19 | pagination on blast member list | cursor stable under insert-after |
| 20 | rate limit blast endpoint | 429 after budget |
| 21 | reopen recall after unlock | only recall_admin; audit row |
| 22 | delete edge after ship | rejected (immutability after CTE ship) |
| 23 | diamond DAG (A→B,C→D) | forward blast visits D once |
| 24 | empty blast (lot never used) | scope size 1 (self) + empty notify |
| 25 | expert cheat: rename lot code mid-chain | blocked; codes immutable after first CTE |
| 26 | TLC source location AND reference both set | rejected / export gap |
| 27 | TLC source neither location nor reference | rejected / export gap |
| 28 | location missing phone or street | rejected on CTE write |
| 29 | transformation with 0 input rows | rejected |
| 30 | export after lock omits a blast member CTE | fail oracle |

G5 still open until these are turned into failing RED tests in a product brief — not before.

Export field contract (types): `docs/ideas/lotblast-export-contract.md`.


### Lab CTE/KDE subset (draft — not full FSMA product)

**Lab CTEs (aligned to FDA tabs we will implement):** `receiving`, `transformation`, `shipping`.  
Drop separate `pack` — packing/repacking that creates a new TLC is **transformation** under 21 CFR definitions in the FDA template.

**Explicit non-goals:** harvesting, cooling, initial packing (RAC), first land-based receiving, receiving-from-exempt, full FTL coverage, FDA submission UX, claiming compliance product.

### FDA example spreadsheet → lab field map (tick 2)

Source: FDA illustrative electronic sortable spreadsheet template (PDF extract from https://www.fda.gov/media/181945/download). Template is **not** mandatory; columns shape our export oracle.

#### Receiving (lab must export these columns for exercised receive events)

| FDA template column group | Lab field(s) | Notes |
|---------------------------|--------------|-------|
| Traceability Lot Code | `tlc` | Immutable after first CTE |
| Quantity + Unit of Measure | `qty`, `uom` | |
| Product Description (name, brand, commodity, variety, pack size, pack style) | `product_*` struct | Lab may require name+size; others optional but columns present |
| Immediate previous source location description | `from_location_*` | Business, phone, address, city, region, postal, country |
| Location where received | `to_location_*` | Same shape |
| Date of reception | `event_date` | |
| TLC source location **or** TLC source reference | `tlc_source_*` **or** `tlc_source_ref` | One required |
| Reference document type + number | `ref_doc_type`, `ref_doc_number` | Optional second pair later |

#### Shipping

| FDA template column group | Lab field(s) | Notes |
|---------------------------|--------------|-------|
| Traceability Lot Code | `tlc` | |
| Quantity + UoM | `qty`, `uom` | Partial ship allowed |
| Product Description | `product_*` | |
| Immediate subsequent recipient location | `to_partner_*` / `to_location_*` | Drives notify list |
| Location from which shipped | `from_location_*` | |
| Shipping Date | `event_date` | |
| TLC source location or reference | `tlc_source_*` / `tlc_source_ref` | |
| Reference document type + number | `ref_doc_type`, `ref_doc_number` | e.g. BOL |

#### Transformation (creates new TLC; links inputs)

| FDA template column group | Lab field(s) | Notes |
|---------------------------|--------------|-------|
| Incoming FTL food TLC (if applicable) | `from_tlc` (row per input) | Multi-input = multi-row or repeated export rows |
| Incoming product description + qty used + uom | `from_product_*`, `from_qty`, `from_uom` | Over-consume rejected (test #10) |
| **New** Traceability Lot Code assigned | `to_tlc` | New node in DAG |
| Location where transformed (= TLC source) | `tlc_source_*` | |
| TLC source reference (optional) | `tlc_source_ref` | |
| Transformation completion date | `event_date` | |
| Product description of food produced | `to_product_*` | |
| Quantity + UoM of food produced | `to_qty`, `to_uom` | |
| Reference documents | `ref_doc_*` | |

**Oracle rule:** mock-recall export must emit **separate sortable sheets/sections** for Receiving, Transformation, Shipping with one TLC per row (FDA guidance: machine-filterable). Missing required KDE → gap flag or blocked export (test #15).

**Gap vs prior lab draft:** old `location_id` / `to_partner_id` scalars are insufficient — location description is multi-field. Update invariants before any code.

## 7. ICP / framing (updated)

**Framing locked:** method stress (graph + regulatory-shaped export), not startup GTM.  
**Regulatory user:** any firm on the FTL that must produce CTE/KDE records as an electronic sortable spreadsheet within 24 hours.  
**Lab proxy user:** QA / recall coordinator running **mock recalls** before compliance-date pressure bites.  
**Still weak:** no first-party interview yet. G1 relies on FDA primary rule + documented 24h spreadsheet obligation — acceptable for method stress; insufficient if we later claim product-market insight.

## 8. Decision

**Do not build yet.** Next research tick:

1. ~~Map lab KDE columns 1:1 against FDA example spreadsheet~~ done (tick 2)
2. ~~Draft export JSON/CSV contract~~ done — `docs/ideas/lotblast-export-contract.md`
3. Adversarial pass: invent 3 fixtures (shared ingredient, diamond DAG, partial ship) with expected blast sizes on paper — done (`docs/ideas/lotblast-fixtures.md`)
4. Only then consider draft brief — still no product code

Sibling seeds (parked): SAFE-conversion math (method-only possible later); bank-recon aging (crowded).

