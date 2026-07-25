# Atomistic Force Studio

Soft-sim studio for computational chemistry leads who compare foundation-model atomistics against classical force-field baselines before locking a sim pack.

## Run

```bash
cd projects/atomistic-force-studio
npm install
npm run dev
```

Open http://localhost:3000. Dev bearer token: `atomistic-force-dev-token`.

## Tests

```bash
npm test
npm run build
npm run test:app-up
```

## Honesty

Soft-sim only. Not DFT-validated manufacturing sims. Not live HPC write-back. Not the authors’ system.

Paper: https://doi.org/10.26434/chemrxiv-2025-f1hgn/v5
