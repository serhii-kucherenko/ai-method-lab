# Molecule Sample Studio

Soft-sim studio for **sample-efficient generative optimization** vs **naive generative baselines** before locking a campaign pack.

Paper: [arXiv 2607.12488](https://arxiv.org/abs/2607.12488v1) · Authors' code: none

## Honesty

Soft-sim only. Not wet-lab validated. Not live ELN. Not the authors' system.

## Quick start

```bash
npm install
npm run dev
```

Bearer token for API: `mol-dev-token`

## Scripts

- `npm test` — goldens, store, UI critical path
- `npm run build` — production build
- `npm run test:app-up` — build + live smoke on `/`
- Offline demo: open `try.html`

## IA

`/campaigns` · `/targets` · `/optimizers` · `/runs` · `/compare` · `/scoreboard` plus `/pricing` `/demo` `/onboarding` `/flows` `/honesty` `/settings`
