# Projects — product experiment portfolio

`projects/` is where the lab **tries real products**.

Each folder is one product experiment: build it with a promoted AI workflow, grow it through maturity phases, record findings, then start the next product. Stress-tier briefs under `briefs/` are **phase templates**, not the products themselves.

## Model

```text
Hypothesis (workflow × product shape)
  → Build product in projects/<id>/
  → Climb phases: smoke → crud → workflow → integrate → scale → sustain
  → Score + FINDINGS after each phase
  → Repeat with the next product idea
```

**Success for a product experiment:** a comprehensive, sustainable slice of product (FE + BE as needed), not a throwaway sandbox proof.

| Path | Role |
|------|------|
| `projects/<id>/` | Living product under experiment |
| `projects/<id>/HYPOTHESIS.md` | What we are testing |
| `projects/<id>/PRODUCT.md` | Vision, users, sustain criteria |
| `projects/<id>/FINDINGS.md` | Product-level learnings |
| `projects/briefs/` | Reusable phase templates (P-smoke, P-crud, …) |
| `projects/PORTFOLIO.md` | Registry of all product experiments |
| `sandboxes/` | Optional short-lived approach A/B cells (not portfolio products) |

## Rules

1. One product **phase** in flight at a time (controller `current_cell`).
2. Use `docs/DEVELOPMENT_WORKFLOW.md` (A03 + A10 overlays as needed).
3. Phase oracles in `oracles/` grade the product at that phase — do not edit oracles mid-run.
4. After each phase: score → append `projects/<id>/FINDINGS.md` + `matrix/FINDINGS.md` → commit → push → continue.
5. When a product reaches **sustain**, write a final findings brief and email it; queue the next product from `PORTFOLIO.md`.

## Maturity phases

| Phase | Template | Product must demonstrate |
|-------|----------|--------------------------|
| smoke | `briefs/P-smoke-001.md` | Auth + core entity + isolation + tests |
| crud | `briefs/P-crud-001.md` | Multi-entity RBAC + migrations |
| workflow | `briefs/P-workflow-001.md` | State machine + audit + concurrency |
| integrate | `briefs/P-integrate-001.md` | Webhooks + outbound deps + idempotency |
| scale | `briefs/P-scale-001.md` | Pagination + rate limits |
| sustain | (per PRODUCT.md) | Deployable, docs, observability, rollback, clear “done enough” MVP |
