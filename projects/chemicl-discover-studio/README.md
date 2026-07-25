# Chemicl Discover Studio

Soft-sim studio for chemistry discovery / ML-for-chem leads who compare **multimodal ChemICL** against a **text-only ICL baseline** before locking a discover pack.

**Paper:** https://doi.org/10.26434/chemrxiv.15006280/v1  
**Authors’ code:** none published  
**Honesty:** soft-sim only — not wet-lab validated discovery, not live ELN write-back, not the authors’ system.

## Run

```bash
cd projects/chemicl-discover-studio
npm install
npm run dev
```

Open http://localhost:3000 — bearer token for APIs: `chemicl-discover-dev-token`.

## Tests

```bash
npm test
npm run build
npm run test:app-up
```

## Domain IA

`/`, `/pricing`, `/demo`, `/onboarding`, `/flows`, `/discovers`, `/exemplars`, `/modalities`, `/runs`, `/compare`, `/scoreboard`, `/settings`, `/honesty`

Offline demo: open `try.html` in a browser.
