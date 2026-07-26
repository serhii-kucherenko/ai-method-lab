# Responsible Index Studio

Soft-sim studio for AI governance / public-policy analytics leads: compare **structured country indexes** against **naive commitment checklists** before locking a country pack.

## Claim

Version country packs, configure dimensions and indicators, run dual compares (`structured_country_index` vs `naive_commitment_checklist`), lock when deltas and honesty are understood.

## Honesty

Soft-sim only — not live national policy authority, not certified AI audits, not government command systems. Research input: [arXiv 2607.14782](https://arxiv.org/abs/2607.14782v1). Not an authors’ product brand. Not branded as GIRAI.

## Run

```bash
cd projects/responsible-index-studio
npm install
npm run dev
```

Open http://localhost:3000 — bearer token for APIs: `responsible-index-dev-token`.

Offline demo: open `try.html` in a browser (approximate JS soft-sim).

## Tests

```bash
npm test          # goldens + store + UI critical
npm run test:app-up   # next build + live GET /
npm run gen:goldens
```

## IA

`/packs` · `/countries` · `/dimensions` · `/indicators` · `/compare` · `/scoreboard` (+ `/pricing` `/demo` `/onboarding` `/flows` `/honesty` `/settings`)

## Guide

`docs/guides/146-responsible-index-studio-lessons.md`
