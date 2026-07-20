# Research log

Frontier thinking only. No product code. No ROADMAP promotion from this file.

## 2026-07-19 — Lab bootstrapped

- Meta-repo created for multi-project × multi-approach benchmarking.
- Wave 1 approaches A01–A10 frozen as method cards.
- First briefs: smoke, crud, workflow.
- **Autonomous controller enabled** (`protocols/AUTONOMOUS_CONTROLLER.md`, `matrix/CONTROLLER.json`): after each cell, continue without human confirmation.
- Wake prompt saved in `docs/AUTOMATION.md` for Cursor Automation / new agents.
- Next research questions:
  - Ideal smoke oracle strength without making experiments too slow
  - Whether team-size sims are scripted role prompts or real multi-agent
  - Auto-merge policy for docs vs results PRs

## 2026-07-20 — Post-ladder process

**Failure tags:** Standardized in `docs/FAIL_TAGS.md` (oracle tags + severity). Cell JSON uses empty `fail_tags` on pass.

**Replication default:** `promoted-only` — after auto-promote, run **3 independent replications** (`run_index` 1–3) on **P-smoke-001** for primary (A03) and enterprise alternate (A10). Original wave-1 runs count as `run_index: 1`; queue r2 and r3. Median metrics; promote stands if ≥2/3 pass per `protocols/TRIPLE_TEST.md`. Routine ladder cells do not replicate by default.

**GitHub CLI:** Available (`gh` 2.45, authenticated). Remote PR trails enabled for sandbox merge evidence going forward.
