# Folio Clip Studio

Soft-sim studio for AgTech / crop-health product leads.

**Claim:** compare multimodal wearable plant-stress sensing against a single-sensor baseline before locking a clip pack.

**Honesty:** soft-sim only — not field-validated farm deployments, not live greenhouse write-back, not the authors’ system.

**Paper:** https://doi.org/10.26434/chemrxiv.15005167/v2 · authors’ code: none published

## Run

```bash
cd projects/folio-clip-studio
npm install
npm run dev
```

Open http://localhost:3000 — primary workspace is `/clips`.

## Tests

```bash
npm test
npm run build
npm run test:app-up
```

## Offline demo

Open `try.html` in a browser for an approximate dual-score demo without the server.
