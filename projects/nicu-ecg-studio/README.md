# Nicu Ecg Studio

Soft-sim studio for NICU analytics / neonatal monitoring leads to compare **alignment-free PPG-guided ECG segment inpainting** against an **alignment-dependent PPG-to-ECG baseline** before locking an ecg pack.

## Run

```bash
cd projects/nicu-ecg-studio
npm install
npm run dev
```

## Tests

```bash
npm test
npm run build
npm run test:app-up
```

## Claim

Paper: https://www.medrxiv.org/content/10.64898/2026.07.06.26357087v1 · authors’ code: none published.

Soft-sim only — not clinical diagnostic use, not live device write-back, not FDA cleared, not the authors’ system.
