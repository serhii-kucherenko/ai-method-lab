# 153 — Dhodh Screen Studio lessons

## What shipped
A soft-sim studio where antimalarial / computational chemistry leads compare **structure-based PfDHODH virtual screening** against a **naive library baseline** on versioned screen packs — packs, screens, hits, assays, dual compare, scoreboard, export, webhook, settings.

## Category practices
Eval / virtual-screen bench: ≥30 dual-impl goldens (`ds-001`…`ds-030`), dual scorers with disagreement when non-selective lookalikes inflate library hits, scoreboard, honesty fence, export + HMAC webhook.

## What we learned
1. Domain nouns must be packs / screens / hits / assays — not desk shells (`/jobs`, `/lifecycle`, `/scenario`) and not aminoarylation route/catalyst nouns.
2. Structure-based docking + pharmacophore can beat naive library dumps on soft-sim while honesty still forbids wet-lab, clinical, IND, and procurement claims.
3. Clear disagreement cases (low parasite selectivity, busy library hit rate) are the product story — not a clinical endorsement.

## Deferred
Live docking engines, wet-lab assay ingestion, compound vendor procurement, IND document generation.
