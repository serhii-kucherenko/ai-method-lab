# Brief (draft) — lotblast smoke oracle shape

**Status:** research draft only. Not pinned as an immutable oracle. Do **not** open `projects/lotblast/` until IDEA_DEPTH → `ready_to_build`.

**Idea:** `docs/ideas/lotblast.md`  
**Contract:** `docs/ideas/lotblast-export-contract.md`  
**Fixtures:** `docs/ideas/fixtures/*.json`

## Intent

Method stress: can A03+A10 sustain a **DAG lot-genealogy** product with deterministic blast radius and FDA-shaped sortable CTE export — without collapsing to lottrack / dual-gate clones.

## In scope (smoke)

1. Plants (tenancy) + roles (`ops`, `qa`, `recall_admin`)
2. CTE writes: receiving, transformation, shipping with multi-field location KDEs
3. Forward blast + backward trace
4. Mock recall lock + export envelope
5. Fixtures A/B/C golden expects
6. Authz plant isolation, webhook on `recall.opened`, pagination on blast members, rate limit

## Out of scope

- Full FSMA compliance product / FTL completeness
- Harvesting, cooling, initial packing, first land-based receiving tabs
- Commercial GTM / replacing Nulogy/ERP
- Dual-signer ceiling gates as the “unique” claim

## Acceptance (paper → future RED)

- All 30 named cases in lotblast dossier
- Fixture A/B/C JSON expects exact
- Export sheets match contract types
- Removing genealogy leaves tests that look like lottrack → **fail the idea**, not weaken tests

## Gate

Promote this file to `oracles/` only after `ready_to_build`. Until then it is a research artifact under briefs.
