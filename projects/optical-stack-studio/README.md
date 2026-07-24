# Optical Stack Studio

**Say the coating. Get the stack.**

Open-vocabulary inverse design studio for multilayer optical coatings: free-form briefs, discrete material sequences, continuous thicknesses, spectrum review, and open-vocab vs catalog-only compare.

Inspired by [arXiv:2607.08392](https://arxiv.org/abs/2607.08392v1). Not branded as IrisFlow. Soft-simulation only — not live fab or spectrometer hardware.

## Run

```bash
cd projects/optical-stack-studio
npm install
npm run dev
```

Open http://localhost:3000 — marketing landing, then **Open design briefs**.

## Test

```bash
npm test
npm run test:app-up
```

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Marketing landing |
| `/briefs` | Open-vocabulary design briefs |
| `/materials` | Discrete material sequences |
| `/thicknesses` | Continuous thickness plans |
| `/stacks` | Assembled multilayer stacks |
| `/spectra` | Predicted spectrum review |
| `/compare` | Open-vocab vs catalog-only |
| `/settings` | Org, members, webhook, exports |
| `/honesty` | Fence + Sources |

## Dual score

- **A** — open-vocabulary discrete+continuous plan quality
- **B** — catalog-only baseline (fixed materials, no free-form brief)

## Auth

Bearer token (dev): `oss-dev-token`

## Offline demo

Open `try.html` in a browser for a single-file approximate demo of the claim.
