# Probe Domain Studio

Soft-sim studio for assay / probe designers comparing **cooperative multi-domain DNA probes** against **single-domain melting baselines** before locking a probe pack.

Paper inspiration: https://doi.org/10.26434/chemrxiv.15006161/v2  
Authors’ code: none published.

## Honesty

Not wet-lab validated IVD. Not a whole-blood device. Not the authors’ probe system brand. Method-lab soft-sim only.

## Run

```bash
cd projects/probe-domain-studio
npm install
npm run dev
```

Open http://localhost:3000 — primary CTA enters `/packs`.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Next.js app |
| `npm run build` | Production build |
| `npm test` | Goldens + store + UI critical |
| `npm run test:app-up` | Live build + `next start` smoke |
| `npm run gen:goldens` | Regenerate pd-001…pd-030 |

## Scorers

- **A** `cooperative_multi_domain_probe`
- **B** `single_domain_melting_baseline`

## Offline demo

`try.html` — approximate single-file demo for StackBlitz / digest attachment. Full dual-impl fidelity requires the local app.
