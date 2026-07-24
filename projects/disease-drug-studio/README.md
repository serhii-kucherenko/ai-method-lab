# Disease Drug Studio

Disease-aware drug candidate workspace: manage disease programs, generate with disease conditioning, rank/filter candidates, and compare against disease-blind baselines.

Inspired by [DrugGen 2](https://arxiv.org/abs/2607.08404v1) / [DrugGen-2 code](https://github.com/alimotahharynia/DrugGen-2). **Not** DrugGen-2 as a brand. **Not** an isomorphic lab desk shell.

## Run

```bash
cd projects/disease-drug-studio
npm install
npm run dev
```

Open http://localhost:3000 — landing CTA goes to `/programs`.

API bearer token (dev): `dds-dev-token`.

## Test

```bash
npm test              # unit + store + UI critical
npm run test:app-up   # next build + next start GET /
```

## Stack

Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui. Soft-simulated domain scoring in TypeScript (no Python sidecar required for this claim).

## Honesty

Method Lab experiment. Soft scores for learning. See `/honesty` and Sources on the landing footer.
