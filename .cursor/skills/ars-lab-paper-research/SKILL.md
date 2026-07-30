---
name: ars-lab-paper-research
description: >-
  Deepen a picked research paper for AI Method Lab product ideation using
  Academic Research Skills patterns on Cursor models (no Anthropic API key).
  Use when researching related work, kill-round evidence, IDEA_DEPTH dossiers,
  or lit briefs for a paper-sourced product idea.
---

# ARS lab paper research (Cursor, no Anthropic key)

Use this for the **Researcher** role when a paper (or paper-like seed) needs depth
before PM go. Goal: stronger product dossiers - not academic manuscripts.

Upstream: [Imbad0202/academic-research-skills](https://github.com/Imbad0202/academic-research-skills)
(CC-BY-NC-4.0). Lab protocol: `protocols/ARS_PAPER_RESEARCH.md`.

## Hard constraints

1. **No Anthropic key.** Run on the current Cursor session model. Never require
   `ANTHROPIC_API_KEY`, Claude Code billing, or `model: opus|sonnet` pins.
2. **Research ≠ build.** Do not open or edit `projects/<slug>/` from this skill.
3. **Job-to-be-done first, paper second.** Related work serves IDEA_DEPTH +
   business rubric - not a publishable literature review.
4. **Software-solvable gate.** Refuse device / clinical carepath / wet-lab /
   retail novelty costumes (`docs/BUSINESS_RUBRIC.md`).
5. **Stop before academic-paper / pipeline.** Do not write venue manuscripts,
   APA full reports, or revision loops unless a human explicitly asks.

## Bootstrap (once per machine)

```bash
node scripts/bootstrap-ars.mjs
node scripts/resolve-ars-root.mjs --print
```

This clones ARS into `vendor/academic-research-skills/` (gitignored) when missing.
Optional env: `ARS_ROOT`, `OPENALEX_POLITE_EMAIL`.

## Workflow

### 1. Resolve seed

Need: paper title, abstract or digest blurb, URL/DOI if known, proposed slug /
display name. Prefer CONTROLLER `intake.last_pick` or shortlist output.

### 2. Related works (deterministic, free APIs)

```bash
node scripts/ars-related-works.mjs --title "..." [--doi 10.xxx] [--arxiv 2607.xxxxx] [--out docs/ideas/<slug>-RELATED-WORKS.json]
```

Uses OpenAlex + arXiv only. No Anthropic. Optional Semantic Scholar if
`SEMANTIC_SCHOLAR_API_KEY` is set (still not Anthropic).

### 3. Load optional ARS prompts when available

If `node scripts/resolve-ars-root.mjs --print` returns a path:

| Mode | Read from ARS_ROOT |
|------|--------------------|
| Quick brief | `deep-research/SKILL.md` → `quick` mode section |
| Lit matrix | `deep-research/templates/literature_matrix_template.md` |
| Devil's advocate | `deep-research/agents/devils_advocate_agent.md` |
| Source quality | `deep-research/references/source_quality_hierarchy.md` |
| OpenAlex / arXiv / Crossref / S2 protocols | `deep-research/references/*_api_protocol.md` |

If ARS_ROOT is missing, continue with related-works JSON + this skill alone.

### 4. Produce lab artifacts (required)

Write under `docs/ideas/`:

| File | Purpose |
|------|---------|
| `<slug>-ARS-BRIEF.md` | 1–2 page product-facing brief: claim, buyers, related work map, gaps |
| `<slug>-KILL-ROUNDS.md` | ≥3 adversarial kills with answered/accepted outcomes (IDEA_DEPTH G3) |
| Update `docs/RESEARCH.md` | Short dated entry pointing at the brief |

Optional: `<slug>-RELATED-WORKS.json` from the script.

Do **not** invent citations. Every paper cited must appear in related-works JSON
or a fetched OpenAlex/arXiv/Crossref record.

### 5. Hand off

Researcher exit remains IDEA_DEPTH (`ready_to_build` or park/kill). PM still owns
roadmap + PM-GO. This skill never skips the business score gate.

## Modes (lab mapping)

| Lab need | ARS-inspired mode | Output |
|----------|-------------------|--------|
| Fast scan of a pick | `quick` | ARS-BRIEF only |
| Kill evidence / competitors | `fact-check` + devil's advocate | KILL-ROUNDS |
| Landscape for differentiation | `lit-review` (truncated) | RELATED-WORKS + brief synthesis |
| Vague seed | `socratic` questions only | RESEARCH.md notes - no fake certainty |

Prefer `quick` when the lab is idle and needs one deepened idea this tick.

## Anti-patterns

- Running `/ars-full` or academic-pipeline inside the lab controller loop
- Requiring Claude Code plugin install for basic related-works
- Treating ARS APA reports as product PRDs
- Same-tick pick → smoke scaffold after a brief
