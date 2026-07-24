# Lessons — Developable Molecule Studio

**Product:** Developable Molecule Studio (`developable-molecule-studio`)  
**Paper input:** https://arxiv.org/abs/2607.12349v1  

## What worked

1. **Distinct IA first.** Pockets → candidates → diffusion → optimize → properties → compare matches the buyer story. Avoiding jobs/lifecycle/scenario shells (and Disease Drug Studio disease routes) kept the pocket+developability claim readable.
2. **Dual score matches the paper tension.** A = pocket-conditioned + property-aware developability plan quality; B = affinity-only baseline that ignores developability until late failure. Compare UI sells the outcome without wet-lab theater.
3. **Honesty fence early.** No conDitar-dev branding, no live synthesis claim — inspired by pocket-conditioned developable molecule research, shipped as a method-lab planner.

## What to watch

- Soft-simulation scores can look “too precise.” Keep copy clear that fixtures are lab goldens, not measured assay values.
- Pockets, candidates, diffusion runs, optimize passes, and property ledger entries are first-class aggregates — don’t collapse them into a single calculator page.
- Export links that need bearer auth should use the client API helper, not bare `<a href>` in production hardening.

## Sustain checklist used

- ≥20 features via `listFeatures()`
- 9 pages including marketing `/`
- ~30 dual-impl goldens (molecule.ts vs moleculeB.ts)
- `npm test` + live `npm run test:app-up`
