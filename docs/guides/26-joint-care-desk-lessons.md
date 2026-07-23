# Joint Care Desk — lessons

## What this product is

Joint Care Desk is a soft-simulation org desk for **dual-evidence musculoskeletal pathway plans**. It compares a stage-aware plan that uses both in-hospital evidence and external knowledge against naive baselines that answer from parametric memory only, use only one evidence world, or ignore care-stage transitions.

Display name is always **Joint Care Desk**. Never brand OrthoPilot, CHEESE, OrthoBench, or ORACLE as the product.

## Dual-gate (keep distinct)

| Gate | Meaning |
|------|---------|
| **A (good)** | Dual-evidence: hospital chart + external knowledge + missing-evidence acquisition + stage-aware pathway (admission → peri-op → discharge → rehab) |
| **B (naive)** | Parametric-memory-only single-shot; hospital-only; external-only; stage-blind plans |

This is **not** a dual-approver board, evidence-synthesis desk, governance desk, stage-validate desk, wild-locomotion desk, or tactile desk with nouns swapped.

## Maturity habits that paid off

1. **Design note before polish** — `docs/ideas/joint-care-desk-DESIGN.md` locks brand, tokens, and landing brief so the marketing `/` stays one composition.
2. **≥20 features / ≥8 pages / ≥4 aggregates** — CRUD alone does not carry the bar; scenario compare, audit export, webhooks, goldens, and honesty count.
3. **≥30 dual-impl goldens** — `scoreSynthesis` and `scoreSynthesisB` must agree; regenerate with `npm run gen:goldens`.
4. **Live app gate** — `npm run build` plus `test/app-up.test.ts` (`next start` GET `/` includes display name). Unit suites alone are not sustain.

## Stack

Next.js App Router + TypeScript + Tailwind + shadcn. Prefer Node writes for JSON on Windows (no PowerShell UTF-8 BOM on `package.json`).

## Honesty fence

Paper-inspired method experiment. Soft simulation only. Not clinical care, not EHR access, not the authors' OrthoPilot system.

## Sources

- Paper: https://arxiv.org/abs/2607.12527v2
- Authors' code: none published
- Product: https://github.com/serhii-kucherenko/ai-method-lab/tree/main/projects/joint-care-desk
