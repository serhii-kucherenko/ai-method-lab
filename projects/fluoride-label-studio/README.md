# Fluoride Label Studio

Soft-sim studio for **fast isotopic [18F]fluoride exchange labeling** vs **multistep prosthetic-group baselines**.

Paper: [ChemRxiv 10.26434/chemrxiv.15005804/v2](https://doi.org/10.26434/chemrxiv.15005804/v2) · authors' code: none published

## Honesty

Method-lab soft-sim only. **Not** wet-lab validated radiopharmaceutical GMP batch release. **Not** live cyclotron control. **Not** clinical PET dosing. **Not** the authors' labeling system brand.

## Run

```bash
cd projects/fluoride-label-studio
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

`/packs` · `/precursors` · `/exchanges` · `/tracers` · `/assays` · `/compare` · `/scoreboard` plus `/pricing` `/demo` `/onboarding` `/flows` `/honesty` `/settings`

Scorers: `fast_isotopic_exchange` (A) · `multistep_prosthetic_baseline` (B)  
Goldens: `fl-001` … `fl-030`
