# Product experiment runbook

How to run one **product phase** (not a throwaway sandbox cell).

## 1. Pick work

From `projects/PORTFOLIO.md` + `docs/BACKLOG.md`. One phase in flight. Mark portfolio + backlog **in progress**.

## 2. Freeze inputs

Pin:

- Product dir: `projects/<id>/`
- Hypothesis: `projects/<id>/HYPOTHESIS.md`
- Workflow: `docs/DEVELOPMENT_WORKFLOW.md` + approach cards (default A03; A10 when PRODUCT says so)
- Phase brief: `projects/briefs/P-<phase>-001.md` (or PRODUCT sustain section)
- Oracle: `oracles/P-<phase>-001.md` (sustain: PRODUCT checklist)

Do not edit oracles mid-run. Midterm method change → `MIDTERM_CHANGE.md` + `TRIPLE_TEST.md`.

## 3. Work in the product folder

```text
projects/<id>/
```

This is the durable product. Prefer evolving this tree over creating `sandboxes/` copies.
Record path in cell JSON as `sandbox_path` **or** `product_path` (prefer `product_path` for portfolio work).

Optional: use `sandboxes/` only for short A/B method comparisons that should not pollute the product.

## 4. Execute

Follow DEVELOPMENT_WORKFLOW stages for the phase slice. RED → GREEN. Log interventions.

## 5. Score

Fill `matrix/cells/<approach>__P-<phase>-001__<product>__rN.json` (or existing id scheme).
Append `projects/<id>/FINDINGS.md` and `matrix/FINDINGS.md`.
Update leaderboard / PORTFOLIO status.

## 6. Notify

If `notify.enabled`, email per `protocols/NOTIFY.md` — content-first, plain-language summary (no acronyms or internal codes). Do not substitute a list of static docs for the summary.

## 7. Close + continue

Commit + push + merge. Advance to next phase on same product, or next queued product if sustain met / abandoned.

**Do not ask for confirmation.**
