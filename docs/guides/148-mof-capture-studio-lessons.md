# 148 — Mof Capture Studio lessons

What we learned shipping **Mof Capture Studio** (anionic MOF heavy-metal capture vs conventional sorbent soft-sim).

## Buyer story first

Water-remediation materials leads need water packs and sorbent/assay workspaces — not a generic dual-gate desk. Domain nouns (`packs` / `waters` / `sorbents` / `assays`) kept the IA distinct from prior products.

## Dual scorers with honesty

Path A (`anionic_mof_capture`) and path B (`conventional_sorbent`) only matter when overclaim risk is visible. The honesty page and landing fence must say: not live plant control, not certified water audits, not municipal procurement, not SU-102 brand.

## Goldens before polish

`mc-001`…`mc-030` dual-impl fixtures lock the claim. Generate expected outputs from the scorers; never hand-edit expected numbers without regenerating.

## Category practices shipped

Materials / remediation bench: goldens, dual compare, scoreboard, versioned packs, audit, export, webhook, org members, rate limit, bearer auth, search/pagination.

## Deferred

Live plant SCADA connectors and certified municipal audits — out of scope for method-lab soft-sim.

## Guide for next climb

Prefer paper-inspired materials claims that map to packs + sorbents + assays rather than noun-swapping a prior desk shell.
