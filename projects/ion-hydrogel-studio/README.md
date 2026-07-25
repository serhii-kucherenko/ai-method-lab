# Ion Hydrogel Studio

Soft-sim studio for **dynamic charge-regulating hydrogel ion transport** vs **fixed-charge baselines**.

Paper: [ChemRxiv 10.26434/chemrxiv.15004897/v2](https://doi.org/10.26434/chemrxiv.15004897/v2) · authors' code: none published

## Honesty

Method-lab soft-sim only. **Not** wet-lab validated membrane manufacturing. **Not** live plant ionics. **Not** commercial battery cell qualification. **Not** the authors' hydrogel system brand.

## Run

```bash
cd projects/ion-hydrogel-studio
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

`/packs` · `/gels` · `/charges` · `/salts` · `/assays` · `/compare` · `/scoreboard` plus `/pricing` `/demo` `/onboarding` `/flows` `/honesty` `/settings`

Scorers: `dynamic_charge_regulation` (A) · `fixed_charge_baseline` (B)  
Goldens: `ih-001` … `ih-030`
