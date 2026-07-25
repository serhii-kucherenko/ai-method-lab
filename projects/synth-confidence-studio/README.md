# Synth Confidence Studio

Soft-sim studio for process chemistry / route-design leads.

**Claim:** compare confidence-gated AI retrosynthesis against a naive AI route baseline before locking a route pack.

**Honesty:** soft-sim only — not wet-lab validated manufacturing routes, not live ELN write-back, not the authors’ system.

**Paper:** https://doi.org/10.26434/chemrxiv.15006146/v1 · authors’ code: none published

## Run

```bash
cd projects/synth-confidence-studio
npm install
npm run dev
```

Open http://localhost:3000 — primary workspace is `/routes`.

## Tests

```bash
npm test
npm run build
npm run test:app-up
```

## Offline demo

Open `try.html` in a browser for an approximate dual-score demo without the server.
