# Chem Trace Studio

Method-lab soft-sim for comparing **typed trace-state validated** agentic chemistry workflows against **ungated agent** baselines before locking a workflow pack.

## Quick start

```bash
npm install
npm run gen:goldens
npm test
npm run dev
```

Dev bearer token: `chem-trace-dev-token`

## Stack

Next.js App Router, Tailwind, shadcn-style UI. In-memory store with HMAC webhooks and dual scorers in `src/domain/chem.ts`.

## Honesty

Soft-sim proxies only — not certified compliance, not live HPC, not the authors' system.
