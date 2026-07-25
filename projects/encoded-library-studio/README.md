# Encoded Library Studio

Soft-sim studio for **iterative DNA-encoded library (DELT) construct-and-screen cycles** vs **single-pass library screens**.

Paper: [ChemRxiv 10.26434/chemrxiv.15004709/v2](https://doi.org/10.26434/chemrxiv.15004709/v2) · authors’ code: none published

## Honesty

Method-lab soft-sim only. **Not** wet-lab validated IND/NDA. **Not** live screening robotics. **Not** clinical candidate nomination. **Not** the authors’ DELT system brand.

## Run

```bash
cd projects/encoded-library-studio
npm install
npm run dev
```

Open http://localhost:3000 — primary CTA enters `/packs`.

```bash
npm test
npm run test:app-up
npm run gen:goldens
```

Offline approximate demo: open `try.html` in a browser.

## Domain IA

`/packs` · `/libraries` · `/cycles` · `/hits` · `/assays` · `/compare` · `/scoreboard` plus `/pricing` `/demo` `/onboarding` `/flows` `/honesty` `/settings`

Scorers: `iterative_delt_optimize` (A) · `single_pass_library_screen` (B)  
Goldens: `el-001` … `el-030`
