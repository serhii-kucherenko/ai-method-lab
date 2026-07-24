# FINDINGS — Graph RAG Studio

## What worked

- GraphRAG-native IA (`/corpora`, `/pipelines`, `/graph`, `/ask`, `/scenarios`) reads as a studio, not a noun-swapped desk.
- Dual-impl multi-step and single-shot scorers agree on 30 fixtures; scenarios usually crown multi-step when duplicate rate and weak edges are high.
- Live `next build` + `next start` landing smoke catches App Router regressions early.

## What was hard

- Keeping visual identity (Fraunces + teal/slate) distinct from prior lab desks while still using shadcn primitives.
- Aligning two independent score implementations on floating-point clamp/order details.

## Money / honesty

Soft simulation only — not a production GraphRAG engine and not authors’ RAGU stack. Do not sell as RAGU/Meno-Lite.
