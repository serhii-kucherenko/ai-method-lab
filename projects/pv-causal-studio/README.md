# Pv Causal Studio

Pharmacovigilance / RWE soft-sim: compare target-trial causal signals vs spontaneous-reporting baselines before locking a pv pack.

## Quick start

```bash
cd projects/pv-causal-studio
npm install
npm run dev
```

Open http://localhost:3000 — primary CTA is **Open signals**.

## Verify before sustain

```bash
npm test
npm run build
npm run test:app-up
```

Offline demo: open `try.html` in a browser.

## Domain routes

`/signals` · `/cohorts` · `/exposures` · `/runs` · `/compare` · `/scoreboard`

Also: `/pricing` · `/demo` · `/onboarding` · `/flows` · `/settings` · `/honesty`

## Honesty

Soft-sim only — not regulatory submission authority, not live claims write-back, not FDA cleared, not the authors’ system.

Paper: https://www.medrxiv.org/content/10.64898/2026.07.01.26356874v1
