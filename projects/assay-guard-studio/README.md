# Assay Guard Studio

Soft-sim studio for **assay-aware protocol validation** vs **naive protocol runners** before locking a liquid-handling deck pack.

Paper inspiration: [arXiv 2607.15620](https://arxiv.org/abs/2607.15620v1) · authors’ code: none.

## Honesty

Soft-sim only. Not certified compliance. Not live robot control. Not the authors’ system.

## Run

```bash
npm install
npm run dev
```

Bearer token for API: `assay-dev-token`

## Test

```bash
npm test
npm run build
npm run test:app-up
```

Offline demo: open `try.html`.
