# Coload Order Studio

Soft-sim studio for **ordered chemo-photothermal co-load sequences** vs **simultaneous-load baselines** on hollow mesoporous carriers.

Paper inspiration: https://doi.org/10.3390/nano16130805  
Authors’ code: none published

## Honesty

Not wet-lab validated GMP nanomedicine manufacture, not live patient dosing, not clinical oncology clearance. Not the authors’ HSN system.

## Run

```bash
cd projects/coload-order-studio
npm install
npm run dev
```

Open http://localhost:3000

## Tests

```bash
npm test
npm run test:app-up
```

## Domain routes

`/packs` · `/carriers` · `/loads` · `/assays` · `/compare` · `/scoreboard` · `/settings`

Plus `/` · `/pricing` · `/demo` · `/onboarding` · `/flows` · `/honesty`

Offline demo: `try.html`
