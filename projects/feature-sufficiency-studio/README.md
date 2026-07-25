# Feature Sufficiency Studio

Know when partial clinical data is enough — before you lock an evaluation pack.

Soft-sim bench for clinical ML ops leads: version **feature packs**, define **observation masks**, run **partial-observation sufficiency** against a **full-feature baseline**, and read deltas on a scoreboard.

## Honesty

- Soft-sim / method-lab only
- Not clinical advice
- Not FDA-cleared software
- Not branded as FSA
- Paper: [arXiv 2607.09165](https://arxiv.org/abs/2607.09165v1) — authors’ code: none published

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Dev bearer token: `fss-dev-token`.

Offline demo: open `try.html` in a browser.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Next.js app |
| `npm run build` | Production build |
| `npm test` | Goldens + store + UI critical |
| `npm run test:app-up` | Live build + `next start` smoke |
| `npm run gen:goldens` | Regenerate ≥30 dual goldens |

## Primary routes

`/features` · `/masks` · `/cohorts` · `/sufficiency` · `/compare` · `/scoreboard` · `/pricing` · `/demo` · `/onboarding` · `/flows` · `/settings` · `/honesty`

## Dual A/B

- **A** `scorePartialObservation` — mask-aware sufficiency
- **B** `scoreFullFeatureBaseline` — full-feature / imputation-optimistic baseline

Implementations live in `src/domain/scoreA.ts` and bitwise-identical `src/domain/scoreB.ts`.
