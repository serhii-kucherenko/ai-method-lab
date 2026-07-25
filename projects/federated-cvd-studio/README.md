# Federated CVD Studio

Soft-sim studio for privacy-preserving CVD risk federations: cohort packs, feature schemas, federation configs, dual A/B scores (federated vs centralized), scoreboard, and platform must-haves.

## Quick start

```bash
npm install
npm run dev
```

Bearer token (dev): `fcvd-dev-token`

## Scripts

- `npm test` — goldens, store, UI critical
- `npm run build` — production build
- `npm run test:app-up` — build + live `next start` smoke
- `npm run gen:goldens` — regenerate ≥30 dual fixtures

## Honesty

Soft-sim only; not FDA cleared; not live EHR; not the authors’ system. Inspired by [arXiv 2607.08595](https://arxiv.org/abs/2607.08595v1).

Offline demo: open `try.html` in a browser.
