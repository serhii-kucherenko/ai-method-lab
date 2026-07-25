# FINDINGS — Quantum Kernel Studio

## Built

- Distinct IA: molecules / kernels / targets / runs (no jobs/lifecycle/scenario shells)
- Dual scorers: `scoreQuantumMultiKernel` (A) vs `scoreClassicalKernel` (B) with ≥30 goldens
- Platform must-haves: bearer auth, org/members, webhook HMAC, audit, export, search, pagination, rate limit
- Commercial surfaces: `/pricing`, `/demo`, `/onboarding`, `/flows`, honesty fence

## Constraints honored

- Soft-sim only; not wet-lab; not live quantum hardware; not Q²SAR brand
- Paper inspiration only (arXiv 2607.11701); authors’ code none published
