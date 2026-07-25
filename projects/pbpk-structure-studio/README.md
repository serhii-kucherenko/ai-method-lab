# PBPK Structure Studio

Soft-sim studio for PK / ADME leads: compound packs, topology graphs, ADME configs, and dual A/B (structure-only topology-compiled PBPK vs measured-lab) before locking a pack.

**Paper:** [ChemRxiv 10.26434/chemrxiv.15004452](https://doi.org/10.26434/chemrxiv.15004452/v4) · authors’ code: none  
**Honesty:** soft-sim only; not regulatory filing; not live LIMS; not the authors’ system / not Sisyphus brand.

## Run

```bash
npm install
npm run dev
```

Dev bearer token: `pbpk-structure-dev-token`

## Tests

```bash
npm test
npm run build
npm run test:app-up
```

## Offline

Open `try.html` for a browser-only soft-sim score sketch.
