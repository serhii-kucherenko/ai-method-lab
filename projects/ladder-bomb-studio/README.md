# Ladder Bomb Studio

OT / ICS security engineers find ladder logic bombs in IEC 61131-3 PLC programs via formal verification that **keeps function-block bodies**, plus trigger synthesis. Dual score: A = FB-aware formal plan quality; B = dropped-FB baseline that misses bombs.

Inspired by [arXiv:2607.08417](https://arxiv.org/abs/2607.08417v1). Not branded as ESBMC-LLB / ESBMC-PLC+. Soft simulation only — not a live industrial verifier.

## Run

```bash
cd projects/ladder-bomb-studio
npm install
npm run dev
```

Open http://localhost:3000 — marketing landing CTA → `/plants`.

## Test

```bash
npm test
npm run test:app-up
```

## Pages

`/` `/plants` `/programs` `/scans` `/triggers` `/findings` `/compare` `/settings` `/honesty`

## Auth

Dev bearer token: `lbs-dev-token` (Authorization: Bearer …).

## Offline demo

Open `try.html` in a browser for an approximate dual-score demo (no server).

## Honesty

See `/honesty` and Sources on the landing. Authors’ code: none published with the paper.
