# Crystal Bind Studio

Materials teams register **crystal packs**, attach **structure / diffraction / DOS / language** descriptor lanes, project a soft-sim **bind space**, and compare **multimodal retrieve quality** against a **single-modality baseline**.

Inspired by [MatBind (arXiv:2607.08470)](https://arxiv.org/abs/2607.08470v1). This product is a Method Lab soft-sim studio — **not** MatBind and **not** measured wet-lab spectra. Authors’ code: none published.

## Quick start

```bash
cd projects/crystal-bind-studio
npm install
npm run dev
```

Open http://localhost:3000 — marketing landing. Studio entry: `/packs`.

Dev API bearer: `cbs-dev-token`.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Next.js app |
| `npm run build` / `npm start` | Production |
| `npm test` | Goldens + store + UI critical |
| `npm run test:app-up` | Live build + start smoke |
| `npm run gen:goldens` | Regenerate ~30 dual goldens |

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Marketing landing |
| `/packs` | Crystal pack registry |
| `/structure` | Structure lane |
| `/diffraction` | Diffraction lane |
| `/dos` | DOS lane |
| `/language` | Language lane |
| `/bind` | Bind-space explorer |
| `/retrieve` | Multimodal vs single compare |
| `/settings` | Org / members / export / audit |
| `/honesty` | Soft-sim fence + Sources |

## Dual score

- **A** — multimodal bind retrieve quality  
- **B** — single-modality baseline  

## Honesty

Soft-sim embeddings only. See `/honesty` and `docs/guides/63-crystal-bind-studio-lessons.md`.
