# Garbage collector — clean bad ideas

Autonomous role: **score → keep / demote / kill → improve the business rubric**.

Runs when the lab is idle, after every `product_complete`, and before opening a new `projects/<slug>/`.

## Goal

Fewer weak studios. Stronger picks. A living rubric (`docs/BUSINESS_RUBRIC.md`) that gets sharper every miss.

## When to run

| Trigger | Action |
|---------|--------|
| Before opening `projects/<slug>/` | Score the pick; **abort climb** if tier Kill or C (unless human unpause override) |
| After sustain / finish email | Score or re-score the finished product; write row into `matrix/business-scores.json` |
| Idle tick with no `current_product` | Scan backlog / shortlist; kill or park weak ideas; bump rubric if a new fail pattern appears |
| Rubric version bump | Re-score Building + last 5 Complete rows; regenerate scorecard |

## Steps (each run)

1. Read `docs/BUSINESS_RUBRIC.md` (current version) + `matrix/business-scores.json`
2. For the target idea/product, fill dimensions 0–10 and compute composite
3. Assign tier A / B / C / Kill
4. Write plain-language fields: business idea, PMF, buyer, money hook, potential, moat, risks
5. Persist via `node scripts/score-business.mjs --upsert …` (or edit JSON then `--write-md`)
6. If Kill or C: append lesson to `docs/BUSINESS_RUBRIC_CHANGELOG.md` and bump rubric version when the lesson is new
7. If Kill on a not-yet-opened idea: do **not** create `projects/<slug>/`; mark idea kit `State: killed`
8. Prefer next paper picks that would score **A** or **B** under current rubric

## Scorecard columns (required)

Human table: `matrix/BUSINESS_SCORECARD.md` (generated from JSON).

| Column | Meaning |
|--------|---------|
| # | Stable id |
| Project | Display name |
| Score | 0–100 composite |
| Tier | A / B / C / Kill |
| Business idea | One-line job-to-be-done |
| PMF | Early fit signal (honest) |
| Buyer | Who pays / adopts first |
| Money hook | How value is captured |
| Potential | Wedge / why it could matter |
| Moat | Why not a clone |
| Evidence | Paper / code strength |
| Status | complete / building / killed / parked |
| Rubric | Version used |
| GC notes | Keep / kill rationale |

Extend JSON with extra keys anytime; regenerator prints known columns and folds unknowns into **Notes**.

## Hard rules

1. Do not “save” a Kill with prettier naming
2. Do not edit harness/oracles to change business scores
3. Finish-in-flight products may complete even if re-scored C — but **do not start** the next C/Kill
4. Every rubric bump needs a changelog entry
5. Finish emails’ business TLDR must match the scorecard row (`protocols/NOTIFY.md`)

## Pointers

- Rubric: `docs/BUSINESS_RUBRIC.md`
- Scores: `matrix/business-scores.json`
- Table: `matrix/BUSINESS_SCORECARD.md`
- Intake: `docs/PAPERS_INTAKE.md`
