# Brief — lotblast smoke

**Status:** build brief (A03+A10). Product: `projects/lotblast/`.

**Idea:** `docs/ideas/lotblast.md`  
**Contract:** `docs/ideas/lotblast-export-contract.md`  
**Fixtures:** `docs/ideas/fixtures/*.json`  
**Algorithm:** `docs/ideas/lotblast-blast-algorithm.md`

## Intent

Method stress: can A03+A10 sustain a **DAG lot-genealogy** product with deterministic blast radius and FDA-shaped sortable CTE export — without collapsing to lottrack / dual-gate clones.

## In scope (smoke)

1. Pure blast + backward-trace matching golden fixtures A–F
2. Plants (tenancy) + roles (`ops`, `qa`, `recall_admin`)
3. CTE writes: receiving, transformation, shipping with multi-field location KDEs
4. Mock recall lock + export envelope
5. Authz plant isolation, webhook on `recall.opened`, pagination on blast members, rate limit

## Out of scope

- Full FSMA compliance product / FTL completeness
- Harvesting, cooling, initial packing, first land-based receiving tabs
- Commercial GTM / replacing Nulogy/ERP
- Dual-signer ceiling gates as the “unique” claim

## Acceptance

- Fixture A–F expects exact (forward + backward + overconsume)
- Export sheets match contract types
- Removing genealogy leaves tests that look like lottrack → **fail the idea**, not weaken tests
