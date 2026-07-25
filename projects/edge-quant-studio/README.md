# Edge Quant Studio

Plan **channel-aware** bit widths for edge CPU LLM soft-sim — dual score **A** (channel-aware plan quality) vs **B** (naive uniform bit-width baseline).

Inspired by [PolyQ / arXiv:2607.14618](https://arxiv.org/abs/2607.14618v1). **Not** PolyQ, **not** measured silicon, **not** authors’ product (no public code in digest).

## Quick start

```bash
cd projects/edge-quant-studio
npm install
npm run dev
```

Open http://localhost:3000 — marketing landing CTA goes to `/packs`.

Dev API token: `eqs-dev-token` (Bearer).

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Marketing landing |
| `/packs` | Model pack registry |
| `/channels` | Channel bit-width plans |
| `/targets` | Edge CPU targets |
| `/runtime` | Compile / runtime soft-sim |
| `/budgets` | Latency / memory honesty |
| `/compare` | Channel-aware vs uniform |
| `/settings` | Org, members, features |
| `/honesty` | Fence + Sources |

## Tests

```bash
npm test
npm run test:app-up
```

## Offline demo

Open `try.html` in a browser for a simplified dual-score demo (no server).

## Honesty

Method-lab soft-sim only. See `/honesty`.

## Sources

- Paper: https://arxiv.org/abs/2607.14618v1
- Authors’ code: none
- Guide: `docs/guides/62-edge-quant-studio-lessons.md`
