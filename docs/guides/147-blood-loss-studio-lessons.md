# 147 — Blood Loss Studio lessons

What we learned shipping **Blood Loss Studio** (caesarean weighed-swab measured vs haemoglobin-calculated soft-sim).

## Buyer story first

Obstetric analytics leads need birth packs and method/assay workspaces — not a generic dual-gate desk. Domain nouns (`packs` / `births` / `methods` / `assays`) kept the IA distinct from prior products.

## Dual scorers with honesty

Path A (`weighed_swab_measured`) and path B (`haemoglobin_calculated`) only matter when overclaim risk is visible. The honesty page and landing fence must say: not clinical advice, not EMR write-back, not device clearance.

## Goldens before polish

`bl-001`…`bl-030` dual-impl fixtures lock the claim. Generate expected outputs from the scorers; never hand-edit expected numbers without regenerating.

## Category practices shipped

Eval / perinatal bench: goldens, dual compare, scoreboard, versioned packs, audit, export, webhook, org members, rate limit, bearer auth, search/pagination.

## Deferred

Live EMR connectors and device certification — out of scope for method-lab soft-sim.

## Guide for next climb

Prefer paper-inspired obstetric claims that map to packs + methods + assays rather than noun-swapping a prior desk shell.
