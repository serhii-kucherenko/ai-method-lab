# Retro Route Studio

Soft-sim chem / synthesis-planning studio: versioned route packs, structured search memory, intermediate properties, and dual compare of **structured-memory agentic** vs **naive local greedy** retrosynthesis scoring.

Inspired by [arXiv 2607.14512](https://arxiv.org/abs/2607.14512v1) (RetroAgent pattern). **Not** a RetroAgent rebrand. **Not** wet-lab execution. **Not** regulatory synthesis certification.

## Run

```bash
cd projects/retro-route-studio
npm install
npm run dev
```

Open http://localhost:3000 — bearer token for APIs: `rrs-dev-token`.

## Scripts

- `npm run build` / `npm start`
- `npm test` — goldens + store + UI critical
- `npm run test:app-up` — live build + start smoke
- `npm run gen:goldens` — regenerate 30 dual-impl fixtures

## Offline try

Open `try.html` in a browser for an approximate A/B score demo.
