# Developable Molecule Studio

Bind the pocket. Pass developability.

Drug discovery teams generate pocket-conditioned molecules with property-aware developability optimization — compared against affinity-only baselines that fail later developability checks.

## Claim

Drug discovery teams generate pocket-conditioned molecules with property-aware developability optimization — not affinity-only generators that fail later developability checks.

Inspired by [arXiv:2607.12349](https://arxiv.org/abs/2607.12349v1). Not live wet-lab synthesis. Not conDitar-dev branding. Authors’ public code: none.

## Run locally

```bash
cd projects/developable-molecule-studio
npm install
npm run dev
```

Open http://localhost:3000 — landing CTA goes to `/pockets`.

Dev API bearer token: `dms-dev-token`.

## Tests

```bash
npm test
npm run test:app-up
```

## Pages

`/` · `/pockets` · `/candidates` · `/diffusion` · `/optimize` · `/properties` · `/compare` · `/settings` · `/honesty`

## Offline demo

Open `try.html` in a browser for an approximate dual-score demo.

## Guide

`docs/guides/55-developable-molecule-studio-lessons.md`
