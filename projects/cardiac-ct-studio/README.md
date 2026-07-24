# Cardiac CT Studio

HITL cardiac CT annotation, multi-structure segmentation, and foundation phenotyping — with an honest auto-only compare.

**Not** clinical certification or live PACS. Method Lab experiment inspired by [arXiv:2607.11287](https://arxiv.org/abs/2607.11287v1).

## Run

```bash
cd projects/cardiac-ct-studio
npm install
npm run dev
```

Open http://localhost:3000 — landing CTA goes to `/studies`.

Dev API bearer: `ccs-dev-token`.

## Test

```bash
npm test
npm run test:app-up
```

## Pages

`/` · `/studies` · `/annotations` · `/segments` · `/phenotypes` · `/augment` · `/compare` · `/settings` · `/honesty`

## Dual score

- **A** — HITL + foundation phenotyping plan quality
- **B** — auto-only baseline (no expert annotation loop)

## Offline demo

Open `try.html` in a browser for a quick HITL vs auto-only sketch.
