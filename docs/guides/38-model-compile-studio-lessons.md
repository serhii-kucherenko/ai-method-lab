# Lessons — Model Compile Studio

## Story
MLIR-inspired LLM compile work needs a studio that shows **passes and artifacts**, not a renamed jobs desk. Model Compile Studio keeps models, targets, compile, artifacts, and compare as first-class surfaces.

## Practices that held
1. **Ban isomorphic IA early** — `/models` `/compile` `/targets` `/artifacts` instead of `/jobs` `/lifecycle` `/scenario`.
2. **Dual score names the claim** — multi-pass plan quality vs single-pass / target-blind.
3. **Honesty fence** — soft simulation; never invent chip timing; never brand as the authors' vendor toolkit.
4. **Live app gate** — `next build` + `next start` GET `/` before sustain.
5. **≥20 features / ≥8 pages** — CRUD alone does not clear the bar.

## Pitfalls avoided
- Noun-swapping a prior studio's route map
- Shipping goldens-only without a marketing landing
- Claiming real accelerator performance from plan scores

## Sources
- Paper: https://arxiv.org/abs/2607.15865v1
- Authors' code: https://github.com/sophgo/tpu-mlir
- Pack: `docs/ideas/model-compile-studio*.md`
