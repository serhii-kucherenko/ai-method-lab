# Alzheimer Predict Studio

Predict without pretending the data is complete.

Clinical ML teams predict Alzheimer’s risk with an imputation-free model and calibrated uncertainty — compared against impute-then-predict baselines that hide missingness.

## Claim

Clinical ML teams predict Alzheimer’s risk with an imputation-free model and calibrated uncertainty — not impute-then-predict pipelines that hide missingness.

Inspired by [arXiv:2607.11656](https://arxiv.org/abs/2607.11656v1). Not clinical certification. Not NITROGEN branding. Authors’ public code: none.

## Run locally

```bash
cd projects/alzheimer-predict-studio
npm install
npm run dev
```

Open http://localhost:3000 — landing CTA goes to `/cohorts`.

Dev API bearer token: `aps-dev-token`.

## Tests

```bash
npm test
npm run test:app-up
```

## Pages

`/` · `/cohorts` · `/features` · `/models` · `/uncertainty` · `/explanations` · `/compare` · `/settings` · `/honesty`

## Offline demo

Open `try.html` in a browser for an approximate dual-score demo.

## Guide

`docs/guides/56-alzheimer-predict-studio-lessons.md`
