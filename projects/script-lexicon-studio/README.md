# Script Lexicon Studio

Soft-sim studio for NLP / localization leads comparing **expanded Ge'ez-script lexicons** against **baseline multilingual tokenizers** before locking a language pack.

## Quick start

```bash
npm install
npm run dev
```

Bearer token for API calls: `sls-dev-token`.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Local Next.js app |
| `npm run build` | Production build |
| `npm test` | Goldens + store + UI critical tests |
| `npm run test:app-up` | Build + `next start` GET `/` smoke |
| `npm run gen:goldens` | Regenerate 30 dual goldens |

## Honesty

Method-lab soft-sim only. Not production MT certification. Not branded as VEXMLM. Paper: [arXiv 2607.15209](https://arxiv.org/abs/2607.15209v1) (no authors' code published).

## Offline demo

Open `try.html` in a browser for a slider soft-sim without the Next server.
