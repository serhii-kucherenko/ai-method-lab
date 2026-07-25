# Terrain Fire Studio

Wildfire GIS studio for **versioned terrain packs**, aerial refreshes, alignment plans, and **physics-aware refresh vs naive overlay** compare.

Inspired by [LTM / arXiv 2607.08711](https://arxiv.org/abs/2607.08711v1). Soft-simulation only — not the authors’ system, not live dispatch, not survey certification. Authors’ code: none published.

## Run

```bash
cd projects/terrain-fire-studio
npm install
npm run dev
```

Open http://localhost:3000 — primary CTA enters `/packs`.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Next.js dev server |
| `npm run build` / `npm start` | Production |
| `npm test` | Goldens + store + UI critical |
| `npm run test:app-up` | Live build + start smoke |
| `npm run gen:goldens` | Regenerate ~30 dual fixtures |

Dev API bearer: `tfs-dev-token`.

## Pages

`/` · `/pricing` · `/demo` · `/onboarding` · `/flows` · `/packs` · `/aerials` · `/alignment` · `/compare` · `/settings` · `/honesty`

Offline demo: `try.html`

## Dual score

- **A** — Physics-aware terrain refresh quality
- **B** — Naive photo-on-DEM overlay baseline

## Guide

`docs/guides/68-terrain-fire-studio-lessons.md`
