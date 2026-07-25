# Quantum Kernel Studio

Soft-sim studio for chem-informatics leads who compare **quantum multiple-kernel QSAR** plans against **classical kernel** baselines before locking a binding-prediction pack.

## Honesty

- Soft-sim only — not wet-lab
- Not live quantum hardware
- Not branded as Q²SAR / not the authors’ system
- Paper: [arXiv 2607.11701](https://arxiv.org/abs/2607.11701v1) (no authors’ code published)

## Quick start

```bash
npm install
npm run dev
```

Dev bearer token: `qks-dev-token`

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run build` | Production build |
| `npm test` | Goldens + store + UI critical |
| `npm run test:app-up` | Live build + `next start` GET `/` |
| `npm run gen:goldens` | Regenerate ≥30 dual fixtures |

## Routes

`/`, `/pricing`, `/demo`, `/onboarding`, `/flows`, `/molecules`, `/kernels`, `/targets`, `/runs`, `/compare`, `/scoreboard`, `/settings`, `/honesty`

## Offline demo

Open [`try.html`](./try.html) for a static dual-score walkthrough.
