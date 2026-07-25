# Persona Triage Studio

Soft-sim studio for clinical AI eval under communication diversity: persona packs, conversation cases, style axes, and dual compare of style-aware triage vs idealized-patient baselines.

**Paper:** https://arxiv.org/abs/2607.08625v1 (no authors’ code published)  
**Honesty:** soft-sim only — not clinical advice, not FDA-cleared, not the authors’ system brand.

## Quick start

```bash
cd projects/persona-triage-studio
npm install
npm run dev
```

Open http://localhost:3000. API bearer token (dev): `pts-dev-token`.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Next.js app |
| `npm run build` | Production build |
| `npm test` | Goldens + store + UI critical |
| `npm run test:app-up` | Live build + `next start` GET `/` |
| `npm run gen:goldens` | Regenerate 30 dual-impl goldens |

## Dual score

| Lane | Meaning |
|------|---------|
| A | Style-aware triage (persona + style axes + diversity) |
| B | Idealized-patient baseline (articulation + cooperation) |

Offline demo: open `try.html` in a browser.

## Docs

- Product notes: `PRODUCT.md`
- Hypothesis / findings: `HYPOTHESIS.md`, `FINDINGS.md`
- Tutor guide: `docs/guides/72-persona-triage-studio-lessons.md` (repo root)
