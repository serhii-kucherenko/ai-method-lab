# Graph RAG Studio

Multi-step GraphRAG workspace: **extract → consolidate → retrieve** with hop trails and citations. Compare against single-shot noisy graph builds.

Inspired by [RAGU](https://arxiv.org/abs/2607.11683v1) / [RaguTeam/RAGU](https://github.com/RaguTeam/RAGU). **Not** RAGU or Meno-Lite.

## Run

```bash
cd projects/graph-rag-studio
npm install
npm run dev
```

Open http://localhost:3000 — landing CTA goes to `/corpora`.

API bearer token (dev): `grs-dev-token`.

## Test

```bash
npm test              # unit + store + UI critical
npm run test:app-up   # next build + next start GET /
```

## Stack

Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui. Soft-simulated domain scoring in TypeScript (no Python sidecar required for this claim).

## Honesty

Method Lab experiment. Soft scores for learning. See `/honesty` and Sources on the landing footer.
