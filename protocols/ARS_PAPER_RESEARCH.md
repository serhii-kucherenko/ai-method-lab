# ARS paper research (Cursor adapter)

Wire [Academic Research Skills](https://github.com/Imbad0202/academic-research-skills)
into the **Researcher** path without Anthropic / Claude Code API keys.

**Linear:** [ai-method-lab](https://linear.app/serhii-kucherenko/project/ai-method-lab-27d1b78be235) · issue SER-102  
**Skill:** `.cursor/skills/ars-lab-paper-research/SKILL.md`  
**project_tracker:** linear

## Why

simple-papers digests give eligibility + a one-line impact blurb. IDEA_DEPTH still
needs related work, kill rounds, and honest differentiation. ARS already encodes
those research behaviors as skills/agents. The lab consumes a **thin Cursor
adapter** so research runs on whatever model the Cursor session uses.

## Non-goals

- No Claude Code `/plugin install` requirement
- No `ANTHROPIC_API_KEY`
- No full academic-pipeline (write → review → revise → publish)
- No replacing simple-papers digest generation (that stays upstream)

## Components

| Piece | Role |
|-------|------|
| `scripts/bootstrap-ars.mjs` | Shallow-clone ARS into `vendor/academic-research-skills/` |
| `scripts/resolve-ars-root.mjs` | Resolve `ARS_ROOT` (env → vendor → Claude marketplace cache) |
| `scripts/ars-related-works.mjs` | OpenAlex + arXiv related works (free; no Anthropic) |
| `.cursor/skills/ars-lab-paper-research/` | Researcher skill for Cursor |
| This protocol | When/how to invoke |

## When to run

Run when **any** of:

1. Lab is idle (`CONTROLLER.current_product` null) and a shortlist pick needs depth
2. Researcher is clearing IDEA_DEPTH G3/G6 for a paper-sourced or paper-backed idea
3. Hourly research loop tick asks to deepen the next candidate

Skip when already in product delivery climb for an armed product (unless
explicitly researching the *next* idea in docs only).

## Procedure

```text
1. node scripts/bootstrap-ars.mjs          # no-op if vendor present
2. node scripts/resolve-ars-root.mjs --print
3. Load skill: ars-lab-paper-research
4. node scripts/ars-related-works.mjs --title "..." --out docs/ideas/<slug>-RELATED-WORKS.json
5. Write docs/ideas/<slug>-ARS-BRIEF.md + <slug>-KILL-ROUNDS.md
6. Append docs/RESEARCH.md
7. Continue IDEA_DEPTH / PM gate — do not open projects/
```

## Model / key policy

| Need | Source |
|------|--------|
| Reasoning / synthesis | Current Cursor session model |
| Bibliographic search | OpenAlex + arXiv (no key). Optional `OPENALEX_POLITE_EMAIL` |
| Optional triangulation | `SEMANTIC_SCHOLAR_API_KEY` if present |
| Forbidden | `ANTHROPIC_API_KEY` as a hard dependency |

If someone has Claude Code + ARS plugin locally, that is optional enrichment -
the lab path must still work without it.

## Outputs contract

Artifacts live under `docs/ideas/`. Citations must be grounded in fetched records.
Briefs are product-facing (buyer, wedge, falsifiers), not venue abstracts.

## License note

ARS is CC-BY-NC-4.0. Keep the clone under `vendor/` (gitignored). Do not re-publish
ARS contents as lab product code. Attribution: Cheng-I Wu / Imbad0202.
