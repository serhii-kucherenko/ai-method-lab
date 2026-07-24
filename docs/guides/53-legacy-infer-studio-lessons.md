# Lessons — Legacy Infer Studio

**Product:** Legacy Infer Studio (`legacy-infer-studio`)  
**Paper input:** https://arxiv.org/abs/2607.14568v1  

## What worked

1. **Distinct IA first.** Devices → stages → budgets → kernels → runs → compare is the product story. Avoiding jobs/lifecycle/scenario shells kept the buyer claim readable.
2. **Dual score matches the paper tension.** A = stage-validated all-GPU residency quality; B = naive offload with host spill / OOM risk. Compare UI sells the outcome without CUDA theater.
3. **Honesty fence early.** No MiniCPM branding, no live Tesla C2075 driver claim — inspired by stage-validation discipline, shipped as a method-lab planner.

## What to watch

- Soft-simulation scores can look “too precise.” Keep copy clear that fixtures are lab goldens, not measured GFLOP/s on Fermi.
- Kernel notes and budgets are first-class aggregates — don’t collapse them into a single calculator page.
- Export links that need bearer auth should use the client API helper, not bare `<a href>` in production hardening.

## Sustain checklist used

- ≥20 features via `listFeatures()`
- 9 pages including marketing `/`
- ~30 dual-impl goldens (infer.ts vs inferB.ts)
- `npm test` + live `npm run test:app-up`
