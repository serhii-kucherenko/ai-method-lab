# 96 — Atomistic Force Studio lessons

## What shipped
A comprehensive soft-sim studio where computational chemistry / drug-design simulation leads version **sim packs**, configure **foundation-model forces** and **trajectories**, run **atomistic soft-sim runs**, and compare **foundation-model atomistics (A)** against a **classical force-field baseline (B)** before locking.

## Category practices
- Eval / industrial soft-sim: dual A/B, goldens (af-001…af-030), scoreboard, honesty fence
- Platform: bearer auth, org/members, audit, export JSON/CSV, webhook HMAC, rate limit, pagination, search

## Domain IA (anti-clone)
Routes use sims / forces / trajectories / runs / compares — not jobs / lifecycle / scenario desk shells.

## Honesty
Soft-sim only. Never claim DFT-validated manufacturing sims or live HPC write-back. Not an authors’ rebrand of FeNNix-Bio1.

## Brand
Sora + IBM Plex Sans; lattice ink / force teal / cool mist.

## Takeaways
1. Domain nouns must match the buyer story — “sim pack” beats a renamed desk.
2. Dual scorers need ≥30 goldens so lock decisions are regression-tested.
3. Commercial surfaces (`/pricing`, `/demo`, `/onboarding`, `/flows`) carry the product past a calculator costume.
