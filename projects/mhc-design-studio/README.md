# Mhc Design Studio

Soft-sim studio for immuno-oncology / vaccine design analytics leads who compare **hybrid quantum–classical de novo MHC-binding peptide design** against a **classical generative baseline** before locking a peptide pack.

## Quick start

```bash
cd projects/mhc-design-studio
npm install
npm run dev
```

Open http://localhost:3000 — bearer token for APIs: `mhc-design-dev-token`.

## Verify

```bash
npm test
npm run build
npm run test:app-up
```

## Domain routes

`/peptides` · `/alleles` · `/designs` · `/runs` · `/compare` · `/scoreboard` · `/flows` · `/demo` · `/onboarding` · `/pricing` · `/settings` · `/honesty`

Offline demo: `try.html`.

## Honesty

Soft-sim only — not wet-lab validated binders, not live ELN write-back, not FDA cleared, not the authors’ system.

Paper: https://www.biorxiv.org/content/10.64898/2026.07.09.736951v1 · authors’ code: none published.
