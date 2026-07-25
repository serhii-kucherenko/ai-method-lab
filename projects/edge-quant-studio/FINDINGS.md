# Findings — Edge Quant Studio

## Claim

Channel-aware quantization plan quality (A) beats naive uniform bit-width baseline (B) in soft-sim for edge CPU LLM planning — falsified via dual goldens and `/compare`.

## Honesty

Soft-sim / method-lab. Inspired by PolyQ (2607.14618). Not PolyQ. Not measured silicon. No authors’ code published.

## Evidence

- 30 dual-impl goldens (`eqs-001`…`eqs-030`)
- Distinct IA: packs / channels / targets / runtime / budgets / compare
- Live `next build` + app-up smoke required for sustain
