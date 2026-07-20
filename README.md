# AI Method Lab

Multi-project methodology lab. Not one product.

**Control plane** that repeatedly:
1. Spins up sandbox projects
2. Builds each under one development approach
3. Scores the run (code + benchmarks)
4. Learns where it scaled or failed
5. Starts the next project / approach

When a method breaks mid-wave: **version it → redo → triple-test** before the new version counts.

## Layout

| Path | Role |
|------|------|
| `docs/` | Research, backlog, rubric, operating system |
| `approaches/` | Method cards (A01–A10+) |
| `projects/briefs/` | Project briefs by stress tier |
| `oracles/` | Pass/fail criteria agents cannot edit mid-run |
| `harness/` | Scoring + cell runner (outside agent-writable sandboxes) |
| `matrix/` | Leaderboard, cell scores, findings |
| `sandboxes/` | Local runs (gitignored contents OK; keep scores in matrix) |
| `protocols/` | Runbook, midterm-change, triple-test |

## Loops

1. **Research** — `docs/RESEARCH.md` + `docs/BACKLOG.md` only; one docs PR at a time
2. **Experiment** — one cell `(approach × project)` in flight; results → `matrix/`
3. **Build / promote** — only after findings promote a method; separate session

## Autonomous by default

The lab is meant to **self-continue** after each approach: score → learn → next cell, without asking you to confirm.

- Controller: `protocols/AUTONOMOUS_CONTROLLER.md` + `matrix/CONTROLLER.json`
- Wake prompt / Automation text: `docs/AUTOMATION.md`
- Agent entry: `AGENTS.md`

## Quick start (manual only if autonomous is paused)

1. Read `docs/OS.md` and `docs/RUBRIC.md`
2. Ensure `matrix/CONTROLLER.json` has `"mode": "autonomous"`
3. Run an agent with the wake prompt in `docs/AUTOMATION.md`
4. Or follow `protocols/RUNBOOK.md` yourself — still no need to confirm between cells
