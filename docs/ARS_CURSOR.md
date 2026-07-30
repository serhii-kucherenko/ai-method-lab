# ARS on Cursor (no Anthropic key)

How AI Method Lab uses [Academic Research Skills](https://github.com/Imbad0202/academic-research-skills)
for paper deepening inside Cursor.

## One-time setup

```bash
node scripts/bootstrap-ars.mjs
node scripts/resolve-ars-root.mjs --print
node scripts/resolve-ars-root.mjs --write-local
```

Optional: `export OPENALEX_POLITE_EMAIL=you@example.com` for OpenAlex polite pool.

**Do not** set or require `ANTHROPIC_API_KEY` for this path.

## Per-paper research

```bash
node scripts/ars-related-works.mjs \
  --title "Paper title here" \
  --doi 10.xxxx/yyyy \
  --out docs/ideas/<slug>-RELATED-WORKS.json
```

Then load the Cursor skill **ars-lab-paper-research** and write:

- `docs/ideas/<slug>-ARS-BRIEF.md`
- `docs/ideas/<slug>-KILL-ROUNDS.md`
- a short `docs/RESEARCH.md` entry

Protocol: `protocols/ARS_PAPER_RESEARCH.md`.

## What this is not

Not Claude Code plugin install. Not the full academic write/review pipeline.
Not a substitute for PM go or the business rubric.
