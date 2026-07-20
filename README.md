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

## Quick start

1. Read `docs/OS.md` and `docs/RUBRIC.md`
2. Pick next cell from `docs/BACKLOG.md`
3. Follow `protocols/RUNBOOK.md`
4. Write `matrix/cells/<cell-id>.json` + update `matrix/FINDINGS.md`
