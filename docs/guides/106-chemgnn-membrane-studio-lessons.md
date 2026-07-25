# Chemgnn Membrane Studio — what we learned

Tutor notes from shipping **Chemgnn Membrane Studio** (`projects/chemgnn-membrane-studio`).

## Buyer story first

Membrane / desalination ML leads need a soft-sim bench that compares **ChemGNN graph surrogates** to **classical physics baselines** before locking a membrane pack. Landing copy sells that outcome — not a generic lab desk.

## Domain nouns beat desk shells

IA uses membranes, graphs, surrogates, runs, compares. Avoid `/jobs`, `/lifecycle`, `/scenario` isomorphic clones. Strangers should recognize a membrane-design product.

## Dual scorers without authors' code

No public authors' repo. Deterministic soft-sim A (`chemgnn_surrogate`) vs B (`classical_physics_baseline`) still yields ≥30 dual-impl goldens (`cm-001`…`cm-030`) and a honest try.html offline demo.

## Honesty is a product surface

Never claim wet-lab validated desalination membranes or live plant write-back. Ship `/honesty`, pricing footnotes, and landing fence in the same release as compare.

## Platform must-haves travel with the claim

Bearer auth, org/members, audit, export, webhook HMAC, rate limit, pagination, and ≥5 named flows on `/flows` are part of the comprehensive bar — not afterthoughts.

## Sources

- ChemRxiv https://doi.org/10.26434/chemrxiv.15006282/v1
- Authors' code: none published
