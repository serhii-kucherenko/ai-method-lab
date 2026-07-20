# AI Method Lab

Build **real products** to test AI development workflows. Repeat across many products. Publish findings.

## How it works

1. Pick a **product hypothesis** (workflow × product shape)
2. Build the product under `projects/<id>/` using the promoted workflow
3. Climb maturity phases (smoke → crud → workflow → integrate → scale → **sustain**)
4. Score each phase; write findings
5. Start the next product — `projects/` is the testing portfolio

Method cards and oracles stay frozen during a phase. When a method breaks: version → redo → triple-test.

## Layout

| Path | Role |
|------|------|
| `projects/` | **Product experiments** (portfolio) — primary work surface |
| `projects/briefs/` | Phase templates (smoke, crud, …) |
| `docs/DEVELOPMENT_WORKFLOW.md` | AI full-stack workflow to use inside products |
| `approaches/` | Method cards (A01–A10+) |
| `oracles/` | Pass/fail criteria (do not edit mid-phase) |
| `matrix/` | Scores, leaderboard, cross-product findings |
| `sandboxes/` | Optional short A/B cells — not portfolio products |
| `protocols/` | Product runbook, autonomous controller, notify |

## Loops

1. **Research** — method/process questions in `docs/RESEARCH.md`
2. **Product experiment** — grow one product in `projects/<id>/` through phases
3. **Findings** — email digests; promote/adjust workflow defaults

## Autonomous by default

- Controller: `protocols/AUTONOMOUS_CONTROLLER.md` + `matrix/CONTROLLER.json`
- Product phases: `protocols/PRODUCT_RUNBOOK.md`
- Always commit, push, merge; email findings when phases complete
- Wake prompt: `docs/AUTOMATION.md`
