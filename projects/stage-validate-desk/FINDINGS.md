# Stage Validate Desk — findings

## Domain deltas

Stage-gated plans (reference tolerance + tiered long-context / bit-width / kernel measurements) vs naive intuition that skips gates: short-bench only, assume 4-bit faster, assume hand GEMM is the ceiling. Workload presets and tolerance floor shift leans; skip-gates cheat rejects.

## What overturns intuition

Soft scores show large risk deltas when naive short-bench baselines ignore stage gates. Contaminated / high-extremity profiles widen the gap. Dual-impl goldens (≥30) keep A/B scorers honest.

## Honesty

Method experiment inspired by https://arxiv.org/abs/2607.14568v1. Not a Fermi CUDA engine replacement. Soft simulation only. Never brand MiniCPM / Fermi / Tesla C2075 as the product name.
