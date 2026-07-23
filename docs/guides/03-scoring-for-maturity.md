# Guide 03 — Scoring for maturity

How agents score product cells under `docs/RUBRIC.md` after **Correction 6** (2026-07-23).

Green tests alone are not a win. Maturity, sophistication, and naming decide whether sustain **passes**.

## Why this guide exists

Correction 6 raised the bar: mature human names, ≥15 features, tutor guides, and scoring that rewards depth over pass-count theater. See `docs/DEPTH_RESTART.md` and `docs/COMPREHENSIVE_PRODUCT.md`.

## When to score

Score every cell `(approach × project)` the same way. Agents under test must not edit `harness/` or `oracles/` during a run.

Score **sustain** only after the product claims finish: UI live, FINDINGS drafted, tutor guide path known.

## Primary checks (in order)

Use the primary metrics table in `docs/RUBRIC.md`. For sustain, apply these gates in order:

### 1. Correctness (still required)

Oracle + contracts green. Prior suite still green (regression safety).

Fail correctness → fail the cell. Do not “save” it with maturity language.

### 2. Maturity gate (hard fail even if tests are green)

Sustain **fails** when any of these is true:

| # | Fail if… | Source |
|---|----------|--------|
| 1 | Public brand is a statute code or glue-noun | `docs/PRODUCT_NAMING.md` |
| 2 | Fewer than **15** user-visible features **or** fewer than **6** pages | Rubric + comprehensive bar |
| 3 | No tutor guide under `docs/guides/` for this product | Tutor role exit |
| 4 | Digests are pass-count only (no story / money honesty) | Rubric + notify rules |

Count features the honest way (`docs/COMPREHENSIVE_PRODUCT.md`):

- Each distinct user-visible capability counts once
- CRUD create/read/update alone = **3 max** toward 15
- Dual-approval status boards do **not** count as domain features

Display name and slug: lead UI, portfolio, try page, and findings email with the human name — not the research id.

### 3. Sophistication

Ask: is the unique domain claim still true at sustain, and is this product **not** an isomorphic clone of a prior dual-gate or calculator costume?

Fail sophistication when the product is a noun-swap of a prior sustained app, or when domain tests are shallow relative to the claim.

### 4. Reviewability includes the guide

PR size and artifact links matter. After Correction 6, a **guide link** is part of reviewability — missing guide hurts the cell even if FINDINGS exist.

## How to write the score

Keep the same shape as other cell scores (validate against `harness/cell.schema.json` when filing JSON). In narrative FINDINGS / score notes:

1. State pass/fail for correctness
2. State pass/fail for **each** maturity gate item (naming, feature count, pages, guide, digest story)
3. State sophistication: unique claim held? clone risk?
4. Note cycle time honestly — slower is OK if maturity rose
5. Do **not** rank primarily by “N tests passed”

## Promotion reminder

A method becomes a default candidate only when correctness **and** maturity hold on ≥2 project tiers, interventions stay in budget, FINDINGS plus a tutor guide exist, and the promote decision is recorded. See promotion section in `docs/RUBRIC.md`.

## Refuse

- Calling sustain a pass because the oracle suite is green while the brand is `c1592`-style
- Counting thin CRUD + one calculator as “15 features”
- Skipping the tutor guide and scoring anyway
- Digests that only list pass counts
- Treating ugly internal ids in UI copy as “secondary only” when they are the public brand

## Worked example

Legacy **Customs Penalty Forecast** (`projects/c1592`) would **fail today’s maturity bar** on naming and (likely) feature count even with green tests. See `docs/guides/scoring/customs-penalty-forecast.md` and Guide 02.

## Quick checklist for scorers

- [ ] Correctness + regression green
- [ ] Display name human; slug hyphenated words
- [ ] ≥15 user-visible features (honest count)
- [ ] ≥6 pages/views
- [ ] Tutor guide present under `docs/guides/`
- [ ] Digests tell a story with money honesty
- [ ] Unique domain claim still true; not a clone
- [ ] Guide linked in reviewability notes
