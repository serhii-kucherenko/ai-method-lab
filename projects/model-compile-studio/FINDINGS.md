# FINDINGS — Model Compile Studio

## What worked
- Distinct IA (models / compile / targets / artifacts) avoided desk-clone failure modes.
- Dual-impl goldens on multi-pass vs single-pass / target-blind made the claim testable without a real chip SDK.
- Soft plan-quality scoring kept honesty: no latency or TOPS theater.

## What to watch
- Do not brand as TPU-MLIR / Sophgo.
- Do not invent chip timing from simulation scores.
- Keep forbidden desk routes out of primary IA.
